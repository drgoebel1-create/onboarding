import type { OBFBTyp } from './enums';

export interface OnboardingFeedback {
  id: string;
  OB_FB_CaseID: number;
  OB_FB_Typ: OBFBTyp;
  OB_FB_Gesamtzufriedenheit: number;
  OB_FB_Hardware: number;
  OB_FB_Zugaenge: number;
  OB_FB_Kommunikation: number;
  OB_FB_NPS: number;
  OB_FB_Kommentar: string;
  OB_FB_Eingeladen_Am: string;
  OB_FB_Eingegangen_Am: string;
  OB_FB_Abgeschlossen: boolean;
}
