import type { Meeting } from "@/lib/client/dashboard.client";
import prisma from "@/lib/datastore";
import { ServerError } from "@/lib/server/api.error";
import {
	getSessionUserId,
	makeResponse,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { StatusCodes } from "http-status-codes";

export const GET = withRouterErrorHandler(
	async (_req, { params }, session) => {
		const meetingId = (await params).id;
		const userId = getSessionUserId(session);
		const meeting = await prisma.meeting.findFirst({
			where: { id: meetingId, userId },
			select: {
				id: true,
				title: true,
				createdAt: true,
				transcription: true,
				summary: true,
				actionItems: true,
			},
		});
		if (!meeting) {
			throw new ServerError(
				`Meeting ${meetingId} not found`,
				StatusCodes.NOT_FOUND,
			);
		}
		return makeResponse<Meeting>({ data: meeting });
	},
	{ isAuthRequired: true },
);
