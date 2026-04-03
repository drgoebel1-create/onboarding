import type { OBStatus, OBFBStatus } from './enums';

export interface OnboardingCase {
  id: string;
  Title: string;
  OB_Vorname: string;
  OB_Nachname: string;
  OB_Email: string;
  OB_Kuerzel: string;
  OB_Firma: string;
  OB_Team: string;
  OB_Vorgesetzter_UPN: string;
  OB_Vorgesetzter_Name: string;
  OB_Vorgesetzter_Email: string;
  OB_Telefon: string;
  OB_Badge: string;
  OB_Notizen: string;
  OB_Eintrittsdatum: string;
  OB_Status: OBStatus;
  OB_FB_Status: OBFBStatus;
  OB_Task_AD: boolean;
  OB_Task_Email: boolean;
  OB_Task_VPN: boolean;
  OB_Task_Hardware: boolean;
  OB_Task_Telefon: boolean;
  OB_Task_Badge: boolean;
  OB_Task_Einweisung: boolean;
  OB_Task_M365: boolean;
  OB_Task_AD_User: string;
  OB_Task_Email_User: string;
  OB_Task_VPN_User: string;
  OB_Task_Hardware_User: string;
  OB_Task_Telefon_User: string;
  OB_Task_Badge_User: string;
  OB_Task_Einweisung_User: string;
  OB_Task_M365_User: string;
}

export interface OnboardingCaseCreate {
  Title: string;
  OB_Vorname: string;
  OB_Nachname: string;
  OB_Email: string;
  OB_Kuerzel: string;
  OB_Firma: string;
  OB_Team: string;
  OB_Eintrittsdatum: string;
  OB_Vorgesetzter_Name: string;
}

export const TASK_DEFINITIONS = [
  { key: 'OB_Task_AD', userKey: 'OB_Task_AD_User', label: 'Active Directory' },
  { key: 'OB_Task_Email', userKey: 'OB_Task_Email_User', label: 'E-Mail' },
  { key: 'OB_Task_VPN', userKey: 'OB_Task_VPN_User', label: 'VPN' },
  { key: 'OB_Task_Hardware', userKey: 'OB_Task_Hardware_User', label: 'Hardware' },
  { key: 'OB_Task_Telefon', userKey: 'OB_Task_Telefon_User', label: 'Telefon' },
  { key: 'OB_Task_Badge', userKey: 'OB_Task_Badge_User', label: 'Badge' },
  { key: 'OB_Task_Einweisung', userKey: 'OB_Task_Einweisung_User', label: 'Einweisung' },
  { key: 'OB_Task_M365', userKey: 'OB_Task_M365_User', label: 'Microsoft 365' },
] as const;

export type TaskKey = (typeof TASK_DEFINITIONS)[number]['key'];
export type TaskUserKey = (typeof TASK_DEFINITIONS)[number]['userKey'];
