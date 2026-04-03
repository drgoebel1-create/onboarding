import { getListItems, createListItem, LIST_NAMES } from './sharepointApi';
import type { OnboardingProtocol } from '../types/protocol';
import type { OBPRAktion } from '../types/enums';

export async function getProtocol(): Promise<OnboardingProtocol[]> {
  return getListItems<OnboardingProtocol>(LIST_NAMES.protocol);
}

export async function getProtocolForCase(caseId: number): Promise<OnboardingProtocol[]> {
  return getListItems<OnboardingProtocol>(LIST_NAMES.protocol, {
    filter: `OB_PR_CaseID eq ${caseId}`,
  });
}

export async function createProtocolEntry(
  caseId: number,
  aktion: OBPRAktion,
  details: string,
  benutzer: string,
): Promise<OnboardingProtocol> {
  return createListItem<OnboardingProtocol>(LIST_NAMES.protocol, {
    OB_PR_CaseID: caseId,
    OB_PR_Aktion: aktion,
    OB_PR_Details: details,
    OB_PR_Benutzer: benutzer,
    OB_PR_Zeitstempel: new Date().toISOString(),
  });
}
