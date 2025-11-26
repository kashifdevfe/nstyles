import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './graphql/schema.js';
import { resolvers, getUser } from './graphql/resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start server
await server.start();

// Middleware - CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel URLs (production and preview deployments)
        const isVercel = origin.includes('.vercel.app');
        
        // Allow localhost for development
        const isLocalhost = origin.startsWith('http://localhost:');
        
        // Allow specific frontend URL from env
        const isAllowedFrontend = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;
        
        // Allow if Vercel, localhost, or matches FRONTEND_URL
        if (isVercel || isLocalhost || isAllowedFrontend || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            // In production, allow all origins as fallback
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// GraphQL endpoint with context
app.use(
    '/graphql',
    expressMiddleware(server, {
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            const user = getUser(token.replace('Bearer ', ''));
            return { user };
        },
    })
);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Barber Shop API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
});
