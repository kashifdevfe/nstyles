import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@barber.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@barber.com',
            password: adminPassword,
            phone: '+44 1234 567890',
            role: 'admin',
            status: 'active'
        }
    });
    console.log('✅ Created admin user:', admin.email);

    // Create sample barber
    const barberPassword = await bcrypt.hash('barber123', 10);
    const barber = await prisma.user.upsert({
        where: { email: 'john@barber.com' },
        update: {},
        create: {
            name: 'John Smith',
            email: 'john@barber.com',
            password: barberPassword,
            phone: '+44 7890 123456',
            role: 'barber',
            status: 'active'
        }
    });
    console.log('✅ Created barber user:', barber.email);

    // Create services
    const services = [
        { name: 'Haircut', price: 5 },
        { name: 'Beard Trim', price: 3 },
        { name: 'Facial', price: 10 },
        { name: 'Hair Wash', price: 2 },
        { name: 'Hair Styling', price: 7 }
    ];

    for (const service of services) {
        const created = await prisma.service.upsert({
            where: { name: service.name },
            update: {},
            create: service
        });
        console.log(`✅ Created service: ${created.name} - £${created.price}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@barber.com / admin123');
    console.log('Barber: john@barber.com / barber123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
