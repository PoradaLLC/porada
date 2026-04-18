/**
 * Shared branded email template for Sierra-117.
 * All styles are inline for email client compatibility.
 */

interface EmailTemplateOptions {
  preheader?: string;
}

export function wrapEmailTemplate(
  body: string,
  options: EmailTemplateOptions = {}
): string {
  const preheader = options.preheader
    ? `<span style="display:none;font-size:1px;color:#080c10;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${options.preheader}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #080c10;">
${preheader}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #080c10;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

        <!-- Header -->
        <tr>
          <td style="border-top: 2px solid #22d3ee; padding: 32px 32px 24px 32px; background-color: #0c1117; border-radius: 12px 12px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right: 12px; vertical-align: middle;">
                  <div style="display: inline-block; width: 36px; height: 36px; line-height: 36px; text-align: center; border-radius: 8px; background-color: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2); font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; color: #22d3ee;">&gt;_</div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #dce4ec; letter-spacing: 1px;">SIERRA-117</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px; background-color: #0c1117; font-family: 'Courier New', monospace;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px 32px 32px; background-color: #0c1117; border-radius: 0 0 12px 12px; border-top: 1px solid rgba(255,255,255,0.05);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom: 12px;">
                  <a href="https://sierra-117.net" style="font-family: 'Courier New', monospace; font-size: 12px; color: #22d3ee; text-decoration: none;">sierra-117.net</a>
                  <span style="font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,0.15); padding: 0 8px;">|</span>
                  <a href="https://sierra-117.net/book" style="font-family: 'Courier New', monospace; font-size: 12px; color: #22d3ee; text-decoration: none;">Book a Call</a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="font-family: 'Courier New', monospace; font-size: 11px; color: rgba(255,255,255,0.25);">Schtubbs LLC / Web Development & Software Engineering</span>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 8px;">
                  <span style="font-family: 'Courier New', monospace; font-size: 11px; color: rgba(255,255,255,0.25);">NYC Tri-State Area</span>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <span style="font-family: 'Courier New', monospace; font-size: 11px; color: rgba(255,255,255,0.15);">If you no longer wish to receive emails, reply with "unsubscribe"</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/**
 * Formats plain text email body into styled HTML paragraphs.
 */
export function formatEmailBody(text: string): string {
  return text
    .split("\n")
    .map(
      (line) =>
        `<p style="margin: 8px 0; line-height: 1.6; font-size: 14px; color: #cbd5e1;">${line || "&nbsp;"}</p>`
    )
    .join("");
}
