import {
  tokens,
  Button,
  Avatar,
  Tooltip,
} from '@fluentui/react-components';
import { SignOut24Regular } from '@fluentui/react-icons';
import { useAuth } from '../../auth/useAuth';

export function Header() {
  const { userName, userEmail, logout } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        padding: '0 24px',
        background: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 600 }}>Onboarding Cockpit</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13 }}>{userName}</span>
        <Avatar name={userName} size={28} color="neutral" />
        <Tooltip content="Abmelden" relationship="label">
          <Button
            icon={<SignOut24Regular />}
            appearance="transparent"
            style={{ color: tokens.colorNeutralForegroundOnBrand }}
            onClick={logout}
            aria-label="Abmelden"
          />
        </Tooltip>
      </div>
    </header>
  );
}
