'use client';
import { useState } from 'react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFab = () => {
    setIsOpen(!isOpen);
  };

  const fabOptions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="#ffffff" viewBox="0 0 490.429 490.429" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M136.041 415.881c-27.2 0-56.107-17.387-56.107-49.493v-241.6c0-29.547 18.773-50.24 45.653-50.24h163.2l-35.093 35.093c-4.267 4.053-4.373 10.88-0.213 15.04 4.053 4.267 10.88 4.373 15.04 0.213.107-.107.213-.213.213-.213l53.333-53.333c4.16-4.16 4.16-10.88 0-15.04L268.734 2.975c-4.267-4.053-10.987-3.947-15.04.213-3.947 4.16-3.947 10.667 0 14.827l35.2 35.093h-163.2c-38.933.107-67.093 30.187-67.093 71.68v241.6c0 39.68 34.027 70.827 77.44 70.827 5.867 0 10.667-4.8 10.667-10.667C146.708 420.681 141.908 415.881 136.041 415.881z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M364.628 53.215c-5.867 0-10.667 4.8-10.667 10.667 0 5.867 4.8 10.667 10.667 10.667 29.653 0 45.973 16.853 45.973 47.36v240.32c0 26.667-14.293 53.653-46.293 53.653H222.974l35.093-35.093c4.053-4.267 3.947-10.987-.213-15.04-4.16-3.947-10.667-3.947-14.827 0l-53.333 53.333c-4.16 4.16-4.16 10.88 0 15.04l53.333 53.333c4.267 4.053 10.987 3.947 15.04-.213 3.947-4.16 3.947-10.667 0-14.827l-35.093-35.2h141.227c39.787 0 67.627-30.827 67.627-74.987v-240.32C431.934 79.561 406.121 53.215 364.628 53.215z" />
        </svg>
      ),
      label: 'Nueva Cobertura',
      action: () => {} // TODO: Implementar navegación a nueva cobertura
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21.916c-4.797 0.02-8.806 3.369-9.837 7.856l-0.013 0.068c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.875-3.885 4.297-6.744 8.386-6.744s7.511 2.859 8.375 6.687l0.011 0.057c0.076 0.34 0.374 0.59 0.732 0.59 0 0 0.001 0 0.001 0h-0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005c-1.045-4.554-5.055-7.903-9.849-7.924h-0.002zM9.164 10.602c0 0 0 0 0 0 2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM9.164 2.75c0 0 0 0 0 0 1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.175-3.176h0zM22.926 10.602c2.582 0 4.676-2.093 4.676-4.676s-2.093-4.676-4.676-4.676c-2.582 0-4.676 2.093-4.676 4.676v0c0.003 2.581 2.095 4.673 4.675 4.676h0zM22.926 2.75c1.754 0 3.176 1.422 3.176 3.176s-1.422 3.176-3.176 3.176c-1.754 0-3.176-1.422-3.176-3.176v0c0.002-1.753 1.423-3.174 3.176-3.176h0zM30.822 19.84c-0.878-3.894-4.308-6.759-8.406-6.759-0.423 0-0.839 0.031-1.246 0.089l0.046-0.006c-0.049 0.012-0.092 0.028-0.133 0.047l0.004-0.002c-0.751-2.129-2.745-3.627-5.089-3.627-2.334 0-4.321 1.485-5.068 3.561l-0.012 0.038c-0.017-0.004-0.03-0.014-0.047-0.017-0.359-0.053-0.773-0.084-1.195-0.084-0.002 0-0.005 0-0.007 0h0c-4.092 0.018-7.511 2.874-8.392 6.701l-0.011 0.058c-0.011 0.048-0.017 0.103-0.017 0.16 0 0.414 0.336 0.75 0.75 0.75 0.357 0 0.656-0.25 0.731-0.585l0.001-0.005c0.737-3.207 3.56-5.565 6.937-5.579h0.002c0.335 0 0.664 0.024 0.985 0.07l-0.037-0.004c-0.008 0.119-0.036 0.232-0.036 0.354 0.006 2.987 2.429 5.406 5.417 5.406s5.411-2.419 5.416-5.406v-0.001c0-0.12-0.028-0.233-0.036-0.352 0.016-0.002 0.031 0.005 0.047 0.001 0.294-0.044 0.634-0.068 0.98-0.068 0.004 0 0.007 0 0.011 0h-0.001c3.379 0.013 6.203 2.371 6.93 5.531l0.009 0.048c0.076 0.34 0.375 0.589 0.732 0.59h0c0.057-0 0.112-0.007 0.165-0.019l-0.005 0.001c0.34-0.076 0.59-0.375 0.59-0.733 0-0.057-0.006-0.112-0.018-0.165l0.001 0.005zM16 18.916c-0 0-0 0-0.001 0-2.163 0-3.917-1.753-3.917-3.917s1.754-3.917 3.917-3.917c2.163 0 3.917 1.754 3.917 3.917 0 0 0 0 0 0.001v-0c-0.003 2.162-1.754 3.913-3.916 3.916h-0z" />
        </svg>
      ),
      label: 'Nuevo R.H.',
      action: () => {} // TODO: Implementar navegación a nuevo recurso humano
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="#ffffff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.5 11c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm0 3c.276 0 .5.224.5.5s-.224.5-.5.5s-.5-.224-.5-.5s.224-.5.5-.5zm9-9h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 3h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zM23.5 30h-15C7.673 30 7 29.327 7 28.5v-25C7 2.673 7.673 2 8.5 2h1c.276 0 .5.224.5.5s-.224.5-.5.5h-1C8.224 3 8 3.225 8 3.5v25c0 .275.224.5.5.5h15c.276 0 .5-.225.5-.5v-25c0-.275-.224-.5-.5-.5h-11c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h11c.827 0 1.5.673 1.5 1.5v25c0 .827-.673 1.5-1.5 1.5z" />
        </svg>
      ),
      label: 'Generar Reporte',
      action: () => {} // TODO: Implementar generación de reportes
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[10]">
      {/* Overlay para cerrar cuando se hace click fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-[5]"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Opciones del FAB */}
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>
        {fabOptions.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
              {option.label}
            </span>
            <button
              onClick={option.action}
              className="w-12 h-12 bg-slate-600 hover:bg-slate-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center transform hover:scale-110"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isOpen ? 'fadeInUp 0.3s ease-out forwards' : 'none'
              }}
            >
              {option.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Botón principal del FAB */}
      <button
        onClick={toggleFab}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-110 z-[10] relative ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingActionButton;
