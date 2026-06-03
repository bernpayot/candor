import { Router, Request, Response } from "express";
import { userController } from "../../containers/user.container.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { UserParams } from "../../types/user.types.js";
import { validate } from "../../middleware/validate.middleware.js";
import { CompleteProfileSchema } from "../../utils/user.schema.js";

const router = Router();

router.patch(
  "/complete-profile",
  requireAuth,
  validate(CompleteProfileSchema),
  (req: Request<UserParams>, res: Response) => {
    userController.completeProfile(req, res);
  },
);

export default router;
