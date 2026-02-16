import { Router } from "express";
import authRoutes from "./auth.routes";
import meRoutes from "./me.routes";
import todoRoutes from "./todo.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);
router.use("/me", meRoutes);

export default router;
