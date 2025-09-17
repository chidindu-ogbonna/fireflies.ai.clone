"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export type Meeting = {
  id: string
  title: string
  createdAt: Date
  summary?: string | null
}

export const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "PPP")
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => {
      const summary = row.getValue("summary") as string | null
      return summary ? (
        <div className="max-w-[300px] truncate">
          {summary}
        </div>
      ) : (
        <span className="text-gray-500">No summary</span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meeting = row.original
      return (
        <Link href={`/meetings/${meeting.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      )
    },
  },
]
