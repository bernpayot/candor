/*
  Warnings:

  - You are about to drop the column `system_prompt` on the `interview_prompts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interview_prompts" DROP COLUMN "system_prompt",
ADD COLUMN     "avoid_topics" TEXT[],
ADD COLUMN     "topics" TEXT[];
