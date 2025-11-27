import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateClientNumber } from '../utils/helpers.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get all entries
router.get('/', authenticate, async (req, res) => {
    try {
        const { barberId, shopId, startDate, endDate } = req.query;

        const where = {};

        if (shopId) where.shopId = shopId;

        // If barber is logged in, only show their entries
        if (req.user.role === 'barber') {
            where.barberId = req.user.userId;
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
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        const entries = await prisma.entry.findMany({
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

        res.json(entries);
    } catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get entry by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const entry = await prisma.entry.findUnique({
            where: { id: req.params.id },
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

        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Barbers can only view their own entries
        if (req.user.role === 'barber' && entry.barberId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get entry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create entry
router.post('/', authenticate, async (req, res) => {
    try {
        const { barberId, serviceIds, date, time, paymentMethod } = req.body;

        if (!barberId || !serviceIds || !date || !time || !paymentMethod) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Get barber to find their shop
        const barber = await prisma.user.findUnique({ where: { id: barberId } });
        if (!barber) {
            return res.status(404).json({ error: 'Barber not found' });
        }

        const clientNumber = await generateClientNumber();

        // Calculate total amount
        const services = await prisma.service.findMany({
            where: { id: { in: serviceIds } }
        });

        if (services.length !== serviceIds.length) {
            return res.status(400).json({ error: 'One or more services not found' });
        }

        const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

        const entry = await prisma.entry.create({
            data: {
                clientNumber,
                barberId,
                shopId: barber.shopId,
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

        res.status(201).json(entry);
    } catch (error) {
        console.error('Create entry error:', error);
        res.status(500).json({ error: 'Failed to create entry' });
    }
});

export default router;

