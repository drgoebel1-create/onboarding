import { graphFetch } from './graphClient';

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string | null;
  userPrincipalName: string;
}

interface UsersResponse {
  value: GraphUser[];
}

export async function searchUsers(query: string): Promise<GraphUser[]> {
  if (!query || query.length < 2) return [];

  const filter = `startsWith(displayName,'${query}') or startsWith(mail,'${query}') or startsWith(userPrincipalName,'${query}')`;
  const data = await graphFetch<UsersResponse>(
    `/users?$filter=${encodeURIComponent(filter)}&$top=10&$select=id,displayName,mail,userPrincipalName`,
  );

  return data.value ?? [];
}
