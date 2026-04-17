import { NextResponse } from 'next/server';
import { SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { withLivePricing } from '@/lib/live-pricing';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    // In a real app, you would filter by category, location, etc.
    const deals = await prisma.deal.findMany({
      where: {
        seller: {
          approvalStatus: SellerApprovalStatus.APPROVED,
        },
      },
      include: {
        seller: {
          include: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(deals.map((deal) => withLivePricing(deal)));
  } catch (error) {
    console.error('Fetch deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole(req, ['SELLER', 'ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const seller = await prisma.seller.findUnique({ where: { userId: auth.token.id } });
    if (!seller) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    if (seller.approvalStatus !== SellerApprovalStatus.APPROVED) {
      return NextResponse.json({ error: 'Seller account is pending admin approval' }, { status: 403 });
    }

    const { title, description, originalPrice, discountedPrice, quantity, pickupStartTime, pickupEndTime, imageUrl, dietaryTags } = await req.json();
    const originalPriceValue = Number(originalPrice);
    const discountedPriceValue = Number(discountedPrice);
    const quantityValue = Number(quantity);
    const pickupStart = new Date(pickupStartTime);
    const pickupEnd = new Date(pickupEndTime);

    if (!title || !pickupStartTime || !pickupEndTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (
      Number.isNaN(originalPriceValue) ||
      Number.isNaN(discountedPriceValue) ||
      Number.isNaN(quantityValue) ||
      Number.isNaN(pickupStart.getTime()) ||
      Number.isNaN(pickupEnd.getTime())
    ) {
      return NextResponse.json({ error: 'Invalid deal data' }, { status: 400 });
    }

    if (originalPriceValue <= 0 || discountedPriceValue <= 0 || quantityValue <= 0) {
      return NextResponse.json({ error: 'Prices and quantity must be greater than zero' }, { status: 400 });
    }

    if (discountedPriceValue > originalPriceValue) {
      return NextResponse.json({ error: 'Discounted price cannot exceed original price' }, { status: 400 });
    }

    if (pickupEnd <= pickupStart) {
      return NextResponse.json({ error: 'Pickup end time must be after pickup start time' }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        sellerId: seller.id,
        title: String(title).trim(),
        description,
        originalPrice: originalPriceValue,
        discountedPrice: discountedPriceValue,
        quantity: Math.floor(quantityValue),
        pickupStartTime: pickupStart,
        pickupEndTime: pickupEnd,
        imageUrl,
        dietaryTags: Array.isArray(dietaryTags) ? dietaryTags.filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim()) : [],
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error('Create deal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
