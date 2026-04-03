export const SP_HOSTNAME = import.meta.env.VITE_SP_HOSTNAME || 'wernersobek.sharepoint.com';
export const SP_SITE_PATH = import.meta.env.VITE_SP_SITE_PATH || '/sites/IT-Onboarding';

export const LIST_NAMES = {
  cases: 'Onboarding_Cases',
  feedback: 'Onboarding_Feedback',
  protocol: 'Onboarding_Protokoll',
} as const;

export const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
