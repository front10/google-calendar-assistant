'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { saveGoogleAuthData } from '@/lib/google-auth-manager';

export function GoogleAuthHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Solo ejecutar cuando la sesión esté cargada y el usuario esté autenticado
    if (status === 'authenticated' && session?.user?.accessToken) {
      // Verificar si es un usuario de Google
      if (session.user.type === 'google') {
        // Guardar datos en localStorage
        saveGoogleAuthData({
          accessToken: session.user.accessToken,
          refreshToken: session.user.refreshToken || undefined,
          googleId: session.user.id || '',
          email: session.user.email || '',
        });
      }
    }
  }, [session, status]);

  // Este componente no renderiza nada, solo maneja la lógica
  return null;
}
