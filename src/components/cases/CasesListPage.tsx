import { useState, useMemo } from 'react';
import {
  Title2,
  Button,
  SearchBox,
  Dropdown,
  Option,
  Card,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../../hooks/useCases';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate, fullName, taskProgress } from '../../utils/formatters';
import { OB_STATUS_VALUES, STATUS_LABELS } from '../../types/enums';
import type { OBStatus } from '../../types/enums';

export function CasesListPage() {
  const navigate = useNavigate();
  const { data: cases, isLoading, error, refetch } = useCases();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OBStatus | ''>('');

  const filtered = useMemo(() => {
    if (!cases) return [];
    let result = cases;

    if (statusFilter) {
      result = result.filter((c) => c.OB_Status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.OB_Vorname?.toLowerCase().includes(q) ||
          c.OB_Nachname?.toLowerCase().includes(q) ||
          c.OB_Email?.toLowerCase().includes(q) ||
          c.OB_Kuerzel?.toLowerCase().includes(q) ||
          c.OB_Firma?.toLowerCase().includes(q) ||
          c.OB_Team?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [cases, search, statusFilter]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title2>Alle Cases</Title2>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/cases/new')}
        >
          Neuer Case
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SearchBox
          placeholder="Suche nach Name, E-Mail, Kürzel..."
          value={search}
          onChange={(_, data) => setSearch(data.value)}
          style={{ minWidth: 280 }}
        />
        <Dropdown
          placeholder="Status Filter"
          value={statusFilter ? STATUS_LABELS[statusFilter] : ''}
          selectedOptions={statusFilter ? [statusFilter] : []}
          onOptionSelect={(_, data) => {
            setStatusFilter((data.optionValue as OBStatus | '') ?? '');
          }}
          style={{ minWidth: 180 }}
        >
          <Option value="">Alle Status</Option>
          {OB_STATUS_VALUES.map((s) => (
            <Option key={s} value={s}>
              {STATUS_LABELS[s]}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: tokens.colorNeutralBackground3,
                textAlign: 'left',
              }}
            >
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Firma</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>Eintrittsdatum</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Fortschritt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32 }}>
                  <Text style={{ color: tokens.colorNeutralForeground3 }}>
                    Keine Cases gefunden.
                  </Text>
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const progress = taskProgress(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/cases/${c.id}`)}
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
                    <td style={tdStyle}>
                      <Text weight="semibold">
                        {fullName(c.OB_Vorname, c.OB_Nachname)}
                      </Text>
                    </td>
                    <td style={tdStyle}>{c.OB_Firma || '—'}</td>
                    <td style={tdStyle}>{c.OB_Team || '—'}</td>
                    <td style={tdStyle}>{formatDate(c.OB_Eintrittsdatum)}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={c.OB_Status} />
                    </td>
                    <td style={tdStyle}>
                      {progress.done}/{progress.total}
                    </td>
                  </tr>
                );
              })
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
