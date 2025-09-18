"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Spinner } from "./ui/spinners";

export function AuthButton() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div>
				<Spinner />
			</div>
		);
	}

	if (session) {
		return (
			<div className="flex items-center gap-4">
				<Button
					onClick={() => signOut({ callbackUrl: "/" })}
					variant="outline"
					size="sm"
				>
					Logout
				</Button>
			</div>
		);
	}

	return (
		<Link href="/">
			<Button size="sm">Login</Button>
		</Link>
	);
}
