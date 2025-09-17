"use client";

import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { LiveTranscript } from "@/components/meeting/LiveTranscript";
import { MeetingControls } from "@/components/meeting/MeetingControls";
import { VideoTile } from "@/components/meeting/VideoTile";
import { NoUser } from "@/components/no-user/NoUser";
import {
	LiveConnectionState,
	type LiveTranscriptionEvent,
	LiveTranscriptionEvents,
	useDeepgram,
} from "@/components/providers/DeepgramProvider";
import {
	MicrophoneEvents,
	MicrophoneState,
	useMicrophone,
} from "@/components/providers/MicrophoneProvider";
import { createMeeting } from "@/lib/client/meetings.client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MeetingPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stream, setStream] = useState<MediaStream | null>(null);
	const {
		connection: deepgramConnection,
		connectionState: deepgramConnectionState,
		connectToDeepgram,
	} = useDeepgram();
	const [transcript, setTranscript] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const { setupMicrophone, microphone, startMicrophone, microphoneState } =
		useMicrophone();
	const keepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);
	const recordingStartTimeRef = useRef<number>(0);

	const createMeetingMutation = useMutation({
		mutationFn: createMeeting,
		onSuccess: (data) => {
			router.push(`/meetings/${data.id}`);
		},
		onError: (error) => {
			console.error("Error creating meeting:", error);
		},
	});

	const onTranscript = (data: LiveTranscriptionEvent) => {
		const { is_final: isFinal, speech_final: speechFinal } = data;
		const thisCaption = data.channel.alternatives[0].transcript;
		if (isFinal && speechFinal) {
			setTranscript((prev) => [...prev, thisCaption]);
		}
	};

	const onData = (e: BlobEvent) => {
		/**
		 * iOS SAFARI FIX:
		 * Prevent packetZero from being sent. If sent at size 0, the connection will close.
		 */
		if (e.data.size > 0) {
			deepgramConnection?.send(e.data);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setupMicrophone();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (microphoneState === MicrophoneState.Ready) {
			connectToDeepgram({
				model: "nova-3",
				interim_results: true,
				smart_format: true,
				filler_words: true,
				utterance_end_ms: 3000,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [microphoneState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!microphone) return;
		if (!deepgramConnection) return;

		const handleConnectionOpen = () => {
			deepgramConnection.addListener(
				LiveTranscriptionEvents.Transcript,
				onTranscript,
			);
			microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
			startMicrophone();
		};

		const handleConnectionClose = () => {
			deepgramConnection.removeListener(
				LiveTranscriptionEvents.Transcript,
				onTranscript,
			);
			microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
		};

		if (deepgramConnectionState === LiveConnectionState.OPEN) {
			handleConnectionOpen();
		}
		return () => {
			handleConnectionClose();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deepgramConnectionState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!deepgramConnection) return;

		if (
			microphoneState !== MicrophoneState.Open &&
			deepgramConnectionState === LiveConnectionState.OPEN
		) {
			deepgramConnection.keepAlive();
			keepAliveInterval.current = setInterval(() => {
				deepgramConnection.keepAlive();
			}, 10000);
		} else {
			clearInterval(keepAliveInterval.current);
		}

		return () => {
			clearInterval(keepAliveInterval.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [microphoneState, deepgramConnectionState]);

	const stopRecording = () => {
		console.log("Stopping recording");
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}
		setIsRecording(false);
	};

	const startRecording = (stream: MediaStream) => {
		console.log("Starting recording with stream:", {
			active: stream.active,
			audioTracks: stream.getAudioTracks().length,
			videoTracks: stream.getVideoTracks().length,
		});

		try {
			// Clear previous recording
			recordedChunksRef.current = [];
			recordingStartTimeRef.current = Date.now();

			// Create MediaRecorder
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm;codecs=vp9,opus",
			});

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				console.log(
					"MediaRecorder stopped, chunks:",
					recordedChunksRef.current.length,
				);
			};

			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start(1000); // Record in 1-second chunks
			setIsRecording(true);
		} catch (error) {
			console.error("Error starting recording:", error);
		}
	};

	const error = "";

	const handleStreamReady = useCallback((mediaStream: MediaStream) => {
		setStream(mediaStream);
	}, []);

	const handleStartRecording = () => {
		if (!stream) {
			console.error("No stream available for recording");
			return;
		}
		if (!stream.active) {
			console.error("Stream is not active");
			return;
		}
		startRecording(stream);
	};

	const handleStopRecording = () => {
		stopRecording();
	};

	const handleEndMeeting = async () => {
		if (isRecording) {
			stopRecording();
		}

		// Wait a bit for the recording to finalize
		await new Promise((resolve) => setTimeout(resolve, 1000));

		let videoBlob: Blob | null = null;
		let duration = 0;

		if (recordedChunksRef.current.length > 0) {
			videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
			duration = Math.floor(
				(Date.now() - recordingStartTimeRef.current) / 1000,
			);
			console.log(
				"Created video blob:",
				videoBlob.size,
				"bytes, duration:",
				duration,
				"seconds",
			);
		}

		createMeetingMutation.mutate({
			title: `Meeting - ${new Date().toLocaleDateString()}`,
			transcription: transcript.join(" "),
			videoBlob,
			duration,
		});
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
					<div className="lg:col-span-2 space-y-4">
						<div className="rounded-lg p-6">
							<h2 className="text-lg font-semibold mb-4">Meeting</h2>
							<div className="relative">
								<VideoTile onStreamReady={handleStreamReady} />
							</div>
						</div>
						{error && (
							<div className="border border-red-200 rounded-lg p-4">
								<p className="text-red-600">{error}</p>
							</div>
						)}
					</div>

					<div className="lg:col-span-1">
						<LiveTranscript transcript={transcript} isRecording={isRecording} />
					</div>
				</div>

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
