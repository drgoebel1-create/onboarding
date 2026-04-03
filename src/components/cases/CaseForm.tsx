import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, Input, Button } from '@fluentui/react-components';
import type { OnboardingCaseCreate } from '../../types/case';

const caseSchema = z.object({
  OB_Vorname: z.string().min(1, 'Vorname ist erforderlich'),
  OB_Nachname: z.string().min(1, 'Nachname ist erforderlich'),
  OB_Email: z.string().email('Ungültige E-Mail-Adresse'),
  OB_Kuerzel: z.string().min(1, 'Kürzel ist erforderlich'),
  OB_Firma: z.string().min(1, 'Firma ist erforderlich'),
  OB_Team: z.string().min(1, 'Team ist erforderlich'),
  OB_Eintrittsdatum: z.string().min(1, 'Eintrittsdatum ist erforderlich'),
  OB_Vorgesetzter_Name: z.string().min(1, 'Vorgesetzter ist erforderlich'),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface CaseFormProps {
  onSubmit: (data: OnboardingCaseCreate) => void;
  isSubmitting?: boolean;
}

const fields: { name: keyof CaseFormData; label: string; type?: string }[] = [
  { name: 'OB_Vorname', label: 'Vorname' },
  { name: 'OB_Nachname', label: 'Nachname' },
  { name: 'OB_Email', label: 'E-Mail', type: 'email' },
  { name: 'OB_Kuerzel', label: 'Kürzel' },
  { name: 'OB_Firma', label: 'Firma' },
  { name: 'OB_Team', label: 'Team' },
  { name: 'OB_Eintrittsdatum', label: 'Eintrittsdatum', type: 'date' },
  { name: 'OB_Vorgesetzter_Name', label: 'Vorgesetzter' },
];

export function CaseForm({ onSubmit, isSubmitting }: CaseFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      OB_Vorname: '',
      OB_Nachname: '',
      OB_Email: '',
      OB_Kuerzel: '',
      OB_Firma: '',
      OB_Team: '',
      OB_Eintrittsdatum: '',
      OB_Vorgesetzter_Name: '',
    },
  });

  const handleFormSubmit = (data: CaseFormData) => {
    onSubmit({
      ...data,
      Title: `${data.OB_Vorname} ${data.OB_Nachname}`,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}
    >
      {fields.map((f) => (
        <Controller
          key={f.name}
          name={f.name}
          control={control}
          render={({ field }) => (
            <Field
              label={f.label}
              validationState={errors[f.name] ? 'error' : undefined}
              validationMessage={errors[f.name]?.message}
              required
            >
              <Input
                {...field}
                type={f.type as 'text' | 'email' | 'date' | undefined}
              />
            </Field>
          )}
        />
      ))}

      <Button appearance="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
      </Button>
    </form>
  );
}
