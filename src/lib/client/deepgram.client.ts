import axios from "axios";

export interface DeepgramKey {
	id: string;
	key: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Deepgram query parameters interface
export interface DeepgramQueryParams {
	// Optional callback URL
	callback?: string;

	// HTTP method for callback request
	callback_method?: "POST" | "GET" | "PUT" | "DELETE";

	// Number of channels in the submitted audio
	channels?: string;

	// Recognize speaker changes
	diarize?: boolean;

	// Identify and extract key entities from content
	dictation?: "true" | "false";

	// Expected encoding of submitted audio
	encoding?:
		| "linear16"
		| "flac"
		| "mulaw"
		| "alaw"
		| "ogg-opus"
		| "ogg-vorbis"
		| "wav"
		| "webm";

	// Endpointing timeout in milliseconds or false to disable
	endpointing?: string | false;

	// Arbitrary key-value pairs for downstream processing
	extra?: string;

	// Include filler words like "uh" and "um"
	filler_words?: "true" | "false";

	// Provide ongoing transcription updates
	interim_results?: "true" | "false";

	// Key term prompting for specialized terminology (Nova-3 only)
	keyterm?: string[];

	// Keywords to boost or suppress terminology
	keywords?: string;

	// BCP-47 language tag
	language?: string;

	// Opt out of Model Improvement Program
	mip_opt_out?: string;

	// AI model to use for transcription
	model?:
		| "nova-3"
		| "nova-3-general"
		| "nova-3-medical"
		| "nova-2"
		| "nova-2-general"
		| "nova-2-meeting"
		| "nova-2-finance"
		| "nova-2-conversationalai"
		| "nova-2-voicemail"
		| "nova-2-video"
		| "nova-2-medical"
		| "nova-2-drivethru"
		| "nova-2-automotive"
		| "nova"
		| "nova-general"
		| "nova-phonecall"
		| "nova-medical"
		| "enhanced"
		| "enhanced-general"
		| "enhanced-meeting"
		| "enhanced-phonecall"
		| "enhanced-finance"
		| "base"
		| "meeting"
		| "phonecall"
		| "finance"
		| "conversationalai"
		| "voicemail"
		| "video"
		| "custom";

	// Transcribe each audio channel independently
	multichannel?: "true" | "false";

	// Convert numbers to numerical format
	numerals?: "true" | "false";

	// Filter profanity from transcript
	profanity_filter?: "true" | "false";

	// Add punctuation and capitalization
	punctuate?: "true" | "false";

	// Redact sensitive information
	redact?: "pci" | "numbers" | "ssn" | "pii" | "true" | "false";

	// Replace terms or phrases in audio
	replace?: string;

	// Sample rate of submitted audio
	sample_rate?: string;

	// Search for terms or phrases in audio
	search?: string;

	// Apply smart formatting to improve readability
	smart_format?: "true" | "false";

	// Label requests for usage reporting
	tag?: string;

	// Timeout for UtteranceEnd message
	utterance_end_ms?: string;

	// Enable voice activity detection events
	vad_events?: "true" | "false";

	// Version of AI model to use
	version?: string;
}

export const getDeepgramApiKey = async () => {
	const response = await axios.get<DeepgramKey>("/api/deepgram");
	return response.data;
};

export const getDeepgramWebSocketUrl = (apiKey: string) => {
	const defaultParams = {
		model: "nova-2",
		language: "en",
		smart_format: "true",
		interim_results: "true",
	};
	const params = new URLSearchParams(defaultParams);
	params.set("Authorization", `token ${apiKey}`);
	const websocketUrl = process.env.NEXT_PUBLIC_DEEPGRAM_WEBSOCKET_URL;
	return `${websocketUrl}?${params.toString()}`;
};
