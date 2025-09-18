import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";

export function Header() {
	return (
		<header className="border-b bg-background">
			<div className="mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="font-bold text-primary">
					promiseFlies.ai
				</Link>
				<AuthButton />
			</div>
		</header>
	);
}
