import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthToken } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = await getAuthToken(req);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.token.id },
      include: {
        reservations: {
          include: {
            deal: {
              include: {
                seller: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      reservations: user.reservations,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await getAuthToken(req);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: auth.token.id },
      data: { name },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
