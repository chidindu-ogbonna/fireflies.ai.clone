# Fireflies.ai Clone

An AI-powered meeting assistant with real-time transcription and intelligent summaries.

## Features

- **Live Video Meetings**: Record meetings with webcam and microphone
- **Real-time Transcription**: Powered by Deepgram AI for accurate transcriptions
- **AI Summaries**: Generate intelligent meeting summaries and action items using OpenAI
- **Meeting Archive**: Store and access all your meetings in one place
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **AI Services**:
  - Deepgram for real-time speech-to-text
  - OpenAI GPT-5-0 for meeting summaries
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Deepgram API key
- OpenAI API key

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

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/fireflies_db?schema=public"
   POSTGRES_URL_NON_POOLING="postgresql://username:password@localhost:5432/fireflies_db?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Deepgram
   DEEPGRAM_API_KEY="your-deepgram-api-key"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name "initial migration"

   # Optional: Open Prisma Studio to view data
   npx prisma studio
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### API Keys Setup

#### Deepgram API Key

1. Sign up at [Deepgram](https://deepgram.com/)
2. Create a new project
3. Generate an API key
4. Add it to your `.env.local` file

#### OpenAI API Key

1. Sign up at [OpenAI](https://openai.com/)
2. Go to API Keys section
3. Create a new API key
4. Add it to your `.env.local` file

### Database Setup (Vercel Postgres)

For production deployment with Vercel:

1. Create a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Create a new Postgres database in Vercel dashboard
4. Copy the connection strings to your environment variables

## Usage

1. **Register an account** at `/register`
2. **Login** at `/login`
3. **Start a meeting** from the dashboard
4. **Allow camera/microphone access** when prompted
5. **Click "Start Recording"** to begin transcription
6. **End the meeting** to save and generate AI summary
7. **View meeting details** from the dashboard

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── meeting/           # Live meeting page
│   └── meetings/          # Meeting review pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── meeting/          # Meeting components
│   ├── review/           # Meeting review components
│   └── ui/               # UI components (Shadcn)
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## Deployment

The app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
