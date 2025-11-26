# Dockerfile for Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for Prisma)
RUN npm ci

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port (Railway will set PORT env var)
EXPOSE ${PORT:-4000}

# Health check (uses PORT env var)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 4000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command (runs migrations and starts server)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

