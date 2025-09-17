"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			router.push("/dashboard");
		}
	}, [session, router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-primary">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-foreground mb-6">
						AI-Powered Meeting Assistant
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Record, transcribe, and analyze your meetings with real-time AI
						transcription and intelligent summaries. Never miss important
						details again.
					</p>
				</div>

				<div className="flex justify-center items-center">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
