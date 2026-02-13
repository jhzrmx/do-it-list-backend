import { protect } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { login, logout, me, signup } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", protect, me);
// router.post("/me", protect, me);

export default router;
