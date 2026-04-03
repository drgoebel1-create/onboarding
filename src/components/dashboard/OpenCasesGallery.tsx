import {
  Card,
  tokens,
  Text,
} from '@fluentui/react-components';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import type { OnboardingCase } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate, fullName, taskProgress } from '../../utils/formatters';

interface OpenCasesGalleryProps {
  cases: OnboardingCase[];
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {cases.map((c) => {
        const progress = taskProgress(c);
        return (
          <Card
            key={c.id}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
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
                  Eintritt: {formatDate(c.OB_Eintrittsdatum)}
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
