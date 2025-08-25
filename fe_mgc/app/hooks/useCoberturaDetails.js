import { useQuery } from '@apollo/client';
import { GET_COBERTURA_DETAILS } from '../graphql/operations/coberturas';

export function useCoberturaDetails(coberturaId, show) {
  const { data, loading, error } = useQuery(GET_COBERTURA_DETAILS, {
    variables: { id: coberturaId },
    skip: !show || !coberturaId,
    errorPolicy: 'all',
  });
  return {
    cobertura: data?.cobertura,
    loading,
    error,
  };
}
