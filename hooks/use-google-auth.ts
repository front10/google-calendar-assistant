'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isGoogleAuthenticated,
  getGoogleAccessToken,
  getGoogleRefreshToken,
  getGoogleEmail,
  getGoogleId,
  clearGoogleAuthData,
  refreshGoogleAccessToken,
} from '@/lib/google-auth-manager';

interface GoogleAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  googleId: string | null;
  isLoading: boolean;
}

export function useGoogleAuth() {
  const [authState, setAuthState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    email: null,
    googleId: null,
    isLoading: true,
  });

  // Cargar estado inicial
  useEffect(() => {
    const loadAuthState = () => {
      const isAuthenticated = isGoogleAuthenticated();
      const accessToken = getGoogleAccessToken();
      const refreshToken = getGoogleRefreshToken();
      const email = getGoogleEmail();
      const googleId = getGoogleId();

      setAuthState({
        isAuthenticated,
        accessToken,
        refreshToken,
        email,
        googleId,
        isLoading: false,
      });
    };

    loadAuthState();
  }, []);

  // Función para conectar con Google
  const connectGoogle = useCallback(() => {
    // Redirigir a nuestro endpoint personalizado de Google OAuth
    window.location.href = '/api/auth/google';
  }, []);

  // Función para desconectar Google
  const disconnectGoogle = useCallback(() => {
    clearGoogleAuthData();
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      email: null,
      googleId: null,
      isLoading: false,
    });
  }, []);

  // Función para renovar el access token
  const refreshToken = useCallback(async () => {
    const newAccessToken = await refreshGoogleAccessToken();
    if (newAccessToken) {
      setAuthState((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));
      return newAccessToken;
    }
    return null;
  }, []);

  // Función para obtener un token válido (renueva si es necesario)
  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (!authState.isAuthenticated) return null;

    // Verificar si el token actual es válido
    const currentToken = getGoogleAccessToken();
    if (currentToken) {
      return currentToken;
    }

    // Intentar renovar el token
    return await refreshToken();
  }, [authState.isAuthenticated, refreshToken]);

  return {
    ...authState,
    connectGoogle,
    disconnectGoogle,
    refreshToken,
    getValidAccessToken,
  };
}
