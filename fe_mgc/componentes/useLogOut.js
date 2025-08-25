
import { clearAuthCookies } from '../lib/auth-utils';

export function useLogOut() {
  return () => {
    clearAuthCookies(); // Usar la función segura de limpieza
    window.location.href = '/login';
  };
}