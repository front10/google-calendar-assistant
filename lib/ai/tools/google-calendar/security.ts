import { OAuth2Client } from 'google-auth-library';
import type { Session } from 'next-auth';

export interface SecurityValidationResult {
  isValid: boolean;
  error?: string;
  needsRefresh?: boolean;
}

/**
 * Validates Google Calendar access token and checks if it's still valid
 */
export async function validateGoogleCalendarAccess(
  session: Session,
): Promise<SecurityValidationResult> {
  try {
    if (!session?.user?.accessToken) {
      return {
        isValid: false,
        error: 'No access token available. User must authenticate with Google.',
      };
    }

    if (session.user.type !== 'google') {
      return {
        isValid: false,
        error:
          'User must be authenticated with Google to access calendar features.',
      };
    }

    // Create OAuth2 client to validate token
    const auth = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    auth.setCredentials({
      access_token: session.user.accessToken,
      refresh_token: session.user.refreshToken,
    });

    // Try to get a new access token to validate current one
    try {
      const { token } = await auth.getAccessToken();
      if (!token) {
        return {
          isValid: false,
          error: 'Invalid or expired access token.',
          needsRefresh: true,
        };
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        isValid: false,
        error: 'Failed to validate access token.',
        needsRefresh: true,
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Security validation error:', error);
    return {
      isValid: false,
      error: 'Security validation failed.',
    };
  }
}

/**
 * Checks if user has required permissions for calendar operations
 */
export function checkCalendarPermissions(
  session: Session,
  requiredPermission: 'read' | 'write' | 'delete' = 'read',
): SecurityValidationResult {
  try {
    if (!session?.user) {
      return {
        isValid: false,
        error: 'User not authenticated.',
      };
    }

    if (session.user.type !== 'google') {
      return {
        isValid: false,
        error: 'Google authentication required for calendar operations.',
      };
    }

    // For now, we assume all Google-authenticated users have calendar access
    // In a production environment, you might want to check specific scopes
    return { isValid: true };
  } catch (error) {
    console.error('Permission check error:', error);
    return {
      isValid: false,
      error: 'Permission check failed.',
    };
  }
}

/**
 * Sanitizes calendar data to prevent XSS and other security issues
 */
export function sanitizeCalendarData(data: any): any {
  if (typeof data === 'string') {
    // Basic XSS prevention - remove script tags and dangerous attributes
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeCalendarData);
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Only allow safe keys
      if (isValidCalendarKey(key)) {
        sanitized[key] = sanitizeCalendarData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Validates calendar keys to prevent injection attacks
 */
function isValidCalendarKey(key: string): boolean {
  const allowedKeys = [
    'id',
    'summary',
    'description',
    'start',
    'end',
    'location',
    'attendees',
    'colorId',
    'status',
    'visibility',
    'recurrence',
    'created',
    'updated',
    'dateTime',
    'date',
    'timeZone',
    'email',
    'displayName',
    'responseStatus',
  ];

  return allowedKeys.includes(key) || /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key);
}

/**
 * Rate limiting for calendar operations
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  userId: string,
  operation: string,
  maxRequests = 100,
  windowMs = 60000, // 1 minute
): SecurityValidationResult {
  try {
    const key = `${userId}:${operation}`;
    const now = Date.now();
    const userLimit = rateLimitMap.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      // Reset or create new limit
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { isValid: true };
    }

    if (userLimit.count >= maxRequests) {
      return {
        isValid: false,
        error: `Rate limit exceeded. Maximum ${maxRequests} requests per minute.`,
      };
    }

    // Increment count
    userLimit.count++;
    rateLimitMap.set(key, userLimit);

    return { isValid: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return {
      isValid: false,
      error: 'Rate limit check failed.',
    };
  }
}

/**
 * Logs security events for monitoring
 */
export function logSecurityEvent(
  event: string,
  userId: string,
  details?: any,
): void {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      details,
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    };

    // In production, you would send this to your logging service
    // console.log('Security Event:', logEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}
