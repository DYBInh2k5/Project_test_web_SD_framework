import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'password123', // Demo purpose, should be hashed
      role: 'admin',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: 'Editor User',
      password: 'password123',
      role: 'editor',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'khachhang@example.com' },
    update: {},
    create: {
      email: 'khachhang@example.com',
      name: 'Nguyen Van Khach',
      password: 'password123',
      role: 'user',
    },
  });

  // Create Categories
  const catDienThoai = await prisma.category.create({
    data: { name: 'Điện thoại', description: 'Các dòng smartphone' },
  });

  const catLapTop = await prisma.category.create({
    data: { name: 'Máy tính xách tay', description: 'Khuyến mãi đặc biệt' },
  });

  // Create Products
  const ip15 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      description: 'Titanium, 256GB',
      price: 28500000,
      categoryId: catDienThoai.id,
      imageUrl: 'https://images.unsplash.com/photo-1696446702183-bc2e8ad23214?w=500&q=80',
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: 'MacBook Air M2',
      description: '8GB RAM, 256GB SSD',
      price: 24000000,
      categoryId: catLapTop.id,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
    },
  });

  // Create Order
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 52500000,
      status: 'pending',
      orderItems: {
        create: [
          { productId: ip15.id, quantity: 1, price: 28500000 },
          { productId: macbook.id, quantity: 1, price: 24000000 },
        ],
      },
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
