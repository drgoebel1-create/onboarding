import {
  Title2,
  Title3,
  Button,
  Card,
  Dropdown,
  Option,
  tokens,
  Text,
} from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useCase, useUpdateCase } from '../../hooks/useCases';
import { useProtocolForCase } from '../../hooks/useProtocol';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { StatusBadge } from '../common/StatusBadge';
import { TaskChecklist } from './TaskChecklist';
import { formatDate, formatDateTime, fullName, taskProgress } from '../../utils/formatters';
import { OB_STATUS_VALUES, STATUS_LABELS } from '../../types/enums';
import type { OBStatus } from '../../types/enums';

const infoFields = [
  { label: 'E-Mail', key: 'OB_Email' },
  { label: 'Kürzel', key: 'OB_Kuerzel' },
  { label: 'Firma', key: 'OB_Firma' },
  { label: 'Team', key: 'OB_Team' },
  { label: 'Vorgesetzter', key: 'OB_Vorgesetzter_Name' },
  { label: 'Telefon', key: 'OB_Telefon' },
  { label: 'Badge', key: 'OB_Badge' },
] as const;

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseItem, isLoading, error, refetch } = useCase(id);
  const { data: protocol } = useProtocolForCase(caseItem ? Number(caseItem.id) : undefined);
  const updateCase = useUpdateCase();

  if (isLoading) return <LoadingSpinner />;
  if (error || !caseItem) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Case nicht gefunden'}
        onRetry={() => refetch()}
      />
    );
  }

  const progress = taskProgress(caseItem);

  const handleStatusChange = (_: unknown, data: { optionValue?: string }) => {
    if (!data.optionValue || data.optionValue === caseItem.OB_Status) return;
    const newStatus = data.optionValue as OBStatus;
    updateCase.mutate({
      itemId: caseItem.id,
      fields: { OB_Status: newStatus },
      logAction: 'Status_Geaendert',
      logDetails: `Status: ${STATUS_LABELS[caseItem.OB_Status]} → ${STATUS_LABELS[newStatus]}`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          icon={<ArrowLeft24Regular />}
          appearance="subtle"
          onClick={() => navigate(-1)}
        />
        <Title2>{fullName(caseItem.OB_Vorname, caseItem.OB_Nachname)}</Title2>
        <StatusBadge status={caseItem.OB_Status} />
      </div>

      {/* Personal Info */}
      <Card style={{ padding: 20 }}>
        <Title3 style={{ marginBottom: 12 }}>Persönliche Daten</Title3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Eintrittsdatum</Text>
            <div>{formatDate(caseItem.OB_Eintrittsdatum)}</div>
          </div>
          {infoFields.map((f) => (
            <div key={f.key}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{f.label}</Text>
              <div>{(caseItem[f.key] as string) || '—'}</div>
            </div>
          ))}
        </div>
        {caseItem.OB_Notizen && (
          <div style={{ marginTop: 16 }}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Notizen</Text>
            <div style={{ whiteSpace: 'pre-wrap' }}>{caseItem.OB_Notizen}</div>
          </div>
        )}
      </Card>

      {/* Status */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Title3 style={{ margin: 0 }}>Status</Title3>
          <Dropdown
            value={STATUS_LABELS[caseItem.OB_Status]}
            selectedOptions={[caseItem.OB_Status]}
            onOptionSelect={handleStatusChange}
            style={{ minWidth: 200 }}
          >
            {OB_STATUS_VALUES.map((s) => (
              <Option key={s} value={s}>
                {STATUS_LABELS[s]}
              </Option>
            ))}
          </Dropdown>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            Fortschritt: {progress.done}/{progress.total} Tasks
          </Text>
        </div>
      </Card>

      {/* Tasks */}
      <TaskChecklist caseItem={caseItem} />

      {/* Protocol */}
      {protocol && protocol.length > 0 && (
        <Card style={{ padding: 20 }}>
          <Title3 style={{ marginBottom: 12 }}>Letzte Aktivitäten</Title3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {protocol
              .sort((a, b) => (b.OB_PR_Zeitstempel ?? '').localeCompare(a.OB_PR_Zeitstempel ?? ''))
              .slice(0, 10)
              .map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 13,
                    padding: '6px 0',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3, minWidth: 130 }}>
                    {formatDateTime(entry.OB_PR_Zeitstempel)}
                  </Text>
                  <Text size={200} weight="semibold" style={{ minWidth: 120 }}>
                    {entry.OB_PR_Aktion}
                  </Text>
                  <Text size={200}>{entry.OB_PR_Details}</Text>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginLeft: 'auto' }}>
                    {entry.OB_PR_Benutzer}
                  </Text>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
