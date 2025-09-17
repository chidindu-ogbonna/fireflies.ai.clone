import prisma from "@/lib/datastore";
import { ServerError } from "@/lib/server/api.error";
import { makeResponse, withRouterErrorHandler } from "@/lib/server/api.utils";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { StatusCodes } from "http-status-codes";
import type { NextRequest } from "next/server";

export const POST = withRouterErrorHandler(
	async (request: NextRequest, { params }, session) => {
		const meetingId = (await params).id;
		const userId = session?.user?.id;
		const meeting = await prisma.meeting.findFirst({
			where: { id: meetingId, userId },
		});

		if (!meeting) {
			throw new ServerError("Meeting not found", StatusCodes.NOT_FOUND);
		}

		if (!meeting.transcription) {
			throw new ServerError(
				"No transcription available",
				StatusCodes.BAD_REQUEST,
			);
		}

		// Generate summary using OpenAI
		const { text } = await generateText({
			model: openai("gpt-3.5-turbo"),
			prompt: `Please analyze the following meeting transcript and provide:

1. A concise summary (2-3 paragraphs) of the main topics discussed
2. A bulleted list of key action items and decisions made

Meeting Transcript:
${meeting.transcription}

Please format your response as:

SUMMARY:
[Your summary here]

ACTION ITEMS:
[Your bulleted action items here]`,
		});

		// Parse the response to separate summary and action items
		const sections = text.split("ACTION ITEMS:");
		const summary = sections[0].replace("SUMMARY:", "").trim();
		const actionItems =
			sections[1]?.trim() || "No specific action items identified.";

		// Update the meeting with the generated summary
		await prisma.meeting.update({
			where: { id: meetingId },
			data: {
				summary,
				actionItems,
			},
		});

		return makeResponse({
			data: {
				summary,
				actionItems,
			},
		});
	},
);
