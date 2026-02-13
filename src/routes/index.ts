import { Router } from "express";
import authRoutes from "./auth.routes";
import todoRoutes from "./todo.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);

export default router;