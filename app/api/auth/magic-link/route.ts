import { NextResponse } from 'next/server';
import { Role, SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, name, role, mode, businessName, address, phone } = await req.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const requestedRole = role === Role.SELLER || role === Role.ADMIN ? role : Role.CUSTOMER;

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { seller: true },
    });

    if (mode === 'login') {
      if (!existingUser && requestedRole === Role.CUSTOMER) {
        await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: normalizedEmail.split('@')[0],
            role: Role.CUSTOMER,
          },
        });

        return NextResponse.json({ ok: true });
      }

      if (!existingUser) {
        return NextResponse.json({ error: 'No account found for this email' }, { status: 404 });
      }

      return NextResponse.json({ ok: true });
    }

    if (!normalizedName) {
      return NextResponse.json({ error: 'Name is required for signup' }, { status: 400 });
    }

    if (existingUser) {
      return NextResponse.json({ error: 'An account already exists for this email' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: normalizedName,
          role: requestedRole,
        },
      });

      if (requestedRole === Role.SELLER) {
        if (!businessName || !address || !phone) {
          throw new Error('Missing seller details');
        }

        await tx.seller.create({
          data: {
            userId: user.id,
            businessName: String(businessName).trim(),
            address: String(address).trim(),
            phone: String(phone).trim(),
            approvalStatus: SellerApprovalStatus.PENDING,
          },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Missing seller details') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Magic link request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
