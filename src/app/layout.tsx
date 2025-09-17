import { Header } from "@/components/Header";
import { DeepgramContextProvider } from "@/components/providers/DeepgramProvider";
import { MicrophoneContextProvider } from "@/components/providers/MicrophoneProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "promiseFlies.ai",
	description: "AI-powered meeting assistant with real-time transcription",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<SessionProvider>
							<Header />
							<MicrophoneContextProvider>
								<DeepgramContextProvider>
									<main>{children}</main>
									<Toaster position="top-right" richColors theme="dark" />
								</DeepgramContextProvider>
							</MicrophoneContextProvider>
						</SessionProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
