"use client";

import { Spinner } from "../ui/spinners";

export const LoadingComponent = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<Spinner />
		</div>
	);
};
