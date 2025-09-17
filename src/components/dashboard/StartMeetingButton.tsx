"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";

export function StartMeetingButton() {
	return (
		<Link href="/meeting">
			<Button className="bg-primary hover:bg-primary/90">
				<Video className="mr-2 h-5 w-5" />
				Start Meeting
			</Button>
		</Link>
	);
}
