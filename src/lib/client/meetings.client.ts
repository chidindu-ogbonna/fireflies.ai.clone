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
	const formData = new FormData();
	formData.append("title", meeting.title);
	formData.append("transcription", meeting.transcription || "");

	if (meeting.duration) {
		formData.append("duration", meeting.duration.toString());
	}

	if (meeting.videoBlob) {
		formData.append("video", meeting.videoBlob, "meeting-recording.webm");
	}

	const response = await axios.post<Meeting>("/api/meetings", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
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
