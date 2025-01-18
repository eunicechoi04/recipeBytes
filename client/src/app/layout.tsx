import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ApiProvider } from "@/context/ApiContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecipeBytes",
  description: "Extract, edit, and save your recipes with RecipeBytes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ApiProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
              <Navbar />
            </div>
            <div className="w-full bg-slate-100 flex justify-center">
              {children}
            </div>
          </body>
        </html>
      </ApiProvider>
    </ClerkProvider>
  );
}
