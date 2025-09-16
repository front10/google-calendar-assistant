import { type NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { saveGoogleAuthData } from '@/lib/google-auth-manager';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || '',
  process.env.GOOGLE_CLIENT_SECRET || '',
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=${error}`,
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/?error=no_code`,
      );
    }

    // Intercambiar código por tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Obtener información del usuario
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token || '',
      audience: process.env.GOOGLE_CLIENT_ID || '',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Guardar datos en localStorage (esto se manejará en el cliente)
    const authData = {
      accessToken: tokens.access_token || undefined,
      refreshToken: tokens.refresh_token || undefined,
      googleId: payload.sub,
      email: payload.email || undefined,
    };

    // Crear una página que maneje el guardado en localStorage
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Calendar Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .spinner {
              border: 3px solid #f3f3f3;
              border-top: 3px solid #4285f4;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h2>Connecting to Google Calendar...</h2>
            <p>Please wait while we set up your Google Calendar access.</p>
          </div>
          <script>
            try {
              // Guardar datos en localStorage usando la misma estructura que el manager
              const authData = ${JSON.stringify(authData)};
              const dataToStore = {
                ...authData,
                expiresAt: Date.now() + (60 * 60 * 1000) // 1 hora
              };
              
              localStorage.setItem('google_auth_data', JSON.stringify(dataToStore));
              
              // Redirigir a la página principal
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            } catch (error) {
              console.error('Error saving Google auth data:', error);
              document.body.innerHTML = '<div class="container"><h2>Error</h2><p>Failed to save authentication data. Please try again.</p></div>';
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/?error=oauth_error`,
    );
  }
}
