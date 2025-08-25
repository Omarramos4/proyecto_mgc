
import "../globals.css";
import { DM_Sans } from 'next/font/google';

const dm_sans = DM_Sans({
    subsets: ['latin'],
    display: 'swap',
});
export const metadata = {
  title: 'Inicio de Sesión',
};

export default function layout({ children }) {
  return (
    <div className="bg-cover bg-center overflow-hidden min-h-screen" style={{ backgroundImage: "url('/hm_bg.webp')" }}>
      {children}
    </div>
  );
}