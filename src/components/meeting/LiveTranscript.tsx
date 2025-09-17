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
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">Live Transcript</h3>
				<div className="flex items-center">
					{isRecording && (
						<div className="flex items-center text-destructive">
							<div className="w-2 h-2 bg-destructive rounded-full animate-pulse mr-2" />
							Recording
						</div>
					)}
				</div>
			</div>

			<div
				ref={scrollRef}
				className="h-96 overflow-y-auto border rounded p-3 bg-muted"
			>
				{transcript.length === 0 ? (
					<p className="text-muted-foreground text-sm text-center">
						{isRecording
							? "Listening..."
							: "Start recording to see live transcription"}
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
