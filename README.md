# fs-blog-api - http api blog server

## Quick Start

Prerequisites:

- Node.js 18+ & npm
- Docker & Docker Compose
- PostgreSQL

### 1. Clone & Setup

```bash
git clone https://github.com/DimaChekashov/fs-blog-api
cd fs-blog-api

# Install dependencies
yarn install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

### 3. Database Setup with Docker

```bash
# Start PostgreSQL container
npm run db:up

# Check logs if needed
npm run db:logs

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

### 4. Start Development Server

```bash
# Start with hot-reload (recommended for development)
npm run dev:watch

# Or start without hot-reload
npm run dev
```

## Project Structure

```bash
src/
├── server.ts            # Main server file
├── config/              # Configuration files
├── controllers/         # Route controllers
├── routes/              # API routes
├── middleware/          # Express middleware
├── services/            # Business logic
├── repositories/        # Database access layer
├── database/
│   ├── migrations/      # Database migrations
│   ├── seeds/           # Seed data
└── utils/               # Utility functions
```
