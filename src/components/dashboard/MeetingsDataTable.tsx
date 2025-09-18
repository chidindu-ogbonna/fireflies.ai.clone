"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface DataTableProps<TData extends MeetingData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface MeetingData {
	id: string;
	[key: string]: unknown;
}

export function MeetingsDataTable<TData extends MeetingData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleRowClick = (
		row: { original: TData },
		event: React.MouseEvent,
	) => {
		// Don't navigate if clicking on a button, link, or other interactive element
		const target = event.target as HTMLElement;
		if (
			target.tagName === "BUTTON" ||
			target.tagName === "A" ||
			target.closest("button") ||
			target.closest("a")
		) {
			return;
		}
		const meeting = row.original;
		router.push(`/meetings/${meeting.id}`);
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								onClick={(event) => handleRowClick(row, event)}
								className="cursor-pointer hover:bg-muted/50 transition-colors"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No meetings yet.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
