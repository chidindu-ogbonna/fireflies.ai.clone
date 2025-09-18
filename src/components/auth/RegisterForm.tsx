"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});
			if (response.ok) {
				setSuccess(true);
				setTimeout(() => {
					router.push("/login");
				}, 2000);
			} else {
				const data = await response.json();
				toast.error(data.error || "Registration failed. Please try again.");
			}
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<Card className="max-w-sm mx-auto">
				<CardContent className="pt-6">
					<div className="text-center">
						<div className="text-green-600 mb-2">✓</div>
						<h3 className="text-lg font-semibold mb-2">
							Registration Successful!
						</h3>
						<p className="text-sm text-muted-foreground">
							Redirecting to login page...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="max-w-sm mx-auto">
			<CardHeader>
				<CardTitle>Create Account</CardTitle>
				<CardDescription>
					Sign up to start using our meeting assistant
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name (Optional)</Label>
						<Input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-2"
						/>
					</div>
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
							minLength={6}
							className="mt-2"
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
						isLoading={isLoading}
					>
						Create Account
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
