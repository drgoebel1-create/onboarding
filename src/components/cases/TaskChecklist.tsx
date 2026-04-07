import { Card, Title3 } from '@fluentui/react-components';
import { TaskToggle } from '../common/TaskToggle';
import { TASK_DEFINITIONS } from '../../types/case';
import type { OnboardingCase } from '../../types/case';
import { useUpdateCase } from '../../hooks/useCases';
import { useAuth } from '../../auth/useAuth';
import { sendMail, buildTaskNotificationMail } from '../../api/mailApi';
import { formatDate, fullName } from '../../utils/formatters';

interface TaskChecklistProps {
  caseItem: OnboardingCase;
}

export function TaskChecklist({ caseItem }: TaskChecklistProps) {
  const updateCase = useUpdateCase();
  const { userName } = useAuth();

  const handleToggle = (
    taskKey: string,
    userKey: string,
    taskLabel: string,
    checked: boolean,
    user: string,
  ) => {
    const previousUser = (caseItem[userKey as keyof OnboardingCase] as string) ?? '';
    const isNewAssignment = user && user !== previousUser;

    updateCase.mutate(
      {
        itemId: caseItem.id,
        fields: {
          [taskKey]: checked,
          [userKey]: user,
        } as Partial<OnboardingCase>,
        logAction: 'Task_Erledigt',
        logDetails: `${taskLabel}: ${checked ? 'erledigt' : 'offen'} (${user || '—'})`,
      },
      {
        onSuccess: () => {
          // Send notification when a new person is assigned
          if (isNewAssignment) {
            const caseName = fullName(caseItem.OB_Vorname, caseItem.OB_Nachname);
            const { subject, bodyHtml } = buildTaskNotificationMail({
              assigneeName: user.split('@')[0],
              taskLabel,
              caseName,
              caseTeam: caseItem.OB_Team || '—',
              caseFirma: caseItem.OB_Firma || '—',
              eintrittsdatum: formatDate(caseItem.OB_Eintrittsdatum),
              assignedBy: userName,
            });

            sendMail({ to: user, subject, bodyHtml }).catch((err) => {
              console.error('Benachrichtigung fehlgeschlagen:', err);
            });
          }
        },
      },
    );
  };

  return (
    <Card style={{ padding: 20 }}>
      <Title3 style={{ marginBottom: 12 }}>Aufgaben-Checkliste</Title3>
      {TASK_DEFINITIONS.map((task) => (
        <TaskToggle
          key={task.key}
          label={task.label}
          checked={Boolean(caseItem[task.key as keyof OnboardingCase])}
          responsibleUser={(caseItem[task.userKey as keyof OnboardingCase] as string) ?? ''}
          onToggle={(checked, user) =>
            handleToggle(task.key, task.userKey, task.label, checked, user)
          }
        />
      ))}
    </Card>
  );
}
