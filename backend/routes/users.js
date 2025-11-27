import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { shop: true }
        });
        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { shop: true }
        });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID (admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { shop: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create user (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, phone, role, status, shopId } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Name, email, password, and role are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                role,
                status: status || 'active',
                shopId
            },
            include: { shop: true }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, phone, role, status, shopId } = req.body;

        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.id !== req.params.id) {
                return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
            }
        }

        const updateData = { name, email, phone, role, status, shopId };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            include: { shop: true }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists. Please use a different email address.' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Cannot delete user: User has associated records' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;

