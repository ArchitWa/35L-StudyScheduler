import { supabase } from "../config/supabase.js";

export const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first,
      last,
      major,
      year,
    } = req.body;

    if (!email || !password || !first || !last) {
      return res.status(400).json({
        error: "email, password, first name, and last name are required",
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabase
      .from("users")
      .insert({
        id: userId,
        first,
        last,
        major,
        year,
      });

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({
      message: "User created successfully",
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      major,
      year,
      phone,
      bio,
      classes
    } = req.body;

    // Update the user profile
    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        major,
        year,
        phone_number: phone,
        bio,
        classes_taking: classes
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
