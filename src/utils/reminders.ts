import { TASK_DEFINITIONS } from '../types/case';
import type { OnboardingCase } from '../types/case';
import { daysUntilEntry, formatDate } from './formatters';

export interface PendingTask {
  caseId: string;
  caseName: string;
  caseFirma: string;
  taskKey: string;
  taskLabel: string;
  eintrittsdatum: string;
  eintrittsdatumFormatted: string;
  daysUntilEntry: number;
}

/**
 * Iterates all active onboarding cases and collects every unchecked task
 * whose owner is assigned AND whose entry date is within `daysThreshold`
 * days from today (including overdue cases). Tasks are grouped by the
 * assignee's UPN / e-mail.
 */
export function collectPendingTasks(
  cases: OnboardingCase[],
  daysThreshold: number,
): Map<string, PendingTask[]> {
  const grouped = new Map<string, PendingTask[]>();

  for (const c of cases) {
    if (c.OB_Status !== 'Neu' && c.OB_Status !== 'In_Bearbeitung') continue;

    const days = daysUntilEntry(c.OB_Eintrittsdatum);
    if (days === null) continue;
    if (days > daysThreshold) continue;

    const caseName = `${c.OB_Vorname} ${c.OB_Nachname}`.trim();

    for (const task of TASK_DEFINITIONS) {
      const done = Boolean((c as unknown as Record<string, unknown>)[task.key]);
      if (done) continue;

      const assignee = ((c as unknown as Record<string, unknown>)[task.userKey] as string) ?? '';
      if (!assignee) continue;

      const entry: PendingTask = {
        caseId: c.id,
        caseName,
        caseFirma: c.OB_Firma || '—',
        taskKey: task.key,
        taskLabel: task.label,
        eintrittsdatum: c.OB_Eintrittsdatum,
        eintrittsdatumFormatted: formatDate(c.OB_Eintrittsdatum),
        daysUntilEntry: days,
      };

      const bucket = grouped.get(assignee);
      if (bucket) {
        bucket.push(entry);
      } else {
        grouped.set(assignee, [entry]);
      }
    }
  }

  // Sort each bucket: most urgent first
  for (const tasks of grouped.values()) {
    tasks.sort((a, b) => a.daysUntilEntry - b.daysUntilEntry);
  }

  return grouped;
}
