import prisma from "@/lib/datastore";
import {
	createTranscription,
	createTranscriptionMetadata,
} from "../ai/transcription";
import { uploadVideoToBlob } from "../blob";

interface CreateMeetingParams {
	userId: string;
	videoFile: File | null;
	title: string;
	transcription: string;
	duration?: number;
}

export const createMeeting = async ({
	userId,
	videoFile,
	title,
	transcription,
	duration,
}: CreateMeetingParams) => {
	const videoUrl = await uploadVideoToBlob({
		userId,
		videoFile,
	});
	let summary: string | null = null;
	let actionItems: string | null = null;
	if (videoUrl) {
		/**
		 * Create transcription from video
		 * This is more improved than the live transcription
		 */
		transcription = await createTranscription(videoUrl);
		const metadata = await createTranscriptionMetadata(transcription);
		summary = metadata.summary;
		actionItems = metadata.actionItems;
	}
	return await prisma.meeting.create({
		data: {
			title,
			transcription,
			videoUrl,
			duration,
			userId,
			summary,
			actionItems,
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
};
