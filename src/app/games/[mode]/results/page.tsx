"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy, Flame, Target, Share2, Check, RotateCcw,
  ArrowUp, ArrowDown, Star, ChevronDown, ChevronUp,
  Lightbulb, XIcon, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { GAME_MODES_META, type AnswerRecord, type DifficultyLabel, type Question } from "@/lib/games/types";
import { recordGameResult, getModeProgress } from "@/lib/games/progress";
import { calculateFinalScore, SCORING } from "@/lib/games/scoring";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfettiBurst } from "@/components/games/confetti";
import { useVoice } from "@/components/voice/voice-context";

type GradeTier = {
  grade: string;
  label: string;
  message: string;
  color: string;
  bgColor: string;
};

const GRADE_TIERS: GradeTier[] = [
  { grade: "S", label: "Perfect", message: "Flawless! The bins bow to you.", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
  { grade: "A", label: "Excellent", message: "Almost perfect. Your recycling IQ is showing.", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
  { grade: "B", label: "Great", message: "Solid work! You and the bins are friends.", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/20" },
  { grade: "C", label: "Good", message: "Good effort! The bins believe in you.", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" },
  { grade: "D", label: "Learning", message: "Every wrong answer is the bin teaching you something.", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
];

function getGrade(accuracy: number): GradeTier {
  if (accuracy >= 95) return GRADE_TIERS[0];
  if (accuracy >= 85) return GRADE_TIERS[1];
  if (accuracy >= 70) return GRADE_TIERS[2];
  if (accuracy >= 50) return GRADE_TIERS[3];
  return GRADE_TIERS[4];
}

function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const modeId = params.mode as string;
  const modeMeta = GAME_MODES_META.find((m) => m.id === modeId);
  const { playVoice } = useVoice();

  const score = parseInt(searchParams.get("score") ?? "0", 10);
  const correct = parseInt(searchParams.get("correct") ?? "0", 10);
  const total = parseInt(searchParams.get("total") ?? "0", 10);
  const streak = parseInt(searchParams.get("streak") ?? "0", 10);
  const difficulty = (searchParams.get("difficulty") ?? "easy") as DifficultyLabel;

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const grade = getGrade(accuracy);

  const answers: AnswerRecord[] = useMemo(() => {
    try {
      return JSON.parse(searchParams.get("answers") ?? "[]");
    } catch {
      return [];
    }
  }, [searchParams]);

  const maxPossible = useMemo(() => {
    return total * Math.round(
      SCORING.BASE_POINTS * SCORING.MAX_SPEED_MULTIPLIER * SCORING.DIFFICULTY_MULTIPLIERS[difficulty]
      + SCORING.MAX_STREAK_BONUS * SCORING.DIFFICULTY_MULTIPLIERS[difficulty]
    );
  }, [total, difficulty]);

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [previousBest, setPreviousBest] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (saved) return;
    setSaved(true);

    const prev = getModeProgress(modeId);
    setPreviousBest(prev.highScore);
    const isHigh = score > prev.highScore;
    setIsNewHigh(isHigh);

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

    playVoice("lesson_complete", { accuracy });

    if (accuracy >= 70) {
      setTimeout(() => setShowConfetti(true), 300);
      setTimeout(() => setShowConfetti(false), 400);
    }
  }, [modeId, score, correct, total, streak, difficulty, accuracy, modeMeta, answers, saved, playVoice]);

  // Animate score counting up
  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const increment = score / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimatedScore(Math.min(Math.round(increment * step), score));
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
    const gradeEmoji = grade.grade === "S" ? "👑" : grade.grade === "A" ? "🌟" : "🎮";
    const text = `${modeMeta?.icon ?? "♻️"} ${gradeEmoji} Grade ${grade.grade} on ${modeMeta?.name ?? "Enviro Games"}!\n\nScore: ${score} | ${accuracy}% accuracy | ${streak} streak\n\nCan you beat me?\nisthisrecyclable.com/games`;

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
  }, [score, accuracy, streak, modeMeta, grade]);

  const accentColor = modeMeta?.color ?? "#3B82F6";
  const scorePct = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
  const scoreDiff = previousBest > 0 ? score - previousBest : 0;

  // Extract fun facts from answers for the "You Learned" section
  const funFacts = useMemo(() => {
    try {
      const questionsRaw = searchParams.get("answers");
      if (!questionsRaw) return [];
      return [];
    } catch {
      return [];
    }
  }, [searchParams]);

  return (
    <div className="relative mx-auto max-w-md px-4 py-8">
      <ConfettiBurst trigger={showConfetti} count={32} size="lg" duration={1.5} />

      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Grade badge */}
        <motion.div
          className={cn("flex flex-col items-center gap-1 rounded-2xl px-8 py-4", grade.bgColor)}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <span className={cn("text-5xl font-black", grade.color)}>{grade.grade}</span>
          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", grade.color)}>
            {grade.label}
          </span>
        </motion.div>

        {/* Motivational message */}
        <motion.p
          className="text-sm text-muted-foreground text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {grade.message}
        </motion.p>

        {/* New high score badge */}
        {isNewHigh && (
          <motion.div
            className="flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20 px-4 py-1.5 text-sm font-semibold text-yellow-700 dark:text-yellow-300"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
          >
            <Star className="h-4 w-4" />
            New High Score!
          </motion.div>
        )}

        {/* Score with previous best comparison */}
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
          {previousBest > 0 && (
            <motion.div
              className="flex items-center justify-center gap-1.5 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-[10px] text-muted-foreground">Previous best: {previousBest}</span>
              {scoreDiff !== 0 && (
                <span className={cn(
                  "flex items-center text-[10px] font-semibold",
                  scoreDiff > 0 ? "text-green-600" : "text-red-500"
                )}>
                  {scoreDiff > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                  {Math.abs(scoreDiff)}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Score bar (your score vs max possible) */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Score</span>
            <span>{scorePct}% of max</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: "0%" }}
              animate={{ width: `${scorePct}%` }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
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

        {/* Difficulty badge + level up hint */}
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

        {/* Improvement tip for low accuracy */}
        {accuracy < 70 && (
          <motion.div
            className="w-full rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                  Pro tip
                </p>
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  {modeId === "recycle-or-not"
                    ? "Candy wrappers and chip bags look metallic but are actually plastic film -- always trash them. When in doubt, check the material, not the appearance."
                    : modeId === "speed-sort"
                    ? "Focus on the material first: paper and metal almost always recycle, food scraps compost, and mixed materials go to trash."
                    : modeId === "climate-iq"
                    ? "Remember: recycling saves 95% of the energy for aluminum and glass is infinitely recyclable. These stats come up a lot!"
                    : "Take your time reading each scenario carefully. The disposal method often depends on whether the item is contaminated or mixed-material."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Answer review toggle */}
        {answers.length > 0 && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={() => setShowReview((v) => !v)}
              className="flex items-center justify-center gap-2 w-full rounded-xl border p-3 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              {showReview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showReview ? "Hide" : "Review"} Answers ({correct}/{total})
            </button>

            <AnimatePresence>
              {showReview && (
                <motion.div
                  className="mt-3 space-y-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {answers.map((answer, idx) => (
                    <div
                      key={answer.questionId}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3",
                        answer.correct
                          ? "border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-950/10"
                          : "border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/10"
                      )}
                    >
                      <div className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5",
                        answer.correct ? "bg-green-500" : "bg-red-400"
                      )}>
                        {answer.correct
                          ? <Check className="h-3 w-3 text-white" />
                          : <XIcon className="h-3 w-3 text-white" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">
                          Q{idx + 1}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                          <span className="tabular-nums">+{answer.points} pts</span>
                          <span className="tabular-nums">{(answer.timeMs / 1000).toFixed(1)}s</span>
                          {answer.streak >= 3 && (
                            <span className="flex items-center gap-0.5 text-orange-500">
                              <Flame className="h-2.5 w-2.5" />
                              {answer.streak}x
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full pt-2">
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
