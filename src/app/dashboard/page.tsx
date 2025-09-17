"use client";

import { MeetingsDataTable } from "@/components/dashboard/MeetingsDataTable";
import { StartMeetingButton } from "@/components/dashboard/StartMeetingButton";
import { LoadingComponent } from "@/components/loading/LoadingComponent";
import { NoUser } from "@/components/no-user/NoUser";
import { Spinner } from "@/components/ui/spinners";
import { getMeetings } from "@/lib/client/meetings.client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./columns";

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const {
		data: meetings,
		isLoading: isLoadingMeetings,
		error,
	} = useQuery({
		queryKey: ["meetings"],
		queryFn: getMeetings,
		enabled: !!session,
	});

	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (!session) {
		return <NoUser />;
	}

	if (error) {
		return (
			<>
				<div className="text-center">
					<h1 className="text-3xl font-bold text-red-600">Error</h1>
					<p className="text-muted-foreground mt-2">
						Failed to load meetings. Please try again.
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="p-6 flex justify-between items-center">
				<h2 className="text-xl font-semibold">Recent Meetings</h2>
				<StartMeetingButton />
			</div>
			<div className="p-6">
				{isLoadingMeetings ? (
					<div className="text-center py-8 flex justify-center items-center">
						<Spinner />
					</div>
				) : (
					<MeetingsDataTable columns={columns} data={meetings || []} />
				)}
			</div>
		</>
	);
}
