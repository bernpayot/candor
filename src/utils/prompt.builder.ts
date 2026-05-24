import { BASE_PROMPT, ASSESSMENT_PROMPT } from "../configs/prompts.js";

export function buildPrompt(
  level: string,
  specialty: string,
  topics: string[],
  avoidTopics: string[],
): string {
  const topicsFormatted = topics.map((t) => `- ${t}`).join("\n");
  const avoidFormatted = avoidTopics.map((t) => `- ${t}`).join("\n");

  return BASE_PROMPT.replace("{{LEVEL}}", level)
    .replace("{{SPECIALTY}}", specialty)
    .replace("{{TOPICS}}", topicsFormatted)
    .replace("{{AVOID_TOPICS}}", avoidFormatted);
}

export function buildAssessmentPrompt(
  level: string,
  specialty: string,
  transcript: string,
): string {
  return ASSESSMENT_PROMPT.replace("{{LEVEL}}", level)
    .replace("{{SPECIALTY}}", specialty)
    .replace("{{TRANSCRIPT}}", transcript);
}
