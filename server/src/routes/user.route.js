// routes/users.js
import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

// Get current user profile
// router.get("/me", requireUser, async (req, res) => {
//   try {
//     const { data: profile, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", req.user.id)
//       .maybeSingle();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json({
//       user: {
//         id: req.user.id,
//         email: req.user.email,
//       },
//       profile: profile || null,
//     });
//   } catch {
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// Update profile
router.put("/me", requireUser, async (req, res) => {
  try {
    const { name, major, year, phone, bio, classes } = req.body;

    const { data, error } = await supabase
      .from("users")
      .upsert({
            id: req.user.id,
            name,
            major,
            year,
            phone_number: phone,
            bio,
            classes_taking: classes,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ profile: data });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;