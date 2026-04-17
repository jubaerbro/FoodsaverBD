import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireRole } from '@/lib/api-auth';

function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  const auth = await requireRole(req, ['CUSTOMER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { dealId, quantity } = await req.json();
    const quantityValue = Number(quantity);

    if (!dealId || !quantityValue || Number.isNaN(quantityValue) || quantityValue < 1) {
      return NextResponse.json({ error: 'Missing deal ID or quantity' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({ where: { id: dealId } });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    if (deal.quantity < quantityValue) {
      return NextResponse.json({ error: 'Not enough quantity available' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedDeal = await tx.deal.updateMany({
        where: {
          id: dealId,
          quantity: {
            gte: quantityValue,
          },
        },
        data: {
          quantity: {
            decrement: quantityValue,
          },
        },
      });

      if (updatedDeal.count === 0) {
        throw new Error('Not enough quantity available');
      }

      let reservation = null;

      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          reservation = await tx.reservation.create({
            data: {
              userId: auth.token.id,
              dealId,
              quantity: quantityValue,
              orderCode: generateOrderCode(),
            },
          });
          break;
        } catch (error) {
          if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
            throw error;
          }
        }
      }

      if (!reservation) {
        throw new Error('Failed to create a unique order code');
      }

      const refreshedDeal = await tx.deal.findUnique({ where: { id: dealId } });

      return { reservation, updatedDeal: refreshedDeal };
    });

    return NextResponse.json({ message: 'Reservation successful', ...result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not enough quantity available') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
