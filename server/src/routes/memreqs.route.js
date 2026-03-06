import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

/**
 * POST /membership-requests
 * User requests to join a group
 * Body: { group_id }
 */
router.post("/", requireUser, async (req, res) => {
  const user = req.user;
  const { group_id } = req.body;

  if (!group_id) return res.status(400).json({ error: "group_id is required" });

  try {
    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from("membership")
      .select("*")
      .eq("user_id", user.id)
      .eq("group_id", group_id)
      .maybeSingle();

    if (existingMember) return res.status(400).json({ error: "Already a member" });

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from("membership_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("group_id", group_id)
      .maybeSingle();

    if (existingRequest) return res.status(400).json({ error: "Request already pending" });

    // Insert new request
    const { data, error } = await supabase
      .from("membership_requests")
      .insert([{ user_id: user.id, group_id, status: "pending" }])
      .select()
      .single();

    if (error) throw error;

    res.json({ request: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /membership-requests/:id
 * Owner accepts or declines a membership request
 * Body: { status: "accepted" | "declined" }
 */
router.put("/:id", requireUser, async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // 1️⃣ Get the request
    const { data: request, error: requestError } = await supabase
      .from("membership_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (requestError || !request) return res.status(404).json({ error: "Request not found" });

    // 2️⃣ Verify the current user is the group owner
    const { data: group } = await supabase
      .from("study_groups")
      .select("*")
      .eq("id", request.group_id)
      .single();

    if (!group || group.group_owner !== user.id) {
      return res.status(403).json({ error: "Only group owner can accept/decline" });
    }

    // 3️⃣ Update request status
    const { data: updatedRequest, error: updateError } = await supabase
      .from("membership_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4️⃣ If accepted, add to membership
    if (status === "accepted") {
      await supabase.from("group_memberships").insert([
        { user_id: request.user_id, group_id: request.group_id }
      ]);
    }

    res.json({ request: updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /membership-requests/:id
 * Requester cancels their own outgoing pending join request
 */
router.delete("/:id", requireUser, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const { data: request, error: requestError } = await supabase
      .from("membership_requests")
      .select("id, user_id, status")
      .eq("id", id)
      .single();

    if (requestError || !request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.user_id !== user.id) {
      return res.status(403).json({ error: "You can only cancel your own requests" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Only pending requests can be canceled" });
    }

    const { error: deleteError } = await supabase
      .from("membership_requests")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /membership-requests/mine
 * Authenticated user lists outgoing join requests they created
 */
router.get("/mine", requireUser, async (req, res) => {
  const user = req.user;

  try {
    const { data: requests, error: requestsError } = await supabase
      .from("membership_requests")
      .select("id, group_id, status, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (requestsError) throw requestsError;

    const groupIds = (requests || []).map((request) => request.group_id).filter(Boolean);

    let groupNameById = {};
    if (groupIds.length > 0) {
      const { data: groups, error: groupsError } = await supabase
        .from("study_groups")
        .select("id, group_name")
        .in("id", groupIds);

      if (groupsError) throw groupsError;

      groupNameById = (groups || []).reduce((acc, group) => {
        acc[group.id] = group.group_name;
        return acc;
      }, {});
    }

    const outgoingRequests = (requests || []).map((request) => ({
      ...request,
      group_name: groupNameById[request.group_id] || "Unknown Group",
    }));

    res.json({ requests: outgoingRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /membership-requests?group_id=xxx
 * Owner lists all requests for their group
 */
router.get("/", requireUser, async (req, res) => {
  const user = req.user;
  const { group_id } = req.query;

  if (!group_id) return res.status(400).json({ error: "group_id is required" });

  try {
    // Check that requester is group owner
    const { data: group } = await supabase
      .from("study_groups")
      .select("*")
      .eq("id", group_id)
      .single();

    if (!group || group.group_owner !== user.id) {
      return res.status(403).json({ error: "Only group owner can view requests" });
    }

    const { data: requests, error } = await supabase
      .from("membership_requests")
      .select("id, user_id, status, created_at, updated_at")
      .eq("group_id", group_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;