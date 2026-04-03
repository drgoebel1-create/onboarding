import { Card, tokens } from '@fluentui/react-components';
import type { ReactNode } from 'react';

interface KpiTileProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

export function KpiTile({ icon, label, value, color }: KpiTileProps) {
  return (
    <Card
      style={{
        flex: '1 1 180px',
        padding: '20px 16px',
        textAlign: 'center',
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: 24, color: color ?? tokens.colorBrandForeground1 }}>
        {icon}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: color ?? tokens.colorNeutralForeground1,
          margin: '8px 0 4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: tokens.colorNeutralForeground2,
        }}
      >
        {label}
      </div>
    </Card>
  );
}
