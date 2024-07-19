import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import DrawerProvider from "@/providers/drawer-provider";
import SheetProvider from "@/providers/sheet-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGCM-AAMUSTED",
  description: "A Comprehensive Management System",
};


type Props = {
  readonly children: React.ReactNode,
  statistics: React.ReactNode
}

export default function RootLayout({children, statistics}: Props) {
  return (
    <ClerkProvider>
      <html lang="en">
          <body className={ inter.className }>
              <QueryProvider>
                <DrawerProvider />
                <SheetProvider />
                <div className='scroll-watcher'></div>
                <Toaster />
                { children }
                <div>
                  {statistics}
                </div>
              </QueryProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
