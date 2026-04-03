import { Title2, Title3, Button, Card, tokens, Text } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import type { OnboardingFeedback } from '../../types/feedback';
import { formatDateTime } from '../../utils/formatters';

interface FeedbackDetailProps {
  feedback: OnboardingFeedback;
  onBack: () => void;
}

const ratingFields = [
  { label: 'Gesamtzufriedenheit', key: 'OB_FB_Gesamtzufriedenheit' },
  { label: 'Hardware', key: 'OB_FB_Hardware' },
  { label: 'Zugänge', key: 'OB_FB_Zugaenge' },
  { label: 'Kommunikation', key: 'OB_FB_Kommunikation' },
  { label: 'NPS', key: 'OB_FB_NPS' },
] as const;

function RatingBar({ value, max = 5 }: { value: number | null; max?: number }) {
  if (value == null) return <Text>—</Text>;
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 120,
          height: 8,
          borderRadius: 4,
          background: tokens.colorNeutralBackground5,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 4,
            background: pct >= 60 ? '#107c10' : pct >= 40 ? '#ff8c00' : '#d13438',
          }}
        />
      </div>
      <Text size={200}>{value}/{max}</Text>
    </div>
  );
}

export function FeedbackDetail({ feedback, onBack }: FeedbackDetailProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={onBack} />
        <Title2>Feedback Details</Title2>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          Case #{feedback.OB_FB_CaseID} · {feedback.OB_FB_Typ}
        </Text>
      </div>

      <Card style={{ padding: 20 }}>
        <Title3 style={{ marginBottom: 16 }}>Bewertungen</Title3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ratingFields.map((f) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Text style={{ minWidth: 160 }}>{f.label}</Text>
              <RatingBar
                value={feedback[f.key] as number | null}
                max={f.key === 'OB_FB_NPS' ? 10 : 5}
              />
            </div>
          ))}
        </div>
      </Card>

      {feedback.OB_FB_Kommentar && (
        <Card style={{ padding: 20 }}>
          <Title3 style={{ marginBottom: 8 }}>Kommentar</Title3>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{feedback.OB_FB_Kommentar}</Text>
        </Card>
      )}

      <Card style={{ padding: 20 }}>
        <Title3 style={{ marginBottom: 12 }}>Zeitraum</Title3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Eingeladen am</Text>
            <div>{formatDateTime(feedback.OB_FB_Eingeladen_Am)}</div>
          </div>
          <div>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Eingegangen am</Text>
            <div>{formatDateTime(feedback.OB_FB_Eingegangen_Am)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
