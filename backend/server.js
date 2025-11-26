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

// Middleware - CORS Configuration (Allow all origins in production)
const corsOptions = {
    origin: function (origin, callback) {
        // In production, allow all origins (Vercel preview URLs change frequently)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
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
