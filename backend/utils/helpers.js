import prisma from './db.js';

// Helper function to generate next client number
export const generateClientNumber = async () => {
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

