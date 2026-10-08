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
      <body className="bg-bg text-text font-sans antialiased min-h-screen relative">
        {/* Page-wide grid background — same "cubes" the hero uses, but
            fixed to the viewport so it stays present as the user scrolls
            and frames every section the same way. The radial mask in
            .bg-grid-fade keeps the corners clean. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-grid bg-grid-fade opacity-60"
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}