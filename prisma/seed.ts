import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@foodsaver.app' },
    update: {
      name: 'Demo Seller',
      role: Role.SELLER,
      password: passwordHash,
    },
    create: {
      email: 'seller@foodsaver.app',
      name: 'Demo Seller',
      password: passwordHash,
      role: Role.SELLER,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@foodsaver.app' },
    update: {
      name: 'Demo Customer',
      role: Role.CUSTOMER,
      password: passwordHash,
    },
    create: {
      email: 'customer@foodsaver.app',
      name: 'Demo Customer',
      password: passwordHash,
      role: Role.CUSTOMER,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@foodsaver.app' },
    update: {
      name: 'Demo Admin',
      role: Role.ADMIN,
      password: passwordHash,
    },
    create: {
      email: 'admin@foodsaver.app',
      name: 'Demo Admin',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {
      businessName: 'FoodSaver Demo Kitchen',
      address: 'Dhaka',
      phone: '+8801700000000',
      approvalStatus: 'APPROVED',
      approvedAt: new Date('2026-04-13T10:00:00.000Z'),
      approvedByUserId: adminUser.id,
    },
    create: {
      userId: sellerUser.id,
      businessName: 'FoodSaver Demo Kitchen',
      address: 'Dhaka',
      phone: '+8801700000000',
      approvalStatus: 'APPROVED',
      approvedAt: new Date('2026-04-13T10:00:00.000Z'),
      approvedByUserId: adminUser.id,
    },
  });

  await prisma.deal.upsert({
    where: { id: 'demo-deal-1' },
    update: {
      title: 'End of Day Bakery Box',
      description: 'A mixed box of fresh pastries and bread.',
      originalPrice: 500,
      discountedPrice: 250,
      quantity: 5,
      pickupStartTime: new Date('2026-04-13T18:00:00.000Z'),
      pickupEndTime: new Date('2026-04-13T21:00:00.000Z'),
      imageUrl: 'https://picsum.photos/seed/backend-seed/400/300',
      dietaryTags: ['Vegetarian'],
      sellerId: seller.id,
    },
    create: {
      id: 'demo-deal-1',
      title: 'End of Day Bakery Box',
      description: 'A mixed box of fresh pastries and bread.',
      originalPrice: 500,
      discountedPrice: 250,
      quantity: 5,
      pickupStartTime: new Date('2026-04-13T18:00:00.000Z'),
      pickupEndTime: new Date('2026-04-13T21:00:00.000Z'),
      imageUrl: 'https://picsum.photos/seed/backend-seed/400/300',
      dietaryTags: ['Vegetarian'],
      sellerId: seller.id,
    },
  });

  await prisma.sellerReview.upsert({
    where: {
      userId_sellerId: {
        userId: customerUser.id,
        sellerId: seller.id,
      },
    },
    update: {
      rating: 5,
      comment: 'Very reliable pickup and the food quality was excellent.',
    },
    create: {
      userId: customerUser.id,
      sellerId: seller.id,
      rating: 5,
      comment: 'Very reliable pickup and the food quality was excellent.',
    },
  });

  console.log('Seeded demo accounts:');
  console.log('seller@foodsaver.app / password123');
  console.log('customer@foodsaver.app / password123');
  console.log('admin@foodsaver.app / password123');
  console.log(`Customer ready: ${customerUser.email}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
