"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Target, Zap, Star, Calendar } from "lucide-react";
import { GAME_MODES_META } from "@/lib/games/types";
import { loadProgress, getGlobalAccuracy, getDailyChallengeSeed } from "@/lib/games/progress";
import type { PlayerProgress } from "@/lib/games/types";

const DAILY_MODE_CYCLE = ["recycle-or-not", "climate-iq", "dropoff-detective", "speed-sort"];

export default function GamesPage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const seed = getDailyChallengeSeed();
  const dailyModeId = DAILY_MODE_CYCLE[seed % DAILY_MODE_CYCLE.length];
  const dailyMode = GAME_MODES_META.find((m) => m.id === dailyModeId);

  const accuracy = progress ? getGlobalAccuracy() : 0;
  const totalGames = progress?.totalGamesPlayed ?? 0;
  const dayStreak = progress?.currentDayStreak ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          Enviro Games
        </h1>
        <p className="text-muted-foreground">
          Learn fast. Think sharp. Save smarter.
        </p>
      </motion.div>

      {/* Stats bar */}
      {totalGames > 0 && (
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <StatCard icon={<Trophy className="h-4 w-4 text-yellow-500" />} label="Games" value={totalGames} />
          <StatCard icon={<Target className="h-4 w-4 text-blue-500" />} label="Accuracy" value={`${accuracy}%`} />
          <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Day streak" value={dayStreak} />
        </motion.div>
      )}

      {/* Daily challenge */}
      {dailyMode && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Link href={`/games/${dailyMode.id}/play?daily=true`}>
            <Card className="overflow-hidden border-2 border-dashed border-yellow-400/40 hover:border-yellow-400/60 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20 text-2xl shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                      Daily Challenge
                    </span>
                    <Star className="h-3 w-3 text-yellow-500" />
                  </div>
                  <p className="text-sm font-medium truncate">
                    Today: {dailyMode.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    New challenge every day. Keep your streak alive!
                  </p>
                </div>
                <Button size="sm" variant="default" className="shrink-0 gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Play
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Game mode grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {GAME_MODES_META.map((mode, i) => {
          const modeProgress = progress?.modes[mode.id];
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/games/${mode.id}/play`}>
                <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${mode.color}15` }}
                      >
                        {mode.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{mode.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mode.description}
                        </p>

                        {modeProgress && modeProgress.totalPlayed > 0 && (
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              {modeProgress.highScore}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {modeProgress.bestStreak} streak
                            </span>
                            <span>
                              {modeProgress.totalPlayed} played
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-3 flex items-center gap-2.5">
        {icon}
        <div>
          <p className="text-lg font-bold leading-none tabular-nums">{value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
