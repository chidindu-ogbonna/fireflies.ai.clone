import type { Meeting } from "@/lib/client/meetings.client";
import prisma from "@/lib/datastore";
import {
	getSessionUserId,
	makeResponse,
	validateDataOrThrow,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { uploadVideoToBlob } from "@/lib/server/blob";
import { z } from "zod";

const MeetingSchema = z.object({
	title: z
		.string()
		.optional()
		.default(`Meeting - ${new Date().toLocaleDateString()}`),
	transcription: z.string().trim(),
	duration: z
		.string()
		.optional()
		.transform((val) => (val ? Number.parseInt(val) : undefined)),
});

export const GET = withRouterErrorHandler(
	async (_req, _context, session) => {
		const userId = getSessionUserId(session);
		const meetings = await prisma.meeting.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				createdAt: true,
				summary: true,
				actionItems: true,
				videoUrl: true,
				duration: true,
			},
		});
		return makeResponse<Meeting[]>({ data: meetings });
	},
	{ requireAuth: true },
);

export const POST = withRouterErrorHandler(
	async (req, _context, session) => {
		const userId = getSessionUserId(session);
		const formData = await req.formData();
		const { title, transcription, duration } = validateDataOrThrow({
			data: {
				title: formData.get("title") as string,
				transcription: formData.get("transcription") as string,
				duration: formData.get("duration") as string,
			},
			schema: MeetingSchema,
		});
		const videoUrl = await uploadVideoToBlob({
			userId,
			videoFile: formData.get("video") as File | null,
		});
		const meeting = await prisma.meeting.create({
			data: {
				title,
				transcription,
				videoUrl,
				duration: duration,
				userId,
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
				summary: true,
				actionItems: true,
				videoUrl: true,
				duration: true,
			},
		});
		return makeResponse<Meeting>({ data: meeting });
	},
	{ requireAuth: true },
);
