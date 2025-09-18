# promiseFlies.ai - A fireflies.ai clone

An AI meeting assistant with real-time transcription and intelligent summaries.

## Features

- **Live Video Meetings**: Record meetings with webcam and microphone access
- **Real-time Transcription**: Powered by Deepgram AI for accurate live speech-to-text
- **AI-Enhanced Summaries**: Generate intelligent meeting summaries and action items using OpenAI GPT-5-mini
- **Meeting Archive**: Store and access all your meetings with full transcripts and video recordings
- **User Authentication**: Secure JWT-based authentication with NextAuth.js
- **File Upload**: Video recording storage using Vercel Blob
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Beautiful dark mode interface with theme switching

## Tech Stack

### Frontend & Framework

- **Next.js 15**: App Router with React Server Components and Turbopack
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Full type safety throughout the application
- **Tailwind CSS 4**: Utility-first CSS framework with custom configuration

### UI & Components

- **Shadcn/ui**: Modern, accessible component library
- **Radix UI**: Headless UI primitives for complex components
- **Lucide React**: Beautiful icon library
- **Sonner**: Elegant toast notifications
- **Class Variance Authority**: Type-safe component variants

### Authentication & Security

- **NextAuth.js 4**: Authentication with JWT strategy
- **Prisma Adapter**: Database session management
- **bcryptjs**: Password hashing and verification
- **Middleware**: Route protection and session validation

### Database & ORM

- **PostgreSQL**: Primary database with connection pooling
- **Prisma 6**: Type-safe database client and migrations
- **Vercel Postgres**: Managed PostgreSQL for production

### AI & Media Processing

- **Deepgram SDK**: Real-time speech-to-text transcription
- **OpenAI SDK**: GPT-5-mini for meeting summaries and action items
- **Replicate**: Whisper model for high-quality video transcription
- **Vercel Blob**: Video file storage and CDN

### State Management & Data Fetching

- **TanStack Query 5**: Server state management with caching
- **React Context**: Client-side state for Deepgram and microphone
- **Axios**: HTTP client for API requests

### Development & Build Tools

- **ESLint 9**: Code linting with Next.js configuration
- **Pino**: Structured logging
- **Zod**: Runtime type validation and schema parsing
- **date-fns 4**: Date manipulation and formatting

