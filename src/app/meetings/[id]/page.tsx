"use client";

import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { NoUser } from "@/components/no-user/NoUser";
import {
	SummaryDisplay,
	TranscriptionDisplay,
} from "@/components/review/MeetingMetaDisplay";
import { VideoPlayer } from "@/components/review/VideoPlayer";
import { Button } from "@/components/ui/button";
import { getMeeting } from "@/lib/client/meetings.client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MeetingReviewPage() {
	const { data: session, status } = useSession();
	const meetingId = useParams().id as string;
	const { data: meeting, isLoading: isLoadingMeeting } = useQuery({
		queryKey: ["meeting", meetingId],
		queryFn: () => getMeeting(meetingId),
		enabled: !!session,
	});

	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (!session) {
		return <NoUser />;
	}

	if (isLoadingMeeting) {
		return <LoadingComponent />;
	}

	if (!meeting) {
		return <div>Meeting not found</div>;
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link href="/dashboard">
						<Button variant="ghost" size="sm" className="mb-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
					</Link>

					<div className="rounded-lg border p-6">
						<h1 className="text-2xl font-bold mb-2">{meeting.title}</h1>
						<p className="text-muted-foreground">
							{format(new Date(meeting.createdAt), "PP 'at' p")}
						</p>
					</div>
				</div>

				<div className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div>
							<SummaryDisplay
								meetingId={meeting.id}
								summary={meeting.summary}
								actionItems={meeting.actionItems}
							/>
						</div>

						<div>
							<TranscriptionDisplay
								transcription={meeting.transcription || ""}
							/>
						</div>
					</div>

					<VideoPlayer
						videoUrl={meeting.videoUrl}
						duration={meeting.duration}
						title={meeting.title}
					/>
				</div>
			</div>
		</div>
	);
}
