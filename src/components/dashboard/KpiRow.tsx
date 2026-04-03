import {
  People24Regular,
  PersonAvailable24Regular,
  Checkmark24Regular,
  Star24Regular,
  ThumbLike24Regular,
} from '@fluentui/react-icons';
import { KpiTile } from '../common/KpiTile';
import type { DashboardStats } from '../../hooks/useDashboardStats';

interface KpiRowProps {
  stats: DashboardStats;
}

export function KpiRow({ stats }: KpiRowProps) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <KpiTile
        icon={<People24Regular />}
        label="Cases gesamt"
        value={stats.total}
      />
      <KpiTile
        icon={<PersonAvailable24Regular />}
        label="Offen / Aktiv"
        value={stats.openActive}
        color="#ff8c00"
      />
      <KpiTile
        icon={<Checkmark24Regular />}
        label="Abgeschlossen"
        value={stats.completed}
        color="#107c10"
      />
      <KpiTile
        icon={<Star24Regular />}
        label="Ø Bewertung"
        value={stats.avgRating ?? '—'}
      />
      <KpiTile
        icon={<ThumbLike24Regular />}
        label="Ø NPS"
        value={stats.avgNPS ?? '—'}
      />
    </div>
  );
}
