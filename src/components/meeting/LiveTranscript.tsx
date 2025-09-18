"use client";

import { useEffect, useRef } from "react";

interface LiveTranscriptProps {
	transcript: string[];
	isRecording: boolean;
}

export function LiveTranscript({
	transcript,
	isRecording,
}: LiveTranscriptProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [transcript]);

	return (
		<div className="h-full rounded-lg p-4">
			<div className="mb-4 border px-2 py-1 rounded-md">
				<p className="text-sm text-muted-foreground">Live Transcript</p>
			</div>

			<div
				ref={scrollRef}
				className="h-96 overflow-y-auto border rounded p-3 bg-muted"
			>
				{transcript.length === 0 ? (
					<p className="text-muted-foreground text-sm text-center">
						{isRecording
							? "Listening for speech..."
							: "Click \"Start Recording\" to begin live transcription."}
					</p>
				) : (
					<div className="space-y-2 break-words">
						{transcript.map((text, index) => (
							<p
								key={`${text}-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									index
								}`}
								className="text-sm leading-relaxed"
							>
								{text}
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
