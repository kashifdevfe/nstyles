import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get all shops
router.get('/', authenticate, async (req, res) => {
    try {
        const shops = await prisma.shop.findMany({
            include: { barbers: true }
        });
        res.json(shops);
    } catch (error) {
        console.error('Get shops error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get shop by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const shop = await prisma.shop.findUnique({
            where: { id: req.params.id },
            include: { barbers: true }
        });
        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // Calculate shop stats
        const entries = await prisma.entry.findMany({
            where: { shopId: shop.id }
        });

        const totalRevenue = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
        const barberCount = await prisma.user.count({
            where: { shopId: shop.id, role: 'barber' }
        });

        res.json({
            ...shop,
            stats: {
                totalRevenue,
                totalEntries: entries.length,
                barberCount
            }
        });
    } catch (error) {
        console.error('Get shop error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create shop (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, address, phone, image } = req.body;

        if (!name || !address) {
            return res.status(400).json({ error: 'Name and address are required' });
        }

        const shop = await prisma.shop.create({
            data: { name, address, phone, image }
        });

        res.status(201).json(shop);
    } catch (error) {
        console.error('Create shop error:', error);
        res.status(500).json({ error: 'Failed to create shop' });
    }
});

// Update shop (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, address, phone, image } = req.body;

        const shop = await prisma.shop.update({
            where: { id: req.params.id },
            data: { name, address, phone, image }
        });

        res.json(shop);
    } catch (error) {
        console.error('Update shop error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Shop not found' });
        }
        res.status(500).json({ error: 'Failed to update shop' });
    }
});

// Delete shop (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        await prisma.shop.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete shop error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Shop not found' });
        }
        res.status(500).json({ error: 'Failed to delete shop' });
    }
});

export default router;

