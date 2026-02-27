"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Search } from "lucide-react";
import Link from "next/link";

type FunnyResultProps = {
  message: string;
  productDescription?: string | null;
};

export function FunnyResult({ message, productDescription }: FunnyResultProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 150, damping: 18 }}
      >
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-4 py-10 px-6 bg-gradient-to-b from-violet-100 to-pink-50 dark:from-violet-950/40 dark:to-pink-950/20">
            <motion.div
              className="text-7xl"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
            >
              😂
            </motion.div>
            <motion.div
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-200/60 dark:bg-violet-800/30 px-4 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Not waste!
            </motion.div>
          </div>

          <CardContent className="p-6 space-y-5">
            <motion.p
              className="text-lg font-medium text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.p>

            {productDescription && (
              <motion.p
                className="text-sm text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                We detected: <span className="font-medium text-foreground">{productDescription}</span>
              </motion.p>
            )}

            <motion.div
              className="rounded-lg border border-dashed p-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-muted-foreground">
                Try pointing your camera at an actual waste item like a bottle,
                wrapper, can, or box and we&apos;ll tell you exactly how to dispose of it.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button asChild variant="default" size="sm" className="gap-1.5">
          <Link href="/">
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/">
            <Search className="h-3.5 w-3.5" />
            Search instead
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
