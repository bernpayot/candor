import { UserRepository } from "../repositories/user.repository.js";
import { ValidationError } from "../utils/errors.js";

export class UserService {
  constructor(private repository: UserRepository) {}

  async completeProfile(userId: string, name: string, timezone: string) {
    await this.repository.completeProfile(userId, name, timezone);

    if (!name || name.trim().length === 0) {
      throw new ValidationError("Name cannot be empty.");
    }
  }
}
