import { gql } from '@apollo/client';
import { 
  COBERTURA_BASIC_FRAGMENT, 
  COBERTURA_FULL_FRAGMENT 
} from '../fragments';

// ===== QUERIES =====

export const GET_COBERTURAS = gql`
  ${COBERTURA_FULL_FRAGMENT}
  
  query GetCoberturas {
    coberturas {
      ...CoberturaFull
    }
  }
`;

export const GET_COBERTURA_BY_ID = gql`
  ${COBERTURA_FULL_FRAGMENT}
  
  query GetCoberturaById($id: ID!) {
    cobertura(id: $id) {
      ...CoberturaFull
    }
  }
`;

// Alias para compatibilidad
export const GET_COBERTURA_DETAILS = GET_COBERTURA_BY_ID;

export const GET_COBERTURAS_BY_ESTADO = gql`
  ${COBERTURA_FULL_FRAGMENT}
  
  query GetCoberturasByEstado($estado: String!) {
    coberturasbyestado(estado: $estado) {
      ...CoberturaFull
    }
  }
`;

// ===== MUTATIONS =====

export const CREATE_COBERTURA = gql`
  ${COBERTURA_FULL_FRAGMENT}
  
  mutation CreateCobertura($input: CreateCoberturaInput!) {
    createCobertura(input: $input) {
      ...CoberturaFull
    }
  }
`;

export const UPDATE_COBERTURA = gql`
  ${COBERTURA_FULL_FRAGMENT}
  
  mutation UpdateCobertura($id: ID!, $input: UpdateCoberturaInput!) {
    updateCobertura(id: $id, input: $input) {
      ...CoberturaFull
    }
  }
`;

export const UPDATE_COBERTURA_ESTADO = gql`
  ${COBERTURA_BASIC_FRAGMENT}
  
  mutation UpdateCoberturaEstado($id: ID!, $estado: String!) {
    updateCoberturaEstado(id: $id, estado: $estado) {
      ...CoberturaBasic
    }
  }
`;

export const DELETE_COBERTURA = gql`
  mutation DeleteCobertura($id: ID!) {
    deleteCobertura(id: $id)
  }
`;

export const CREATE_ARCHIVO = gql`
  mutation CreateArchivo($input: CreateArchivoInput!) {
    createArchivo(input: $input) {
      id
      descripcion
      rutaArchivo
      ID_cobertura
      ID_tipoarchivo
      tipoArchivo {
        id
        descripcion
      }
    }
  }
`;

export const DELETE_ARCHIVO = gql`
  mutation DeleteArchivo($id: ID!) {
    deleteArchivo(id: $id)
  }
`;
