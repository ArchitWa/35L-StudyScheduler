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
            .from("membership")
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
            .from("membership")
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