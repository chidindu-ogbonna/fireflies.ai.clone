import axios from "axios";

export interface Meeting {
	id: string;
	title: string;
	createdAt: Date;
	transcription?: string | null;
	summary?: string | null;
	actionItems?: string | null;
}

export const getMeetings = async () => {
	const response = await axios.get<Meeting[]>("/api/meetings");
	return response.data;
};

export const createMeeting = async (meeting: Meeting) => {
	const response = await axios.post<Meeting>("/api/meetings", meeting);
	return response.data;
};

export const getMeeting = async (id: string) => {
	const response = await axios.get<Meeting>(`/api/meetings/${id}`);
	return response.data;
};
