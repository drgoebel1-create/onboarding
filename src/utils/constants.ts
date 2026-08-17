import type { TaskUserKey } from '../types/case';

export const SP_HOSTNAME = import.meta.env.VITE_SP_HOSTNAME || 'wernersobek.sharepoint.com';
export const SP_SITE_PATH = import.meta.env.VITE_SP_SITE_PATH || '/sites/IT-Onboarding';

export const LIST_NAMES = {
  cases: 'Onboarding_Cases',
  feedback: 'Onboarding_Feedback',
  protocol: 'Onboarding_Protokoll',
} as const;

export const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

export const TASK_DEFAULT_ASSIGNEES: Record<TaskUserKey, string> = {
  OB_Task_AD_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_AD || '',
  OB_Task_Email_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_EMAIL || '',
  OB_Task_VPN_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_VPN || '',
  OB_Task_Hardware_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_HARDWARE || '',
  OB_Task_Telefon_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_TELEFON || '',
  OB_Task_Badge_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_BADGE || '',
  OB_Task_Einweisung_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_EINWEISUNG || '',
  OB_Task_M365_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_M365 || '',
  OB_Task_Arbeitsplatz_User: import.meta.env.VITE_DEFAULT_ASSIGNEE_ARBEITSPLATZ || '',
};

export const REMINDER_WINDOW_DAYS = 7;
