import {
  Card,
  tokens,
  Text,
} from '@fluentui/react-components';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import type { OnboardingCase } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import {
  caseUrgency,
  compareByUrgency,
  daysUntilEntry,
  formatDate,
  fullName,
  taskProgress,
  urgencyColor,
} from '../../utils/formatters';

interface OpenCasesGalleryProps {
  cases: OnboardingCase[];
}

function entryLabel(days: number | null): string {
  if (days === null) return '—';
  if (days < 0) return `${Math.abs(days)} Tag${Math.abs(days) === 1 ? '' : 'e'} überfällig`;
  if (days === 0) return 'Eintritt heute';
  if (days === 1) return 'Eintritt morgen';
  return `Eintritt in ${days} Tagen`;
}

export function OpenCasesGallery({ cases }: OpenCasesGalleryProps) {
  const navigate = useNavigate();

  if (cases.length === 0) {
    return (
      <Card style={{ padding: 24, textAlign: 'center' }}>
        <Text style={{ color: tokens.colorNeutralForeground3 }}>
          Keine offenen Cases vorhanden.
        </Text>
      </Card>
    );
  }

  const sorted = [...cases].sort(compareByUrgency);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map((c) => {
        const progress = taskProgress(c);
        const urgency = caseUrgency(c);
        const days = daysUntilEntry(c.OB_Eintrittsdatum);
        return (
          <Card
            key={c.id}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderLeft: `4px solid ${urgencyColor(urgency)}`,
            }}
            onClick={() => navigate(`/cases/${c.id}`)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div>
                  <Text weight="semibold">{fullName(c.OB_Vorname, c.OB_Nachname)}</Text>
                  <div style={{ fontSize: 12, color: tokens.colorNeutralForeground3 }}>
                    {c.OB_Firma} · {c.OB_Team}
                  </div>
                </div>
                <StatusBadge status={c.OB_Status} />
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {formatDate(c.OB_Eintrittsdatum)}
                </Text>
                <Text
                  size={200}
                  style={{
                    color:
                      urgency === 'red'
                        ? urgencyColor('red')
                        : tokens.colorNeutralForeground3,
                    fontWeight: urgency === 'red' ? 600 : 400,
                  }}
                >
                  {entryLabel(days)}
                </Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  Tasks: {progress.done}/{progress.total}
                </Text>
              </div>
              <ChevronRight24Regular style={{ color: tokens.colorNeutralForeground3 }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
