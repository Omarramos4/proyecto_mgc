import { useState } from 'react';
import Fecha from '../componentes/Fecha';
import UsuarioDetalles from '../componentes/UsuarioDetalles';
import Notificacion from '../componentes/Notificacion';

export default function Header(params) {
    const [notifications, setNotifications] = useState([]);

    const clearNotification = (index) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="sticky top-0 -mt-5 h-20 left-20 w-full flex items-center justify-between bg-gray-200 rounded-b-md p-2 z-[100] shadow-md">
            <h1 className="p-5 text-gray-900 text-xl max-[820px]:text-sm font-bold">{params.title}</h1>
            
            {/* Contenedor para los tres componentes alineados */}
            <div className="hidden min-[767px]:flex items-center gap-20">
                <UsuarioDetalles />
                <Notificacion 
                    notifications={notifications} 
                    onClearNotification={clearNotification} 
                />
                <div className="hidden min-[969px]:block">
                    <Fecha />
                </div>
            </div>
            
         
        </div>
    );
}