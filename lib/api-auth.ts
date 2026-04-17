import { NextResponse } from 'next/server';
import { AuthTokenPayload } from '@/lib/auth';
import { verifyAppToken } from '@/lib/auth';
import { verifySupabaseAccessToken } from '@/lib/supabase-auth';

export async function getAuthToken(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      token: null,
    };
  }

  const rawToken = authHeader.split(' ')[1];
  const appToken = verifyAppToken(rawToken);

  if (appToken) {
    return {
      error: null,
      token: appToken,
    };
  }

  const token = await verifySupabaseAccessToken(rawToken);

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      token: null,
    };
  }

  return {
    error: null,
    token,
  };
}

export async function requireRole(
  req: Request,
  allowedRoles: AuthTokenPayload['role'][]
) {
  const auth = await getAuthToken(req);

  if (!auth.token) {
    return auth;
  }

  if (!allowedRoles.includes(auth.token.role)) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      token: null,
    };
  }

  return auth;
}
