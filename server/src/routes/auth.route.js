import express from "express";
import { supabase } from "../config/supabase.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

// Redirect to Supabase's Google OAuth authorize endpoint
router.get("/login", (req, res) => {
  const baseUrl = process.env.SUPABASE_URL;
  const redirectTo = process.env.AUTH_REDIRECT_URL;
  if (!baseUrl || !redirectTo) {
    return res.status(500).json({ error: "Auth not configured" });
  }

  const params = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    scopes: "openid email profile",
    prompt: "select_account",
    hd: "ucla.edu",
  });

  const url = `${baseUrl}/auth/v1/authorize?${params.toString()}`;
  return res.redirect(302, url);
});

// Current authenticated user (and optional profile)
router.get("/me", requireUser, async (req, res) => {
  const user = req.user; // from requireUser
  // Optionally load profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return res.json({ user: { id: user.id, email: user.email }, profile: profile || null });
});

// Optional: logout endpoint (frontend should call supabase.auth.signOut())
router.post("/logout", (_req, res) => {
  return res.status(204).send();
});

export default router;

