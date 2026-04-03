import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

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
