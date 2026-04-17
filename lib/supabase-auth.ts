import { createRemoteJWKSet, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { getSupabaseProjectUrl } from '@/lib/supabase';

export type SupabaseSessionUser = {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  name: string;
};

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`${getSupabaseProjectUrl()}/auth/v1/.well-known/jwks.json`)
    );
  }

  return jwks;
}

export async function verifySupabaseAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: `${getSupabaseProjectUrl()}/auth/v1`,
    audience: 'authenticated',
  });

  const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
  const supabaseUserId = typeof payload.sub === 'string' ? payload.sub : '';

  if (!email || !supabaseUserId) {
    return null;
  }

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { supabaseUserId },
        { email },
      ],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        supabaseUserId,
        name: email.split('@')[0],
        role: 'CUSTOMER',
      },
    });
  }

  if (!user.supabaseUserId || user.supabaseUserId !== supabaseUserId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { supabaseUserId },
    });
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  } satisfies SupabaseSessionUser;
}
