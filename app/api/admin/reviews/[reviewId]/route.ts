import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const auth = await requireRole(req, ['ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const { reviewId } = await params;

    await prisma.sellerReview.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
