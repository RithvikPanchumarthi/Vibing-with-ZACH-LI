import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "WorkVibe — Where Career Starts",
  description:
    "The universal talent marketplace connecting students, job seekers, and employers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
