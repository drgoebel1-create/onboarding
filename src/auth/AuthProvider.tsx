import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { PublicClientApplication, InteractionStatus } from '@azure/msal-browser';
import { Button, Spinner, Title1, tokens } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { loginRequest } from './msalConfig';

interface AuthProviderProps {
  instance: PublicClientApplication;
  children: ReactNode;
}

function LoginPage() {
  const { instance, inProgress } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  if (inProgress !== InteractionStatus.None) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="large" label="Anmeldung wird durchgeführt..." />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '24px',
        background: tokens.colorNeutralBackground2,
      }}
    >
      <Title1>Onboarding Cockpit</Title1>
      <p style={{ color: tokens.colorNeutralForeground2, margin: 0 }}>
        Werner Sobek AG
      </p>
      <Button appearance="primary" size="large" onClick={handleLogin}>
        Mit Microsoft anmelden
      </Button>
    </div>
  );
}

export function AuthProvider({ instance, children }: AuthProviderProps) {
  return (
    <MsalProvider instance={instance}>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}
