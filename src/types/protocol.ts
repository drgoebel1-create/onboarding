import type { OBPRAktion } from './enums';

export interface OnboardingProtocol {
  id: string;
  OB_PR_CaseID: number;
  OB_PR_Aktion: OBPRAktion;
  OB_PR_Details: string;
  OB_PR_Benutzer: string;
  OB_PR_Zeitstempel: string;
}
