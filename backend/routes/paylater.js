import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get all pay later entries
router.get('/', authenticate, async (req, res) => {
    try {
        const { barberId, shopId } = req.query;

        const where = {};

        // If barber is logged in, only show their pay later entries
        if (req.user.role === 'barber') {
            where.barberId = req.user.userId;
        } else if (barberId) {
            // Admin can filter by barberId
            where.barberId = barberId;
        }

        if (shopId) {
            where.shopId = shopId;
        }

        const payLaterEntries = await prisma.payLater.findMany({
            where,
            include: {
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shop: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(payLaterEntries);
    } catch (error) {
        console.error('Get pay later entries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get unpaid pay later entries (for loan remaining calculation)
router.get('/unpaid', authenticate, async (req, res) => {
    try {
        const { barberId, shopId } = req.query;

        const where = {
            isPaid: false
        };

        if (req.user.role === 'barber') {
            where.barberId = req.user.userId;
        } else if (barberId) {
            where.barberId = barberId;
        }

        if (shopId) {
            where.shopId = shopId;
        }

        const unpaidEntries = await prisma.payLater.findMany({
            where,
            include: {
                barber: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                shop: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const totalUnpaid = unpaidEntries.reduce((sum, entry) => sum + entry.amount, 0);

        res.json({
            entries: unpaidEntries,
            totalUnpaid
        });
    } catch (error) {
        console.error('Get unpaid pay later entries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create pay later entry
router.post('/', authenticate, async (req, res) => {
    try {
        const { barberId, shopId, customerName, customerPhone, amount, date, time, serviceIds } = req.body;

        if (!barberId || !customerName || !customerPhone || !amount || !date || !time) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Get barber to find their shop if shopId not provided
        const barber = await prisma.user.findUnique({ where: { id: barberId } });
        if (!barber) {
            return res.status(404).json({ error: 'Barber not found' });
        }

        const payLaterEntry = await prisma.payLater.create({
            data: {
                barberId,
                shopId: shopId || barber.shopId,
                customerName,
                customerPhone,
                amount: parseFloat(amount),
                date: new Date(date),
                time,
                serviceIds: serviceIds || [],
                isPaid: false
            },
            include: {
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shop: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json(payLaterEntry);
    } catch (error) {
        console.error('Create pay later entry error:', error);
        res.status(500).json({ error: 'Failed to create pay later entry' });
    }
});

// Mark pay later entry as paid
router.put('/:id/mark-paid', authenticate, async (req, res) => {
    try {
        const payLaterId = req.params.id;

        const payLaterEntry = await prisma.payLater.findUnique({
            where: { id: payLaterId },
            include: { barber: true }
        });

        if (!payLaterEntry) {
            return res.status(404).json({ error: 'Pay later entry not found' });
        }

        if (payLaterEntry.isPaid) {
            return res.status(400).json({ error: 'This entry is already marked as paid' });
        }

        // Barbers can only mark their own entries as paid
        if (req.user.role === 'barber' && payLaterEntry.barberId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Import helper function
        const { generateClientNumber } = await import('../utils/helpers.js');

        // Create a regular entry when marking as paid
        let createdEntry = null;
        if (payLaterEntry.serviceIds && payLaterEntry.serviceIds.length > 0) {
            // Get services to create entry with proper service details
            const services = await prisma.service.findMany({
                where: { id: { in: payLaterEntry.serviceIds } }
            });

            if (services.length > 0) {
                const clientNumber = await generateClientNumber();
                
                createdEntry = await prisma.entry.create({
                    data: {
                        clientNumber,
                        barberId: payLaterEntry.barberId,
                        shopId: payLaterEntry.shopId,
                        date: payLaterEntry.date,
                        time: payLaterEntry.time,
                        paymentMethod: 'Pay Later',
                        totalAmount: payLaterEntry.amount,
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
        } else {
            // If no services stored, create entry with just the amount
            const clientNumber = await generateClientNumber();
            
            createdEntry = await prisma.entry.create({
                data: {
                    clientNumber,
                    barberId: payLaterEntry.barberId,
                    shopId: payLaterEntry.shopId,
                    date: payLaterEntry.date,
                    time: payLaterEntry.time,
                    paymentMethod: 'Pay Later',
                    totalAmount: payLaterEntry.amount
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

        // Mark pay later entry as paid
        const updatedEntry = await prisma.payLater.update({
            where: { id: payLaterId },
            data: {
                isPaid: true,
                paidAt: new Date()
            },
            include: {
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shop: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.json({
            payLater: updatedEntry,
            entry: createdEntry
        });
    } catch (error) {
        console.error('Mark pay later as paid error:', error);
        res.status(500).json({ error: 'Failed to update pay later entry' });
    }
});

// Get pay later entry by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const payLaterEntry = await prisma.payLater.findUnique({
            where: { id: req.params.id },
            include: {
                barber: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shop: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!payLaterEntry) {
            return res.status(404).json({ error: 'Pay later entry not found' });
        }

        // Barbers can only view their own entries
        if (req.user.role === 'barber' && payLaterEntry.barberId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(payLaterEntry);
    } catch (error) {
        console.error('Get pay later entry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete pay later entry (admin only)
// NOTE: This only deletes the PayLater history record.
// If the entry was marked as paid, the corresponding Entry record remains untouched
// to preserve financial stats and revenue calculations.
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const payLaterId = req.params.id;

        const payLaterEntry = await prisma.payLater.findUnique({
            where: { id: payLaterId }
        });

        if (!payLaterEntry) {
            return res.status(404).json({ error: 'Pay later entry not found' });
        }

        // Only delete the PayLater history record
        // If this entry was marked as paid, the Entry record created at that time
        // remains in the database and continues to be included in stats/revenue
        await prisma.payLater.delete({
            where: { id: payLaterId }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete pay later entry error:', error);
        res.status(500).json({ error: 'Failed to delete pay later entry' });
    }
});

// Delete all pay later entries (admin only)
// NOTE: This only deletes PayLater history records.
// Any Entry records that were created when entries were marked as paid
// remain untouched to preserve financial stats and revenue calculations.
router.delete('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { isPaid } = req.query; // Optional filter: delete only paid or unpaid entries

        const where = {};
        if (isPaid !== undefined) {
            where.isPaid = isPaid === 'true';
        }

        // Only delete PayLater history records
        // Entry records (if any were created when entries were marked as paid)
        // remain in the database and continue to be included in stats/revenue
        const result = await prisma.payLater.deleteMany({
            where
        });

        res.json({ 
            success: true, 
            deletedCount: result.count 
        });
    } catch (error) {
        console.error('Delete all pay later entries error:', error);
        res.status(500).json({ error: 'Failed to delete pay later entries' });
    }
});

export default router;

