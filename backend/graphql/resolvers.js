import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to get authenticated user
export const getUser = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Helper function to generate next client number
const generateClientNumber = async () => {
    const lastEntry = await prisma.entry.findFirst({
        orderBy: { clientNumber: 'desc' }
    });

    if (!lastEntry) {
        return 'C-0001';
    }

    const lastNumber = parseInt(lastEntry.clientNumber.split('-')[1]);
    const nextNumber = lastNumber + 1;
    return `C-${String(nextNumber).padStart(4, '0')}`;
};

export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) throw new Error('Not authenticated');
            return await prisma.user.findUnique({ where: { id: context.user.userId } });
        },

        users: async (_, __, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }
            return await prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                include: { shop: true }
            });
        },

        user: async (_, { id }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }
            return await prisma.user.findUnique({
                where: { id },
                include: { shop: true }
            });
        },

        services: async () => {
            return await prisma.service.findMany({
                orderBy: { name: 'asc' }
            });
        },

        service: async (_, { id }) => {
            return await prisma.service.findUnique({ where: { id } });
        },

        shops: async (_, __, context) => {
            if (!context.user) throw new Error('Not authenticated');
            return await prisma.shop.findMany({
                include: { barbers: true }
            });
        },

        shop: async (_, { id }, context) => {
            if (!context.user) throw new Error('Not authenticated');
            return await prisma.shop.findUnique({
                where: { id },
                include: { barbers: true }
            });
        },

        entries: async (_, { barberId, shopId, startDate, endDate }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            const where = {};

            if (shopId) where.shopId = shopId;

            // If barber is logged in, only show their entries
            if (context.user.role === 'barber') {
                where.barberId = context.user.userId;
            } else if (barberId) {
                // Admin can filter by barberId
                where.barberId = barberId;
            }

            // Date range filtering
            if (startDate || endDate) {
                where.date = {};
                if (startDate) {
                    where.date.gte = new Date(startDate);
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999); // Include the entire end date
                    where.date.lte = end;
                }
            }

            return await prisma.entry.findMany({
                where,
                include: {
                    barber: true,
                    shop: true,
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        },

        entry: async (_, { id }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            const entry = await prisma.entry.findUnique({
                where: { id },
                include: {
                    barber: true,
                    shop: true,
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });

            // Barbers can only view their own entries
            if (context.user.role === 'barber' && entry.barberId !== context.user.userId) {
                throw new Error('Not authorized');
            }

            return entry;
        },

        stats: async (_, { startDate, endDate }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            // Default to today if no dates provided
            const start = startDate ? new Date(startDate) : new Date();
            start.setHours(0, 0, 0, 0);
            
            const end = endDate ? new Date(endDate) : new Date();
            end.setHours(23, 59, 59, 999);

            const where = {
                date: {
                    gte: start,
                    lte: end
                }
            };

            const entries = await prisma.entry.findMany({
                where,
                include: {
                    entryServices: true
                }
            });

            const stats = {
                totalCustomersToday: entries.length,
                totalRevenueToday: entries.reduce((sum, e) => sum + e.totalAmount, 0),
                cashPayments: entries.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.totalAmount, 0),
                cardPayments: entries.filter(e => e.paymentMethod === 'Card').reduce((sum, e) => sum + e.totalAmount, 0),
                applePayPayments: entries.filter(e => e.paymentMethod === 'Apple Pay').reduce((sum, e) => sum + e.totalAmount, 0),
                otherPayments: entries.filter(e => e.paymentMethod === 'Other').reduce((sum, e) => sum + e.totalAmount, 0),
                totalServicesPerformed: entries.reduce((sum, e) => sum + e.entryServices.length, 0)
            };

            return stats;
        },

        dailyReport: async (_, __, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const entries = await prisma.entry.findMany({
                where: {
                    date: {
                        gte: today
                    }
                },
                include: {
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });

            // Calculate service usage
            const serviceUsageMap = {};
            entries.forEach(entry => {
                entry.entryServices.forEach(es => {
                    const name = es.service.name;
                    serviceUsageMap[name] = (serviceUsageMap[name] || 0) + 1;
                });
            });

            const serviceUsage = Object.entries(serviceUsageMap).map(([serviceName, count]) => ({
                serviceName,
                count
            }));

            return {
                totalCustomers: entries.length,
                totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
                cashPayments: entries.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.totalAmount, 0),
                cardPayments: entries.filter(e => e.paymentMethod === 'Card').reduce((sum, e) => sum + e.totalAmount, 0),
                applePayPayments: entries.filter(e => e.paymentMethod === 'Apple Pay').reduce((sum, e) => sum + e.totalAmount, 0),
                otherPayments: entries.filter(e => e.paymentMethod === 'Other').reduce((sum, e) => sum + e.totalAmount, 0),
                serviceUsage
            };
        },

        weeklyReport: async (_, { startDate, endDate }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            // Default to last 7 days if no dates provided
            let start, end;
            if (startDate && endDate) {
                start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
            } else {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);
                start = sevenDaysAgo;
                end = new Date();
                end.setHours(23, 59, 59, 999);
            }

            const entries = await prisma.entry.findMany({
                where: {
                    date: {
                        gte: start,
                        lte: end
                    }
                },
                include: {
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });

            // Calculate most used service
            const serviceUsageMap = {};
            entries.forEach(entry => {
                entry.entryServices.forEach(es => {
                    const name = es.service.name;
                    serviceUsageMap[name] = (serviceUsageMap[name] || 0) + 1;
                });
            });

            let mostUsedService = null;
            let maxCount = 0;
            Object.entries(serviceUsageMap).forEach(([name, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    mostUsedService = name;
                }
            });

            // Calculate daily sales
            const dailySalesMap = {};
            entries.forEach(entry => {
                const dateStr = entry.date.toISOString().split('T')[0];
                dailySalesMap[dateStr] = (dailySalesMap[dateStr] || 0) + entry.totalAmount;
            });

            const dailySales = Object.entries(dailySalesMap).map(([date, revenue]) => ({
                date,
                revenue
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            return {
                totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
                mostUsedService,
                dailySales
            };
        },

        monthlyReport: async (_, __, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);

            const entries = await prisma.entry.findMany({
                where: {
                    date: {
                        gte: thirtyDaysAgo
                    }
                },
                include: {
                    barber: true,
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });

            // Calculate top barber
            const barberRevenueMap = {};
            entries.forEach(entry => {
                const barberName = entry.barber.name;
                barberRevenueMap[barberName] = (barberRevenueMap[barberName] || 0) + entry.totalAmount;
            });

            let topBarber = null;
            let maxRevenue = 0;
            Object.entries(barberRevenueMap).forEach(([name, revenue]) => {
                if (revenue > maxRevenue) {
                    maxRevenue = revenue;
                    topBarber = name;
                }
            });

            // Calculate most requested service
            const serviceUsageMap = {};
            entries.forEach(entry => {
                entry.entryServices.forEach(es => {
                    const name = es.service.name;
                    serviceUsageMap[name] = (serviceUsageMap[name] || 0) + 1;
                });
            });

            let mostRequestedService = null;
            let maxCount = 0;
            Object.entries(serviceUsageMap).forEach(([name, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    mostRequestedService = name;
                }
            });

            // Calculate daily sales
            const dailySalesMap = {};
            entries.forEach(entry => {
                const dateStr = entry.date.toISOString().split('T')[0];
                dailySalesMap[dateStr] = (dailySalesMap[dateStr] || 0) + entry.totalAmount;
            });

            const dailySales = Object.entries(dailySalesMap).map(([date, revenue]) => ({
                date,
                revenue
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            return {
                totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
                topBarber,
                mostRequestedService,
                dailySales
            };
        }
    },

    Mutation: {
        login: async (_, { email, password }) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Invalid password');
            }

            if (user.status === 'inactive') {
                throw new Error('Account is inactive');
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return {
                token,
                user
            };
        },

        createUser: async (_, args, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: args.email }
            });

            if (existingUser) {
                throw new Error('Email already exists. Please use a different email address.');
            }

            try {
                const hashedPassword = await bcrypt.hash(args.password, 10);
                return await prisma.user.create({
                    data: {
                        ...args,
                        password: hashedPassword,
                    },
                    include: { shop: true }
                });
            } catch (error) {
                console.error('Create user error:', error);
                
                // Handle Prisma unique constraint errors
                if (error.code === 'P2002') {
                    if (error.meta?.target?.includes('email')) {
                        throw new Error('Email already exists. Please use a different email address.');
                    }
                    throw new Error('A user with this information already exists.');
                }
                
                throw new Error(`Failed to create user: ${error.message || 'Unknown error'}`);
            }
        },

        updateUser: async (_, { id, ...args }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            // If email is being updated, check if it already exists for another user
            if (args.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: args.email }
                });

                if (existingUser && existingUser.id !== id) {
                    throw new Error('Email already exists. Please use a different email address.');
                }
            }

            if (args.password) {
                args.password = await bcrypt.hash(args.password, 10);
            }

            try {
                return await prisma.user.update({
                    where: { id },
                    data: args,
                    include: { shop: true }
                });
            } catch (error) {
                console.error('Update user error:', error);
                
                // Handle Prisma unique constraint errors
                if (error.code === 'P2002') {
                    if (error.meta?.target?.includes('email')) {
                        throw new Error('Email already exists. Please use a different email address.');
                    }
                    throw new Error('A user with this information already exists.');
                }
                if (error.code === 'P2025') {
                    throw new Error('User not found');
                }
                
                throw new Error(`Failed to update user: ${error.message || 'Unknown error'}`);
            }
        },

        deleteUser: async (_, { id }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            if (!id) {
                throw new Error('User ID is required');
            }

            // Check if user exists
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new Error('User not found');
            }

            try {
                await prisma.user.delete({ where: { id } });
                return true;
            } catch (error) {
                console.error('Delete user error:', error);
                
                // Handle Prisma errors
                if (error.code === 'P2025') {
                    throw new Error('User not found');
                }
                if (error.code === 'P2003') {
                    throw new Error('Cannot delete user: User has associated records');
                }
                
                throw new Error(`Failed to delete user: ${error.message || 'Unknown error'}`);
            }
        },

        createService: async (_, { name, price }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            return await prisma.service.create({
                data: { name, price }
            });
        },

        updateService: async (_, { id, name, price }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            return await prisma.service.update({
                where: { id },
                data: { name, price }
            });
        },

        deleteService: async (_, { id }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized');
            }

            if (!id) {
                throw new Error('Service ID is required');
            }

            // Check if service exists
            const service = await prisma.service.findUnique({ 
                where: { id },
                include: {
                    entryServices: {
                        take: 1 // Just check if any exist
                    }
                }
            });

            if (!service) {
                throw new Error('Service not found');
            }

            // Check if service is being used (optional - cascade should handle this, but good to inform user)
            if (service.entryServices && service.entryServices.length > 0) {
                // Still allow deletion as cascade will handle it, but we could warn if needed
                // For now, we'll proceed with deletion
            }

            try {
                await prisma.service.delete({ where: { id } });
                return true;
            } catch (error) {
                console.error('Delete service error:', error);
                
                // Handle Prisma errors
                if (error.code === 'P2025') {
                    throw new Error('Service not found');
                }
                if (error.code === 'P2003') {
                    throw new Error('Cannot delete service: It is being used in existing entries');
                }
                if (error.code === 'P2002') {
                    throw new Error('Service deletion failed due to constraint violation');
                }
                
                // Generic error
                throw new Error(`Failed to delete service: ${error.message || 'Unknown error'}`);
            }
        },

        createShop: async (_, args, context) => {
            if (!context.user || context.user.role !== 'admin') throw new Error('Not authorized');
            return prisma.shop.create({ data: args });
        },

        updateShop: async (_, { id, ...args }, context) => {
            if (!context.user || context.user.role !== 'admin') throw new Error('Not authorized');
            return prisma.shop.update({
                where: { id },
                data: args,
            });
        },

        deleteShop: async (_, { id }, context) => {
            if (!context.user || context.user.role !== 'admin') throw new Error('Not authorized');
            await prisma.shop.delete({ where: { id } });
            return true;
        },

        createEntry: async (_, { barberId, serviceIds, date, time, paymentMethod }, context) => {
            if (!context.user) throw new Error('Not authenticated');

            // Get barber to find their shop
            const barber = await prisma.user.findUnique({ where: { id: barberId } });
            if (!barber) throw new Error('Barber not found');

            const clientNumber = await generateClientNumber();

            // Calculate total amount
            const services = await prisma.service.findMany({
                where: { id: { in: serviceIds } }
            });

            const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

            return await prisma.entry.create({
                data: {
                    clientNumber,
                    barberId,
                    shopId: barber.shopId, // Link to barber's shop
                    date: new Date(date),
                    time,
                    paymentMethod,
                    totalAmount,
                    entryServices: {
                        create: services.map(service => ({
                            serviceId: service.id,
                            price: service.price
                        }))
                    }
                },
                include: {
                    barber: true,
                    shop: true,
                    entryServices: {
                        include: {
                            service: true
                        }
                    }
                }
            });
        }
    },

    Shop: {
        stats: async (parent) => {
            const entries = await prisma.entry.findMany({
                where: { shopId: parent.id }
            });

            const totalRevenue = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
            const barberCount = await prisma.user.count({
                where: { shopId: parent.id, role: 'barber' }
            });

            return {
                totalRevenue,
                totalEntries: entries.length,
                barberCount
            };
        }
    }
};

// module.exports = resolvers; // Removed for ESM compatibility
