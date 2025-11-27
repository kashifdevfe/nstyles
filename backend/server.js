import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
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

// CORS Configuration - Allow all origins for production
// Using cors package for proper preflight handling
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
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 200 // Use 200 instead of 204 for better compatibility
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

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
});
