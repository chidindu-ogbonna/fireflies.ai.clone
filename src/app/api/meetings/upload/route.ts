import { authOptions } from "@/lib/auth";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
	const body = (await request.json()) as HandleUploadBody;
	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (
				pathname: string,
				/* clientPayload?: string, */
			) => {
				/**
				 * Generate a client token for the browser to upload the file
				 * Authenticate users before generating the token.
				 * Otherwise, you're allowing anonymous uploads.
				 */
				const session = await getServerSession(authOptions);
				if (!session?.user?.id) {
					throw new Error("Not authorized");
				}

				return {
					allowedContentTypes: [
						"video/webm",
						"video/mp4",
						"video/avi",
						"video/mov",
					],
					tokenPayload: JSON.stringify({
						// optional, sent to your server on upload completion
						userId: session.user.id,
					}),
				};
			},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400 }, // The webhook will retry 5 times waiting for a 200
		);
	}
}
