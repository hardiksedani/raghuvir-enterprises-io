import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";

import { ToastProvider } from "@/components/ui/Toast";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Raghuvir Enterprises — Premium Wholesale Products",
  description: "Trusted wholesale partner for retailers and dealers — premium farali atta, spices & more at unbeatable prices. Based in Akola, Maharashtra, India.",
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

          <ToastProvider>
            <Navbar />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </ToastProvider>

        </Providers>
      </body>
    </html>
  );
}
