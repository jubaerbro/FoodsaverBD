import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = await requireRole(req, ['SELLER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: auth.token.id },
      include: {
        deals: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        sellerReviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Seller dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
