import { useMsal } from '@azure/msal-react';
import { useCallback } from 'react';
import { loginRequest } from './msalConfig';

export function useAuth() {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? null;

  const logout = useCallback(() => {
    instance.logoutRedirect();
  }, [instance]);

  const userName = account?.name ?? account?.username ?? 'Unbekannt';
  const userEmail = account?.username ?? '';

  return {
    account,
    userName,
    userEmail,
    logout,
    instance,
    loginRequest,
  };
}
