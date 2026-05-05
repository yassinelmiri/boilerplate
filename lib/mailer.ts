import { resend } from "@/integrations/resend/client";

const isConfigured =
  !!process.env.RESEND_API_KEY &&
  !!process.env.RESEND_EMAIL_SENDER_NAME &&
  !!process.env.RESEND_EMAIL_SENDER_ADDRESS;

const from = `${process.env.RESEND_EMAIL_SENDER_NAME} <${process.env.RESEND_EMAIL_SENDER_ADDRESS}>`;

const appName = process.env.APP_NAME ?? "Tacaric";

// ─── Minimal shared HTML shell ────────────────────────────────────────────────

function html(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 16px;background:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;color:#09090b">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;border:1px solid #e4e4e7">
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#71717a;letter-spacing:.05em;text-transform:uppercase">${appName}</p>
    ${body}
    <hr style="margin:32px 0;border:none;border-top:1px solid #e4e4e7">
    <p style="margin:0;font-size:12px;color:#a1a1aa">If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>`;
}

function button(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;margin:24px 0 0;padding:12px 24px;background:#09090b;color:#fafafa;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none">${text}</a>`;
}

async function send(to: string, subject: string, body: string) {
  if (!isConfigured) {
    console.warn(`[Mailer] RESEND not configured — skipping email "${subject}" to ${to}`);
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: html(body),
  });

  if (error) {
    console.error(`[Mailer] Failed to send "${subject}" to ${to}:`, error);
    throw new Error(error.message);
  }
}

// ─── Email helpers ────────────────────────────────────────────────────────────

export async function sendMagicLink(email: string, url: string) {
  await send(
    email,
    `Sign in to ${appName}`,
    `<h2 style="margin:0 0 8px;font-size:20px;font-weight:600">Sign in to ${appName}</h2>
     <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6">Click the button below to sign in. This link expires in 10 minutes and can only be used once.</p>
     ${button("Sign in", url)}
     <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa">Or copy this URL: ${url}</p>`,
  );
}

export async function sendEmailOtp(email: string, otp: string, type: string) {
  const isVerification = type === "email-verification";
  const isPasswordReset = type === "forget-password";

  const subject = isVerification
    ? `Verify your email — ${otp}`
    : isPasswordReset
      ? `Your password reset code — ${otp}`
      : `Your sign-in code — ${otp}`;

  const heading = isVerification
    ? "Verify your email"
    : isPasswordReset
      ? "Reset your password"
      : "Your sign-in code";

  const description = isVerification
    ? "Enter this code to verify your email address. It expires in 5 minutes."
    : isPasswordReset
      ? "Enter this code to reset your password. It expires in 5 minutes."
      : "Enter this code to sign in. It expires in 5 minutes.";

  await send(
    email,
    subject,
    `<h2 style="margin:0 0 8px;font-size:20px;font-weight:600">${heading}</h2>
     <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.6">${description}</p>
     <div style="display:inline-block;padding:16px 32px;background:#f4f4f5;border-radius:8px;font-size:32px;font-weight:700;font-family:monospace;letter-spacing:.25em;color:#09090b">${otp}</div>`,
  );
}

export async function sendChangeEmailConfirmation(
  email: string,
  newEmail: string,
  url: string,
) {
  await send(
    email,
    `Confirm your new email address`,
    `<h2 style="margin:0 0 8px;font-size:20px;font-weight:600">Confirm email change</h2>
     <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6">You requested to change your email to <strong>${newEmail}</strong>. Click below to confirm.</p>
     ${button("Confirm new email", url)}`,
  );
}

export async function sendDeleteAccountVerification(email: string, url: string) {
  await send(
    email,
    `Confirm account deletion — ${appName}`,
    `<h2 style="margin:0 0 8px;font-size:20px;font-weight:600">Delete your account</h2>
     <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6">You requested to permanently delete your ${appName} account. This action <strong>cannot be undone</strong>. Click below to confirm.</p>
     ${button("Delete my account", url)}`,
  );
}
