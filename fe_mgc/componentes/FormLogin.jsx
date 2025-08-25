'use client';
import React from 'react';
import { useState } from 'react';
import { loginUsuario } from './useAuth';
import { Alert } from 'flowbite-react';
import { FaUser, FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';

export default function FormLogin() {
    const router = useRouter();
    const { refreshUser } = useUser();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Maneja el envío del formulario

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowSuccess(false);
        const result = await loginUsuario({ NombreUsuario: user, Contrasenia: password });
        
        if (result.error) {
            setError(result.error);
            setShowError(true);
            setTimeout(() => setShowError(false), 3500);
            return;
        }
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
        
        // Verificar que el token se guardó correctamente
        if (Cookies.get('token')) {
            //delay para asegurar que el token esté completamente establecido
            setTimeout(async () => {
                // Refrescar el contexto del usuario para cargar los datos inmediatamente
                await refreshUser();
                
                // Redirigir después de refrescar el contexto
                setTimeout(() => {
                    router.push('/sgc/inicio');
                }, 500);
            }, 100);
        } else {
            // Si no se guardó el token, mostrar error
            setTimeout(() => {
                setError('Error al guardar las credenciales');
                setShowError(true);
                setTimeout(() => setShowError(false), 3500);
            }, 1000);
        }
    };

    return (
        <div
            
            className="min-h-screen flex justify-center items-center px-2 sm:px-4 md:px-8 
                       py-4 sm:py-8 lg:py-12 xl:py-16 
                       [@media(max-height:820px)]:py-4 [@media(max-height:780px)]:py-2 
                       overflow-y-auto relative"
        >
            {/* Alertas superpuestas, no desplazan el contenido */}
            {showSuccess && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md pointer-events-none">
                    <Alert color="success" className="text-center font-bold shadow-lg">¡Bienvenido!</Alert>
                </div>
            )}
            {showError && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md pointer-events-none">
                    <Alert color="failure" className="text-center font-bold shadow-lg">{error}</Alert>
                </div>
            )}
            <form
                style={{ background: "rgba(24,31,64,0.94)" }}
                className="w-full max-w-lg sm:max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto rounded-3xl shadow-lg 
                           p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center gap-2 
                           [@media(max-height:820px)]:p-8 [@media(max-height:780px)]:p-3"
                onSubmit={handleSubmit}
            >
                <div className="flex justify-center items-center mb-3 sm:mb-4">
                    <img src="/HM_Logo.webp" alt="Logo" className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 object-contain [@media(max-height:780px)]:h-30 [@media(max-height:780px)]:w-30" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-500 text-center mb-2 sm:mb-4">Sistema de Gestión de Coberturas</h1>
                <h2 className="text-lg sm:text-xl font-bold text-gray-200 text-center mb-2 sm:mb-3">Autenticación de Usuarios</h2>
            
                <div className="mb-4 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaUser />
                    </span>
                    <input
                        type="text"
                        id="user"
                        className="bg-gray-100 text-gray-900 rounded-lg block w-full p-2.5 pl-10 text-base sm:text-lg focus:ring-2 focus:ring-orange-400"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                        placeholder="Usuario"
                    />
                </div>
                <div className="mb-6 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock />
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="bg-gray-100 text-gray-900 rounded-lg block w-full p-2.5 pl-10 pr-10 text-base sm:text-lg focus:ring-2 focus:ring-orange-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Contraseña"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-base sm:text-lg px-5 py-2.5 text-center transition-colors duration-200"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
