import type { Meeting } from "@/lib/client/meetings.client";
import prisma from "@/lib/datastore";
import {
	getSessionUserId,
	makeResponse,
	validateDataOrThrow,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { createMeeting } from "@/lib/server/service/meetings.service";
import { z } from "zod";

const MeetingSchema = z.object({
	title: z
		.string()
		.optional()
		.default(`Meeting - ${new Date().toLocaleDateString()}`),
	transcription: z.string().trim(),
	duration: z.number().optional(),
	videoUrl: z.string().url().optional().nullable(),
});

const FormDataMeetingSchema = z.object({
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
		const contentType = req.headers.get("content-type") || "";

		/**
		 * Handle legacy form data uploads
		 */
		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			const { title, transcription, duration } = validateDataOrThrow({
				data: {
					title: formData.get("title") as string,
					transcription: formData.get("transcription") as string,
					duration: formData.get("duration") as string,
				},
				schema: FormDataMeetingSchema,
			});
			const meeting = await createMeeting({
				userId,
				videoFile: formData.get("video") as File | null,
				title,
				transcription,
				duration,
				videoUrl: null,
			});
			return makeResponse<Meeting>({ data: meeting });
		}
		const body = await req.json();
		const { title, transcription, duration, videoUrl } = validateDataOrThrow({
			data: body,
			schema: MeetingSchema,
		});
		const meeting = await createMeeting({
			userId,
			videoFile: null,
			title,
			transcription,
			duration,
			videoUrl,
		});
		return makeResponse<Meeting>({ data: meeting });
	},
	{ requireAuth: true },
);
