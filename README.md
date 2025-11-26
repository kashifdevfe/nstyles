# N STYLES - Barber Shop Management System

A modern, full-stack barber shop management system built with Next.js, GraphQL, and PostgreSQL.

## Features

- 🎨 Modern, mobile-first responsive design
- 👥 User management (Admin & Barber roles)
- 🏪 Shop management
- 💇 Service management
- 📊 Real-time statistics and reports
- 📅 Date range filtering
- 🔐 JWT authentication
- 📱 Mobile-friendly interface

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Redux Toolkit
- Apollo Client
- Recharts

### Backend
- Node.js
- Express.js
- Apollo Server (GraphQL)
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Barber
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/barber_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:4000/graphql"
```

5. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run prisma:seed
```

6. Start the backend:
```bash
cd backend
npm run dev
```

7. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Credentials

### Admin
- Email: `admin@barber.com`
- Password: `admin123`

### Barber
- Email: `john@barber.com`
- Password: `barber123`

## Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.

## Project Structure

```
Barber/
├── backend/
│   ├── graphql/
│   │   ├── schema.js       # GraphQL schema
│   │   └── resolvers.js    # GraphQL resolvers
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── server.js           # Express server
├── frontend/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── store/              # Redux store
└── README.md
```

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## License

MIT
