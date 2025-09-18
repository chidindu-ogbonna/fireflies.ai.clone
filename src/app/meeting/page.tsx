"use client";

import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { MeetingControls } from "@/components/meeting/MeetingControls";
import { MeetingUploadDialog } from "@/components/meeting/MeetingUploadDialog";
import { VideoRecorder } from "@/components/meeting/VideoRecorder";
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
import { Button } from "@/components/ui/button";
import { createMeeting } from "@/lib/client/meetings.client";
import type { LiveSchema } from "@deepgram/sdk";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const deepgramOptions: LiveSchema = {
	model: "nova-3",
	interim_results: true,
	smart_format: true,
	filler_words: true,
	utterance_end_ms: 3000,
};

export default function MeetingPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stream, setStream] = useState<MediaStream | null>(null);
	const {
		connection: deepgramConnection,
		connectionState: deepgramConnectionState,
		connectToDeepgram,
		disconnectFromDeepgram,
	} = useDeepgram();
	const [transcript, setTranscript] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isStartingRecording, setIsStartingRecording] = useState(false);
	const [isEndingRecording, setIsEndingRecording] = useState(false);
	const {
		setupMicrophone,
		microphone,
		startMicrophone,
		stopMicrophone,
		microphoneState,
	} = useMicrophone();
	const keepAliveInterval = useRef<NodeJS.Timeout | undefined>(undefined);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);
	const recordingStartTimeRef = useRef<number>(0);
	const [isAudioEnabled, setIsAudioEnabled] = useState(true);
	const [isVideoEnabled, setIsVideoEnabled] = useState(true);
	const [hasStartedRecording, setHasStartedRecording] = useState(false);
	const [showUploadDialog, setShowUploadDialog] = useState(false);
	const [pendingMeetingData, setPendingMeetingData] = useState<{
		videoBlob: Blob | null;
		duration: number;
	} | null>(null);
	const [currentTranscript, setCurrentTranscript] = useState<string>("");

	const createMeetingMutation = useMutation({
		mutationFn: createMeeting,
		onSuccess: (data) => {
			setShowUploadDialog(false);
			setPendingMeetingData(null);
			router.push(`/meetings/${data.id}`);
		},
		onError: (error) => {
			console.error("Error creating meeting:", error);
			toast.error("Could not save meeting, please try again.");
			setShowUploadDialog(false);
			setPendingMeetingData(null);
		},
	});

	const onTranscript = (data: LiveTranscriptionEvent) => {
		const { is_final: isFinal, speech_final: speechFinal } = data;
		const deepgramTranscript = data.channel.alternatives[0].transcript;
		setCurrentTranscript(deepgramTranscript);
		if (isFinal && speechFinal) {
			setTranscript((prev) => [...prev, deepgramTranscript]);
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
		if (!microphone) return;
		if (!deepgramConnection) return;
		if (!isRecording) return; // Only start when recording

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
	}, [deepgramConnectionState, isRecording]);

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
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}
		setIsRecording(false);
	};

	const startRecording = (stream: MediaStream) => {
		try {
			recordedChunksRef.current = [];
			recordingStartTimeRef.current = Date.now();
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm;codecs=vp9,opus",
			});
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					recordedChunksRef.current.push(event.data);
				}
			};
			mediaRecorder.onstop = () => {
				console.log("recorder stopped");
			};
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start(1000); // Record in 1-second chunks
			setIsRecording(true);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error("Could not start recording, please try again.");
		}
	};

	const handleStreamReady = useCallback((mediaStream: MediaStream) => {
		setStream(mediaStream);
	}, []);

	const handleStartRecording = async () => {
		if (isStartingRecording || isRecording) {
			/**
			 * Prevent double clicks
			 */
			return;
		}
		if (!stream) {
			console.error("No stream available for recording");
			toast.error("Camera not ready. Please wait and try again.");
			return;
		}
		if (!stream.active) {
			console.error("Stream is not active");
			toast.error("Camera stream is not active. Please refresh and try again.");
			return;
		}
		setIsStartingRecording(true);
		try {
			if (microphoneState === MicrophoneState.Ready) {
				await connectToDeepgram(deepgramOptions);
			}
			startRecording(stream);
			setHasStartedRecording(true);
			setIsPaused(false);
		} catch (error) {
			console.error("Error starting recording:", error);
			toast.error("Failed to start recording. Please try again.");
		} finally {
			setIsStartingRecording(false);
		}
	};

	const handlePauseRecording = () => {
		stopRecording();
		stopMicrophone();
		setIsPaused(true);
	};

	const handleResumeRecording = async () => {
		if (!stream) {
			console.error("No stream available for recording");
			return;
		}
		if (!stream.active) {
			console.error("Stream is not active");
			return;
		}
		if (deepgramConnectionState !== LiveConnectionState.OPEN) {
			await connectToDeepgram(deepgramOptions);
		}
		startRecording(stream);
		setIsPaused(false);
	};

	const handleEndMeeting = async () => {
		if (isEndingRecording) {
			/**
			 * Prevent double clicks
			 */
			return;
		}
		setIsEndingRecording(true);
		try {
			if (isRecording) {
				stopRecording();
				stopMicrophone();
				disconnectFromDeepgram();
			}
			setIsPaused(false);
			/**
			 * Wait a bit for the recording to finalize
			 */
			await new Promise((resolve) => setTimeout(resolve, 1000));
			let videoBlob: Blob | null = null;
			let duration = 0;
			if (recordedChunksRef.current.length > 0) {
				videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
				duration = Math.floor(
					(Date.now() - recordingStartTimeRef.current) / 1000,
				);
				setPendingMeetingData({ videoBlob, duration });
				setShowUploadDialog(true);
			} else {
				toast.error("No recording created.");
			}
		} catch (error) {
			console.error("Error ending recording:", error);
			toast.error("Failed to end recording properly. Please try again.");
		} finally {
			setIsEndingRecording(false);
		}
	};

	const handleToggleMute = () => {
		const newAudioState = !isAudioEnabled;
		if (stream) {
			const audioTracks = stream.getAudioTracks();
			for (const track of audioTracks) {
				track.enabled = newAudioState;
			}
		}
		setIsAudioEnabled(newAudioState);
	};

	const handleToggleVideo = () => {
		const newVideoState = !isVideoEnabled;
		if (stream) {
			const videoTracks = stream.getVideoTracks();
			for (const track of videoTracks) {
				track.enabled = newVideoState;
			}
		}
		setIsVideoEnabled(newVideoState);
	};

	const handleUploadMeeting = (title: string) => {
		if (!pendingMeetingData) {
			toast.error("No meeting data available");
			return;
		}
		createMeetingMutation.mutate({
			title,
			transcription: transcript.join(" "),
			videoBlob: pendingMeetingData.videoBlob,
			duration: pendingMeetingData.duration,
		});
	};

	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (!session) {
		return <NoUser />;
	}

	return (
		<div className="fixed inset-0 flex flex-col">
			<div className="absolute top-20 left-4 z-10">
				<Link href="/dashboard">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
				</Link>
			</div>

			<div className="flex-1 flex items-center justify-center p-8">
				<div className="relative w-full max-w-4xl h-full max-h-[70vh]">
					<VideoRecorder
						onStreamReady={handleStreamReady}
						isRecording={isRecording}
						currentTranscript={currentTranscript}
					/>

					<div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
						<div className="text-white text-sm font-medium">
							{session.user?.name || session.user?.email || "You"}
						</div>
					</div>

					<div className="absolute top-16 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
						<div className="text-white/70 text-xs">
							{format(new Date(), "MMM d, yyyy • h:mm a")}
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
				<div className="bg-muted backdrop-blur-sm rounded-full px-6 py-3 border border-border">
					<MeetingControls
						onStartRecording={handleStartRecording}
						onPauseRecording={handlePauseRecording}
						onResumeRecording={handleResumeRecording}
						onEndMeeting={handleEndMeeting}
						onToggleMute={handleToggleMute}
						onToggleVideo={handleToggleVideo}
						isRecording={isRecording}
						isPaused={isPaused}
						isAudioEnabled={isAudioEnabled}
						isVideoEnabled={isVideoEnabled}
						isEndMeetingEnabled={hasStartedRecording}
						isStartingRecording={isStartingRecording}
						isEndingRecording={isEndingRecording}
					/>
				</div>
			</div>

			<MeetingUploadDialog
				isOpen={showUploadDialog}
				isUploading={createMeetingMutation.isPending}
				onUpload={handleUploadMeeting}
				onOpenChange={setShowUploadDialog}
			/>
		</div>
	);
}
