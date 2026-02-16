import {
    deleteMe,
    myInfo,
    updateMe,
} from "@/controllers/me.controller";
import { protect } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", protect, myInfo);
router.put("/", protect, updateMe);
router.delete("/", protect, deleteMe);

export default router;
