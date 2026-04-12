import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    // In a real app, you would filter by category, location, etc.
    const deals = await prisma.deal.findMany({
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error('Fetch deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: string, role: string } | null;

    if (!decoded || (decoded.role !== 'SELLER' && decoded.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: decoded.id } });
    if (!seller && decoded.role !== 'ADMIN') {
       return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const { title, description, originalPrice, discountedPrice, quantity, pickupStartTime, pickupEndTime, imageUrl, dietaryTags } = await req.json();

    if (!title || !originalPrice || !discountedPrice || !quantity || !pickupStartTime || !pickupEndTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        sellerId: seller ? seller.id : 'admin-override', // In a real app, handle admin creating deals properly
        title,
        description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice: parseFloat(discountedPrice),
        quantity: parseInt(quantity, 10),
        pickupStartTime: new Date(pickupStartTime),
        pickupEndTime: new Date(pickupEndTime),
        imageUrl,
        dietaryTags: dietaryTags || [],
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error('Create deal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
