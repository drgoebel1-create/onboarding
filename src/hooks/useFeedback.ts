import { useQuery } from '@tanstack/react-query';
import { getFeedback, getFeedbackForCase } from '../api/feedbackApi';

export function useFeedback() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: getFeedback,
  });
}

export function useFeedbackForCase(caseId: number | undefined) {
  return useQuery({
    queryKey: ['feedback', caseId],
    queryFn: () => getFeedbackForCase(caseId!),
    enabled: caseId !== undefined,
  });
}
