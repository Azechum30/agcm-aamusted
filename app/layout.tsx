import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import DrawerProvider from "@/providers/drawer-provider";
import SheetProvider from "@/providers/sheet-provider";
import TitheDialogProvider from "@/providers/tithe-dialog-provider";
import EditTitheProvider from "@/providers/EditTitheProvider";
import UploadTitheSheetProvider from "@/providers/upload-tithe-sheet-provider";
import { cn } from "@/lib/utils";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

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
        <body className={ cn( `relative ${ inter.className }` ) }>
          <ClerkLoading>
            <span className="flex justify-center items-center h-screen">
              <Loader2 className="size-8 animate-spin" />
            </span>
          </ClerkLoading>
          <ClerkLoaded>
            <QueryProvider>
                <DrawerProvider />
                <SheetProvider />
                <UploadTitheSheetProvider />
                <TitheDialogProvider />
                <EditTitheProvider />
                <div className='scroll-watcher'></div>
                <Toaster closeButton richColors visibleToasts={2} position="top-right" />
                { children }
                <div>
                  {statistics}
                </div>
              </QueryProvider>
              </ClerkLoaded>
          </body>
      </html>
    </ClerkProvider>
  );
}
