import { graphFetch, graphFetchAll } from './graphClient';
import { SP_HOSTNAME, SP_SITE_PATH, LIST_NAMES } from '../utils/constants';

let siteId: string | null = null;
const listIds: Record<string, string> = {};

export async function getSiteId(): Promise<string> {
  if (siteId) return siteId;

  const data = await graphFetch<{ id: string }>(
    `/sites/${SP_HOSTNAME}:${SP_SITE_PATH}`,
  );
  siteId = data.id;
  return siteId;
}

export async function getListId(listName: string): Promise<string> {
  if (listIds[listName]) return listIds[listName];

  const sid = await getSiteId();
  const data = await graphFetch<{ value: { id: string; displayName: string }[] }>(
    `/sites/${sid}/lists?$filter=displayName eq '${listName}'`,
  );

  if (!data.value?.length) {
    throw new Error(`SharePoint-Liste "${listName}" nicht gefunden`);
  }

  listIds[listName] = data.value[0].id;
  return listIds[listName];
}

interface GraphListItem {
  id: string;
  fields: Record<string, unknown>;
}

interface GetListItemsOptions {
  filter?: string;
  orderBy?: string;
  top?: number;
}

export async function getListItems<T>(
  listName: string,
  options?: GetListItemsOptions,
): Promise<T[]> {
  const sid = await getSiteId();
  const lid = await getListId(listName);

  let path = `/sites/${sid}/lists/${lid}/items?$expand=fields`;

  const params: string[] = [];
  if (options?.filter) params.push(`$filter=fields/${options.filter}`);
  if (options?.orderBy) params.push(`$orderby=fields/${options.orderBy}`);
  if (options?.top) params.push(`$top=${options.top}`);

  if (params.length) path += '&' + params.join('&');

  const items = await graphFetchAll<GraphListItem>(path.replace('https://graph.microsoft.com/v1.0', ''));

  return items.map((item) => ({
    id: item.id,
    ...item.fields,
  })) as T[];
}

export async function createListItem<T>(
  listName: string,
  fields: Record<string, unknown>,
): Promise<T> {
  const sid = await getSiteId();
  const lid = await getListId(listName);

  const data = await graphFetch<GraphListItem>(
    `/sites/${sid}/lists/${lid}/items`,
    {
      method: 'POST',
      body: JSON.stringify({ fields }),
    },
  );

  return { id: data.id, ...data.fields } as T;
}

export async function updateListItem<T>(
  listName: string,
  itemId: string,
  fields: Record<string, unknown>,
): Promise<T> {
  const sid = await getSiteId();
  const lid = await getListId(listName);

  const data = await graphFetch<Record<string, unknown>>(
    `/sites/${sid}/lists/${lid}/items/${itemId}/fields`,
    {
      method: 'PATCH',
      body: JSON.stringify(fields),
    },
  );

  return { id: itemId, ...data } as T;
}

export { LIST_NAMES };
