import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";

export function Header() {
	return (
		<header className="border-b bg-background">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold text-primary">
					PromiseFlies.ai
				</Link>
				<AuthButton />
			</div>
		</header>
	);
}
