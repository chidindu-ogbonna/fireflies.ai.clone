"use client";

import { Spinner } from "@/components/ui/spinners";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VideoRecorderProps {
	onStreamReady?: (stream: MediaStream) => void;
	isRecording?: boolean;
	currentTranscript?: string;
}

export function VideoRecorder({
	onStreamReady,
	isRecording,
	currentTranscript,
}: VideoRecorderProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const onStreamReadyRef =
		useRef<VideoRecorderProps["onStreamReady"]>(onStreamReady);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * Keep latest callback without triggering start/stop cycle
	 */
	useEffect(() => {
		onStreamReadyRef.current = onStreamReady;
	}, [onStreamReady]);

	useEffect(() => {
		const startCamera = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				streamRef.current = mediaStream;
				setStream(mediaStream);
				setIsLoading(false);
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}
				if (onStreamReadyRef.current) {
					onStreamReadyRef.current(mediaStream);
				}
			} catch (err) {
				setIsLoading(false);
				toast.error("Failed to access camera and microphone");
				console.error("Error accessing media devices:", err);
			}
		};

		startCamera();

		return () => {
			/**
			 * Cleanup the current stream when effect re-runs or component unmounts
			 */
			if (streamRef.current) {
				for (const track of streamRef.current.getTracks()) {
					track.stop();
				}
				streamRef.current = null;
			}
		};
	}, []);

	return (
		<div className="rounded-lg p-6">
			<div className="flex items-center justify-between mb-2">
				<div />
				<div className="flex items-center">
					<div
						className={cn(
							"flex items-center text-destructive gap-2 text-sm",
							isRecording ? "opacity-100" : "opacity-0",
						)}
					>
						<div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
						Recording
					</div>
				</div>
			</div>
			<div className="relative w-full calc(100vh - 200px) bg-transparent rounded-lg overflow-hidden">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center rounded-lg">
						<Spinner size={8} className="text-primary" />
					</div>
				)}
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="w-full h-full object-cover"
				/>

				{currentTranscript && isRecording && (
					<div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-h-24 overflow-hidden">
						<div className="text-white text-xs leading-relaxed">
							{currentTranscript}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
