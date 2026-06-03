import { Router, Request, Response } from "express";
import { interviewController } from "../../containers/interview.container.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { InterviewParams } from "../../types/interview.types.js";
import {
  CompleteInterviewSchema,
  CreateInterviewSchema,
} from "../../utils/interview.schema.js";
const router = Router();

router.get("/interviews/levels", requireAuth, (req, res) =>
  interviewController.getLevels(req, res),
);
router.get("/interviews/specialties", requireAuth, (req, res) =>
  interviewController.getSpecialties(req, res),
);
router.post(
  "/interviews",
  requireAuth,
  validate(CreateInterviewSchema),
  (req, res) => interviewController.createInterview(req, res),
);
router.get("/interviews", requireAuth, (req, res) =>
  interviewController.getUserInterviews(req, res),
);
router.patch(
  "/interviews/:id",
  requireAuth,
  validate(CompleteInterviewSchema),
  (req: Request<InterviewParams>, res: Response) =>
    interviewController.updateInterviewStatus(req, res),
);
router.get(
  "/interviews/:id",
  requireAuth,
  (req: Request<InterviewParams>, res: Response) =>
    interviewController.getInterview(req, res),
);
router.get(
  "/interviews/:id/result",
  requireAuth,
  (req: Request<InterviewParams>, res: Response) =>
    interviewController.getInterviewResult(req, res),
);

export default router;
