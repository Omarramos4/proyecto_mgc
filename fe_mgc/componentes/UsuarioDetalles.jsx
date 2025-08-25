import { useState, useEffect } from 'react';
import { FaSun, FaCloudSun, FaMoon } from 'react-icons/fa';
import { useUserData } from '../lib/user-hooks';
import { getAuthToken } from '../lib/auth-utils';

export default function UsuarioDetalles() {
    const [saludo, setSaludo] = useState('');
    const [icono, setIcono] = useState(null);
    const { usuario, loading, error, isAuthenticated } = useUserData();

    useEffect(() => {
        const hora = new Date().getHours();
        if (hora >= 6 && hora < 12) {
            setSaludo('¡Buenos días');
            setIcono(<FaSun className="inline text-yellow-400 ml-2" />);
        } else if (hora >= 12 && hora < 19) {
            setSaludo('¡Buenas tardes');
            setIcono(<FaCloudSun className="inline text-orange-400 ml-2" />);
        } else {
            setSaludo('¡Buenas noches');
            setIcono(<FaMoon className="inline text-blue-700 ml-2" />);
        }
    }, []);

    // Detectar si hay token pero no hay usuario cargado
    useEffect(() => {
        const token = getAuthToken();
        
        // Si hay token pero no hay usuario y no se está cargando, intentar recargar
        if (token && !usuario && !loading && !error) {
            console.log('Detectado token sin usuario cargado, intentando recargar...');
            // Disparar evento para refrescar el contexto
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('userContextRefresh'));
            }
        }
    }, [usuario, loading, error]);

    // Mostrar loading mientras se cargan los datos
    if (loading) {
        return (
            <div className="justify-center border-r-1 pr-5 border-l-1 pl-5 border-gray-900 items-center text-center">
                <p className="text-gray-700">Cargando...</p>
            </div>
        );
    }

    // Mostrar error si hay problemas
    if (error) {
        return (
            <div className="justify-center border-r-1 pr-5 border-l-1 pl-5 border-gray-900 items-center text-center">
                <p className="text-red-600">Error al cargar usuario</p>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="justify-center border-r-1 pr-5 border-l-1 pl-5 border-gray-900 items-center text-center">
                <p className="text-gray-700">No hay datos de usuario</p>
            </div>
        );
    }
    return (
        <div className="justify-center items-center text-gray-900 text-center font-bold">
            <p className="text-gray-700">{saludo}, {usuario.NombreUsuario}! {icono} ~  {usuario.roles?.NombreRol}</p>
            <p className="text-gray-700">
                {usuario.sucursales?.NombreSucursal}
            </p>
        </div>
    );
}
