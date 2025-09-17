"use client";

import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { LiveTranscript } from "@/components/meeting/LiveTranscript";
import { MeetingControls } from "@/components/meeting/MeetingControls";
import { VideoTile } from "@/components/meeting/VideoTile";
import { NoUser } from "@/components/no-user/NoUser";
import {
	getDeepgramApiKey,
	getDeepgramWebSocketUrl,
} from "@/lib/client/deepgram.client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useWebSocket from "react-use-websocket";

export default function MeetingPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stream, setStream] = useState<MediaStream | null>(null);
	const { data: deepgramKey } = useQuery({
		queryKey: ["deepgram-key"],
		queryFn: getDeepgramApiKey,
		enabled: !!session,
	});

	const shouldConnectToWebSocket = Boolean(deepgramKey?.key);
	const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
		deepgramKey?.key ? getDeepgramWebSocketUrl(deepgramKey?.key) : null,
		{
			onMessage: (event) => {
				console.log("Deepgram message:", event.data);
				// getWebSocket()?.close()

				// try {
				// 	const data = JSON.parse(event.data);
				// 	if (data.channel && data.channel.alternatives) {
				// 		const transcript = data.channel.alternatives[0]?.transcript;
				// 		if (transcript && !data.is_final) {
				// 			// Handle interim results
				// 			console.log("Interim:", transcript);
				// 		} else if (transcript && data.is_final) {
				// 			// Handle final results
				// 			setTranscript((prev) => [...prev, transcript]);
				// 		}
				// 	}
				// } catch (error) {
				// 	console.error("Error parsing Deepgram message:", error);
				// }
			},
			shouldReconnect: () => shouldConnectToWebSocket,
			reconnectAttempts: 3,
			reconnectInterval: 3000,
			protocols: [],
			onOpen: () => {
				console.log("WebSocket opened");
			},
			onClose: () => {
				console.log("WebSocket closed");
			},
			onError: (error) => {
				console.error("WebSocket error:", error);
			},
		},
		shouldConnectToWebSocket,
	);

	// const {
	// 	transcript,
	// 	isRecording,
	// 	error,
	// 	startRecording,
	// 	stopRecording,
	// 	getFullTranscript,
	// 	clearTranscript,
	// } = useDeepgram(deepgramKey?.key);

	const startRecording = () => {
		console.log("Starting recording");
	};

	const stopRecording = () => {
		console.log("Stopping recording");
	};

	// const clearTranscript = () => {
	// 	console.log("Clearing transcript");
	// };

	const getFullTranscript = () => {
		console.log("Getting full transcript");
		return "";
	};

	const error = "";
	const isRecording = false;
	const transcript: string[] = [];

	// clearTranscript();

	const handleStreamReady = (mediaStream: MediaStream) => {
		setStream(mediaStream);
	};

	const handleStartRecording = () => {
		if (!stream) {
			console.error("No stream available for recording");
			return;
		}

		if (!stream.active) {
			console.error("Stream is not active");
			return;
		}

		console.log("Starting recording with stream:", {
			active: stream.active,
			audioTracks: stream.getAudioTracks().length,
			videoTracks: stream.getVideoTracks().length,
		});

		startRecording();
	};

	const handleStopRecording = () => {
		stopRecording();
	};

	const handleEndMeeting = async () => {
		if (isRecording) {
			stopRecording();
		}

		const fullTranscript = getFullTranscript();

		if (fullTranscript.trim()) {
			try {
				// Save the meeting to the database
				const response = await fetch("/api/meetings", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title: `Meeting - ${new Date().toLocaleDateString()}`,
						transcription: fullTranscript,
					}),
				});

				if (response.ok) {
					const { meetingId } = await response.json();
					router.push(`/meetings/${meetingId}`);
				} else {
					console.error("Failed to save meeting");
					router.push("/dashboard");
				}
			} catch (error) {
				console.error("Error saving meeting:", error);
				router.push("/dashboard");
			}
		} else {
			router.push("/dashboard");
		}
	};

	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (!session) {
		return <NoUser />;
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
					{/* Video Section */}
					<div className="lg:col-span-2 space-y-4">
						<div className="rounded-lg p-6">
							<h2 className="text-xl font-semibold mb-4">Live Meeting</h2>
							<VideoTile onStreamReady={handleStreamReady} />
						</div>

						{error && (
							<div className="border border-red-200 rounded-lg p-4">
								<p className="text-red-600">{error}</p>
							</div>
						)}
					</div>

					{/* Transcript Section */}
					<div className="lg:col-span-1">
						<LiveTranscript transcript={transcript} isRecording={isRecording} />
					</div>
				</div>

				{/* Meeting Controls */}
				<div className="fixed bottom-0 left-0 right-0 border-t shadow-lg">
					<MeetingControls
						onStartRecording={handleStartRecording}
						onStopRecording={handleStopRecording}
						onEndMeeting={handleEndMeeting}
						isRecording={isRecording}
					/>
				</div>
			</div>
		</div>
	);
}
