import type { DeepgramKey } from "@/lib/client/deepgram.client";
import prisma from "@/lib/datastore";
import { ServerError } from "@/lib/server/api.error";
import {
	getSessionUserId,
	makeResponse,
	withRouterErrorHandler,
} from "@/lib/server/api.utils";
import { createClient } from "@deepgram/sdk";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

interface AccessTokenResponse {
	access_token: string;
	expires_in: number;
}

const getAccessToken = async (apiKey: string) => {
	const response = await axios.post<AccessTokenResponse>(
		"https://api.deepgram.com/v1/auth/grant",
		{},
		{
			headers: {
				Authorization: `Token ${apiKey}`,
				"Content-Type": "application/json",
			},
		},
	);
	return response.data.access_token;
};

const returnDeepgramKeyWithAccessToken = async (
	deepgramKey: Omit<DeepgramKey, "accessToken">,
) => {
	const accessToken = await getAccessToken(deepgramKey.key);
	return makeResponse<DeepgramKey>({ data: { ...deepgramKey, accessToken } });
};

/**
 * This route is used to get the Deepgram API key for the user.
 * If the user already has a Deepgram API key, it will return the existing key.
 * If the user does not have a Deepgram API key, it will create a new key and return it.
 * The key will be valid for 1 hour.
 */
export const GET = withRouterErrorHandler(
	async (_req, _context, session) => {
		const userId = getSessionUserId(session);
		const existingDeepgramKey = await prisma.deepgramKey.findFirst({
			where: { userId },
		});
		if (existingDeepgramKey) {
			const isExpired = existingDeepgramKey.expiresAt < new Date(Date.now());
			if (isExpired) {
				await prisma.deepgramKey.delete({
					where: { id: existingDeepgramKey.id },
				});
			} else {
				return returnDeepgramKeyWithAccessToken(existingDeepgramKey);
			}
		}
		const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
		const projectId = process.env.DEEPGRAM_PROJECT_ID as string;
		const expirationDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
		const { result, error } = await deepgram.manage.createProjectKey(
			projectId,
			{
				expiration_date: expirationDate,
				comment: `Temp key for userId: ${userId}`,
				scopes: ["member"],
			},
		);
		if (error) {
			throw new ServerError(
				`${error.name} ${error.message}`,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		const deepgramKey = await prisma.deepgramKey.create({
			data: {
				key: result.key,
				expiresAt: expirationDate,
				externalId: result.api_key_id,
				userId,
			},
		});
		return returnDeepgramKeyWithAccessToken(deepgramKey);
	},
	{ requireAuth: true },
);
