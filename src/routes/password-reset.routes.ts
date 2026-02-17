import { Router } from "express";
import { sendLink, verifyLink, changePassword } from "../controllers/password-reset.controller";

const router = Router();

router.post("/send-link", sendLink);
router.post("/verify-link", verifyLink);
router.post("/change-password", changePassword);

export default router;
