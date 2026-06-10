import { UserRepository } from "../repositories/user.repository.js";
import { ValidationError } from "../utils/errors.js";

export class UserService {
  constructor(private repository: UserRepository) {}

  async completeProfile(userId: string, name: string, timezone: string) {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Name cannot be empty.");
    }

    return this.repository.completeProfile(userId, name.trim(), timezone);
  }
}
