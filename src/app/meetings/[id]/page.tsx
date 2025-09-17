import { SummaryDisplay } from "@/components/review/SummaryDisplay";
import { TranscriptionDisplay } from "@/components/review/TranscriptionDisplay";
import { Button } from "@/components/ui/button";
import { getMeeting } from "@/lib/client/dashboard.client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MeetingReviewPageProps {
	params: {
		id: string;
	};
}

export default function MeetingReviewPage({ params }: MeetingReviewPageProps) {
	const { data: session } = useSession();
	const { data: meeting } = useQuery({
		queryKey: ["meeting", params.id],
		queryFn: () => getMeeting(params.id),
		enabled: !!session,
	});

	if (!meeting) {
		notFound();
	}

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link href="/dashboard">
						<Button variant="outline" size="sm" className="mb-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Button>
					</Link>

					<div className="rounded-lg border p-6">
						<h1 className="text-2xl font-bold mb-2">{meeting.title}</h1>
						<p className="text-muted-foreground">
							{format(new Date(meeting.createdAt), "PPP 'at' p")}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
						<SummaryDisplay
							meetingId={meeting.id}
							summary={meeting.summary}
							actionItems={meeting.actionItems}
						/>
					</div>

					<div>
						<TranscriptionDisplay transcription={meeting.transcription || ""} />
					</div>
				</div>
			</div>
		</div>
	);
}
