import {
  type IPublicClientApplication,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';
import { graphScopes } from '../auth/msalConfig';
import { GRAPH_BASE } from '../utils/constants';

let msalInstance: IPublicClientApplication | null = null;

export function setMsalInstance(instance: IPublicClientApplication) {
  msalInstance = instance;
}

async function getAccessToken(): Promise<string> {
  if (!msalInstance) throw new Error('MSAL instance not initialized');

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) throw new Error('Kein angemeldeter Benutzer');

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...graphScopes,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect(graphScopes);
      throw new Error('Redirect für Token-Erneuerung');
    }
    throw error;
  }
}

export async function graphFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${GRAPH_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Graph API Fehler ${response.status}: ${errorBody}`,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function graphFetchAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let url: string | null = `${GRAPH_BASE}${path}`;

  while (url) {
    const token = await getAccessToken();
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Graph API Fehler ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    items.push(...(data.value ?? []));
    url = data['@odata.nextLink'] ?? null;
  }

  return items;
}
