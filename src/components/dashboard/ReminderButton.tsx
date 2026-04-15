import { useMemo, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Alert24Regular } from '@fluentui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import type { OnboardingCase } from '../../types/case';
import { collectPendingTasks, type PendingTask } from '../../utils/reminders';
import { buildReminderMail, sendMail } from '../../api/mailApi';
import { createProtocolEntry } from '../../api/protocolApi';
import { useAuth } from '../../auth/useAuth';
import { REMINDER_WINDOW_DAYS } from '../../utils/constants';

interface ReminderButtonProps {
  cases: OnboardingCase[] | undefined;
}

export function ReminderButton({ cases }: ReminderButtonProps) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { userEmail } = useAuth();
  const queryClient = useQueryClient();

  const grouped = useMemo<Map<string, PendingTask[]>>(() => {
    if (!cases) return new Map<string, PendingTask[]>();
    return collectPendingTasks(cases, REMINDER_WINDOW_DAYS);
  }, [cases]);

  const totalPeople = grouped.size;
  const totalTasks = Array.from(grouped.values()).reduce(
    (sum, tasks) => sum + tasks.length,
    0,
  );

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    let mailsSent = 0;
    let mailsFailed = 0;

    for (const [assignee, tasks] of grouped.entries()) {
      const { subject, bodyHtml } = buildReminderMail({
        assigneeName: assignee.split('@')[0],
        tasks: tasks.map((t) => ({
          caseName: t.caseName,
          caseFirma: t.caseFirma,
          taskLabel: t.taskLabel,
          eintrittsdatum: t.eintrittsdatumFormatted,
          daysUntilEntry: t.daysUntilEntry,
        })),
      });

      try {
        await sendMail({ to: assignee, subject, bodyHtml });
        mailsSent += 1;

        // Log one protocol entry per affected case.
        const uniqueCaseIds = Array.from(new Set(tasks.map((t) => t.caseId)));
        for (const caseId of uniqueCaseIds) {
          const tasksForCase = tasks.filter((t) => t.caseId === caseId);
          try {
            await createProtocolEntry(
              Number(caseId),
              'Kommentar',
              `Reminder gesendet an ${assignee} (${tasksForCase.length} offene Aufgabe${tasksForCase.length === 1 ? '' : 'n'})`,
              userEmail,
            );
          } catch (err) {
            console.error('Protokoll-Eintrag (Reminder) fehlgeschlagen:', err);
          }
        }
      } catch (err) {
        console.error(`Reminder an ${assignee} fehlgeschlagen:`, err);
        mailsFailed += 1;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['protocol'] });
    setSending(false);
    setResult(
      mailsFailed === 0
        ? `${mailsSent} Reminder verschickt.`
        : `${mailsSent} verschickt, ${mailsFailed} fehlgeschlagen.`,
    );
  };

  const handleOpenChange = (_: unknown, data: { open: boolean }) => {
    setOpen(data.open);
    if (!data.open) {
      setResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger disableButtonEnhancement>
        <Button
          appearance="secondary"
          icon={<Alert24Regular />}
          disabled={!cases || totalTasks === 0}
        >
          Erinnerungen senden{totalTasks > 0 ? ` (${totalTasks})` : ''}
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Erinnerungen senden</DialogTitle>
          <DialogContent>
            {result ? (
              <Text>{result}</Text>
            ) : totalTasks === 0 ? (
              <Text>Keine offenen Aufgaben im Reminder-Fenster ({REMINDER_WINDOW_DAYS} Tage).</Text>
            ) : (
              <>
                <Text block style={{ marginBottom: 12 }}>
                  Es werden <strong>{totalPeople}</strong> Sammel-Mails mit insgesamt{' '}
                  <strong>{totalTasks}</strong> offenen Aufgaben verschickt (Eintritt innerhalb{' '}
                  {REMINDER_WINDOW_DAYS} Tage):
                </Text>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {Array.from(grouped.entries()).map(([assignee, tasks]) => (
                    <li key={assignee} style={{ marginBottom: 4 }}>
                      <Text>
                        <strong>{assignee}</strong> — {tasks.length} Aufgabe
                        {tasks.length === 1 ? '' : 'n'}
                      </Text>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {sending && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <Spinner size="tiny" />
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  Wird verschickt…
                </Text>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => setOpen(false)} disabled={sending}>
              {result ? 'Schließen' : 'Abbrechen'}
            </Button>
            {!result && totalTasks > 0 && (
              <Button appearance="primary" onClick={handleSend} disabled={sending}>
                Jetzt senden
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
