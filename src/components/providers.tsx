"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { MusicProvider } from "@/components/music/music-context";
import { SfxProvider } from "@/components/sfx/sfx-context";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <MotionConfig reducedMotion="user">
          <MusicProvider>
            <SfxProvider>
              {children}
              <Toaster position="bottom-center" />
            </SfxProvider>
          </MusicProvider>
        </MotionConfig>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
