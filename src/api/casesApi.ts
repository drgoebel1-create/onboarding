import { getListItems, createListItem, updateListItem, LIST_NAMES } from './sharepointApi';
import type { OnboardingCase, OnboardingCaseCreate } from '../types/case';
import { TASK_DEFAULT_ASSIGNEES } from '../utils/constants';

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
    OB_Task_Arbeitsplatz: false,
    ...TASK_DEFAULT_ASSIGNEES,
  });
}

export async function updateCase(
  itemId: string,
  fields: Partial<OnboardingCase>,
): Promise<OnboardingCase> {
  const { id: _id, ...rest } = fields as Record<string, unknown>;
  return updateListItem<OnboardingCase>(LIST_NAMES.cases, itemId, rest);
}
