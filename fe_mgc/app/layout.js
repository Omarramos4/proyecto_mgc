
import "./globals.css";
import { DM_Sans } from 'next/font/google';
import { UserProvider } from '../context/UserContext';

const dm_sans = DM_Sans({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial'],
});

export const metadata = {
  title: 'MGC - Sistema de Gestión de Coberturas',
  description: 'Sistema de gestión de coberturas de personal',
  keywords: 'gestión, coberturas, personal, recursos humanos',
};

export default function layout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="http://127.0.0.1:8000" />
        <link rel="dns-prefetch" href="http://127.0.0.1:8000" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" /> 
      </head>
      <body className={dm_sans.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}