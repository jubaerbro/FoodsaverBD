import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

async function getOwnedDeal(userId: string, dealId: string) {
  return prisma.deal.findFirst({
    where: {
      id: dealId,
      seller: {
        userId,
      },
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const auth = await requireRole(req, ['SELLER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { dealId } = await params;
    const ownedDeal = await getOwnedDeal(auth.token.id, dealId);

    if (!ownedDeal) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const body = await req.json();
    const updated = await prisma.deal.update({
      where: { id: dealId },
      data: {
        title: typeof body.title === 'string' ? body.title.trim() : ownedDeal.title,
        description: typeof body.description === 'string' ? body.description.trim() : ownedDeal.description,
        originalPrice: typeof body.originalPrice === 'number' ? body.originalPrice : ownedDeal.originalPrice,
        discountedPrice: typeof body.discountedPrice === 'number' ? body.discountedPrice : ownedDeal.discountedPrice,
        quantity: typeof body.quantity === 'number' ? body.quantity : ownedDeal.quantity,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : ownedDeal.imageUrl,
        dietaryTags: Array.isArray(body.dietaryTags) ? body.dietaryTags : ownedDeal.dietaryTags,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update seller deal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const auth = await requireRole(req, ['SELLER']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { dealId } = await params;
    const ownedDeal = await getOwnedDeal(auth.token.id, dealId);

    if (!ownedDeal) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.deal.delete({
      where: { id: dealId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete seller deal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
