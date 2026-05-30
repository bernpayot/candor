type VerificationOTPEmail = {
  otp: string;
  type: string;
};

function getVerificationOTPSubject(type: string) {
  if (type === "email-verification") {
    return "Verify your Candor email";
  }

  if (type === "forget-password") {
    return "Reset your Candor password";
  }

  return "Your Candor sign-in code";
}

export function buildVerificationOTPEmail({ otp, type }: VerificationOTPEmail) {
  const subject = getVerificationOTPSubject(type);

  const text = [
    subject,
    "",
    `Your verification code is ${otp}.`,
    "This code expires in 5 minutes.",
    "",
    "If you did not request this code, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.5;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">${subject}</h1>
      <p style="margin: 0 0 16px;">Use this code to continue with Candor:</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 0 0 16px;">${otp}</p>
      <p style="margin: 0 0 16px;">This code expires in 5 minutes.</p>
      <p style="margin: 0; color: #525252;">If you did not request this code, you can ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}
