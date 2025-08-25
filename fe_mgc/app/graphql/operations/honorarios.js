import { gql } from '@apollo/client';
import { HONORARIO_FRAGMENT } from '../fragments';

// ===== QUERIES =====

export const GET_HONORARIOS = gql`
  ${HONORARIO_FRAGMENT}
  
  query GetHonorarios {
    honorarios {
      ...HonorarioFragment
    }
  }
`;

export const GET_HONORARIOS_BY_SUCURSAL = gql`
  ${HONORARIO_FRAGMENT}
  
  query GetHonorariosBySucursal($sucursalId: ID!) {
    honorariosBySucursal(sucursalId: $sucursalId) {
      ...HonorarioFragment
    }
  }
`;

export const GET_HONORARIOS_BY_FECHA = gql`
  ${HONORARIO_FRAGMENT}
  
  query GetHonorariosByFecha($fechaInicio: String!, $fechaFin: String!) {
    honorariosByFecha(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      ...HonorarioFragment
    }
  }
`;
