"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "date-fns";
import { Clock } from "lucide-react";

interface VideoPlayerProps {
	videoUrl?: string | null;
	duration?: number | null;
	title: string;
}

export function VideoPlayer({ videoUrl, duration, title }: VideoPlayerProps) {
	if (!videoUrl) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recording</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-64 bg-muted rounded-lg">
						<p className="text-muted-foreground">
							No video recording available
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{title}</span>
					{duration && (
						<div className="text-sm flex items-center gap-2 text-muted-foreground">
							<Clock className="w-4 h-4" />
							{formatDuration({ seconds: duration })}
						</div>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="relative">
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<video
						controls
						className="w-full rounded-lg"
						preload="metadata"
						controlsList="nodownload"
					>
						<source src={videoUrl} type="video/webm" />
						<source src={videoUrl} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			</CardContent>
		</Card>
	);
}