## Setup Instructions

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- **PostgreSQL database** (local installation or cloud service like Vercel Postgres)
- **Deepgram API account** and API key
- **OpenAI API account** and API key
- **Replicate API account** and token (for video transcription)
- **Vercel account** (for Blob storage and deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fireflies.ai.clone
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

   > **Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility with some packages.

3. **Set up environment variables**

   Cop the `.env.example` to a `.env.local` file in the root directory.
   Create the environment variables included in the `.env.local`

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations (creates all tables)
   npx prisma migrate dev

   # Optional: Seed the database (if you have seed data)
   npx prisma db seed

   # Optional: Open Prisma Studio to view/manage data
   npx prisma studio
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

### API Keys Setup

#### Deepgram API Key (Real-time Transcription)

1. Sign up at [Deepgram Console](https://console.deepgram.com/)
2. Create a new project or use the default project
3. Navigate to **API Keys** section
4. Create a new API key with appropriate scopes
5. Copy the **Project ID** and **API Key**
6. Add both to your `.env.local` file

#### OpenAI API Key (Meeting Summaries)

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys** section
3. Create a new API key
4. Add billing information (required for API usage)
5. Add the key to your `.env.local` file

#### Replicate API Token (Video Transcription)

1. Sign up at [Replicate](https://replicate.com/)
2. Go to **Account Settings** → **API Tokens**
3. Create a new API token
4. Add it to your `.env.local` file

#### Vercel Blob Storage (Video Upload)

1. Create a [Vercel](https://vercel.com/) account
2. Go to **Storage** → **Blob**
3. Create a new Blob store
4. Generate a read/write token
5. Add it to your `.env.local` file

### Database Setup

#### Local PostgreSQL

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb fireflies_db

# Update connection string in .env.local
POSTGRES_URL="postgresql://localhost:5432/fireflies_db?schema=public"
```

#### Vercel Postgres (Production)

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Create Postgres database in Vercel dashboard
4. Copy connection strings to your environment variables
5. Run migrations: `npx prisma migrate deploy`

## Usage

### Getting Started

1. **Create Account**: Navigate to `/register` and create a new account
2. **Login**: Sign in at `/login` using your credentials
3. **Dashboard**: View your meeting history and start new meetings

### Recording a Meeting

1. **Start Meeting**: Click "Start Meeting" from the dashboard
2. **Camera/Microphone Access**: Allow browser permissions when prompted
3. **Begin Recording**: Click "Start Recording" to begin live transcription
4. **Live Features**:
   - View real-time transcription in the sidebar
   - See video preview of yourself
   - Monitor recording status indicator
5. **End Meeting**: Click "Stop Recording" to finish and save

### After Recording

1. **Automatic Processing**: Video is uploaded and processed automatically
2. **AI Summary**: GPT-5-mini generates meeting summary and action items
3. **Enhanced Transcription**: Whisper model creates improved transcription from video
4. **Review**: Access full meeting details, video playback, and transcripts

### Meeting Management

- **Dashboard View**: See all meetings with titles, dates, and summaries
- **Meeting Details**: Click any meeting to view full transcript and video
- **Search & Filter**: Find specific meetings quickly
- **Export Options**: Copy transcripts and summaries

## Project Structure

```
├── prisma/                     # Database schema and migrations
│   ├── migrations/            # Database migration files
│   └── schema.prisma         # Database schema definition
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js 15 App Router
│   │   ├── (auth)/          # Route groups for auth pages
│   │   │   ├── login/       # Login page
│   │   │   └── register/    # Registration page
│   │   ├── api/             # API routes (Route Handlers)
│   │   │   ├── auth/        # NextAuth.js endpoints
│   │   │   ├── deepgram/    # Deepgram API key management
│   │   │   └── meetings/    # Meeting CRUD operations
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── meeting/         # Live meeting recording page
│   │   ├── meetings/        # Meeting review pages
│   │   ├── globals.css      # Global styles and Tailwind
│   │   └── layout.tsx       # Root layout with providers
│   ├── components/           # React components
│   │   ├── auth/           # Login/Register forms
│   │   ├── dashboard/      # Meeting list and controls
│   │   ├── meeting/        # Video recorder, live transcript
│   │   ├── providers/      # Context providers
│   │   ├── review/         # Meeting playback components
│   │   └── ui/             # Shadcn/ui components
│   ├── lib/                 # Utility functions and services
│   │   ├── client/         # Client-side API calls
│   │   ├── server/         # Server-side utilities
│   │   │   ├── ai/         # AI transcription services
│   │   │   └── service/    # Business logic
│   │   ├── auth.ts         # NextAuth configuration
│   │   └── utils.ts        # Shared utilities
│   ├── middleware.ts        # Route protection middleware
│   └── types/              # TypeScript type definitions
├── components.json          # Shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run generate        # Generate Prisma client
npm run migrate:dev     # Run database migrations
npm run reset           # Reset database and migrations
```

## Deployment

### Vercel Deployment (Recommended)

1. **Prepare your repository**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   ```bash
   # Using Vercel CLI
   npx vercel --prod

   # Or connect via Vercel Dashboard
   # 1. Import your GitHub repository
   # 2. Configure environment variables
   # 3. Deploy automatically
   ```

3. **Environment Variables**
   Add all environment variables from `.env.local` to your Vercel project settings:
   - Database URLs (use Vercel Postgres)
   - API keys (Deepgram, OpenAI, Replicate)
   - NextAuth configuration
   - Blob storage token

4. **Database Migration**

   ```bash
   # After deployment, run migrations
   npx prisma migrate deploy
   ```

## Performance & Monitoring

- **Database**: Connection pooling with Prisma
- **Caching**: TanStack Query for client-side caching
- **Logging**: Structured logging with Pino
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Bundle Analysis**: Built-in Next.js bundle analyzer
