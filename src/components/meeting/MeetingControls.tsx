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
		<div className="flex justify-center space-x-4 p-4 border-t">
			<Button
				variant={isAudioEnabled ? "outline" : "destructive"}
				onClick={onToggleMute}
				className={
					isAudioEnabled
						? "hover:bg-muted"
						: "bg-destructive hover:bg-destructive/90"
				}
			>
				{isAudioEnabled ? (
					<Mic className="h-5 w-5" />
				) : (
					<MicOff className="h-5 w-5" />
				)}
			</Button>

			<Button
				variant={isVideoEnabled ? "outline" : "destructive"}
				onClick={onToggleVideo}
				className={
					isVideoEnabled
						? "hover:bg-muted"
						: "bg-destructive hover:bg-destructive/90"
				}
			>
				{isVideoEnabled ? (
					<Video className="h-5 w-5" />
				) : (
					<VideoOff className="h-5 w-5" />
				)}
			</Button>

			{isPaused ? (
				<Button
					variant="default"
					onClick={onResumeRecording}
					className="bg-green-700 hover:bg-green-800"
				>
					<Play className="h-5 w-5" />
					Resume Recording
				</Button>
			) : (
				<Button
					variant={isRecording ? "outline" : "default"}
					onClick={isRecording ? onPauseRecording : onStartRecording}
					disabled={isStartingRecording}
					className={
						isRecording
							? "bg-destructive hover:bg-destructive/90 animate-pulse"
							: "bg-green-700 hover:bg-green-800"
					}
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
				variant="destructive"
				onClick={onEndMeeting}
				disabled={!isEndMeetingEnabled || isEndingRecording}
			>
				{isEndingRecording ? (
					<Spinner className="text-inherit" />
				) : (
					<PhoneOff className="h-5 w-5" />
				)}
				End Recording
			</Button>
		</div>
	);
}
