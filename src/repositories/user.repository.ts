import { prisma } from "../configs/database.js";

export class UserRepository {
  async completeProfile(userId: string, name: string, timezone: string) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        timezone: timezone,
        onboardingCompleted: true,
      },
    });

    return user;
  }
}
