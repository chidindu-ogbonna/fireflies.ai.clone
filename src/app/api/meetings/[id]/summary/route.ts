import type { Meeting } from "@/lib/client/meetings.client";
import prisma from "@/lib/datastore";
import {
	createTranscription,
	createTranscriptionMetadata,
} from "@/lib/server/ai/transcription";
import { ServerError } from "@/lib/server/api.error";
import {
	getSessionUserId,
	makeResponse,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { StatusCodes } from "http-status-codes";
import type { NextRequest } from "next/server";

export const POST = withRouterErrorHandler(
	async (_req: NextRequest, { params }, session) => {
		const meetingId = (await params).id;
		const userId = getSessionUserId(session);
		const meeting = await prisma.meeting.findFirst({
			where: { id: meetingId, userId },
		});
		if (!meeting) {
			throw new ServerError(
				`Meeting ${meetingId} not found`,
				StatusCodes.NOT_FOUND,
			);
		}
		let transcription = meeting.transcription;
		if (!transcription) {
			if (!meeting.videoUrl) {
				throw new ServerError(
					`Meeting ${meetingId} has no transcription or video URL`,
					StatusCodes.BAD_REQUEST,
				);
			}
			transcription = await createTranscription(meeting.videoUrl);
		}
		const { summary, actionItems } =
			await createTranscriptionMetadata(transcription);
		const updatedMeeting = await prisma.meeting.update({
			where: { id: meetingId },
			data: { summary, actionItems, transcription },
		});
		return makeResponse<Meeting>({ data: updatedMeeting });
	},
	{ requireAuth: true },
);
