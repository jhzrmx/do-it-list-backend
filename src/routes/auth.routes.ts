import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

export default router;
