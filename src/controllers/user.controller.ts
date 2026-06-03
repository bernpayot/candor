import { UserService } from "../services/user.service.js";
import { UserParams } from "../types/user.types.js";
import { Request, Response } from "express";

export class UserController {
  constructor(private service: UserService) {}

  async completeProfile(req: Request<UserParams>, res: Response) {
    const userId = req.user!.id;
    const { name, timezone } = req.body;
    const user = await this.service.completeProfile(userId, name, timezone);
    return res.status(200).json(user);
  }
}
