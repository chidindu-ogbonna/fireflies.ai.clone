import { put } from "@vercel/blob";
import { logger } from "./logger";

interface UploadVideoToBlobProps {
	userId: string;
	videoFile?: Blob | null;
}

export const uploadVideoToBlob = async ({
	userId,
	videoFile,
}: UploadVideoToBlobProps): Promise<string | null> => {
	try {
		if (!videoFile || videoFile.size <= 0) {
			return null;
		}
		const filename = `meeting-${userId}-${Date.now()}.webm`;
		const videoUrl = (
			await put(filename, videoFile, {
				access: "public",
			})
		).url;
		logger.info({ videoUrl }, "Video uploaded to Vercel Blob");
		return videoUrl;
	} catch (error) {
		logger.error(error, "uploadVideoToBlob");
		return null;
	}
};
