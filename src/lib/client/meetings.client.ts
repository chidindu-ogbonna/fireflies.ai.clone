import { upload } from "@vercel/blob/client";
import axios from "axios";

export interface Meeting {
	id: string;
	title: string;
	createdAt: Date;
	transcription?: string | null;
	summary?: string | null;
	actionItems?: string | null;
	videoUrl?: string | null;
	duration?: number | null;
}

type CreateMeetingParams = Pick<
	Meeting,
	"title" | "transcription" | "duration"
> & {
	videoBlob?: Blob | null;
};

export const getMeetings = async () => {
	const response = await axios.get<Meeting[]>("/api/meetings");
	return response.data;
};

export const createMeeting = async (meeting: CreateMeetingParams) => {
	let videoUrl: string | null = null;

	/**
	 * Upload video directly to Vercel Blob if present
	 */
	if (meeting.videoBlob) {
		try {
			const blob = await upload(
				`du-meeting-recording-${Date.now()}.webm`,
				meeting.videoBlob,
				{
					access: "public",
					handleUploadUrl: "/api/meetings/upload",
				},
			);
			videoUrl = blob.url;
		} catch (error) {
			console.error("Error uploading video to blob:", error);
			throw new Error("Failed to upload video. Please try again.");
		}
	}

	const response = await axios.post<Meeting>(
		"/api/meetings",
		{
			title: meeting.title,
			transcription: meeting.transcription || "",
			duration: meeting.duration,
			videoUrl: videoUrl,
		},
		{ headers: { "Content-Type": "application/json" } },
	);
	return response.data;
};

export const getMeeting = async (id: string) => {
	console.log("getMeeting", id);
	const response = await axios.get<Meeting>(`/api/meetings/${id}`);
	return response.data;
};

export const createMeetingSummary = async (id: string) => {
	const response = await axios.post<Meeting>(`/api/meetings/${id}/summary`);
	return response.data;
};
