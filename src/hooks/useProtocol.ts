import { useQuery } from '@tanstack/react-query';
import { getProtocol, getProtocolForCase } from '../api/protocolApi';

export function useProtocol() {
  return useQuery({
    queryKey: ['protocol'],
    queryFn: getProtocol,
  });
}

export function useProtocolForCase(caseId: number | undefined) {
  return useQuery({
    queryKey: ['protocol', caseId],
    queryFn: () => getProtocolForCase(caseId!),
    enabled: caseId !== undefined,
  });
}
