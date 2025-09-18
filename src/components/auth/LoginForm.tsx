"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const toastGenericError = () => {
	toast.error("Something went wrong. Please try again.", {
		description:
			"If the problem persists, please contact promise.bones@gmail.com",
	});
};

const toastInvalidCredentials = () => {
	toast.error("Invalid credentials. Try with the correct credentials.");
};

export function LoginForm({
	demoEmail = "",
	demoPassword = "",
}: {
	demoEmail?: string;
	demoPassword?: string;
}) {
	const [email, setEmail] = useState(demoEmail);
	const [password, setPassword] = useState(demoPassword);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
			if (result?.error) {
				toastInvalidCredentials();
			} else {
				router.push("/dashboard");
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toastGenericError();
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Update form fields and auto-login when demo credentials change
	 */
	useEffect(() => {
		if (demoEmail) {
			setEmail(demoEmail);
		}
		if (demoPassword) {
			setPassword(demoPassword);
		}
		if (demoEmail && demoPassword && !isLoading) {
			setIsLoading(true);
			signIn("credentials", {
				email: demoEmail,
				password: demoPassword,
				redirect: false,
			})
				.then((result) => {
					if (result?.error) {
						toastInvalidCredentials();
					} else {
						router.push("/dashboard");
					}
				})
				.catch(() => {
					toastGenericError();
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [demoEmail, demoPassword, isLoading, router]);

	return (
		<Card className="py-4 w-full max-w-sm mx-auto">
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-2"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-2"
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
						isLoading={isLoading}
					>
						Sign in
					</Button>
					<div className="text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
