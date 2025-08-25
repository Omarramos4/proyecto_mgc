"use client";
import { useState, useEffect } from 'react';

export default function Fecha() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date()); // Solo se ejecuta en cliente
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Actualizar cada minuto (60000ms)
    return () => {
      clearInterval(timer);
    };
  }, []);


  const dayStr = time ? time.toLocaleDateString('es-ES', { day: 'numeric' }) : '';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <span className="flex items-center font-semibold text-black whitespace-nowrap leading-tight">
          {time ? time.toLocaleDateString('es-ES', { weekday: 'long' }) : ''}
        </span>
        <span className="flex flex-col items-center justify-center">
          <span className='font-bold text-5xl text-blue-900 leading-none min-w-[2ch] text-center'>{dayStr}</span>
          <span className="text-gray-700 text-sm font-semibold mt-1 leading-none">
            {time ? time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </span>

        <span className="font-semibold text-black items-center whitespace-nowrap leading-tight">
          {time ? time.toLocaleDateString('es-ES', { month: 'long' }) : ''}
        </span>
      </div>
    </div>
  );
}
