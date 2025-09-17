import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import Replicate from "replicate";
import { logger } from "../logger";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

interface ReplicateWhisperOutput {
	detected_language: string;
	segments: Record<string, unknown>[];
	transcription: string;
	translation: string | null;
}

export const createTranscriptionSummary = async (transcription: string) => {
	const { text } = await generateText({
		model: openai("gpt-4o-mini"),
		prompt: `
Please analyze the following meeting transcript and provide:
1. A concise summary (2-3 paragraphs) of the main topics discussed
2. A bulleted list of key action items and decisions made

Meeting Transcript:
${transcription}

Please format your response as:

SUMMARY:
[Your summary here]

ACTION ITEMS:
[Your bulleted action items here]`,
	});
	const sections = text.split("ACTION ITEMS:");
	const summary = sections[0].replace("SUMMARY:", "").trim();
	const actionItems =
		sections[1]?.trim() || "No specific action items identified.";
	return { summary, actionItems };
};

export const createTranscription = async (url: string) => {
	try {
		const output = (await replicate.run(
			process.env.REPLICATE_WHISPER_MODEL as `${string}/${string}`,
			{
				input: {
					audio: url,
					language: "auto",
					translate: false,
					temperature: 0,
					transcription: "plain text",
					suppress_tokens: "-1",
					logprob_threshold: -1,
					no_speech_threshold: 0.6,
					condition_on_previous_text: true,
					compression_ratio_threshold: 2.4,
					temperature_increment_on_fallback: 0.2,
				},
			},
		)) as ReplicateWhisperOutput;
		return output?.transcription ?? "";
	} catch (error) {
		logger.error(error);
		return "";
	}
};
