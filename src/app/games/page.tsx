"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy, Flame, Target, Zap, Star, Calendar,
  Recycle, Clock, ArrowRight, ChevronRight,
} from "lucide-react";
import { GAME_MODES_META } from "@/lib/games/types";
import {
  loadProgress,
  getGlobalAccuracy,
  getDailyChallengeSeed,
  getPlayerRank,
  getNextRank,
  suggestDifficulty,
} from "@/lib/games/progress";
import type { PlayerProgress, DifficultyLabel } from "@/lib/games/types";
import { cn } from "@/lib/utils";

const DAILY_MODE_CYCLE = ["recycle-or-not", "climate-iq", "dropoff-detective", "speed-sort"];

const LEARN_HOOKS: Record<string, string> = {
  "recycle-or-not": "Which everyday items are actually recyclable",
  "dropoff-detective": "How to handle tricky disposal scenarios",
  "climate-iq": "Surprising environmental facts and statistics",
  "speed-sort": "Quick instincts for sorting waste correctly",
};

const DIFFICULTY_COLORS: Record<DifficultyLabel, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  hard: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
  expert: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
};

function getRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function getHoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
}

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
  const rank = getPlayerRank(totalGames);
  const nextRank = getNextRank(totalGames);
  const hoursLeft = getHoursUntilMidnight();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero with gradient */}
      <motion.div
        className="relative text-center mb-8 rounded-2xl px-6 py-10 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50/50 to-purple-50/30 dark:from-green-950/20 dark:via-blue-950/10 dark:to-purple-950/10 -z-10 rounded-2xl" />
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-3"
        >
          <Recycle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          Enviro Games
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Test your eco-IQ. Four modes. One planet.
        </p>
      </motion.div>

      {/* Stats bar + rank */}
      {totalGames > 0 ? (
        <motion.div
          className="mb-6 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={<Trophy className="h-4 w-4 text-yellow-500" />} label="Games" value={totalGames} />
            <StatCard icon={<Target className="h-4 w-4 text-blue-500" />} label="Accuracy" value={`${accuracy}%`} />
            <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Day streak" value={dayStreak} />
          </div>

          {/* Rank badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium">
              <span className="text-sm">{rank.icon}</span>
              {rank.label}
            </span>
            {nextRank && (
              <span className="text-[10px] text-muted-foreground">
                {nextRank.minGames - totalGames} games to {nextRank.icon} {nextRank.label}
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        /* First-time welcome card */
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="border-dashed border-2 border-green-300/40 dark:border-green-700/30">
            <CardContent className="p-5 text-center">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-sm font-semibold mb-1">Ready to test your recycling knowledge?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Play games to learn what goes where. Earn streaks, rank up, and become a recycling legend.
              </p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-400" /> Build streaks</span>
                <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-yellow-400" /> Earn ranks</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-purple-400" /> Learn facts</span>
              </div>
            </CardContent>
          </Card>
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
            <Card className="group overflow-hidden border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all hover:shadow-lg hover:shadow-yellow-500/5">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/80 via-amber-50/50 to-transparent dark:from-yellow-950/10 dark:via-amber-950/5 dark:to-transparent" />
              <CardContent className="relative p-5 flex items-center gap-4">
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
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      Keep your streak alive!
                    </p>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                      <Clock className="h-2.5 w-2.5" />
                      {hoursLeft}h left
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="default" className="shrink-0 gap-1.5 group-hover:gap-2 transition-all">
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
          const difficulty = suggestDifficulty(mode.id);
          const learnHook = LEARN_HOOKS[mode.id];
          const lastPlayed = modeProgress?.lastPlayed ? getRelativeTime(modeProgress.lastPlayed) : null;

          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/games/${mode.id}/play`}>
                <Card
                  className="h-full hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
                  style={{ borderLeftWidth: 3, borderLeftColor: mode.color }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${mode.color}15` }}
                      >
                        {mode.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{mode.name}</h3>
                          {modeProgress && modeProgress.totalPlayed > 0 && (
                            <span className={cn(
                              "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                              DIFFICULTY_COLORS[difficulty]
                            )}>
                              {difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mode.description}
                        </p>

                        {learnHook && (
                          <p className="text-[10px] text-muted-foreground/70 mt-1.5 italic">
                            Learn: {learnHook}
                          </p>
                        )}

                        {modeProgress && modeProgress.totalPlayed > 0 ? (
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              {modeProgress.highScore}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {modeProgress.bestStreak} streak
                            </span>
                            <span>{modeProgress.totalPlayed} played</span>
                            {lastPlayed && (
                              <span className="ml-auto text-muted-foreground/60">{lastPlayed}</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground/60">
                            <ArrowRight className="h-3 w-3" />
                            Start playing
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
