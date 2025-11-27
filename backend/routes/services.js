import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await prisma.service.findUnique({
            where: { id: req.params.id }
        });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create service (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const service = await prisma.service.create({
            data: { name, price }
        });

        res.status(201).json(service);
    } catch (error) {
        console.error('Create service error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Service name already exists' });
        }
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// Update service (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, price } = req.body;

        const service = await prisma.service.update({
            where: { id: req.params.id },
            data: { name, price }
        });

        res.json(service);
    } catch (error) {
        console.error('Update service error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Service not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Service name already exists' });
        }
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// Delete service (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const service = await prisma.service.findUnique({
            where: { id: req.params.id },
            include: {
                entryServices: {
                    take: 1
                }
            }
        });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        await prisma.service.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete service error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Service not found' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Cannot delete service: It is being used in existing entries' });
        }
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

export default router;

