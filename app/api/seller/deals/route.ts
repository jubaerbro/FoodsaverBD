import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = await requireRole(req, ['SELLER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const seller = await prisma.seller.findUnique({ where: { userId: auth.token.id } });
    
    if (!seller) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const deals = await prisma.deal.findMany({
      where: {
        sellerId: seller.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Fetch seller deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
