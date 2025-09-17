import axios from "axios";

export interface DeepgramKey {
	id: string;
	key: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	accessToken: string;
}

export const getDeepgramApiKey = async () => {
	const response = await axios.get<DeepgramKey>("/api/deepgram");
	return response.data;
};
