import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

// POST /study-groups
router.post("/", requireUser, async (req, res) => {
    const userId = req.user.id;
    console.log(userId)

    const {
        group_name,
        day_of_week,
        time,
        zoom_link,
        classes,
        goals
    } = req.body;

    const { data: group, error: groupError } = await supabase
        .from("study_groups")
        .insert([
            {
                group_name,
                day_of_week,
                time,
                zoom_link,
                classes,
                goals,
                group_owner: userId
            }
        ])
        .select()
        .single();

    if (groupError) {
        return res.status(400).json({ error: groupError.message });
    }

    const { error: membershipError } = await supabase
        .from("group_memberships")
        .insert([
            {
                user_id: userId,
                group_id: group.id
            }
        ]);

    if (membershipError) {
        await supabase
            .from("study_groups")
            .delete()
            .eq("id", group.id);

        return res.status(400).json({
            error: membershipError.message
        });
    }

    res.status(201).json({
        group
    });
});


// GET /study-groups/mine
router.get("/mine", requireUser, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1️⃣ Get group_ids the user belongs to
    const { data: memberships, error: membershipError } = await supabase
      .from("group_memberships")
      .select("group_id")
      .eq("user_id", userId);

    if (membershipError) throw membershipError;

    if (!memberships || memberships.length === 0) {
      return res.json({ groups: [] });
    }

    const groupIds = memberships.map(m => m.group_id);

    // 2️⃣ Fetch those groups
    const { data: groups, error: groupsError } = await supabase
      .from("study_groups")
      .select("*")
      .in("id", groupIds)
      .order("created_at", { ascending: false });

    if (groupsError) throw groupsError;

    // 3️⃣ Get ALL memberships for those groups
    const { data: allMemberships, error: allMembershipsError } = await supabase
      .from("group_memberships")
      .select("group_id, user_id")
      .in("group_id", groupIds);

    if (allMembershipsError) throw allMembershipsError;

    // 4️⃣ Get user profile data
    const userIds = [...new Set(allMemberships.map(m => m.user_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from("users")
      .select("id, avatar_url")
      .in("id", userIds);

    if (profilesError) throw profilesError;

    // 5️⃣ Attach users to each group
    const groupsWithUsers = groups.map(group => {
      const members = allMemberships
        .filter(m => m.group_id === group.id)
        .map(m => profiles.find(p => p.id === m.user_id));

      return {
        ...group,
        users: members
      };
    });

    return res.json({ groups: groupsWithUsers });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});
// GET /study-groups
router.get("/", async (_req, res) => {
    try {
        const { data: groups, error: groupsError } = await supabase
            .from("study_groups")
            .select("*")
            .order("created_at", { ascending: false });

        if (groupsError) throw groupsError;

        const groupIds = groups.map(g => g.id);
        const { data: memberships, error: membershipError } = await supabase
            .from("group_memberships")
            .select("user_id, group_id")
            .in("group_id", groupIds);

        if (membershipError) throw membershipError;

        const groupsWithMembers = groups.map(group => ({
            ...group,
            members: memberships
                .filter(m => m.group_id === group.id)
                .map(m => m.user_id)
        }));

        res.json({ groups: groupsWithMembers });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// GET /study-groups/:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { data: group, error: groupError } = await supabase
            .from("study_groups")
            .select("*")
            .eq("id", id)
            .single();

        if (groupError || !group) return res.status(404).json({ error: "Group not found" });

        const { data: members, error: membersError } = await supabase
            .from("group_memberships")
            .select("user_id")
            .eq("group_id", id);

        if (membersError) throw membersError;

        const { data: requests, error: requestsError } = await supabase
            .from("membership_requests")
            .select(`
                id,
                status,
                created_at,
                user:user_id (id, name)
            `)
            .eq("group_id", id)
            .order("created_at", { ascending: true });

        if (requestsError) throw requestsError;

        res.json({
            group: {
                ...group,
                members: members.map(m => m.user_id),
                requests: requests, // includes pending + processed requests
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /study-groups/:id
router.put("/:id", requireUser, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // Check ownership
    const { data: group, error: fetchError } = await supabase
        .from("study_groups")
        .select("group_owner")
        .eq("id", id)
        .single();

    if (fetchError || !group)
        return res.status(404).json({ error: "Group not found" });

    if (group.group_owner !== userId)
        return res.status(403).json({ error: "Not group owner" });

    const {
        group_name,
        day_of_week,
        time,
        zoom_link,
        classes,
        goals
    } = req.body;

    const { data, error } = await supabase
        .from("study_groups")
        .update({
            group_name,
            day_of_week,
            time,
            zoom_link,
            classes,
            goals
        })
        .eq("id", id)
        .select()
        .single();

    if (error)
        return res.status(400).json({ error: error.message });

    res.json({ group: data });
});

// DELETE /study-groups/:id/leave
router.delete("/:id/leave", requireUser, async (req, res) => {
  const userId = req.user.id;
  const { id: groupId } = req.params;

  try {
    // 1️⃣ Get group info
    const { data: group, error: groupError } = await supabase
      .from("study_groups")
      .select("id, group_owner")
      .eq("id", groupId)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // 2️⃣ Get all memberships
    const { data: memberships, error: membershipError } = await supabase
      .from("group_memberships")
      .select("user_id")
      .eq("group_id", groupId);

    if (membershipError) throw membershipError;

    const memberIds = memberships.map(m => m.user_id);

    // Ensure user is actually in the group
    if (!memberIds.includes(userId)) {
      return res.status(403).json({ error: "You are not in this group" });
    }

    const isOwner = group.group_owner === userId;

    // 3️⃣ If owner
    if (isOwner) {
      const otherMembers = memberIds.filter(id => id !== userId);

      if (otherMembers.length === 0) {
        // No one else left → delete entire group
        await supabase
          .from("study_groups")
          .delete()
          .eq("id", groupId);

        return res.json({ message: "Group deleted (no members left)" });
      }

      // Pick random new owner
      const randomIndex = Math.floor(Math.random() * otherMembers.length);
      const newOwner = otherMembers[randomIndex];

      // Update group owner
      const { error: updateError } = await supabase
        .from("study_groups")
        .update({ group_owner: newOwner })
        .eq("id", groupId);

      if (updateError) throw updateError;
    }

    // 4️⃣ Remove current user from memberships
    const { error: deleteMembershipError } = await supabase
      .from("group_memberships")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (deleteMembershipError) throw deleteMembershipError;

    return res.json({
      message: isOwner
        ? "Ownership transferred and you left the group"
        : "You left the group"
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});


// DELETE /study-groups/:id
router.delete("/:id", requireUser, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { data: group, error } = await supabase
        .from("study_groups")
        .select("group_owner")
        .eq("id", id)
        .single();

    if (error || !group)
        return res.status(404).json({ error: "Group not found" });

    if (group.group_owner !== userId)
        return res.status(403).json({ error: "Not group owner" });

    const { error: deleteError } = await supabase
        .from("study_groups")
        .delete()
        .eq("id", id);

    if (deleteError)
        return res.status(400).json({ error: deleteError.message });

    res.status(204).send();
});

export default router;