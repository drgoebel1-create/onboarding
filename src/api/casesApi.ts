import { getListItems, createListItem, updateListItem, LIST_NAMES } from './sharepointApi';
import type { OnboardingCase, OnboardingCaseCreate } from '../types/case';

export async function getCases(): Promise<OnboardingCase[]> {
  return getListItems<OnboardingCase>(LIST_NAMES.cases);
}

export async function createCase(data: OnboardingCaseCreate): Promise<OnboardingCase> {
  return createListItem<OnboardingCase>(LIST_NAMES.cases, {
    ...data,
    Title: `${data.OB_Vorname} ${data.OB_Nachname}`,
    OB_Status: 'Neu',
    OB_FB_Status: 'Nicht_Gestartet',
    OB_Task_AD: false,
    OB_Task_Email: false,
    OB_Task_VPN: false,
    OB_Task_Hardware: false,
    OB_Task_Telefon: false,
    OB_Task_Badge: false,
    OB_Task_Einweisung: false,
    OB_Task_M365: false,
    OB_Task_AD_User: '',
    OB_Task_Email_User: '',
    OB_Task_VPN_User: '',
    OB_Task_Hardware_User: '',
    OB_Task_Telefon_User: '',
    OB_Task_Badge_User: '',
    OB_Task_Einweisung_User: '',
    OB_Task_M365_User: '',
  });
}

export async function updateCase(
  itemId: string,
  fields: Partial<OnboardingCase>,
): Promise<OnboardingCase> {
  const { id: _id, ...rest } = fields as Record<string, unknown>;
  return updateListItem<OnboardingCase>(LIST_NAMES.cases, itemId, rest);
}
