import { gql } from '@apollo/client';

// ========================================
// FRAGMENTOS BÁSICOS (sin dependencias)
// ========================================

export const COBERTURA_BASIC_FRAGMENT = gql`
  fragment CoberturaBasic on Cobertura {
    id
    FechaInicio
    FechaFin
    Estado
    FechaSolicitud
  }
`;

export const RECURSO_HUMANO_BASIC_FRAGMENT = gql`
  fragment RecursoHumanoBasic on RecursoHumano {
    id
    Nombres
    Apellidos
    DNI
  }
`;

export const SUCURSAL_BASIC_FRAGMENT = gql`
  fragment SucursalBasic on Sucursal {
    id
    NombreSucursal
  }
`;

export const AREA_FRAGMENT = gql`
  fragment AreaFragment on Area {
    id
    NombreArea
  }
`;

export const USUARIO_FRAGMENT = gql`
  fragment UsuarioFragment on Usuario {
    id
    NombreUsuario
    NombreCompleto
    CorreoElectronico
    Estado
    ID_sucursal
  }
`;

export const MOTIVO_FRAGMENT = gql`
  fragment MotivoFragment on Motivo {
    id
    Descripcion
  }
`;

export const MODALIDAD_FRAGMENT = gql`
  fragment ModalidadFragment on Modalidad {
    id
    Descripcion
  }
`;

export const TIPO_ARCHIVO_FRAGMENT = gql`
  fragment TipoArchivoFragment on TipoArchivo {
    id
    descripcion
  }
`;

export const ARCHIVO_BASIC_FRAGMENT = gql`
  fragment ArchivoBasic on Archivo {
    id
    rutaArchivo
    descripcion
    tipoArchivo {
      id
      descripcion
    }
  }
`;

// ========================================
// FRAGMENTOS COMPUESTOS (con dependencias)
// ========================================

export const PUESTO_FRAGMENT = gql`
  ${AREA_FRAGMENT}
  
  fragment PuestoFragment on Puesto {
    id
    Descripcion
    ID_Area
    area {
      ...AreaFragment
    }
  }
`;

export const RECURSO_HUMANO_FULL_FRAGMENT = gql`
  ${PUESTO_FRAGMENT}
  ${SUCURSAL_BASIC_FRAGMENT}
  ${AREA_FRAGMENT}
  
  fragment RecursoHumanoFull on RecursoHumano {
    id
    Nombres
    Apellidos
    DNI
    CtaBanco
    Origen
    Estado
    puesto {
      ...PuestoFragment
    }
    sucursal {
      ...SucursalBasic
    }
  }
`;

export const COBERTURA_FULL_FRAGMENT = gql`
  ${COBERTURA_BASIC_FRAGMENT}
  ${RECURSO_HUMANO_BASIC_FRAGMENT}
  ${USUARIO_FRAGMENT}
  ${PUESTO_FRAGMENT}
  ${SUCURSAL_BASIC_FRAGMENT}
  ${ARCHIVO_BASIC_FRAGMENT}
  ${MOTIVO_FRAGMENT}
  ${MODALIDAD_FRAGMENT}
  ${AREA_FRAGMENT}
  
  fragment CoberturaFull on Cobertura {
    ...CoberturaBasic
    ID_solicitante
    ID_cobertura
    ID_cubierto
    ID_puesto
    ID_motivo
    ID_modalidad
    Justificacion

    solicitante {
      ...UsuarioFragment
      sucursales {
        ...SucursalBasic
      }
    }

    cobertura {
      ...RecursoHumanoBasic
      CtaBanco
      Origen
      Estado
      puesto {
        ...PuestoFragment
      }
      sucursal {
        ...SucursalBasic
      }
    }

    cubierto {
      ...RecursoHumanoBasic
      CtaBanco
      Origen
      Estado
      puesto {
        ...PuestoFragment
      }
      sucursal {
        ...SucursalBasic
      }
    }

    puesto {
      ...PuestoFragment
    }

    motivo {
      ...MotivoFragment
    }

    modalidad {
      ...ModalidadFragment
    }

    archivos {
      ...ArchivoBasic
    }

    honorarios {
      id
      pagoNeto
      fechaHora_honorario
    }
  }
`;

// ========================================
// FRAGMENTOS DE HONORARIOS
// ========================================

export const HONORARIO_FRAGMENT = gql`
  ${RECURSO_HUMANO_BASIC_FRAGMENT}
  ${SUCURSAL_BASIC_FRAGMENT}
  
  fragment HonorarioFragment on Honorario {
    id
    pagoNeto
    fechaHora_honorario
    recursoHumano {
      ...RecursoHumanoBasic
      sucursal {
        ...SucursalBasic
      }
    }
  }
`;
