import { NextResponse } from 'next/server';
import { SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { withLivePricing } from '@/lib/live-pricing';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  void req;

  try {
    const { dealId } = await params;

    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        seller: {
          approvalStatus: SellerApprovalStatus.APPROVED,
        },
      },
      include: {
        seller: {
          include: {
            user: true,
            sellerReviews: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(withLivePricing(deal));
  } catch (error) {
    console.error('Fetch deal detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
