import type { Meeting } from "@/lib/client/dashboard.client";
import prisma from "@/lib/datastore";
import {
	getSessionUserId,
	makeResponse,
	validateDataOrThrow,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { z } from "zod";

const MeetingSchema = z.object({
	title: z.string().optional(),
	transcription: z.string(),
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
			},
		});
		return makeResponse<Meeting[]>({ data: meetings });
	},
	{ isAuthRequired: true },
);

export const POST = withRouterErrorHandler(
	async (req, _context, session) => {
		const userId = getSessionUserId(session);
		const { title, transcription } = validateDataOrThrow({
			data: await req.json(),
			schema: MeetingSchema,
		});
		const meeting = await prisma.meeting.create({
			data: {
				title: title || `Meeting - ${new Date().toLocaleDateString()}`,
				transcription: transcription.trim(),
				userId,
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
				summary: true,
				actionItems: true,
			},
		});
		return makeResponse<Meeting>({ data: meeting });
	},
	{ isAuthRequired: true },
);
