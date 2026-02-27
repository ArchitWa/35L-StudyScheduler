import { supabase } from "../config/supabase.js";

const UCLA_DOMAINS = new Set(["ucla.edu", "g.ucla.edu"]);

export async function requireUser(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

    const email = (data.user.email || "").toLowerCase();
    const domain = email.split("@")[1];
    if (!UCLA_DOMAINS.has(domain)) {
      return res.status(403).json({ error: "UCLA email required" });
    }

    req.user = data.user; // id, email, etc.
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

