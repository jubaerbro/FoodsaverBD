import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { Role, SellerApprovalStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signAppToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, name, role, businessName, address, phone } = await req.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password : '';
    const requestedRole = role === Role.SELLER ? Role.SELLER : Role.CUSTOMER;

    if (!normalizedEmail || !normalizedPassword || !normalizedName) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (normalizedPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account already exists for this email' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(normalizedPassword, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: normalizedName,
          password: passwordHash,
          role: requestedRole,
        },
      });

      if (requestedRole === Role.SELLER) {
        await tx.seller.create({
          data: {
            userId: createdUser.id,
            businessName: String(businessName || normalizedName).trim() || normalizedName,
            address: String(address || 'Test seller address').trim() || 'Test seller address',
            phone: String(phone || '0000000000').trim() || '0000000000',
            approvalStatus: SellerApprovalStatus.APPROVED,
            approvedAt: new Date(),
          },
        });
      }

      return createdUser;
    });

    const authToken = signAppToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Password signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
