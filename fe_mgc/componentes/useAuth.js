import { setAuthToken, clearAuthCookies, getAuthToken } from '../lib/auth-utils';

/**
 * Función de login mejorada con mejores prácticas de seguridad
 */
export async function loginUsuario({ NombreUsuario, Contrasenia }) {
    try {
        const res = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation {
                    login(input: {NombreUsuario: "${NombreUsuario}", Contrasenia: "${Contrasenia}"}) {
                        token
                        expiresAt
                        user {
                            id
                            NombreUsuario
                            NombreCompleto
                        }
                    }
                }`,
                variables: {
                    input: {
                        NombreUsuario,
                        Contrasenia,
                    },
                },
            }),
        });
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (data.errors) {
            // Manejo mejorado de errores de GraphQL
            const firstError = data.errors[0] || {};
            const message = firstError.message || 'Error de autenticación';
            
            return { error: message };
        }
        
        if (!data.data || !data.data.login) {
            console.error('Respuesta inválida del servidor:', data);
            return { error: "Respuesta inválida del servidor" };
        }
        
        const { token, user } = data.data.login;
        
        // Solo almacenar el token de manera segura
        setAuthToken(token);
        
        // NO almacenar datos del usuario en cookies
        // Los datos se obtendrán del servidor cuando se necesiten
        
        return { token, user };
        
    } catch (err) {
        console.error('Error en login:', err);
        // Limpiar cualquier cookie existente en caso de error
        clearAuthCookies();
        
        // Manejo más específico de errores
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return { error: "Error de conexión con el servidor" };
        } else if (err.name === 'SyntaxError') {
            return { error: "Error al procesar la respuesta del servidor" };
        } else {
            return { error: err.message || "Error de credenciales" };
        }
    }
}

/**
 * Función de logout mejorada
 */
export async function logoutUsuario() {
    try {
        const token = getAuthToken();
        
        if (token) {
            // Invalidar token en el servidor
            await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `mutation { logout }`
                }),
            });
        }
    } catch (error) {
        console.error('Error al hacer logout en servidor:', error);
    } finally {
        // Siempre limpiar cookies locales
        clearAuthCookies();
        window.location.href = '/login';
    }
}
