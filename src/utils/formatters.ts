import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import type { OnboardingCase } from '../types/case';

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: de });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy HH:mm', { locale: de });
  } catch {
    return dateStr;
  }
}

export function fullName(vorname: string, nachname: string): string {
  return `${vorname} ${nachname}`.trim();
}

export function taskProgress(caseItem: Record<string, unknown>): { done: number; total: number } {
  const taskKeys = [
    'OB_Task_AD', 'OB_Task_Email', 'OB_Task_VPN', 'OB_Task_Hardware',
    'OB_Task_Telefon', 'OB_Task_Badge', 'OB_Task_Einweisung', 'OB_Task_M365',
  ];
  const total = taskKeys.length;
  const done = taskKeys.filter((k) => caseItem[k] === true).length;
  return { done, total };
}

/**
 * Returns the number of calendar days between today and the entry date.
 * Negative if the entry date is already in the past.
 * Returns `null` if the date cannot be parsed.
 */
export function daysUntilEntry(eintrittsdatum: string | null | undefined): number | null {
  if (!eintrittsdatum) return null;
  try {
    return differenceInCalendarDays(parseISO(eintrittsdatum), new Date());
  } catch {
    return null;
  }
}

export type UrgencyLevel = 'red' | 'yellow' | 'green' | 'none';

/**
 * Derives a simple urgency level for a case based on days until entry
 * and task completion:
 * - `none`: case already completed (status Abgeschlossen) or paused
 * - `green`: all 8 tasks done, or entry comfortably far away
 * - `yellow`: entry within 7 days, tasks still open
 * - `red`: entry within 2 days (or overdue), tasks still open
 */
export function caseUrgency(caseItem: OnboardingCase): UrgencyLevel {
  if (caseItem.OB_Status === 'Abgeschlossen' || caseItem.OB_Status === 'Pausiert') {
    return 'none';
  }
  const { done, total } = taskProgress(caseItem as unknown as Record<string, unknown>);
  if (done === total) return 'green';

  const days = daysUntilEntry(caseItem.OB_Eintrittsdatum);
  if (days === null) return 'green';
  if (days < 3) return 'red';
  if (days < 7) return 'yellow';
  return 'green';
}

export function urgencyColor(level: UrgencyLevel): string {
  switch (level) {
    case 'red':
      return '#d13438';
    case 'yellow':
      return '#ffaa44';
    case 'green':
      return '#107c10';
    case 'none':
    default:
      return '#c8c6c4';
  }
}

const URGENCY_ORDER: Record<UrgencyLevel, number> = {
  red: 0,
  yellow: 1,
  green: 2,
  none: 3,
};

export function compareByUrgency(a: OnboardingCase, b: OnboardingCase): number {
  const ua = URGENCY_ORDER[caseUrgency(a)];
  const ub = URGENCY_ORDER[caseUrgency(b)];
  if (ua !== ub) return ua - ub;
  const da = daysUntilEntry(a.OB_Eintrittsdatum) ?? Number.MAX_SAFE_INTEGER;
  const db = daysUntilEntry(b.OB_Eintrittsdatum) ?? Number.MAX_SAFE_INTEGER;
  return da - db;
}
