import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

function normalizeClasses(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
      }
    } catch {
      return value
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);
    }
  }

  return [];
}

router.get("/groups", requireUser, async (req, res) => {
  const userId = req.user.id;
  const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 20);

  try {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("classes_taking")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) throw profileError;
    const userClasses = new Set(normalizeClasses(profile?.classes_taking));

    const { data: groups, error: groupsError } = await supabase
      .from("study_groups")
      .select("id, group_name, day_of_week, time, meet_spot, classes, goals, group_owner, created_at")
      .order("created_at", { ascending: false })
      .limit(300);

    if (groupsError) throw groupsError;
    if (!groups || groups.length === 0) {
      return res.json({ recommendations: [] });
    }

    const { data: memberships, error: membershipsError } = await supabase
      .from("group_memberships")
      .select("group_id, user_id")
      .in(
        "group_id",
        groups.map((g) => g.id)
      );

    if (membershipsError) throw membershipsError;

    const { data: outgoing, error: outgoingError } = await supabase
      .from("membership_requests")
      .select("group_id")
      .eq("user_id", userId)
      .eq("status", "pending");

    if (outgoingError) throw outgoingError;

    const joinedGroupIds = new Set(
      (memberships || [])
        .filter((m) => m.user_id === userId)
        .map((m) => m.group_id)
    );
    const pendingGroupIds = new Set((outgoing || []).map((r) => r.group_id));

    const memberCountByGroup = (memberships || []).reduce((acc, row) => {
      acc[row.group_id] = (acc[row.group_id] || 0) + 1;
      return acc;
    }, {});

    const scored = [];
    for (const group of groups) {
      if (group.group_owner === userId) continue;
      if (joinedGroupIds.has(group.id)) continue;
      if (pendingGroupIds.has(group.id)) continue;

      const groupClasses = normalizeClasses(group.classes);
      const overlap = groupClasses.filter((cls) => userClasses.has(cls));
      const overlapCount = overlap.length;

      // v1 weighted heuristic, tuned for class relevance first.
      let score = 0;
      score += overlapCount * 40;
      if (overlapCount > 0) score += 20;

      const memberCount = memberCountByGroup[group.id] || 0;
      if (memberCount <= 2) score += 8;
      else if (memberCount <= 5) score += 5;
      else if (memberCount >= 10) score -= 5;

      const createdAt = group.created_at ? new Date(group.created_at).getTime() : 0;
      const ageDays = createdAt ? (Date.now() - createdAt) / (1000 * 60 * 60 * 24) : 999;
      if (ageDays <= 3) score += 8;
      else if (ageDays <= 14) score += 4;

      // If user has no classes saved yet, keep recommendations useful via recency + group size.
      if (userClasses.size === 0) {
        score = 10 + (memberCount <= 5 ? 5 : 0) + (ageDays <= 7 ? 5 : 0);
      }

      const reasons = [];
      if (overlapCount > 0) reasons.push(`${overlapCount} shared class${overlapCount > 1 ? "es" : ""}`);
      if (memberCount <= 5) reasons.push("smaller group");
      if (ageDays <= 7) reasons.push("recently created");

      scored.push({
        ...group,
        member_count: memberCount,
        score,
        overlap_classes: overlap,
        reasons,
      });
    }

    scored.sort((a, b) => b.score - a.score || new Date(b.created_at) - new Date(a.created_at));

    return res.json({
      recommendations: scored.slice(0, limit),
      meta: { user_classes_count: userClasses.size },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Failed to fetch recommendations" });
  }
});

export default router;

