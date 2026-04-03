import { useState, useMemo } from 'react';
import {
  Title2,
  Card,
  tokens,
  Text,
  Badge,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import { useFeedback } from '../../hooks/useFeedback';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatDateTime } from '../../utils/formatters';
import { FeedbackDetail } from './FeedbackDetail';
import type { OnboardingFeedback } from '../../types/feedback';

export function FeedbackPage() {
  const { data: feedback, isLoading, error, refetch } = useFeedback();
  const [selectedFeedback, setSelectedFeedback] = useState<OnboardingFeedback | null>(null);
  const [typFilter, setTypFilter] = useState('');

  const filtered = useMemo(() => {
    if (!feedback) return [];
    if (!typFilter) return feedback;
    return feedback.filter((f) => f.OB_FB_Typ === typFilter);
  }, [feedback, typFilter]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Fehler beim Laden'}
        onRetry={() => refetch()}
      />
    );
  }

  if (selectedFeedback) {
    return (
      <FeedbackDetail
        feedback={selectedFeedback}
        onBack={() => setSelectedFeedback(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Title2>Feedback</Title2>

      <div style={{ display: 'flex', gap: 12 }}>
        <Dropdown
          placeholder="Typ Filter"
          value={typFilter || ''}
          selectedOptions={typFilter ? [typFilter] : []}
          onOptionSelect={(_, data) => setTypFilter(data.optionValue ?? '')}
          style={{ minWidth: 180 }}
        >
          <Option value="">Alle Typen</Option>
          <Option value="Onboarding">Onboarding</Option>
          <Option value="IT_Ausstattung">IT-Ausstattung</Option>
          <Option value="Allgemein">Allgemein</Option>
        </Dropdown>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: tokens.colorNeutralBackground3, textAlign: 'left' }}>
              <th style={thStyle}>Case ID</th>
              <th style={thStyle}>Typ</th>
              <th style={thStyle}>Zufriedenheit</th>
              <th style={thStyle}>NPS</th>
              <th style={thStyle}>Eingegangen</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32 }}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>
                    Kein Feedback vorhanden.
                  </Text>
                </td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedFeedback(f)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      tokens.colorNeutralBackground1Hover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  <td style={tdStyle}>{f.OB_FB_CaseID}</td>
                  <td style={tdStyle}>{f.OB_FB_Typ}</td>
                  <td style={tdStyle}>
                    {f.OB_FB_Gesamtzufriedenheit != null
                      ? `${f.OB_FB_Gesamtzufriedenheit}/5`
                      : '—'}
                  </td>
                  <td style={tdStyle}>{f.OB_FB_NPS ?? '—'}</td>
                  <td style={tdStyle}>{formatDateTime(f.OB_FB_Eingegangen_Am)}</td>
                  <td style={tdStyle}>
                    <Badge
                      appearance="filled"
                      color={f.OB_FB_Abgeschlossen ? 'success' : 'warning'}
                    >
                      {f.OB_FB_Abgeschlossen ? 'Abgeschlossen' : 'Offen'}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
};
