import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import prisma from '../utils/db.js';

const router = express.Router();

// Get stats
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Default to today if no dates provided
        const start = startDate ? new Date(startDate) : new Date();
        start.setHours(0, 0, 0, 0);
        
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const entries = await prisma.entry.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
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

        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get daily report
router.get('/daily', authenticate, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let start, end;
        if (startDate && endDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            start = today;
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

        const report = {
            totalCustomers: entries.length,
            totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
            cashPayments: entries.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.totalAmount, 0),
            cardPayments: entries.filter(e => e.paymentMethod === 'Card').reduce((sum, e) => sum + e.totalAmount, 0),
            applePayPayments: entries.filter(e => e.paymentMethod === 'Apple Pay').reduce((sum, e) => sum + e.totalAmount, 0),
            otherPayments: entries.filter(e => e.paymentMethod === 'Other').reduce((sum, e) => sum + e.totalAmount, 0),
            serviceUsage
        };

        res.json(report);
    } catch (error) {
        console.error('Get daily report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get weekly report
router.get('/weekly', authenticate, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

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

        const serviceUsage = Object.entries(serviceUsageMap).map(([serviceName, count]) => ({
            serviceName,
            count
        }));

        res.json({
            totalCustomers: entries.length,
            totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
            cashPayments: entries.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.totalAmount, 0),
            cardPayments: entries.filter(e => e.paymentMethod === 'Card').reduce((sum, e) => sum + e.totalAmount, 0),
            applePayPayments: entries.filter(e => e.paymentMethod === 'Apple Pay').reduce((sum, e) => sum + e.totalAmount, 0),
            otherPayments: entries.filter(e => e.paymentMethod === 'Other').reduce((sum, e) => sum + e.totalAmount, 0),
            mostUsedService,
            serviceUsage,
            dailySales
        });
    } catch (error) {
        console.error('Get weekly report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get monthly report
router.get('/monthly', authenticate, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let start, end;
        if (startDate && endDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        } else {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            start = thirtyDaysAgo;
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

        const serviceUsage = Object.entries(serviceUsageMap).map(([serviceName, count]) => ({
            serviceName,
            count
        }));

        res.json({
            totalCustomers: entries.length,
            totalRevenue: entries.reduce((sum, e) => sum + e.totalAmount, 0),
            cashPayments: entries.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.totalAmount, 0),
            cardPayments: entries.filter(e => e.paymentMethod === 'Card').reduce((sum, e) => sum + e.totalAmount, 0),
            applePayPayments: entries.filter(e => e.paymentMethod === 'Apple Pay').reduce((sum, e) => sum + e.totalAmount, 0),
            otherPayments: entries.filter(e => e.paymentMethod === 'Other').reduce((sum, e) => sum + e.totalAmount, 0),
            topBarber,
            mostRequestedService,
            serviceUsage,
            dailySales
        });
    } catch (error) {
        console.error('Get monthly report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

