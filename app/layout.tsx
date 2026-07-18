import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
<<<<<<< HEAD

export const metadata: Metadata = {
  title: "Raghuvir Enterprises",
  description: "E-commerce store with a modern design",
  other: {
    "security-verification":
      "secscan-verify-a364b99a1c57b0429ee2d60ea5794d7f",
  },
};


=======
import { ToastProvider } from "@/components/ui/Toast";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Raghuvir Enterprises — Premium Wholesale Products",
  description: "Trusted wholesale partner for retailers and dealers — premium farali atta, spices & more at unbeatable prices. Based in Akola, Maharashtra, India.",
};

>>>>>>> d4b4a93 (update code)
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
<<<<<<< HEAD
          <Navbar />
          <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
=======
          <ToastProvider>
            <Navbar />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </ToastProvider>
>>>>>>> d4b4a93 (update code)
        </Providers>
      </body>
    </html>
  );
}
