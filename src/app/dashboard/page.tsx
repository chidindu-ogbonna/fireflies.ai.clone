"use client";

import { MeetingsDataTable } from "@/components/dashboard/MeetingsDataTable";
import { StartMeetingButton } from "@/components/dashboard/StartMeetingButton";
import { Spinner } from "@/components/ui/spinners";
import { getMeetings } from "@/lib/client/dashboard.client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./columns";

export default function DashboardPage() {
	const { data: session } = useSession();
	const {
		data: meetings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["meetings"],
		queryFn: getMeetings,
		enabled: !!session,
	});

	if (!session) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Please sign in</h1>
					<p className="text-muted-foreground mt-2">
						You need to be signed in to view your dashboard
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-red-600">Error</h1>
					<p className="text-muted-foreground mt-2">
						Failed to load meetings. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground mt-2">
						Manage your meetings and view transcriptions
					</p>
				</div>
				<StartMeetingButton />
			</div>

			<div className="bg-background rounded-lg shadow">
				<div className="p-6 border-b">
					<h2 className="text-xl font-semibold">Recent Meetings</h2>
				</div>
				<div className="p-6">
					{isLoading ? (
						<div className="text-center py-8 flex justify-center items-center">
							<Spinner />
						</div>
					) : (
						<MeetingsDataTable columns={columns} data={meetings || []} />
					)}
				</div>
			</div>
		</div>
	);
}
