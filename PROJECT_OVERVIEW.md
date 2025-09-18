# promiseFlies.ai ( Fireflies.ai Clone )

## Application Description

The application enables users to record video meetings with real-time transcription, automatic AI-generated summaries, and meeting management.

### Core Features

- **Live Video Meetings**: Real-time video recording with webcam and microphone access
- **Real-time Transcription**: Live speech-to-text during meetings using Deepgram AI
- **AI-Enhanced Summaries**: Intelligent meeting summaries and action items via OpenAI GPT-4-mini
- **Meeting Archive**: Complete meeting history with searchable transcripts and video playback
- **Secure Authentication**: JWT-based user authentication with NextAuth.js

## Components

### 1. Real-time Audio Transcription ( Deepgram )

WebSocket-based live transcription with temporary API key management.
Provides instant feedback during meetings while maintaining security through key rotation and user isolation.

- **Temporary API Keys**: Server generates 1-hour Deepgram keys for enhanced security
- **User Isolation**: Each user receives their own temporary key to prevent cross-user access
- **Connection Management**: React Context provider handles WebSocket lifecycle and reconnection
- **Real-time Feedback**: Immediate transcription display during recording for user engagement

```typescript
// Security-first approach with temporary keys
const connectToDeepgram = async (options: LiveSchema) => {
  const deepgramKey = await getDeepgramApiKey(); // 1-hour expiration
  const deepgram = createClient({ accessToken: deepgramKey.accessToken });
  const connection = deepgram.listen.live(options);
};
```

### 2. Summary & Action Items Generation ( GPT-5 mini )

Post-processing pipeline using GPT-5 mini for structured meeting analysis.
Delivers consistent, actionable meeting insights while optimizing AI service costs.

**Key Design Decisions**:

- **Structured Prompting**: Consistent format for summaries and action items extraction
- **Post-processing Approach**: AI analysis occurs after meeting completion for accuracy
- **Cost Optimization**: Uses GPT-4-mini for balance between quality and cost efficiency
- **Parsing Strategy**: Automated parsing of AI responses into structured database fields

```typescript
const createTranscriptionMetadata = async (transcription: string) => {
  const { text } = await generateText({
    model: openai("gpt-4-mini"),
    prompt: `Analyze meeting transcript and provide:
    Summary: 2-3 paragraph overview
    Action Items: Bulleted list of decisions and tasks`
  });
};
```

### 3. Accurate Meeting Transcription - ( Open AI Whisper )

- Post-processing Transcription using the OpenAI Whisper model
- High-quality final transcription
- Higher accuracy with context understanding
- This approach enables us provide immediate user feedback while ensuring high-quality final transcripts for analysis.

**Processing Flow**:

```txt
Recording → Live Deepgram → Real-time Display
    ↓
Video File → Whisper Processing → Final Transcript → AI Summary
```

### 4. Video Recording Flow

**Architecture Choice**: Browser-native recording with cloud storage and processing pipeline.

**Recording Pipeline**:

1. **Media Stream Acquisition**: WebRTC getUserMedia for camera/microphone access
2. **Live Processing**: Simultaneous video preview and audio streaming to Deepgram
3. **Recording Storage**: MediaRecorder API creates WebM files locally
4. **Upload Process**: Automatic upload to Vercel Blob storage upon completion
5. **Background Processing**: Asynchronous Whisper transcription and AI summary generation

```typescript
const VideoRecorder = ({ onStreamReady, isRecording }) => {
  useEffect(() => {
    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      onStreamReady(mediaStream); // Enable live transcription
    };
  }, []);
};
```

**Key Design Decisions**:

- **Browser-native Recording**: No external plugins required, cross-platform compatibility
- **Parallel Processing**: Live transcription and video recording occur simultaneously
- **Efficient Format**: WebM format for optimal file size and quality balance
- **Asynchronous Pipeline**: Non-blocking background processing for better user experience
- **Error Handling**: Graceful permission handling and connection failure recovery

**Benefits**: Seamless user experience with professional-grade recording capabilities and robust error handling.

## Stack

**Frontend**: Next.js 15 with React 19 provides cutting-edge performance and developer experience
**Database**: PostgreSQL with Prisma ensures type safety and efficient queries
**AI Services**: Best-in-class providers (Deepgram, OpenAI, Replicate) for specialized tasks
**Authentication**: NextAuth.js provides secure, production-ready user management
**Deployment**: Vercel platform offers seamless scaling and global distribution
