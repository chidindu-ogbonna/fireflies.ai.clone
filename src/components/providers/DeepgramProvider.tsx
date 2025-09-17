"use client";

import { getDeepgramApiKey } from "@/lib/client/deepgram.client";
import {
	type LiveClient,
	LiveConnectionState,
	type LiveSchema,
	type LiveTranscriptionEvent,
	LiveTranscriptionEvents,
	createClient,
} from "@deepgram/sdk";

import {
	type FunctionComponent,
	type ReactNode,
	createContext,
	useContext,
	useState,
} from "react";

interface DeepgramContextType {
	connection: LiveClient | null;
	connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
	disconnectFromDeepgram: () => void;
	connectionState: LiveConnectionState;
	isConnecting: boolean;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(
	undefined,
);

interface DeepgramContextProviderProps {
	children: ReactNode;
}

const DeepgramContextProvider: FunctionComponent<
	DeepgramContextProviderProps
> = ({ children }) => {
	const [connection, setConnection] = useState<LiveClient | null>(null);
	const [connectionState, setConnectionState] = useState<LiveConnectionState>(
		LiveConnectionState.CLOSED,
	);
	const [isConnecting, setIsConnecting] = useState(false);

	/**
	 * Connects to the Deepgram speech recognition service and sets up a live transcription session.
	 *
	 * @param options - The configuration options for the live transcription session.
	 * @param endpoint - The optional endpoint URL for the Deepgram service.
	 * @returns A Promise that resolves when the connection is established.
	 */
	const connectToDeepgram = async (options: LiveSchema, endpoint?: string) => {
		// Prevent multiple simultaneous connections
		if (isConnecting || connectionState === LiveConnectionState.OPEN) {
			console.log("Already connecting or connected to Deepgram");
			return;
		}
		// Disconnect existing connection first
		if (connection) {
			console.log("Disconnecting existing connection");
			await disconnectFromDeepgram();
		}
		setIsConnecting(true);
		setConnectionState(LiveConnectionState.CONNECTING);
		try {
			const deepgramKey = await getDeepgramApiKey();
			const deepgram = createClient({ accessToken: deepgramKey.accessToken });
			const conn = deepgram.listen.live(options, endpoint);
			// Set up event listeners before setting the connection
			conn.addListener(LiveTranscriptionEvents.Open, () => {
				console.log("Deepgram connection opened");
				setConnectionState(LiveConnectionState.OPEN);
				setIsConnecting(false);
			});

			conn.addListener(LiveTranscriptionEvents.Close, () => {
				console.log("Deepgram connection closed");
				setConnectionState(LiveConnectionState.CLOSED);
				setIsConnecting(false);
			});

			conn.addListener(LiveTranscriptionEvents.Error, (error) => {
				console.error("Deepgram connection error:", error);
				setConnectionState(LiveConnectionState.CLOSED);
				setIsConnecting(false);
			});
			setConnection(conn);
		} catch (error) {
			console.error("Failed to connect to Deepgram:", error);
			setConnectionState(LiveConnectionState.CLOSED);
			setIsConnecting(false);
		}
	};

	const disconnectFromDeepgram = async () => {
		if (connection) {
			console.log("Disconnecting from Deepgram");
			connection.finish();
			setConnection(null);
			setConnectionState(LiveConnectionState.CLOSED);
			setIsConnecting(false);
		}
	};

	return (
		<DeepgramContext.Provider
			value={{
				connection,
				connectToDeepgram,
				disconnectFromDeepgram,
				connectionState,
				isConnecting,
			}}
		>
			{children}
		</DeepgramContext.Provider>
	);
};

function useDeepgram(): DeepgramContextType {
	const context = useContext(DeepgramContext);
	if (context === undefined) {
		throw new Error(
			"useDeepgram must be used within a DeepgramContextProvider",
		);
	}
	return context;
}

export {
	DeepgramContextProvider,
	LiveConnectionState,
	LiveTranscriptionEvents,
	useDeepgram,
	type LiveTranscriptionEvent,
};
