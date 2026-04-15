import { Button, Title2 } from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import { useFeedback } from '../../hooks/useFeedback';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { KpiRow } from './KpiRow';
import { OpenCasesGallery } from './OpenCasesGallery';
import { ReminderButton } from './ReminderButton';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: cases, isLoading, error, refetch } = useCases();
  const { data: feedback } = useFeedback();
  const stats = useDashboardStats(cases, feedback);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Fehler beim Laden'}
        onRetry={() => refetch()}
      />
    );
  }

  const openCases = (cases ?? []).filter(
    (c) => c.OB_Status === 'Neu' || c.OB_Status === 'In_Bearbeitung',
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title2>Dashboard</Title2>
        <div style={{ display: 'flex', gap: 8 }}>
          <ReminderButton cases={cases} />
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={() => navigate('/cases/new')}
          >
            Neuer Case
          </Button>
        </div>
      </div>

      <KpiRow stats={stats} />

      <div>
        <Title2 style={{ marginBottom: 12 }}>Offene Cases</Title2>
        <OpenCasesGallery cases={openCases} />
      </div>
    </div>
  );
}
