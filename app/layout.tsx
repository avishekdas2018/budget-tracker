import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { dark } from "@clerk/themes";

import { DM_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";


const dmSans = DM_Sans({
  subsets: ["latin"],
});

// const inter = Inter({
//   subsets: ["latin"],
// });

// const ptSans = PT_Sans({
//   subsets: ["latin"],
//   weight: "400",
// });

// const alata = Alata({
//   subsets: ["latin"],
//   weight: "400",
//   style: "normal"
// });

export const metadata: Metadata = {
  title: "MintyBudget",
  description: "MintyBudget is a budgeting app that helps you track your expenses and income.",
  keywords: ["budgeting", "finance", "money", "expenses", "income", "tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider appearance={{ baseTheme: dark,  }}>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
        <body
          className={`${dmSans.className} antialiased`}
        >
          <Toaster richColors position="bottom-right" />
          <ClerkLoading>
            <div className="flex h-screen w-screen items-center justify-center">
              <Loader2 className="h-14 w-14 animate-spin text-violet-500" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
