import { InterviewRepository } from "../repositories/interview.repository.js";
import { InterviewService } from "../services/interview.service.js";
import { InterviewController } from "../controllers/interview.controller.js";

/** Composite Root */
const interviewRepository = new InterviewRepository();
const interviewService = new InterviewService(interviewRepository);
export const interviewController = new InterviewController(interviewService);
