import { gql } from '@apollo/client';
import { 
  RECURSO_HUMANO_BASIC_FRAGMENT, 
  RECURSO_HUMANO_FULL_FRAGMENT,
  USUARIO_FRAGMENT 
} from '../fragments';

// ===== QUERIES =====

export const GET_RECURSOS_HUMANOS = gql`
  ${RECURSO_HUMANO_FULL_FRAGMENT}
  
  query GetRecursosHumanos {
    recursosHumanos {
      ...RecursoHumanoFull
    }
  }
`;

export const GET_RECURSO_HUMANO_BY_ID = gql`
  ${RECURSO_HUMANO_FULL_FRAGMENT}
  
  query GetRecursoHumanoById($id: ID!) {
    recursoHumano(id: $id) {
      ...RecursoHumanoFull
    }
  }
`;

export const GET_RECURSOS_BY_SUCURSAL = gql`
  ${RECURSO_HUMANO_FULL_FRAGMENT}
  
  query GetRecursosBySucursal($sucursalId: ID!) {
    recursosBySucursal(sucursalId: $sucursalId) {
      ...RecursoHumanoFull
    }
  }
`;

// ===== MUTATIONS =====

export const CREATE_RECURSO_HUMANO = gql`
  ${RECURSO_HUMANO_FULL_FRAGMENT}
  
  mutation CreateRecursoHumano($input: CreateRecursoHumanoInput!) {
    createRecursoHumano(input: $input) {
      ...RecursoHumanoFull
    }
  }
`;

export const UPDATE_RECURSO_HUMANO = gql`
  ${RECURSO_HUMANO_FULL_FRAGMENT}
  
  mutation UpdateRecursoHumano($id: ID!, $input: UpdateRecursoHumanoInput!) {
    updateRecursoHumano(id: $id, input: $input) {
      ...RecursoHumanoFull
    }
  }
`;

export const UPDATE_RECURSO_ESTADO = gql`
  ${RECURSO_HUMANO_BASIC_FRAGMENT}
  
  mutation UpdateRecursoEstado($id: ID!, $estado: String!) {
    updateRecursoEstado(id: $id, estado: $estado) {
      ...RecursoHumanoBasic
    }
  }
`;

export const DELETE_RECURSO_HUMANO = gql`
  mutation DeleteRecursoHumano($id: ID!) {
    deleteRecursoHumano(id: $id)
  }
`;

export const CREATE_USUARIO = gql`
  ${USUARIO_FRAGMENT}
  
  mutation CreateUsuario($input: CreateUsuarioInput!) {
    createUsuario(input: $input) {
      ...UsuarioFragment
    }
  }
`;

export const UPDATE_USUARIO = gql`
  ${USUARIO_FRAGMENT}
  
  mutation UpdateUsuario($id: ID!, $input: UpdateUsuarioInput!) {
    updateUsuario(id: $id, input: $input) {
      ...UsuarioFragment
    }
  }
`;

export const DELETE_USUARIO = gql`
  mutation DeleteUsuario($id: ID!) {
    deleteUsuario(id: $id)
  }
`;
