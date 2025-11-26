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

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace('/graphql', ''),
            'http://localhost:3000',
            'http://localhost:3001',
        ].filter(Boolean);
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in production for Railway
        }
    },
    credentials: true,
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
