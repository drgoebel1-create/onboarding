import { useState, useMemo } from 'react';
import {
  Title2,
  Card,
  tokens,
  Text,
  Dropdown,
  Option,
  SearchBox,
} from '@fluentui/react-components';
import { useProtocol } from '../../hooks/useProtocol';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatDateTime } from '../../utils/formatters';
import { OB_PR_AKTION_VALUES } from '../../types/enums';

export function ProtocolPage() {
  const { data: protocol, isLoading, error, refetch } = useProtocol();
  const [aktionFilter, setAktionFilter] = useState('');
  const [caseIdSearch, setCaseIdSearch] = useState('');

  const filtered = useMemo(() => {
    if (!protocol) return [];
    let result = [...protocol].sort(
      (a, b) => (b.OB_PR_Zeitstempel ?? '').localeCompare(a.OB_PR_Zeitstempel ?? ''),
    );

    if (aktionFilter) {
      result = result.filter((p) => p.OB_PR_Aktion === aktionFilter);
    }

    if (caseIdSearch.trim()) {
      result = result.filter((p) => String(p.OB_PR_CaseID).includes(caseIdSearch.trim()));
    }

    return result;
  }, [protocol, aktionFilter, caseIdSearch]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Fehler beim Laden'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Title2>Aktivitätsprotokoll</Title2>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SearchBox
          placeholder="Case ID suchen..."
          value={caseIdSearch}
          onChange={(_, data) => setCaseIdSearch(data.value)}
          style={{ minWidth: 180 }}
        />
        <Dropdown
          placeholder="Aktion Filter"
          value={aktionFilter || ''}
          selectedOptions={aktionFilter ? [aktionFilter] : []}
          onOptionSelect={(_, data) => setAktionFilter(data.optionValue ?? '')}
          style={{ minWidth: 200 }}
        >
          <Option value="">Alle Aktionen</Option>
          {OB_PR_AKTION_VALUES.map((a) => (
            <Option key={a} value={a}>
              {a.replace(/_/g, ' ')}
            </Option>
          ))}
        </Dropdown>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: tokens.colorNeutralBackground3, textAlign: 'left' }}>
              <th style={thStyle}>Zeitstempel</th>
              <th style={thStyle}>Case ID</th>
              <th style={thStyle}>Aktion</th>
              <th style={thStyle}>Details</th>
              <th style={thStyle}>Benutzer</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32 }}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>
                    Keine Protokolleinträge vorhanden.
                  </Text>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}
                >
                  <td style={tdStyle}>{formatDateTime(p.OB_PR_Zeitstempel)}</td>
                  <td style={tdStyle}>{p.OB_PR_CaseID}</td>
                  <td style={tdStyle}>
                    <Text weight="semibold">{p.OB_PR_Aktion?.replace(/_/g, ' ')}</Text>
                  </td>
                  <td style={tdStyle}>{p.OB_PR_Details}</td>
                  <td style={tdStyle}>{p.OB_PR_Benutzer}</td>
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
