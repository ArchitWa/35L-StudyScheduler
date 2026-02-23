import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, "../..");
const rootDir = path.join(__dirname, "../../..");

// Load .env from server/ first, then from project root (root can override)
const serverEnv = path.join(serverDir, ".env");
const rootEnv = path.join(rootDir, ".env");
if (fs.existsSync(serverEnv)) dotenv.config({ path: serverEnv });
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });
// If no .env was found, dotenv default loads from cwd
if (!fs.existsSync(serverEnv) && !fs.existsSync(rootEnv)) dotenv.config();

const url = (process.env.SUPABASE_URL || "").trim();
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (!url || !key) {
  const tried = [serverEnv, rootEnv].filter((p) => fs.existsSync(p));
  const hint = tried.length
    ? "File exists but SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are missing or empty. Add them (no quotes, no spaces around =)."
    : `No .env found. Create server/.env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (copy server/.env.example).`;
  throw new Error(
    `Supabase config required. ${hint} Get values from Supabase dashboard → Project Settings → API.`
  );
}

export const supabase = createClient(url, key);
