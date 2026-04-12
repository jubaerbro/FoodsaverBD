import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: string, role: string } | null;

    if (!decoded || decoded.role !== 'SELLER') {
      return NextResponse.json({ error: 'Forbidden. Only sellers can access this.' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: decoded.id } });
    
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
