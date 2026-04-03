import { Badge } from '@fluentui/react-components';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/enums';
import type { OBStatus } from '../../types/enums';

interface StatusBadgeProps {
  status: OBStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      appearance="filled"
      style={{
        backgroundColor: STATUS_COLORS[status] ?? '#888',
        color: '#fff',
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
