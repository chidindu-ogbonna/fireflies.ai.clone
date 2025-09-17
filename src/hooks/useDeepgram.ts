"use client";

import { useEffect, useRef, useState } from "react";

export function useDeepgram() {
	const [transcript, setTranscript] = useState<string[]>([]);
	const [isRecording, setIsRecording] = useState(false);
	const [error, setError] = useState<string>("");

	const websocketRef = useRef<WebSocket | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const startRecording = async (stream: MediaStream) => {
		try {
			setError("");

			// Get Deepgram API key from our API route
			const response = await fetch("/api/deepgram");
			if (!response.ok) {
				throw new Error("Failed to get API key");
			}

			const { apiKey } = await response.json();

			// Create WebSocket connection to Deepgram
			const websocket = new WebSocket(
				`wss://api.deepgram.com/v1/listen?${new URLSearchParams({
					model: "nova-2",
					language: "en",
					smart_format: "true",
					interim_results: "true",
				}).toString()}`,
				["token", apiKey],
			);

			websocketRef.current = websocket;
			streamRef.current = stream;

			websocket.onopen = () => {
				console.log("Deepgram WebSocket connected");

				// Start recording audio
				const mediaRecorder = new MediaRecorder(stream, {
					mimeType: "audio/webm;codecs=opus",
				});

				mediaRecorderRef.current = mediaRecorder;

				mediaRecorder.ondataavailable = (event) => {
					if (event.data.size > 0 && websocket.readyState === WebSocket.OPEN) {
						websocket.send(event.data);
					}
				};

				mediaRecorder.start(250); // Send data every 250ms
				setIsRecording(true);
			};

			websocket.onmessage = (message) => {
				const data = JSON.parse(message.data);

				if (data.channel?.alternatives?.[0]?.transcript) {
					const transcriptText = data.channel.alternatives[0].transcript;

					if (transcriptText.trim() && data.is_final) {
						setTranscript((prev) => [...prev, transcriptText]);
					}
				}
			};

			websocket.onerror = (error) => {
				console.error("Deepgram WebSocket error:", error);
				setError("Transcription service error");
			};

			websocket.onclose = () => {
				console.log("Deepgram WebSocket closed");
				setIsRecording(false);
			};
		} catch (err) {
			console.error("Error starting recording:", err);
			setError("Failed to start recording");
		}
	};

	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
		}

		if (
			websocketRef.current &&
			websocketRef.current.readyState === WebSocket.OPEN
		) {
			websocketRef.current.close();
		}

		setIsRecording(false);
	};

	const getFullTranscript = () => {
		return transcript.join(" ");
	};

	const clearTranscript = () => {
		setTranscript([]);
	};

	// Cleanup on unmount
	// biome-ignore lint/correctness/useExhaustiveDependencies: stopRecording is not a dependency
	useEffect(() => {
		return () => {
			stopRecording();
		};
	}, []);

	return {
		transcript,
		isRecording,
		error,
		startRecording,
		stopRecording,
		getFullTranscript,
		clearTranscript,
	};
}
