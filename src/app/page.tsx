"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	const { data: session } = useSession();
	const [demoEmail, setDemoEmail] = useState<undefined | string>(undefined);
	const [demoPassword, setDemoPassword] = useState<undefined | string>(
		undefined,
	);

	const handleUseDemoCredentials = () => {
		setDemoEmail("promise.bones@gmail.com");
		setDemoPassword("password");
	};

	return (
		<div className="container mx-auto px-4 py-16 space-y-16">
			<div className="text-center mb-16">
				<h1 className="text-2xl md:text-5xl font-bold text-foreground mb-6">
					The AI Meeting Assistant
				</h1>
				<p className="text-base md:text-2xl font-mono mb-8 max-w-2xl mx-auto">
					Record, transcribe, and analyze your meetings with real-time AI
					transcription and intelligent summaries. Never miss important details
					again.
				</p>
			</div>

			<div className="flex justify-center items-center">
				{session ? (
					<div className="text-center">
						<h1 className="text-3xl font-bold text-foreground mb-6">
							Welcome back, {session.user.name || session.user.email}
						</h1>
						<div>
							<Link href="/dashboard">
								<Button>Go to Dashboard</Button>
							</Link>
						</div>
					</div>
				) : (
					<LoginForm demoEmail={demoEmail} demoPassword={demoPassword} />
				)}
			</div>

			{!session && (
				<Card className="py-4 max-w-lg mx-auto">
					<CardContent className="flex flex-col md:flex-row justify-between items-center">
						<div className="text-sm space-y-1 w-full">
							<div className="text-3xl">⚠️</div>
							<div>Checking out the demo?</div>
							<div>Don&apos;t want to create an account?</div>
						</div>
						<Button
							className="mt-4 w-full md:w-auto"
							variant={"secondary"}
							onClick={handleUseDemoCredentials}
						>
							Use Demo Credentials
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
