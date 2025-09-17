import { StatusCodes } from "http-status-codes";
import type { NextApiRequest } from "next";
import { type Session, getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { ZodSchema, z } from "zod";
import { authOptions } from "../auth";
import { getErrorMessage } from "../utils";
import { ServerError } from "./api.error";
import type {
	AppRouterContext,
	AppRouterHandler,
	HandlerConfig,
	MakeResponseConfig,
} from "./api.types";

export const withRouterErrorHandler = <
	AppRouterParams extends Record<string, string> = Record<string, string>,
>(
	handler: AppRouterHandler<AppRouterParams>,
	config?: HandlerConfig,
) => {
	const { isWebhook = false, isAuthRequired = false } = config || {};
	return async (
		req: NextRequest,
		context: AppRouterContext<AppRouterParams>,
	) => {
		try {
			let session: Session | null = null;
			if (isAuthRequired) {
				session = await getServerSession(authOptions);
				if (!session) {
					return makeResponse({
						error: new ServerError("Unauthorized", StatusCodes.UNAUTHORIZED),
						isWebhook,
					});
				}
			}
			return await handler(req, context, session);
		} catch (error) {
			return makeResponse({
				error: ServerError.fromError(error, StatusCodes.INTERNAL_SERVER_ERROR),
				isWebhook,
			});
		}
	};
};

export const validateDataOrThrow = <T extends ZodSchema>(params: {
	data:
		| NextApiRequest["query"]
		| NextApiRequest["body"]
		| Record<string, unknown>;
	schema: T;
}): z.infer<T> => {
	const { success, data, error } = params.schema.safeParse(params.data);
	if (!success) {
		throw new ServerError(getErrorMessage(error), StatusCodes.BAD_REQUEST);
	}
	return data;
};

const getErrorStatusCode = (statusCode: number) => {
	return (statusCode >= 400 && statusCode < 500) ||
		(statusCode >= 500 && statusCode < 600)
		? statusCode
		: StatusCodes.INTERNAL_SERVER_ERROR;
};

export const makeResponse = async <T = object>({
	error,
	data,
	isWebhook = false,
	statusCode = StatusCodes.OK,
}: MakeResponseConfig<T>) => {
	if (error) {
		const errorMessage = getErrorMessage(error);
		if (isWebhook) {
			return NextResponse.json(data || {}, { status: StatusCodes.OK });
		}
		const errorStatusCode = getErrorStatusCode(statusCode);
		return NextResponse.json(
			{ error: errorMessage },
			{ status: errorStatusCode },
		);
	}
	return NextResponse.json(data || {}, { status: statusCode });
};

export const getSessionUserId = (session: Session | null) => {
	const userId = session?.user?.id;
	if (!userId) {
		throw new ServerError("User not authenticated", StatusCodes.UNAUTHORIZED);
	}
	return userId;
};
