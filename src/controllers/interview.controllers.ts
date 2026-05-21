import { InterviewService } from "../services/interview.service.js";
import { Request, Response, NextFunction } from "express";
export class InterviewController {
  constructor(private service: InterviewService) {}

  async getLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const levels = await this.service.getLevels();
      return res.status(200).json(levels);
    } catch (error) {
      next(error);
    }
  }

  async getSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const specialties = await this.service.getSpecialties();
      return res.status(200).json(specialties);
    } catch (error) {
      next(error);
    }
  }
}
