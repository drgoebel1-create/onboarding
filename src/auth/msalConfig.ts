import type { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID || 'cc86b24c-f47b-43e7-8fb5-12eb6f0f86d6',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID || 'wernersobek.onmicrosoft.com'}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['Sites.ReadWrite.All', 'User.Read', 'User.ReadBasic.All'],
};

export const graphScopes = {
  scopes: ['Sites.ReadWrite.All', 'User.ReadBasic.All'],
};
