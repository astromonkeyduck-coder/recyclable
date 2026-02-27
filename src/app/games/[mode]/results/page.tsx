"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, Target, Share2, Check, RotateCcw, ArrowUp, Star } from "lucide-react";
import Link from "next/link";
import { GAME_MODES_META, type AnswerRecord, type DifficultyLabel } from "@/lib/games/types";
import { recordGameResult, getModeProgress } from "@/lib/games/progress";
import { calculateFinalScore } from "@/lib/games/scoring";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const modeId = params.mode as string;
  const modeMeta = GAME_MODES_META.find((m) => m.id === modeId);

  const score = parseInt(searchParams.get("score") ?? "0", 10);
  const correct = parseInt(searchParams.get("correct") ?? "0", 10);
  const total = parseInt(searchParams.get("total") ?? "0", 10);
  const streak = parseInt(searchParams.get("streak") ?? "0", 10);
  const difficulty = (searchParams.get("difficulty") ?? "easy") as DifficultyLabel;

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) return;
    setSaved(true);

    const prev = getModeProgress(modeId);
    const isHigh = score > prev.highScore;
    setIsNewHigh(isHigh);

    let answers: AnswerRecord[] = [];
    try {
      answers = JSON.parse(searchParams.get("answers") ?? "[]");
    } catch {}

    const result = calculateFinalScore(
      answers,
      modeId,
      modeMeta?.name ?? modeId,
      difficulty,
      isHigh
    );
    result.totalScore = score;
    result.correctCount = correct;
    result.totalQuestions = total;
    result.bestStreak = streak;
    result.accuracy = accuracy;
    result.isNewHighScore = isHigh;

    recordGameResult(result);
  }, [modeId, score, correct, total, streak, difficulty, accuracy, modeMeta, searchParams, saved]);

  // Animate score counting up
  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const increment = score / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setAnimatedScore(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    const duration = 800;
    const steps = 20;
    const increment = accuracy / steps;
    let step = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++;
        setAnimatedAccuracy(Math.min(Math.round(increment * step), accuracy));
        if (step >= steps) clearInterval(interval);
      }, duration / steps);
    }, 400);
    return () => clearTimeout(timer);
  }, [accuracy]);

  const handleShare = useCallback(async () => {
    const text = `${modeMeta?.icon ?? "♻️"} I scored ${score} on ${modeMeta?.name ?? "Enviro Games"} (${accuracy}% accuracy, ${streak} streak)\n\nCan you beat me?\nisthisrecyclable.com/games`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Enviro Games", text });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy");
    }
  }, [score, accuracy, streak, modeMeta]);

  const accentColor = modeMeta?.color ?? "#3B82F6";

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* New high score celebration */}
        {isNewHigh && (
          <motion.div
            className="flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 px-4 py-1.5 text-sm font-semibold text-yellow-700 dark:text-yellow-300"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <Star className="h-4 w-4" />
            New High Score!
          </motion.div>
        )}

        {/* Score */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {modeMeta?.name ?? "Score"}
          </p>
          <p className="text-6xl font-black tabular-nums tracking-tight" style={{ color: accentColor }}>
            {animatedScore}
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <Card>
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Target className="h-5 w-5 text-blue-500" />
              <p className="text-2xl font-bold tabular-nums">{animatedAccuracy}%</p>
              <p className="text-[10px] text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <p className="text-2xl font-bold tabular-nums">{streak}</p>
              <p className="text-[10px] text-muted-foreground">Best streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <p className="text-2xl font-bold tabular-nums">{correct}/{total}</p>
              <p className="text-[10px] text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
        </div>

        {/* Accuracy ring */}
        <motion.div
          className="relative h-32 w-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={accentColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - accuracy / 100) }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{animatedAccuracy}%</span>
            <span className="text-[10px] text-muted-foreground">accuracy</span>
          </div>
        </motion.div>

        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            difficulty === "easy" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
            difficulty === "medium" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
            difficulty === "hard" && "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
            difficulty === "expert" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
          )}>
            {difficulty}
          </span>
          {accuracy >= 80 && difficulty !== "expert" && (
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <ArrowUp className="h-3 w-3" />
              Ready for harder!
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full">
          <Button onClick={handleShare} variant="default" size="lg" className="gap-2 w-full">
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Share Score"}
          </Button>
          <div className="flex gap-2.5">
            <Button asChild variant="outline" size="lg" className="gap-2 flex-1">
              <Link href={`/games/${modeId}/play`}>
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 flex-1">
              <Link href="/games">
                All Games
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
