import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

router.post("/", requireUser, async (req, res) => {
    try {
        const { group_name, day_of_week, time, zoom_link, classes, goals } = req.body;

        if (!group_name || !day_of_week || !time) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data: group, error: groupError } = await supabase
            .from("study_groups")
            .insert({
                group_name,
                day_of_week,
                time,
                zoom_link,
                classes,
                goals,
                created_by: req.user.id
            })
            .select()
            .single();

        if (groupError) return res.status(400).json({ error: groupError.message });

        const { error: memberError } = await supabase
            .from("study_group_members")
            .insert({
                user_id: req.user.id,
                group_id: group.id
            });

        if (memberError) return res.status(400).json({ error: memberError.message });

        return res.status(201).json({ group });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.put("/:groupId", requireUser, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { group_name, day_of_week, time, zoom_link, classes, goals } = req.body;

        const { data: group, error: selectError } = await supabase
            .from("study_groups")
            .select("created_by")
            .eq("id", groupId)
            .single();

        if (selectError || !group) return res.status(404).json({ error: "Group not found" });
        if (group.created_by !== req.user.id)
            return res.status(403).json({ error: "Only the creator can edit the group" });


        const { data: updatedGroup, error } = await supabase
            .from("study_groups")
            .update({ group_name, day_of_week, time, zoom_link, classes, goals })
            .eq("id", groupId)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.json({ group: updatedGroup });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:groupId", requireUser, async (req, res) => {
    try {
        const { groupId } = req.params;

        const { data: group, error: selectError } = await supabase
            .from("study_groups")
            .select("created_by")
            .eq("id", groupId)
            .single();

        if (selectError || !group) return res.status(404).json({ error: "Group not found" });
        if (group.created_by !== req.user.id)
            return res.status(403).json({ error: "Only the creator can delete the group" });

        const { error } = await supabase
            .from("study_groups")
            .delete()
            .eq("id", groupId);

        if (error) return res.status(400).json({ error: error.message });

        return res.json({ message: "Group deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;