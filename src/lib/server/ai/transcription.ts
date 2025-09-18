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

export const createTranscriptionMetadata = async (transcription: string) => {
	if (!transcription) {
		return { summary: null, actionItems: null };
	}

	const { text } = await generateText({
		model: openai("gpt-5-mini"),
		prompt: `
Analyze the following meeting transcript and provide a structured response that includes:
Summary: Write a concise, well-organized summary (2-3 paragraphs) covering the main topics, discussions, and overall outcomes. Avoid unnecessary details and keep the language professional and neutral.
Action Items & Decisions: Provide a clear, bulleted list of key action items, assignments (with responsible parties if mentioned), and any important decisions or next steps. Use direct, actionable phrasing.

Meeting Transcript:
${transcription}

Format your response as follows:

SUMMARY:
[Your 2-3 paragraph summary here]

ACTION ITEMS:
- [Action item #1]
- [Action item #2]
- [Action item #3]
`,
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
