import { withRouterErrorHandler } from "@/lib/server/api.utils";
import { type NextRequest, NextResponse } from "next/server";

export const GET = withRouterErrorHandler(
	async (request: NextRequest) => {
		const apiKey = process.env.DEEPGRAM_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "Deepgram API key not configured" },
				{ status: 500 },
			);
		}
		// Return the API key for client-side use
		// In production, you might want to create a temporary key instead
		return NextResponse.json({ apiKey });
	},
	{
		isAuthRequired: true,
	},
);
