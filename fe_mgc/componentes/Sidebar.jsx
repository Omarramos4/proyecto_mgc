/**
 * Componente Sidebar con tematización dinámica basada en el ID de sucursal del usuario.
 * - Cambia la paleta de colores según el ID de sucursal (1 = Central, 2 = Norte).
 * - Soporta modo expandido/colapsado mediante contexto (SidebarContext).
 * - Cada item puede tener submenú (ej: Coberturas) con apertura controlada.
 * - Tooltips automáticos cuando el sidebar está colapsado.
 * - Gradientes y estilos condicionados al estado activo y al tema.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLogOut } from './useLogOut';
import { usePathname } from 'next/navigation';
import { useUserSucursal } from '../lib/user-hooks';
import { useSidebar } from '../app/context/SidebarContext';

/**
 * @param {Object} props
 * @param {JSX.Element} props.icon Ícono SVG.
 * @param {string} props.text Texto visible (cuando expandido).
 * @param {boolean} props.active Si el item está activo.
 * @param {boolean} props.expanded Si el sidebar global está expandido.
 * @param {Function} props.onClick Acción principal (o para subitem).
 * @param {boolean} [props.hasSubmenu] Indica si tiene submenú.
 * @param {Array} [props.submenuItems] Lista de subitems {id,text}.
 * @param {boolean} [props.isSubmenuOpen] Control de apertura del submenú.
 * @param {Function} [props.toggleSubmenu] Cambia el estado abierto/cerrado.
 * @param {string} [props.customClass] Clases extra para estilos especiales.
 * @param {boolean} [props.forceWhiteText] Fuerza texto blanco (logout, etc.).
 * @param {boolean} [props.isCentral] Tema actual (true = Central).
 */
