// Configuraciones y utilidades para Apollo Client

export const apolloConfig = {
  // URI del servidor GraphQL
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  
  // Configuraciones de cache
  cacheConfig: {
    typePolicies: {
      Query: {
        fields: {
          coberturas: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          recursosHumanos: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  },

  // Configuraciones de fetch para SSR
  fetchOptions: {
    next: { 
      revalidate: 300, // Revalidar cada 5 minutos
    },
  },
};

// Función para manejar errores de GraphQL
export const handleGraphQLErrors = (error) => {
  console.error('GraphQL Error:', error);
  
  if (error.networkError) {
    console.error('Network Error:', error.networkError);
    
    // Manejar errores de red específicos
    if (error.networkError.statusCode === 401) {
      // Redireccionar a login o manejar autenticación
      console.error('Error de autenticación');
    } else if (error.networkError.statusCode === 500) {
      console.error('Error interno del servidor');
    }
  }

  if (error.graphQLErrors) {
    error.graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  return error.message;
};

// Transformadores de datos comunes
export const dataTransformers = {
  // Formatear fecha para mostrar
  formatDate: (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  },

  // Formatear nombre completo
  formatFullName: (nombres, apellidos) => {
    if (!nombres && !apellidos) return 'N/A';
    return `${nombres || ''} ${apellidos || ''}`.trim();
  },

  // Formatear estado con color
  getEstadoStyle: (estado) => {
    const styles = {
      'Activa': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Completada': 'bg-blue-100 text-blue-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return styles[estado] || styles.default;
  },
};

// Configuración de política de cache por tipo
export const cacheTypePolicies = {
  Cobertura: {
    fields: {
      FechaInicio: {
        read(value) {
          return dataTransformers.formatDate(value);
        }
      },
      FechaFin: {
        read(value) {
          return dataTransformers.formatDate(value);
        }
      }
    }
  },
  RecursoHumano: {
    keyFields: ['id', 'DNI'], // Usar tanto ID como DNI como claves
  },
};
