import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: string, role: string } | null;

    if (!decoded || decoded.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden. Only customers can reserve' }, { status: 403 });
    }

    const { dealId, quantity } = await req.json();

    if (!dealId || !quantity) {
      return NextResponse.json({ error: 'Missing deal ID or quantity' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({ where: { id: dealId } });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    if (deal.quantity < quantity) {
      return NextResponse.json({ error: 'Not enough quantity available' }, { status: 400 });
    }

    // Use a transaction to ensure quantity is updated safely
    const [reservation, updatedDeal] = await prisma.$transaction([
      prisma.reservation.create({
        data: {
          userId: decoded.id,
          dealId,
          quantity: parseInt(quantity, 10),
          orderCode: generateOrderCode(),
        },
      }),
      prisma.deal.update({
        where: { id: dealId },
        data: {
          quantity: {
            decrement: parseInt(quantity, 10),
          },
        },
      }),
    ]);

    return NextResponse.json({ message: 'Reservation successful', reservation, updatedDeal }, { status: 201 });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