const SidebarItem = ({ 
  icon, 
  text, 
  active, 
  expanded,
  onClick,
  href = "#",
  hasSubmenu = false,
  submenuItems = [],
  isSubmenuOpen = false,
  toggleSubmenu = () => {},
  customClass = '',
  // activeSubitem retirado (lógica de subitem activo eliminada)
  forceWhiteText = false,
  isCentral = true
}) => {

  return (
    <div className="relative">
      <Link
        href={hasSubmenu ? "#" : href}
        onClick={(e) => {
          if (hasSubmenu) {
            e.preventDefault();
            toggleSubmenu();
          } else {
            onClick();
          }
        }}
        className={`
          relative flex items-center p-2 rounded-xl cursor-pointer
          transition-all duration-300
          ${active ? 'text-white' : forceWhiteText ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
          ${expanded ? 'justify-start' : 'justify-center'}
          group
          ${customClass}
        `}
      >
  {/* Contenedor del ícono: aplica gradiente según tema y estado */}
  <div className={`
          flex items-center justify-center
          w-12 h-12 transition-all duration-300 group-hover:scale-110
          ${(() => {
            const activeGrad = isCentral 
              ? 'bg-gradient-to-br from-red-500 to-yellow-400 text-white shadow-lg'
              : 'bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg';
            if (active) return activeGrad;
            if (customClass) return customClass; // p.e. botón logout
            return 'bg-gray-800 group-hover:bg-gray-700';
          })()}
          rounded-xl
          ${expanded ? '' : 'p-2'}
        `}>
          {icon}
        </div>
  {/* Texto del item (mostrar/ocultar via width + opacity para transiciones suaves) */}
  <span className={`
          overflow-hidden whitespace-nowrap
          transition-all duration-300
          ${active || forceWhiteText ? 'text-white font-medium' : 'text-gray-400'}
          ${expanded ? 'w-full ml-4 opacity-100' : 'w-0 opacity-0'}
        `}>
          {text}
        </span>
        
        {hasSubmenu && expanded && (
          <span className={`ml-auto transition-transform duration-300 ${isSubmenuOpen ? 'rotate-90' : ''}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </Link>

  {/* Lista de subitems visible solo si el submenú está abierto y el sidebar expandido */}
  {hasSubmenu && expanded && isSubmenuOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {submenuItems.map((subItem) => (
            <Link
              key={subItem.id}
              href="#"
              onClick={() => onClick(subItem.id)}
              className={`
                flex items-center p-2 rounded-lg cursor-pointer
                transition-all duration-200
                hover:bg-gray-700
                text-gray-400
              `}
            >
              <span className="ml-2 text-sm">{subItem.text}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ==============================================
// Sidebar (Principal)
// ----------------------------------------------
// Responsabilidades:
//  * Lee el ID de sucursal del usuario para determinar el tema (1 = Central, 2 = Norte).
//  * Coordina expansión/colapso a través del contexto SidebarContext.
//  * Mantiene estado de item activo y subitem activo.
//  * Controla apertura de submenús (solo uno abierto a la vez: openSubmenu).
//  * Pasa la bandera de tema (isCentral) a SidebarItem para coloreado.
// ==============================================
const Sidebar = () => {
  // Ahora obtenemos el estado y la función del contexto usando el hook useSidebar
  const { isSidebarExpanded, toggleSidebar } = useSidebar();
  const logOut = useLogOut();
  const pathname = usePathname(); // Hook para obtener la ruta actual

  // Leer ID de sucursal para determinar el tema
  const [isCentral, setIsCentral] = useState(true);
  
  // Función para determinar el item activo basado en la URL
  const getActiveItemFromPath = (path) => {
  if (path.includes('/sgc/dashboard')) return 'dashboard';
  if (path.includes('/sgc/inicio')) return 'inicio';
  if (path.includes('/sgc/coberturas')) return 'coberturas';
  if (path.includes('/sgc/recursohumano')) return 'recursohumano';
  if (path.includes('/sgc/reportes')) return 'reporteria';
  if (path.includes('/sgc/configs')) return 'configuraciones';
  return 'inicio'; // Por defecto
  };

  const [activeItem, setActiveItem] = useState(() => getActiveItemFromPath(pathname || '/sgc/inicio'));
  
  // Obtener ID de sucursal usando el hook seguro
  const { sucursalId, loading: sucursalLoading } = useUserSucursal();
  
  // Al montar: lee el ID de sucursal para determinar el tema
  useEffect(() => {
    if (!sucursalLoading && sucursalId) {
      // ID 1 = Sucursal Central (tema rojo-amarillo)
      // ID 2 = Sucursal Norte (tema azul-cyan)
      const isCentralSucursal = sucursalId === "1" || sucursalId === 1;
      setIsCentral(isCentralSucursal);
    }
  }, [sucursalId, sucursalLoading]);

  // Hook para actualizar el item activo cuando cambie la ruta
  useEffect(() => {
    const newActiveItem = getActiveItemFromPath(pathname);
    setActiveItem(newActiveItem);
  }, [pathname]);

  // activeSubitem removido (no se usa highlight de subitems)
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Íconos en memo para evitar recreaciones innecesarias en renders.
  const icons = {
      dashboard: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="2" fill="#ffffff"/>
          <rect x="14" y="3" width="7" height="7" rx="2" fill="#ffffff"/>
          <rect x="14" y="14" width="7" height="7" rx="2" fill="#ffffff"/>
          <rect x="3" y="14" width="7" height="7" rx="2" fill="#ffffff"/>
        </svg>
      ),
    home: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h4" />
      </svg>
    ),
    coberturas: (
      <svg className="h-6 w-6" fill="#ffffff"  viewBox="0 0 490.429 490.429" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M136.041 415.881c-27.2 0-56.107-17.387-56.107-49.493v-241.6c0-29.547 18.773-50.24 45.653-50.24h163.2l-35.093 35.093c-4.267 4.053-4.373 10.88-0.213 15.04 4.053 4.267 10.88 4.373 15.04 0.213.107-.107.213-.213.213-.213l53.333-53.333c4.16-4.16 4.16-10.88 0-15.04L268.734 2.975c-4.267-4.053-10.987-3.947-15.04.213-3.947 4.16-3.947 10.667 0 14.827l35.2 35.093h-163.2c-38.933.107-67.093 30.187-67.093 71.68v241.6c0 39.68 34.027 70.827 77.44 70.827 5.867 0 10.667-4.8 10.667-10.667C146.708 420.681 141.908 415.881 136.041 415.881z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M364.628 53.215c-5.867 0-10.667 4.8-10.667 10.667 0 5.867 4.8 10.667 10.667 10.667 29.653 0 45.973 16.853 45.973 47.36v240.32c0 26.667-14.293 53.653-46.293 53.653H222.974l35.093-35.093c4.053-4.267 3.947-10.987-.213-15.04-4.16-3.947-10.667-3.947-14.827 0l-53.333 53.333c-4.16 4.16-4.16 10.88 0 15.04l53.333 53.333c4.267 4.053 10.987 3.947 15.04-.213 3.947-4.16 3.947-10.667 0-14.827l-35.093-35.2h141.227c39.787 0 67.627-30.827 67.627-74.987v-240.32C431.934 79.561 406.121 53.215 364.628 53.215z" />
      </svg>
    ),
    
    recursohumano: (
      <svg className="h-6 w-6" viewBox="0 0 32 32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21.916c-4.797 0.02-8.806 3.369-9.837 7.856l-0.013 0.068c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.875-3.885 4.297-6.744 8.386-6.744s7.511 2.859 8.375 6.687l0.011 0.057c0.076 0.34 0.374 0.59 0.732 0.59 0 0 0.001 0 0.001 0h-0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-1.045-4.554-5.055-7.903-9.849-7.924h-0.002zM9.164 10.602c0 0 0 0 0 0 2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM9.164 2.75c0 0 0 0 0 0 1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.175-3.176h0zM22.926 10.602c2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM22.926 2.75c1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.176-3.176h0zM30.822 19.84c-0.878-3.894-4.308-6.759-8.406-6.759-0.423 0-0.839 0.031-1.246 0.089l0.046-0.006c-0.049 0.012-0.092 0.028-0.133 0.047l0.004-0.002c-0.751-2.129-2.745-3.627-5.089-3.627-2.334 0-4.321 1.485-5.068 3.561l-0.012 0.038c-0.017-0.004-0.03-0.014-0.047-0.017-0.359-0.053-0.773-0.084-1.195-0.084-0.002 0-0.005 0-0.007 0h0c-4.092 0.018-7.511 2.874-8.392 6.701l-0.011 0.058c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.737-3.207 3.56-5.565 6.937-5.579h0.002c0.335 0 0.664 0.024 0.985 0.07l-0.037-0.004c-0.008 0.119-0.036 0.232-0.036 0.354 0.006 2.987 2.429 5.406 5.417 5.406s5.411-2.419 5.416-5.406v-0.001c0-0.12-0.028-0.233-0.036-0.352 0.016-0.002 0.031 0.005 0.047 0.001 0.294-0.044 0.634-0.068 0.98-0.068 0.004 0 0.007 0 0.011 0h-0.001c3.379 0.013 6.203 2.371 6.93 5.531l0.009 0.048c0.076 0.34 0.375 0.589 0.732 0.59h0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005zM16 18.916c-0 0-0 0-0.001 0-2.163 0-3.917-1.753-3.917-3.917s1.754-3.917 3.917-3.917c2.163 0 3.917 1.754 3.917 3.917 0 0 0 0 0 0.001v-0c-0.003 2.162-1.754 3.913-3.916 3.916h-0z" />
      </svg>
    ),
    reporteria: (
      <svg className="h-8 w-8" fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.5 11c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm9-9h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zM23.5 30h-15C7.673 30 7 29.327 7 28.5v-25C7 2.673 7.673 2 8.5 2h1c.276 0 .5.224.5.5s-.224.5-.5.5h-1C8.224 3 8 3.225 8 3.5v25c0 .275.224.5.5.5h15c.276 0 .5-.225.5-.5v-25c0-.275-.224-.5-.5-.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11c.827 0 1.5.673 1.5 1.5v25c0 .827-.673 1.5-1.5 1.5z" />
      </svg>
    ),
    configuraciones: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  };

  const sidebarItems = [
    { id: 'dashboard', icon: icons.dashboard, text: 'Dashboard', href: '/sgc/dashboard' },
    { id: 'inicio', icon: icons.home, text: 'Inicio', href: '/sgc/inicio' },
    { 
      id: 'coberturas', 
      icon: icons.coberturas, 
      text: 'Coberturas',
      href: '/sgc/coberturas',
      /*submenuItems: [
        { id: 'coberturas-activas', text: 'Coberturas Activas' },
        { id: 'historial-coberturas', text: 'Historial de Coberturas' },
        { id: 'solicitudes-pendientes', text: 'Solicitudes Pendientes' }
      ]*/
    },
    { id: 'recursohumano', icon: icons.recursohumano, text: 'Recurso Humano', href: '/sgc/recursohumano' },
    { id: 'reporteria', icon: icons.reporteria, text: 'Reportería', href: '/sgc/reportes' },
    { id: 'configuraciones', icon: icons.configuraciones, text: 'Configuraciones', href: '/sgc/configs' },
  ];

  // Marca item principal como activo y limpia subitem seleccionado.
  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  // Abre/cierra un submenú; cierra el previamente abierto si es otro.
  const toggleSubmenu = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
  <aside className={`
      h-full shadow-2xl
      ${isCentral 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-slate-900 to-slate-700'}
      transition-all duration-300 ease-in-out
      ${isSidebarExpanded ? 'w-64' : 'w-20'}
      flex flex-col fixed z-[200]
    `}>
      <div className={`
        absolute top-4 z-[300] transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? 'left-64' : 'left-20'}
        -translate-x-1/2
      `}>
  {/* Botón toggle expandir/colapsar */}
  <button
          onClick={toggleSidebar}
          className={`
            p-2 mt-2 ml-2 text-white rounded-full shadow-lg
            ${isCentral 
              ? 'bg-gradient-to-br from-red-500 to-yellow-400 hover:from-red-600 hover:to-yellow-500'
              : 'bg-gradient-to-br from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500'}
            transition-transform duration-300 hover:scale-110
            ${isSidebarExpanded ? 'rotate-180' : ''}
          `}
          aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col h-full">
  <nav className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex mt-5 cursor-grab justify-center items-center pb-4 border-b border-gray-700 h-16 px-2">
            

            <h1 className={`
              text-lg font-bold transition-all duration-500 ease-in-out
              ${isSidebarExpanded ? 'w-auto opacity-100 ml-0' : 'w-0 opacity-0 -ml-4'}
              ${isCentral ? 'text-gray-100' : 'text-cyan-100'} bg-clip-text
              whitespace-nowrap overflow-hidden
            `}>
              Gestor de 
              <br />
              Coberturas
            </h1>
            
            <div>
              <img src="/HM_Logo.webp" className='h-18 w-18 ml-2' alt="logo" />
            </div>
            
          </div>

          {/* Lista principal de items */}
          <ul className="mt-4 space-y-2 px-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <SidebarItem 
                  icon={item.icon} 
                  text={item.text} 
                  active={activeItem === item.id} 
                  expanded={isSidebarExpanded}
                  onClick={() => handleItemClick(item.id)}
                  href={item.href}
                  hasSubmenu={!!item.submenuItems}
                  submenuItems={item.submenuItems}
                  isSubmenuOpen={openSubmenu === item.id}
                  toggleSubmenu={() => toggleSubmenu(item.id)}
                  isCentral={isCentral}
                />
              </li>
            ))}
          </ul>
        </nav>

  {/* Zona inferior (logout) */}
  <div className="mt-auto px-2 py-4 border-t border-gray-700">
          <SidebarItem 
            icon={icons.logout} 
            text="Cerrar Sesión" 
            active={false} 
            expanded={isSidebarExpanded}
            onClick={() => { logOut(); handleItemClick('logout'); }}
            customClass={isCentral 
              ? 'bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-400 text-white' 
              : 'bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-400 text-white'}
            forceWhiteText={true}
            isCentral={isCentral}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;