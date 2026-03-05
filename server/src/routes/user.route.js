import express from "express";
import { createUser, updateProfile } from "../controllers/user.controller.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

router.post("/", createUser);
router.put("/profile", requireUser, updateProfile);

export default router;
