import { Card, Title3 } from '@fluentui/react-components';
import { TaskToggle } from '../common/TaskToggle';
import { TASK_DEFINITIONS } from '../../types/case';
import type { OnboardingCase } from '../../types/case';
import { useUpdateCase } from '../../hooks/useCases';

interface TaskChecklistProps {
  caseItem: OnboardingCase;
}

export function TaskChecklist({ caseItem }: TaskChecklistProps) {
  const updateCase = useUpdateCase();

  const handleToggle = (
    taskKey: string,
    userKey: string,
    taskLabel: string,
    checked: boolean,
    user: string,
  ) => {
    updateCase.mutate({
      itemId: caseItem.id,
      fields: {
        [taskKey]: checked,
        [userKey]: user,
      } as Partial<OnboardingCase>,
      logAction: 'Task_Erledigt',
      logDetails: `${taskLabel}: ${checked ? 'erledigt' : 'offen'} (${user || '—'})`,
    });
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
