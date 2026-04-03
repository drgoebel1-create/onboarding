import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { lightTheme } from './styles/theme';
import { msalConfig } from './auth/msalConfig';
import { AuthProvider } from './auth/AuthProvider';
import { setMsalInstance } from './api/graphClient';
import App from './App';

const msalInstance = new PublicClientApplication(msalConfig);

// Set active account after redirect
msalInstance.initialize().then(() => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (
      event.eventType === EventType.LOGIN_SUCCESS &&
      event.payload &&
      'account' in event.payload
    ) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  });

  setMsalInstance(msalInstance);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <FluentProvider theme={lightTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider instance={msalInstance}>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </FluentProvider>
    </StrictMode>,
  );
});
