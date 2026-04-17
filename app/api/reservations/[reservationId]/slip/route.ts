import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { getLivePricing } from '@/lib/live-pricing';
import { buildReservationSlipHtml } from '@/lib/reservation-slip';

function formatTaka(value: number) {
  return `Tk ${new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 }).format(value)}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const auth = await requireRole(req, ['CUSTOMER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { reservationId } = await params;
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        userId: auth.token.id,
      },
      include: {
        user: true,
        deal: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const livePricing = getLivePricing(
      Number(reservation.deal.originalPrice) || 0,
      Number(reservation.deal.discountedPrice) || 0
    );

    const html = buildReservationSlipHtml({
      reservationId: reservation.id,
      orderCode: reservation.orderCode,
      reservedAt: reservation.createdAt,
      quantity: reservation.quantity,
      customerName: reservation.user.name,
      customerEmail: reservation.user.email,
      dealTitle: reservation.deal.title,
      sellerName: reservation.deal.seller.businessName,
      pickupAddress: reservation.deal.seller.address || 'Pickup address unavailable',
      pickupStartTime: reservation.deal.pickupStartTime,
      pickupEndTime: reservation.deal.pickupEndTime,
      amountLabel: formatTaka(livePricing.liveDiscountedPrice * reservation.quantity),
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="foodsaver-slip-${reservation.orderCode}.html"`,
      },
    });
  } catch (error) {
    console.error('Reservation slip error:', error);
    return NextResponse.json({ error: 'Failed to generate reservation slip' }, { status: 500 });
  }
}
