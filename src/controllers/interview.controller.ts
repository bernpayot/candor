import { InterviewService } from "../services/interview.service.js";
import { Request, Response } from "express";
import { InterviewParams } from "../types/interview.types.js";
export class InterviewController {
  constructor(private service: InterviewService) {}

  async getLevels(req: Request, res: Response) {
    const levels = await this.service.getLevels();
    return res.status(200).json({ data: levels });
  }

  async getSpecialties(req: Request, res: Response) {
    const specialties = await this.service.getSpecialties();
    return res.status(200).json({ data: specialties });
  }

  async getUserInterviews(req: Request, res: Response) {
    const userId = req.user!.id;
    const userInterviews = await this.service.getUserInterviews(userId);
    return res.status(200).json(userInterviews);
  }

  async getInterview(req: Request<InterviewParams>, res: Response) {
    const interviewId = req.params.id;
    const userId = req.user!.id;
    const interview = await this.service.getInterview(interviewId, userId);
    return res.status(200).json(interview);
  }

  async getInterviewResult(req: Request<InterviewParams>, res: Response) {
    const interviewId = req.params.id;
    const userId = req.user!.id;
    const interviewResult = await this.service.getInterviewResult(
      interviewId,
      userId,
    );
    return res.status(200).json(interviewResult);
  }

  async createInterview(req: Request, res: Response) {
    const userId = req.user!.id;
    const { levelId, specialtyId } = req.body;
    const interview = await this.service.createInterview(
      userId,
      levelId,
      specialtyId,
    );
    return res.status(201).json(interview);
  }

  async updateInterviewStatus(req: Request<InterviewParams>, res: Response) {
    const userId = req.user!.id;
    const interviewId = req.params.id;
    const { transcript } = req.body;
    const updatedInterview = await this.service.updateInterviewStatus(
      userId,
      interviewId,
      transcript,
    );
    return res.status(200).json(updatedInterview);
  }
}
