import { type NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 },
      );
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID || '',
      process.env.GOOGLE_CLIENT_SECRET || '',
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return NextResponse.json({
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token,
    });
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    );
  }
}
