// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import serviceRoutes from './routes/services.js';
import shopRoutes from './routes/shops.js';
import entryRoutes from './routes/entries.js';
import reportRoutes from './routes/reports.js';
import prisma, { testDatabaseConnection } from './utils/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration - Allow all origins for production
const corsOptions = {
    origin: function (origin, callback) {
        try {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) {
                return callback(null, true);
            }
            // Allow all origins in production - reflect the requesting origin
            // This is required when credentials: true
            callback(null, origin);
        } catch (error) {
            console.error('CORS origin callback error:', error);
            callback(null, true); // Fallback to allow all on error
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 200 // Use 200 instead of 204 for better compatibility
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint with database connectivity test
app.get('/health', async (req, res) => {
    const healthStatus = {
        status: 'ok',
        message: 'Barber Shop API is running',
        database: 'unknown',
        timestamp: new Date().toISOString()
    };

    // Test database connection with better diagnostics
    const dbTest = await testDatabaseConnection();
    
    if (dbTest.connected) {
        healthStatus.database = 'connected';
        res.json(healthStatus);
    } else {
        healthStatus.database = 'disconnected';
        healthStatus.error = dbTest.error;
        healthStatus.troubleshooting = dbTest.suggestions || [];
        res.status(503).json(healthStatus);
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Barber Shop API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            services: '/api/services',
            shops: '/api/shops',
            entries: '/api/entries',
            reports: '/api/reports'
        }
    });
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
});
