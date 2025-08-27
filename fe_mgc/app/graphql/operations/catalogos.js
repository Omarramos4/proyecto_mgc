// Consulta para configuraciones generales
export const GET_CONFIGURACIONES = gql`
  query GetConfiguraciones {
    configuraciones {
      id
      valor
      descripcion
    }
  }
`;
import { gql } from '@apollo/client';
import { 
  SUCURSAL_BASIC_FRAGMENT, 
  PUESTO_FRAGMENT, 
  MOTIVO_FRAGMENT, 
  MODALIDAD_FRAGMENT, 
  TIPO_ARCHIVO_FRAGMENT,
  USUARIO_FRAGMENT,
  AREA_FRAGMENT
} from '../fragments';

// ===== QUERIES =====

export const GET_SUCURSALES = gql`
  ${SUCURSAL_BASIC_FRAGMENT}
  
  query GetSucursales {
    sucursales {
      ...SucursalBasic
      ContactoPrincipal
      Telefono
      Estado
    }
  }
`;

export const GET_USUARIOS = gql`
  ${USUARIO_FRAGMENT}
  
  query GetUsuarios {
    usuarios {
      ...UsuarioFragment
      NombreUsuario
      roles {
        id
        NombreRol
        Descripcion
      }
    }
  }
`;

export const GET_AREAS = gql`
  ${AREA_FRAGMENT}
  
  query GetAreas {
    areas {
      ...AreaFragment
    }
  }
`;

export const GET_AREA_BY_ID = gql`
  ${AREA_FRAGMENT}
  ${PUESTO_FRAGMENT}
  
  query GetAreaById($id: ID!) {
    area(id: $id) {
      ...AreaFragment
      puestos {
        ...PuestoFragment
      }
    }
  }
`;

export const GET_PUESTOS = gql`
  ${PUESTO_FRAGMENT}
  
  query GetPuestos {
    puestos {
      ...PuestoFragment
    }
  }
`;

export const GET_MOTIVOS = gql`
  ${MOTIVO_FRAGMENT}
  
  query GetMotivos {
    motivos {
      ...MotivoFragment
    }
  }
`;

export const GET_MODALIDADES = gql`
  ${MODALIDAD_FRAGMENT}
  
  query GetModalidades {
    modalidades {
      ...ModalidadFragment
    }
  }
`;

export const GET_TIPOS_ARCHIVOS = gql`
  ${TIPO_ARCHIVO_FRAGMENT}
  
  query GetTiposArchivos {
    tiposArchivos {
      ...TipoArchivoFragment
    }
  }
`;

// Consulta combinada para el formulario de cobertura
export const GET_COBERTURA_FORM_DATA = gql`
  ${PUESTO_FRAGMENT}
  ${MOTIVO_FRAGMENT}
  ${MODALIDAD_FRAGMENT}
  ${TIPO_ARCHIVO_FRAGMENT}
  
  query GetCoberturaFormData {
    recursosHumanos {
      id
      Nombres
      Apellidos
      DNI
      sucursal {
        id
        NombreSucursal
      }
    }
    puestos {
      ...PuestoFragment
    }
    motivos {
      ...MotivoFragment
    }
    modalidades {
      ...ModalidadFragment
    }
    tiposArchivos {
      ...TipoArchivoFragment
    }
  }
`;
