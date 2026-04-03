import { getListItems, LIST_NAMES } from './sharepointApi';
import type { OnboardingFeedback } from '../types/feedback';

export async function getFeedback(): Promise<OnboardingFeedback[]> {
  return getListItems<OnboardingFeedback>(LIST_NAMES.feedback);
}

export async function getFeedbackForCase(caseId: number): Promise<OnboardingFeedback[]> {
  return getListItems<OnboardingFeedback>(LIST_NAMES.feedback, {
    filter: `OB_FB_CaseID eq ${caseId}`,
  });
}
