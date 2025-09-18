"use client";

import { Button } from "@/components/ui/button";
import { createMeetingSummary } from "@/lib/client/meetings.client";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface SummaryDisplayProps {
	meetingId: string;
	summary?: string | null;
	actionItems?: string | null;
}

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
				<div className="rounded-lg border p-6">
					<h3 className="text-lg font-semibold mb-4">Meeting Summary</h3>
					<div className="prose max-w-none">
						<div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
							{currentSummary}
						</div>
					</div>
				</div>
			)}

			{currentActionItems && (
				<div className="rounded-lg border p-6">
					<h3 className="text-lg font-semibold mb-4">Action Items</h3>
					<div className="prose max-w-none">
						<div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
							{currentActionItems}
						</div>
					</div>
				</div>
			)}

			
		</div>
	);
}
