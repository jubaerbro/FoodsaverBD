import { NextResponse } from 'next/server';
import { SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const auth = await requireRole(req, ['ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { sellerId } = await params;
    const { action, notes } = await req.json();

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const approvalStatus =
      action === 'approve' ? SellerApprovalStatus.APPROVED : SellerApprovalStatus.REJECTED;

    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approvalStatus,
        approvalNotes: typeof notes === 'string' ? notes.trim() : null,
        approvedAt: action === 'approve' ? new Date() : null,
        approvedByUserId: auth.token.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Seller moderation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const auth = await requireRole(req, ['ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { sellerId } = await params;
    await prisma.seller.delete({
      where: { id: sellerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete seller error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
