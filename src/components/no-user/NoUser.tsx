import Link from "next/link";

export const NoUser = () => {
	return (
		<div className="py-8">
			<div className="flex flex-col items-center">
				<h1 className="text-2xl font-bold">
					You need to be signed in to view your dashboard
				</h1>
			</div>
			<Link href="/" className="text-muted-foreground mt-2">
				Sign in
			</Link>
		</div>
	);
};
