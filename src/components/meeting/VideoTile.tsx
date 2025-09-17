"use client";

import { useEffect, useRef, useState } from "react";

interface VideoTileProps {
	onStreamReady?: (stream: MediaStream) => void;
}

export function VideoTile({ onStreamReady }: VideoTileProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const startCamera = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});

				setStream(mediaStream);
				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
				}

				if (onStreamReady) {
					onStreamReady(mediaStream);
				}
			} catch (err) {
				setError("Failed to access camera and microphone");
				console.error("Error accessing media devices:", err);
			}
		};

		startCamera();

		return () => {
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}
		};
	}, [onStreamReady, stream]);

	if (error) {
		return (
			<div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="relative w-full calc(100vh - 200px) bg-black rounded-lg overflow-hidden">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className="w-full h-full object-cover"
			/>
		</div>
	);
}
