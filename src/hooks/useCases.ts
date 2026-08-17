import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCases, createCase, updateCase } from '../api/casesApi';
import { createProtocolEntry } from '../api/protocolApi';
import { sendMail, buildTaskNotificationMail } from '../api/mailApi';
import { useAuth } from '../auth/useAuth';
import { TASK_DEFINITIONS } from '../types/case';
import type { OnboardingCase, OnboardingCaseCreate, TaskKey } from '../types/case';
import type { OBPRAktion, OBStatus } from '../types/enums';
import { formatDate, fullName } from '../utils/formatters';

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
  const { userEmail, userName } = useAuth();

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

      // Auto-assignment notifications: one mail + protocol entry per
      // task that was pre-filled from TASK_DEFAULT_ASSIGNEES.
      const caseName = fullName(newCase.OB_Vorname, newCase.OB_Nachname);
      const eintritt = formatDate(newCase.OB_Eintrittsdatum);

      for (const task of TASK_DEFINITIONS) {
        const assignee = (newCase[task.userKey as keyof OnboardingCase] as string) ?? '';
        if (!assignee) continue;

        const { subject, bodyHtml } = buildTaskNotificationMail({
          assigneeName: assignee.split('@')[0],
          taskLabel: task.label,
          caseName,
          caseTeam: newCase.OB_Team || '—',
          caseFirma: newCase.OB_Firma || '—',
          eintrittsdatum: eintritt,
          assignedBy: userName,
        });

        sendMail({ to: assignee, subject, bodyHtml }).catch((err) => {
          console.error('Auto-Benachrichtigung fehlgeschlagen:', err);
        });

        try {
          await createProtocolEntry(
            Number(newCase.id),
            'Aktualisiert',
            `Auto-Zuweisung: ${task.label} an ${assignee}`,
            userEmail,
          );
        } catch (err) {
          console.error('Protokoll-Eintrag (Auto-Zuweisung) fehlgeschlagen:', err);
        }
      }

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
    }: {
      itemId: string;
      fields: Partial<OnboardingCase>;
      logAction?: OBPRAktion;
      logDetails?: string;
    }) => updateCase(itemId, fields),
    onSuccess: async (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });

      if (variables.logAction) {
        await createProtocolEntry(
          Number(variables.itemId),
          variables.logAction,
          variables.logDetails ?? '',
          userEmail,
        );
      }

      // Auto-status-transitions based on task completion.
      // Skip for status changes initiated manually (logAction === 'Status_Geaendert'),
      // and never overwrite Abgeschlossen or Pausiert.
      if (variables.logAction !== 'Status_Geaendert') {
        const currentStatus = (updated.OB_Status ??
          (variables.fields.OB_Status as OBStatus | undefined)) as OBStatus | undefined;

        if (currentStatus && currentStatus !== 'Abgeschlossen' && currentStatus !== 'Pausiert') {
          const doneCount = TASK_DEFINITIONS.filter(
            (t) => Boolean(updated[t.key as TaskKey]),
          ).length;
          const total = TASK_DEFINITIONS.length;

          let nextStatus: OBStatus | null = null;
          if (doneCount === total && currentStatus !== 'Bereit') {
            nextStatus = 'Bereit';
          } else if (currentStatus === 'Neu' && doneCount >= 1) {
            nextStatus = 'In_Bearbeitung';
          }

          if (nextStatus) {
            try {
              await updateCase(variables.itemId, { OB_Status: nextStatus });
              await createProtocolEntry(
                Number(variables.itemId),
                'Status_Geaendert',
                `Automatisch: ${currentStatus} → ${nextStatus}`,
                userEmail,
              );
              queryClient.invalidateQueries({ queryKey: ['cases'] });
            } catch (err) {
              console.error('Auto-Status-Transition fehlgeschlagen:', err);
            }
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['protocol'] });
    },
  });
}
