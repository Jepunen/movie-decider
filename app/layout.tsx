import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers";
import { SessionProvider } from "./context/SessionContext";
import { ChatProvider } from "./context/ChatContext";
import GlobalLoader from "./components/GlobalLoader";
import { ChatOverlay } from "./components/_Chat";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "NextMovie",
	description: "Decide what movie to watch next!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReactQueryProvider>
					<SessionProvider>
						<ChatProvider>
							<GlobalLoader />
							<ChatOverlay />
							<main className="min-h-dvh flex flex-col items-center justify-center p-4">
								{children}
							</main>
						</ChatProvider>
					</SessionProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
