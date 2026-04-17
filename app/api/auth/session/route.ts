import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = await getAuthToken(req);

  if (!auth.token) {
    return auth.error;
  }

  return NextResponse.json({
    user: {
      id: auth.token.id,
      email: auth.token.email,
      name: auth.token.name,
      role: auth.token.role,
    },
  });
}
