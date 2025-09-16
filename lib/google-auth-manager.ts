'use client';

interface GoogleAuthData {
  accessToken: string;
  refreshToken?: string;
  googleId: string;
  email: string;
  expiresAt: number;
}

const GOOGLE_AUTH_KEY = 'google_auth_data';

/**
 * Guarda los datos de autenticación de Google en localStorage
 */
export function saveGoogleAuthData(
  data: Omit<GoogleAuthData, 'expiresAt'>,
): void {
  const authData: GoogleAuthData = {
    ...data,
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hora
  };

  try {
    localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving Google auth data:', error);
  }
}

/**
 * Obtiene los datos de autenticación de Google desde localStorage
 */
export function getGoogleAuthData(): GoogleAuthData | null {
  try {
    const data = localStorage.getItem(GOOGLE_AUTH_KEY);
    if (!data) return null;

    const authData: GoogleAuthData = JSON.parse(data);

    // Verificar si el token ha expirado
    if (Date.now() > authData.expiresAt) {
      clearGoogleAuthData();
      return null;
    }

    return authData;
  } catch (error) {
    console.error('Error getting Google auth data:', error);
    return null;
  }
}

/**
 * Verifica si el usuario está autenticado con Google
 */
export function isGoogleAuthenticated(): boolean {
  return getGoogleAuthData() !== null;
}

/**
 * Obtiene el access token de Google
 */
export function getGoogleAccessToken(): string | null {
  const authData = getGoogleAuthData();
  return authData?.accessToken || null;
}

/**
 * Obtiene el refresh token de Google
 */
export function getGoogleRefreshToken(): string | null {
  const authData = getGoogleAuthData();
  return authData?.refreshToken || null;
}

/**
 * Obtiene el email del usuario de Google
 */
export function getGoogleEmail(): string | null {
  const authData = getGoogleAuthData();
  return authData?.email || null;
}

/**
 * Obtiene el Google ID del usuario
 */
export function getGoogleId(): string | null {
  const authData = getGoogleAuthData();
  return authData?.googleId || null;
}

/**
 * Limpia los datos de autenticación de Google
 */
export function clearGoogleAuthData(): void {
  try {
    localStorage.removeItem(GOOGLE_AUTH_KEY);
  } catch (error) {
    console.error('Error clearing Google auth data:', error);
  }
}

/**
 * Renueva el access token si es necesario
 */
export async function refreshGoogleAccessToken(): Promise<string | null> {
  const refreshToken = getGoogleRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch('/api/auth/google/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    // Actualizar los datos almacenados
    const currentData = getGoogleAuthData();
    if (currentData) {
      saveGoogleAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || currentData.refreshToken,
        googleId: currentData.googleId,
        email: currentData.email,
      });
    }

    return data.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    clearGoogleAuthData();
    return null;
  }
}
