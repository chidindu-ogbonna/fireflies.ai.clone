import type { Session } from "next-auth";
import type { NextRequest, NextResponse } from "next/server";
import type { ZodError } from "zod";

export interface MakeResponseConfig<T = object> {
	error?: Error | ZodError;
	data?: T;
	isWebhook?: boolean;
	statusCode?: number;
}

export type AppRouterContext<AppRouterParams = Record<string, string>> = {
	params: Promise<AppRouterParams>;
};

export interface HandlerConfig {
	isWebhook?: boolean;
	isAuthRequired?: boolean;
}

export type AppRouterHandler<
	AppRouterParams extends Record<string, string> = Record<string, string>,
> = (
	req: NextRequest,
	context: AppRouterContext<AppRouterParams>,
	session: Session | null,
) => Promise<NextResponse>;
