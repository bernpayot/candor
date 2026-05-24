export function formatTranscript(
  questions: {
    id: string;
    questionText: string;
    userAnswer: string;
    sequenceOrder: number;
  }[],
): string {
  return questions
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map(
      (question) => `Question ${question.sequenceOrder}
      Question Id: ${question.id}
      Question: ${question.questionText}
      Answer: ${question.userAnswer}`,
    )
    .join("\n\n");
}
