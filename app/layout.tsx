import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Raghuvir Enterprises",
  description: "E-commerce store with a modern design",
  other: {
    "security-verification":
      "secscan-verify-a364b99a1c57b0429ee2d60ea5794d7f",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
