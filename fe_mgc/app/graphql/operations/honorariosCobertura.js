import { gql } from '@apollo/client';

export const GET_COBERTURA_DETALLES = gql`
  query GetCoberturaDetalles($id: ID!) {
    cobertura(id: $id) {
      id
      puesto {
        id
        SueldoGeneral
      }
      cubierto {
        id
      }
    }
  }
`;

export const CREATE_HONORARIO = gql`
  mutation CreateHonorario($input: CreateHonorarioInput!) {
    createHonorario(input: $input) {
      id
    }
  }
`;
