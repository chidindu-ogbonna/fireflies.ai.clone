"use client";

import { TIME_IN_SECONDS } from "@/lib/utils";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextAuthSessionProvider
			refetchInterval={TIME_IN_SECONDS.FIVE_MINUTES}
			refetchOnWindowFocus={false}
			refetchWhenOffline={false}
		>
			{children}
		</NextAuthSessionProvider>
	);
}
