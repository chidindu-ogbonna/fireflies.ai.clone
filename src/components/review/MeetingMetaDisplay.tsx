"use client";

import { Button } from "@/components/ui/button";
import { createMeetingSummary } from "@/lib/client/meetings.client";
import { useMutation } from "@tanstack/react-query";
import { BookOpenText, FileText, ListCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SummaryDisplayProps {
	meetingId: string;
	summary?: string | null;
	actionItems?: string | null;
}

interface TranscriptionDisplayProps {
	transcription: string;
}

interface TextCardProps {
	Icon: React.ElementType;
	title: string;
	content: string;
	height?: "h-64" | "h-72" | "h-80" | "h-96";
}

const TextCard = ({ Icon, title, content, height = "h-64" }: TextCardProps) => {
	return (
		<div className="rounded-lg border p-6">
			<div className="flex items-center text-lg font-semibold mb-4 gap-2">
				<Icon className="w-6 h-6 text-primary" />
				{title}
			</div>
			<div className={`max-w-none ${height} overflow-y-auto`}>
				<div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
					{content}
				</div>
			</div>
		</div>
	);
};

export function SummaryDisplay({
	meetingId,
	summary,
	actionItems,
}: SummaryDisplayProps) {
	const [currentSummary, setCurrentSummary] = useState(summary);
	const [currentActionItems, setCurrentActionItems] = useState(actionItems);

	const { mutate: generateSummary, isPending } = useMutation({
		mutationFn: createMeetingSummary,
		onSuccess: (data) => {
			setCurrentSummary(data.summary);
			setCurrentActionItems(data.actionItems);
		},
		onError: (error) => {
			console.error("Error generating summary:", error);
			toast.error("Error generating summary. Please try again.");
		},
	});

	if (!currentSummary && !currentActionItems) {
		return (
			<div className="rounded-lg border p-6">
				<div className="text-center space-y-2">
					<div className="flex items-center justify-center gap-2">
						<Sparkles className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-semibold">AI Summary</h3>
					</div>
					<div className="text-muted-foreground mb-4 text-sm">
						Generate an AI-powered summary and action items from this meeting
					</div>
					<Button
						onClick={() => generateSummary(meetingId)}
						disabled={isPending}
						className="bg-primary hover:bg-primary/90"
						isLoading={isPending}
					>
						<Sparkles className="h-4 w-4 mr-2" />
						Generate Summary
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{currentSummary && (
				<TextCard
					Icon={BookOpenText}
					title="Meeting Summary"
					content={currentSummary}
				/>
			)}
			{currentActionItems && (
				<TextCard
					Icon={ListCheck}
					title="Action Items"
					content={currentActionItems}
				/>
			)}
		</div>
	);
}

export function TranscriptionDisplay({
	transcription,
}: TranscriptionDisplayProps) {
	return (
		<TextCard
			Icon={FileText}
			title="Transcription"
			content={transcription}
			height="h-80"
		/>
	);
}
