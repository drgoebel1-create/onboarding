import { Title2, Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useCreateCase } from '../../hooks/useCases';
import { CaseForm } from './CaseForm';
import type { OnboardingCaseCreate } from '../../types/case';

export function NewCasePage() {
  const navigate = useNavigate();
  const createCase = useCreateCase();

  const handleSubmit = (data: OnboardingCaseCreate) => {
    createCase.mutate(data, {
      onSuccess: (newCase) => {
        navigate(`/cases/${newCase.id}`);
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          icon={<ArrowLeft24Regular />}
          appearance="subtle"
          onClick={() => navigate('/')}
        />
        <Title2>Neuer Onboarding Case</Title2>
      </div>

      <CaseForm onSubmit={handleSubmit} isSubmitting={createCase.isPending} />

      {createCase.isError && (
        <div style={{ color: '#d13438' }}>
          Fehler: {createCase.error instanceof Error ? createCase.error.message : 'Unbekannter Fehler'}
        </div>
      )}
    </div>
  );
}
