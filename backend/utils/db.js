import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance to be reused
const prisma = new PrismaClient();

export default prisma;

