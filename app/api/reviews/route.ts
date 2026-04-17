import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId is required' }, { status: 400 });
    }

    const reviews = await prisma.sellerReview.findMany({
      where: { sellerId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole(req, ['CUSTOMER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { sellerId, rating, comment } = await req.json();
    const ratingValue = Number(rating);

    if (!sellerId || Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const review = await prisma.sellerReview.upsert({
      where: {
        userId_sellerId: {
          userId: auth.token.id,
          sellerId,
        },
      },
      update: {
        rating: ratingValue,
        comment: typeof comment === 'string' ? comment.trim() : null,
      },
      create: {
        userId: auth.token.id,
        sellerId,
        rating: ratingValue,
        comment: typeof comment === 'string' ? comment.trim() : null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
