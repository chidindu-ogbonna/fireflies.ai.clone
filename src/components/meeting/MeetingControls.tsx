"use client";

import { Button } from "@/components/ui/button";
import {
	Circle,
	Mic,
	MicOff,
	PhoneOff,
	Square,
	Video,
	VideoOff,
} from "lucide-react";
import { useState } from "react";

interface MeetingControlsProps {
	onStartRecording: () => void;
	onStopRecording: () => void;
	onEndMeeting: () => void;
	isRecording: boolean;
}

export function MeetingControls({
	onStartRecording,
	onStopRecording,
	onEndMeeting,
	isRecording,
}: MeetingControlsProps) {
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);

	const toggleMute = () => {
		setIsMuted(!isMuted);
		// TODO: Implement actual mute/unmute logic
	};

	const toggleVideo = () => {
		setIsVideoOff(!isVideoOff);
		// TODO: Implement actual video on/off logic
	};

	return (
		<div className="flex justify-center space-x-4 p-4 border-t">
			<Button
				variant={isMuted ? "destructive" : "outline"}
				onClick={toggleMute}
			>
				{isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
			</Button>

			<Button
				variant={isVideoOff ? "destructive" : "outline"}
				onClick={toggleVideo}
			>
				{isVideoOff ? (
					<VideoOff className="h-5 w-5" />
				) : (
					<Video className="h-5 w-5" />
				)}
			</Button>

			<Button
				variant={isRecording ? "destructive" : "default"}
				onClick={isRecording ? onStopRecording : onStartRecording}
				className={
					isRecording
						? "bg-destructive hover:bg-destructive/90"
						: "bg-green-600 hover:bg-green-700"
				}
			>
				{isRecording ? (
					<>
						<Square className="h-5 w-5 mr-2" />
						Stop Recording
					</>
				) : (
					<>
						<Circle className="h-5 w-5 mr-2" />
						Start Recording
					</>
				)}
			</Button>

			<Button variant="destructive" onClick={onEndMeeting}>
				<PhoneOff className="h-5 w-5 mr-2" />
				End Meeting
			</Button>
		</div>
	);
}
