"use client";

import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { LiveTranscript } from "@/components/meeting/LiveTranscript";
import { MeetingControls } from "@/components/meeting/MeetingControls";
import { VideoTile } from "@/components/meeting/VideoTile";
import { NoUser } from "@/components/no-user/NoUser";
import { useDeepgram } from "@/hooks/useDeepgram";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MeetingPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stream, setStream] = useState<MediaStream | null>(null);

	const {
		transcript,
		isRecording,
		error,
		startRecording,
		stopRecording,
		getFullTranscript,
		clearTranscript,
	} = useDeepgram();

	const handleStreamReady = (mediaStream: MediaStream) => {
		setStream(mediaStream);
	};

	const handleStartRecording = () => {
		if (stream) {
			startRecording(stream);
		}
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
