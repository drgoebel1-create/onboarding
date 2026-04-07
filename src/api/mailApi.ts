import { graphFetch } from './graphClient';

interface SendMailParams {
  to: string;
  subject: string;
  bodyHtml: string;
}

export async function sendMail({ to, subject, bodyHtml }: SendMailParams): Promise<void> {
  await graphFetch<void>('/me/sendMail', {
    method: 'POST',
    body: JSON.stringify({
      message: {
        subject,
        body: {
          contentType: 'HTML',
          content: bodyHtml,
        },
        toRecipients: [
          {
            emailAddress: { address: to },
          },
        ],
      },
      saveToSentItems: false,
    }),
  });
}

export function buildTaskNotificationMail(params: {
  assigneeName: string;
  taskLabel: string;
  caseName: string;
  caseTeam: string;
  caseFirma: string;
  eintrittsdatum: string;
  assignedBy: string;
}): { subject: string; bodyHtml: string } {
  const subject = `Onboarding-Aufgabe: ${params.taskLabel} für ${params.caseName}`;

  const bodyHtml = `
    <div style="font-family: Segoe UI, sans-serif; max-width: 600px;">
      <h2 style="color: #1d5a9a;">Neue Onboarding-Aufgabe</h2>
      <p>Hallo ${params.assigneeName},</p>
      <p>Dir wurde eine Aufgabe im Onboarding-Prozess zugewiesen:</p>
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 12px; background: #f3f2f1; font-weight: 600; width: 160px;">Aufgabe</td>
          <td style="padding: 8px 12px; background: #f3f2f1;">${params.taskLabel}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600;">Neuer Mitarbeiter</td>
          <td style="padding: 8px 12px;">${params.caseName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f3f2f1; font-weight: 600;">Firma / Team</td>
          <td style="padding: 8px 12px; background: #f3f2f1;">${params.caseFirma} · ${params.caseTeam}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: 600;">Eintrittsdatum</td>
          <td style="padding: 8px 12px;">${params.eintrittsdatum}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f3f2f1; font-weight: 600;">Zugewiesen von</td>
          <td style="padding: 8px 12px; background: #f3f2f1;">${params.assignedBy}</td>
        </tr>
      </table>
      <p>Bitte erledige diese Aufgabe rechtzeitig vor dem Eintrittsdatum.</p>
      <p style="color: #6b6b6b; font-size: 12px; margin-top: 24px;">
        Diese E-Mail wurde automatisch vom Onboarding Cockpit versendet.
      </p>
    </div>
  `;

  return { subject, bodyHtml };
}
