import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCases, createCase, updateCase } from '../api/casesApi';
import { createProtocolEntry } from '../api/protocolApi';
import { useAuth } from '../auth/useAuth';
import type { OnboardingCase, OnboardingCaseCreate } from '../types/case';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: getCases,
  });
}

export function useCase(id: string | undefined) {
  const { data: cases, ...rest } = useCases();
  const caseItem = cases?.find((c) => c.id === id);
  return { data: caseItem, ...rest };
}

export function useCreateCase() {
  const queryClient = useQueryClient();
  const { userEmail } = useAuth();

  return useMutation({
    mutationFn: (data: OnboardingCaseCreate) => createCase(data),
    onSuccess: async (newCase) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      await createProtocolEntry(
        Number(newCase.id),
        'Erstellt',
        `Case erstellt: ${newCase.OB_Vorname} ${newCase.OB_Nachname}`,
        userEmail,
      );
      queryClient.invalidateQueries({ queryKey: ['protocol'] });
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();
  const { userEmail } = useAuth();

  return useMutation({
    mutationFn: ({
      itemId,
      fields,
      logAction,
      logDetails,
    }: {
      itemId: string;
      fields: Partial<OnboardingCase>;
      logAction?: string;
      logDetails?: string;
    }) => updateCase(itemId, fields),
    onSuccess: async (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });

      if (variables.logAction) {
        await createProtocolEntry(
          Number(variables.itemId),
          variables.logAction as 'Aktualisiert' | 'Status_Geaendert' | 'Task_Erledigt',
          variables.logDetails ?? '',
          userEmail,
        );
        queryClient.invalidateQueries({ queryKey: ['protocol'] });
      }
    },
  });
}
