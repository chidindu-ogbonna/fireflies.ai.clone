"use client";

import { Button } from "@/components/ui/button";
import {
	Disc,
	Mic,
	MicOff,
	PhoneOff,
	Play,
	Square,
	Video,
	VideoOff,
} from "lucide-react";
import { Spinner } from "../ui/spinners";

interface MeetingControlsProps {
	onStartRecording: () => void;
	onPauseRecording: () => void;
	onResumeRecording: () => void;
	onEndMeeting: () => void;
	isRecording: boolean;
	isPaused: boolean;
	onToggleMute: () => void;
	onToggleVideo: () => void;
	isAudioEnabled: boolean;
	isVideoEnabled: boolean;
	isEndMeetingEnabled: boolean;
	isStartingRecording: boolean;
	isEndingRecording: boolean;
}

export function MeetingControls({
	onStartRecording,
	onPauseRecording,
	onResumeRecording,
	onEndMeeting,
	isRecording,
	isPaused,
	onToggleMute,
	onToggleVideo,
	isAudioEnabled,
	isVideoEnabled,
	isEndMeetingEnabled,
	isStartingRecording,
	isEndingRecording,
}: MeetingControlsProps) {
	return (
		<div className="flex items-center space-x-3">
			<Button
				size="lg"
				onClick={onToggleMute}
				className={`w-12 h-12 rounded-full transition-all duration-200 ${
					isAudioEnabled
						? "bg-muted-foreground/80 hover:bg-muted-foreground/20 text-white"
						: "bg-red-600 hover:bg-red-700 text-white"
				}`}
			>
				{isAudioEnabled ? (
					<Mic className="h-5 w-5" />
				) : (
					<MicOff className="h-5 w-5" />
				)}
			</Button>

			<Button
				size="lg"
				onClick={onToggleVideo}
				className={`w-12 h-12 rounded-full transition-all duration-200 ${
					isVideoEnabled
						? "bg-muted-foreground/80 hover:bg-muted-foreground/20 text-white"
						: "bg-red-600 hover:bg-red-700 text-white"
				}`}
			>
				{isVideoEnabled ? (
					<Video className="h-5 w-5" />
				) : (
					<VideoOff className="h-5 w-5" />
				)}
			</Button>

			{isPaused ? (
				<Button
					size="lg"
					onClick={onResumeRecording}
					className="bg-muted-foreground/80 hover:bg-muted-foreground/20 text-white px-6 h-12 rounded-lg transition-all duration-200"
				>
					<Play className="h-5 w-5" />
					Resume Recording
				</Button>
			) : (
				<Button
					size="lg"
					onClick={isRecording ? onPauseRecording : onStartRecording}
					disabled={isStartingRecording}
					className={`px-6 h-12 rounded-lg transition-all duration-200 gap-2 ${
						isRecording
							? "bg-muted-foreground/80 hover:bg-muted-foreground/20 animate-pulse"
							: "bg-green-700 hover:bg-green-800"
					}`}
				>
					{isStartingRecording ? (
						<>
							<Spinner className="text-inherit" />
							Start Recording
						</>
					) : isRecording ? (
						<>
							<Square className="h-5 w-5" />
							Pause Recording
						</>
					) : (
						<>
							<Disc className="h-5 w-5" />
							Start Recording
						</>
					)}
				</Button>
			)}

			<Button
				size="lg"
				onClick={onEndMeeting}
				disabled={!isEndMeetingEnabled || isEndingRecording}
				className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
			>
				{isEndingRecording ? (
					<Spinner className="text-inherit" />
				) : (
					<PhoneOff className="h-5 w-5" />
				)}
			</Button>
		</div>
	);
}
