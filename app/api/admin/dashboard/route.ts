import { NextResponse } from 'next/server';
import { SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = await requireRole(req, ['ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const [pendingSellers, sellers, deals, reviews, totalReviews] = await Promise.all([
      prisma.seller.findMany({
        where: { approvalStatus: SellerApprovalStatus.PENDING },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.seller.findMany({
        include: {
          user: true,
          sellerReviews: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.deal.count(),
      prisma.sellerReview.findMany({
        include: {
          user: true,
          seller: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
      prisma.sellerReview.count(),
    ]);

    return NextResponse.json({
      stats: {
        totalSellers: sellers.length,
        pendingSellers: pendingSellers.length,
        activeDeals: deals,
        totalReviews,
      },
      pendingSellers,
      sellers,
      reviews,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
