"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Video } from "lucide-react";
import Link from "next/link";

export type Meeting = {
	id: string;
	title: string;
	createdAt: Date;
	summary?: string | null;
	videoUrl?: string | null;
	duration?: number | null;
};

export const columns: ColumnDef<Meeting>[] = [
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => {
			const meeting = row.original;
			return (
				<div className="flex items-center gap-2">
					<span>{meeting.title}</span>
					{meeting.videoUrl && <Video className="h-4 w-4 text-blue-500" />}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => {
			return format(new Date(row.getValue("createdAt")), "PPP");
		},
	},
	{
		accessorKey: "summary",
		header: "Summary",
		cell: ({ row }) => {
			const summary = row.getValue("summary") as string | null;
			return summary ? (
				<div className="max-w-[300px] truncate">{summary}</div>
			) : (
				<span className="text-gray-500">No summary</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const meeting = row.original;
			return (
				<Link href={`/meetings/${meeting.id}`}>
					<Button variant="outline" size="sm">
						View Details
					</Button>
				</Link>
			);
		},
	},
];
