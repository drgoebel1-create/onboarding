export const OB_STATUS_VALUES = [
  'Neu',
  'In_Bearbeitung',
  'Bereit',
  'Abgeschlossen',
  'Pausiert',
] as const;

export type OBStatus = (typeof OB_STATUS_VALUES)[number];

export const OB_FB_STATUS_VALUES = [
  'Nicht_Gestartet',
  'Eingeladen',
  'Teilweise',
  'Vollstaendig',
] as const;

export type OBFBStatus = (typeof OB_FB_STATUS_VALUES)[number];

export const OB_PR_AKTION_VALUES = [
  'Erstellt',
  'Aktualisiert',
  'Status_Geaendert',
  'Task_Erledigt',
  'Feedback_Eingeladen',
  'Feedback_Eingegangen',
  'Kommentar',
] as const;

export type OBPRAktion = (typeof OB_PR_AKTION_VALUES)[number];

export const OB_FB_TYP_VALUES = [
  'Onboarding',
  'IT_Ausstattung',
  'Allgemein',
] as const;

export type OBFBTyp = (typeof OB_FB_TYP_VALUES)[number];

export const STATUS_LABELS: Record<OBStatus, string> = {
  Neu: 'Neu',
  In_Bearbeitung: 'In Bearbeitung',
  Bereit: 'Bereit',
  Abgeschlossen: 'Abgeschlossen',
  Pausiert: 'Pausiert',
};

export const STATUS_COLORS: Record<OBStatus, string> = {
  Neu: '#0078d4',
  In_Bearbeitung: '#ff8c00',
  Bereit: '#107c10',
  Abgeschlossen: '#6b6b6b',
  Pausiert: '#d13438',
};
