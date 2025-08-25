'use client';

import { useMutation, useQuery } from '@apollo/client';
import { 
  GET_COBERTURAS,
  GET_COBERTURA_DETAILS,
  CREATE_COBERTURA,
  UPDATE_COBERTURA,
  UPDATE_COBERTURA_ESTADO,
  DELETE_COBERTURA 
} from '../graphql/operations/coberturas';
import { useUserSucursal } from '../../lib/user-hooks';
import { useMemo } from 'react';

export function useCoberturas() {
  const { data, loading, error, refetch } = useQuery(GET_COBERTURAS, {
    // Optimizaciones de rendimiento
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    // Cache por 5 minutos
    pollInterval: 300000,
  });

  const { sucursalId, loading: userLoading } = useUserSucursal();

  // Filtrar coberturas por sucursal del usuario directamente en el componente
  const coberturasFiltradasPorSucursal = useMemo(() => {
    if (!data?.coberturas || !sucursalId) return [];
    
    return data.coberturas.filter((cobertura) => {
      // Filtrar por sucursal del solicitante de la cobertura
      const solicitanteSucursalId = cobertura?.solicitante?.ID_sucursal?.toString();
      return solicitanteSucursalId === sucursalId.toString();
    });
  }, [data?.coberturas, sucursalId]);

  return {
    coberturas: coberturasFiltradasPorSucursal,
    loading: loading || userLoading,
    error,
    refetch
  };
}

export function useCobertura(id) {
  const { data, loading, error } = useQuery(GET_COBERTURA_DETAILS, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  return {
    cobertura: data?.cobertura,
    loading,
    error
  };
}

export function useCreateCobertura() {
  const [createCobertura, { loading, error }] = useMutation(CREATE_COBERTURA, {
    refetchQueries: [{ query: GET_COBERTURAS }],
  });

  const create = async (input) => {
    try {
      const result = await createCobertura({
        variables: { input }
      });
      return { data: result.data.createCobertura, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return { create, loading, error };
}

export function useUpdateCobertura() {
  const [updateCobertura, { loading, error }] = useMutation(UPDATE_COBERTURA, {
    refetchQueries: [{ query: GET_COBERTURAS }],
  });

  const update = async (id, input) => {
    try {
      const result = await updateCobertura({
        variables: { id, input }
      });
      return { data: result.data.updateCobertura, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return { update, loading, error };
}

export function useUpdateCoberturaEstado() {
  const [updateCoberturaEstado, { loading, error }] = useMutation(UPDATE_COBERTURA_ESTADO, {
    refetchQueries: [{ query: GET_COBERTURAS }],
  });

  const updateEstado = async (id, estado) => {
    try {
      const result = await updateCoberturaEstado({
        variables: { id, estado }
      });
      return { data: result.data.updateCobertura, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return { updateEstado, loading, error };
}

/* function useDeleteCobertura() {
  const [deleteCobertura, { loading, error }] = useMutation(DELETE_COBERTURA, {
    refetchQueries: [{ query: GET_COBERTURAS }],
  });

  const remove = async (id) => {
    try {
      const result = await deleteCobertura({
        variables: { id }
      });
      return { data: result.data.deleteCobertura, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return { remove, loading, error };
}*/
