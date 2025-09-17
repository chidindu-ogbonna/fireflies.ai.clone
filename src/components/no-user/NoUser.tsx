import Link from "next/link";
import { Button } from "../ui/button";

export const NoUser = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<Button>
				<Link href="/login">Login</Link>
			</Button>
		</div>
	);
};
