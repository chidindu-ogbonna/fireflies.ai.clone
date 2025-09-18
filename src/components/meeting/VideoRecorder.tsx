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
		<div className="relative w-full h-full">
			<div className="absolute top-4 right-4 z-10">
				<div
					className={cn(
						"flex items-center gap-2 text-sm bg-red-600 text-white px-3 py-1 rounded-full transition-opacity",
						isRecording ? "opacity-100" : "opacity-0",
					)}
				>
					<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
					REC
				</div>
			</div>

			<div className="relative w-full h-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-800">
						<div className="text-center">
							<Spinner size={8} className="text-white mb-4" />
							<p className="text-white/70 text-sm">Connecting to camera...</p>
						</div>
					</div>
				)}
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="w-full h-full object-cover"
				/>

				{isRecording && (
					<div className="absolute bottom-6 left-6 right-6">
						<div className="bg-muted/80 backdrop-blur-sm/50 rounded-lg p-2 border border-border">
							<div className="flex items-center gap-2">
								<span
									className={"animate-pulse text-2xl text-muted-foreground"}
								>
									•
								</span>
								<div className="text-white text-sm overflow-hidden">
									{currentTranscript}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
