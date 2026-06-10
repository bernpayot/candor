import { Router } from "express";
import interviewRouter from "./interview.routes.js";
import userRouter from "./user.routes.js";

const router = Router();
router.use(interviewRouter);
router.use("/users", userRouter);

export default router;
