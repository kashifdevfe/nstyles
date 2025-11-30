// Database connection test utility
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables!');
    console.error('Please create a .env file in the backend directory with:');
    console.error('DATABASE_URL="your-connection-string"');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    // Try to connect
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query successful!');
    
    await prisma.$disconnect();
    console.log('✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.message?.includes("Can't reach database server")) {
      console.error('\n💡 Possible solutions:');
      console.error('1. Check if your Neon database is paused (free tier databases pause after inactivity)');
      console.error('   → Go to https://console.neon.tech and resume your database');
      console.error('2. Verify your DATABASE_URL is correct in the .env file');
      console.error('3. Check your internet connection');
      console.error('4. Try using the direct connection URL instead of pooler URL');
      console.error('   → In Neon dashboard, get the "Connection string" from Settings');
    } else if (error.message?.includes('authentication failed')) {
      console.error('\n💡 Authentication error - check your DATABASE_URL credentials');
    } else if (error.message?.includes('SSL')) {
      console.error('\n💡 SSL error - ensure your DATABASE_URL includes ?sslmode=require');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();

