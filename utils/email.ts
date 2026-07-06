import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY is not set in environment variables.");
}

const FROM_EMAIL = 'noreply@sawaflix.com'; // Change this to your verified SendGrid sender

/**
 * Send an approval email to the creator
 */
export async function sendApprovalEmail(toEmail: string, fullName: string, username: string) {
  if (!process.env.SENDGRID_API_KEY) return;

  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Welcome to Sawaflix - You are Verified!',
    html: `
      <h2>Hello ${fullName},</h2>
      <p>Congratulations! Your creator application has been approved.</p>
      <p>Your official creator profile is now active on Sawaflix.</p>
      <p>Log in to your dashboard to start managing your portfolio and uploading content.</p>
      <br />
      <p>Welcome to the family,</p>
      <p>The Sawaflix Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Approval email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send approval email to ${toEmail}:`, error);
  }
}

/**
 * Send a rejection email to the creator with feedback
 */
export async function sendRejectionEmail(toEmail: string, fullName: string, reason: string) {
  if (!process.env.SENDGRID_API_KEY) return;

  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Sawaflix Verification Update',
    html: `
      <h2>Hello ${fullName},</h2>
      <p>Thank you for your interest in becoming a verified creator on Sawaflix.</p>
      <p>We have carefully reviewed your application, but unfortunately, we are unable to approve it at this time.</p>
      <div style="padding: 15px; border-left: 4px solid #ef4444; background-color: #fef2f2; margin: 20px 0;">
        <strong>Admin Feedback:</strong><br/>
        ${reason}
      </div>
      <p>You may reapply after 30 days if you are able to address the feedback above.</p>
      <br />
      <p>Best regards,</p>
      <p>The Sawaflix Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Rejection email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send rejection email to ${toEmail}:`, error);
  }
}
