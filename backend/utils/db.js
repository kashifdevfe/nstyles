import { PrismaClient } from '@prisma/client';

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please create a .env file in the backend directory with DATABASE_URL');
  console.error('Example: DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"');
}

// Create a single PrismaClient instance to be reused
// Configure with connection pool settings for Neon
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Connection pool settings for Neon
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Helper function to test connection with better error messages
export async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    const errorMessage = error.message || 'Unknown error';
    
    if (errorMessage.includes("Can't reach database server")) {
      return {
        connected: false,
        error: 'Database server unreachable',
        suggestions: [
          'Check if your Neon database is paused (free tier databases pause after inactivity)',
          'Go to https://console.neon.tech and resume your database',
          'Wait 10-30 seconds after resuming before retrying',
          'Verify your DATABASE_URL in .env file is correct',
          'Check your internet connection'
        ]
      };
    }
    
    if (errorMessage.includes('authentication failed') || errorMessage.includes('password')) {
      return {
        connected: false,
        error: 'Authentication failed',
        suggestions: [
          'Check your DATABASE_URL credentials in .env file',
          'Verify the username and password are correct',
          'Get a fresh connection string from Neon dashboard'
        ]
      };
    }
    
    if (errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
      return {
        connected: false,
        error: 'SSL connection error',
        suggestions: [
          'Ensure your DATABASE_URL includes ?sslmode=require',
          'Try adding ?sslmode=require to your connection string'
        ]
      };
    }
    
    return {
      connected: false,
      error: errorMessage,
      suggestions: ['Check your DATABASE_URL format', 'Verify database is running']
    };
  }
}

// Handle graceful shutdown
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

export default prisma;

