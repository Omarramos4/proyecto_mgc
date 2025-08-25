import { useState, useEffect } from 'react';

export default function Footer() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date()); // Solo se ejecuta en cliente
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-0 rounded-br-md w-full h-12 flex items-center justify-end bg-gray-200 border-t border-gray-300 z-[10] px-8">
      <span className="text-gray-700 text-sm font-semibold mx-auto">
        {time ? `${time.toLocaleDateString()} ${time.toLocaleTimeString()}` : ''}
      </span>
    </div>
  );
}