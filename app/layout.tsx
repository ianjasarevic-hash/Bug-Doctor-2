import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bug.dr"),
  title: "bug.dr — prove you can fix production bugs",
  description:
    "AI can solve LeetCode. It can't fix prod at 3am. bug.dr drops engineers into real broken production codebases. Read the incident, ship a fix, pass the checks.",
  openGraph: {
    title: "bug.dr — prove you can fix production bugs",
    description:
      "Real codebases. Real bugs. Real checks. Prove you can be trusted with prod.",
    type: "website",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#151618",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}