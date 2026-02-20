import { NextResponse } from 'next/server'

const POSTMARK_API_URL = 'https://api.postmarkapp.com/email'

export async function POST(request) {
  try {
    const { submitterEmail, projectId, market, address, submittedAt } = await request.json()

    if (!submitterEmail || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const formUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vestahome.design'}/project-close`
    const formattedDate = new Date(submittedAt || Date.now()).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #2C2C2C;">
        <div style="border-bottom: 1px solid #E5DFD8; padding: 24px 0 16px;">
          <div style="display: inline-block; width: 32px; height: 32px; background: #2C2C2C; border-radius: 3px; text-align: center; line-height: 32px;">
            <span style="color: #FAF8F5; font-family: Georgia, serif; font-size: 14px;">V</span>
          </div>
          <span style="font-family: Georgia, serif; font-size: 18px; color: #2C2C2C; margin-left: 10px; vertical-align: middle;">Vesta Design Studio</span>
        </div>

        <div style="padding: 32px 0;">
          <div style="width: 48px; height: 48px; background: rgba(139, 157, 131, 0.15); border-radius: 50%; text-align: center; line-height: 48px; margin-bottom: 24px;">
            <span style="font-size: 22px;">✓</span>
          </div>

          <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin: 0 0 8px;">
            Project Close Form Submitted
          </h1>

          <p style="color: #9A9590; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Your project debrief has been recorded successfully.
          </p>

          <div style="background: #F3EDE7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="color: #9A9590; padding: 4px 0; width: 120px;">Project ID</td>
                <td style="color: #2C2C2C; font-weight: 500; padding: 4px 0;">${projectId}</td>
              </tr>
              ${market ? `<tr>
                <td style="color: #9A9590; padding: 4px 0;">Market</td>
                <td style="color: #2C2C2C; padding: 4px 0;">${market}</td>
              </tr>` : ''}
              ${address ? `<tr>
                <td style="color: #9A9590; padding: 4px 0;">Address</td>
                <td style="color: #2C2C2C; padding: 4px 0;">${address}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #9A9590; padding: 4px 0;">Submitted by</td>
                <td style="color: #2C2C2C; padding: 4px 0;">${submitterEmail}</td>
              </tr>
              <tr>
                <td style="color: #9A9590; padding: 4px 0;">Date</td>
                <td style="color: #2C2C2C; padding: 4px 0;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <a href="${formUrl}" style="display: inline-block; background: #2C2C2C; color: #FAF8F5; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">
            Submit Another Form
          </a>
        </div>

        <div style="border-top: 1px solid #E5DFD8; padding: 16px 0; color: #9A9590; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Vesta Home &middot; vestahome.design
        </div>
      </div>
    `

    const textBody = `Project Close Form Submitted\n\nProject ID: ${projectId}\n${market ? `Market: ${market}\n` : ''}${address ? `Address: ${address}\n` : ''}Submitted by: ${submitterEmail}\nDate: ${formattedDate}\n\nSubmit another form: ${formUrl}`

    // Send to submitter
    const recipients = [submitterEmail, 'project-closings@vestahome.com']

    const results = await Promise.allSettled(
      recipients.map((to) =>
        fetch(POSTMARK_API_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN,
          },
          body: JSON.stringify({
            From: process.env.POSTMARK_FROM_EMAIL || 'noreply@vestahome.design',
            To: to,
            Subject: `Project Close Confirmation — ${projectId}`,
            HtmlBody: htmlBody,
            TextBody: textBody,
            MessageStream: 'outbound',
          }),
        })
      )
    )

    const failed = results.filter((r) => r.status === 'rejected')
    if (failed.length === recipients.length) {
      throw new Error('All emails failed to send')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send receipt' }, { status: 500 })
  }
}
