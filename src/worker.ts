import { Worker } from "bullmq";
import { connection } from "./configs/redis.js";
import { assessmentProcessor } from "./jobs/assessment.processor.js";

const worker = new Worker("assessments", assessmentProcessor, {
  connection,
  concurrency: 5,
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed: ${error.message}`);
});
