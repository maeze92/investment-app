import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { Toaster } from "@/components/ui/toaster";
import { DevToolsPanel } from "@/components/dev-tools/DevToolsPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Investitionsplanung - Unternehmensgruppen",
  description: "Multi-Mandanten Investitionsplanungsplattform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'development' && <DevToolsPanel />}
        </AppProvider>
      </body>
    </html>
  );
}
