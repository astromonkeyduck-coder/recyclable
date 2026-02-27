"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Clock, Zap, ArrowRight, Check, XIcon } from "lucide-react";
import Link from "next/link";
import { createSession, createDailyChallenge } from "@/lib/games/engine";
import { scoreAnswer } from "@/lib/games/scoring";
import { suggestDifficulty } from "@/lib/games/progress";
import type { GameModeData, GameSession, AnswerRecord, DifficultyLabel, Question } from "@/lib/games/types";
import { cn } from "@/lib/utils";

function GamePlayContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeId = params.mode as string;
  const isDaily = searchParams.get("daily") === "true";

  const { data: modeData } = useQuery<GameModeData>({
    queryKey: ["game-mode", modeId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${modeId}`);
      if (!res.ok) throw new Error("Failed to load game");
      return res.json();
    },
  });

  const [session, setSession] = useState<GameSession | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);
  const [lastExplanation, setLastExplanation] = useState("");
  const questionStartRef = useRef(Date.now());

  // Initialize session when data loads
  useEffect(() => {
    if (!modeData || session) return;
    const difficulty = suggestDifficulty(modeId);
    const s = isDaily
      ? createDailyChallenge(modeData)
      : createSession(modeData, difficulty);
    setSession(s);
  }, [modeData, session, modeId, isDaily]);

  const currentQuestion: Question | null =
    session && session.currentIndex < session.questions.length
      ? session.questions[session.currentIndex]
      : null;

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!session || !currentQuestion || feedback) return;

      const timeMs = Date.now() - questionStartRef.current;
      const isCorrect = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer.includes(answer)
        : currentQuestion.correctAnswer === answer;

      const newStreak = isCorrect ? session.streak + 1 : 0;
      const points = scoreAnswer(isCorrect, timeMs, newStreak, session.difficulty);

      if (navigator.vibrate) {
        navigator.vibrate(isCorrect ? 20 : [30, 50, 30]);
      }

      const record: AnswerRecord = {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeMs,
        points,
        streak: newStreak,
      };

      setFeedback(isCorrect ? "correct" : "wrong");
      setPointsEarned(points);
      setLastExplanation(currentQuestion.explanation);

      setTimeout(() => {
        const newAnswers = [...session.answers, record];
        const newIndex = session.currentIndex + 1;

        if (newIndex >= session.questions.length) {
          // Game over — navigate to results
          const resultParams = new URLSearchParams({
            mode: modeId,
            score: String(session.score + points),
            correct: String(newAnswers.filter((a) => a.correct).length),
            total: String(newAnswers.length),
            streak: String(Math.max(...newAnswers.map((a) => a.streak), 0)),
            difficulty: session.difficulty,
            answers: JSON.stringify(newAnswers),
          });
          router.push(`/games/${modeId}/results?${resultParams.toString()}`);
          return;
        }

        setSession({
          ...session,
          answers: newAnswers,
          currentIndex: newIndex,
          score: session.score + points,
          streak: newStreak,
        });
        setFeedback(null);
        setPointsEarned(0);
        questionStartRef.current = Date.now();
      }, 1200);
    },
    [session, currentQuestion, feedback, modeId, router]
  );

  // Timer for speed-sort
  const [timer, setTimer] = useState<number | null>(null);
  useEffect(() => {
    if (!currentQuestion || !currentQuestion.timeLimit) return;
    setTimer(currentQuestion.timeLimit);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t === null || t <= 1) {
          clearInterval(interval);
          if (t === 1) handleAnswer("__timeout__");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestion?.id]);

  if (!modeData || !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground">Loading game...</span>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progressPct = (session.currentIndex / session.questions.length) * 100;
  const isSpeedSort = currentQuestion.type === "speed_sort";

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/games"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold tabular-nums">{session.score}</span>
          {session.streak >= 2 && (
            <motion.span
              className="flex items-center gap-1 text-orange-500 text-xs font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={session.streak}
            >
              <Zap className="h-3 w-3" />
              {session.streak}x
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>
            Question {session.currentIndex + 1} of {session.questions.length}
          </span>
          {timer !== null && (
            <span className={cn("flex items-center gap-1 font-medium tabular-nums", timer <= 3 && "text-red-500")}>
              <Clock className="h-3 w-3" />
              {timer}s
            </span>
          )}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {currentQuestion.category}
              </p>
              <h2 className={cn(
                "font-semibold leading-snug",
                isSpeedSort ? "text-2xl text-center py-4" : "text-lg"
              )}>
                {currentQuestion.prompt}
              </h2>
            </CardContent>
          </Card>

          {/* Answer options */}
          <div className={cn(
            "grid gap-2.5",
            isSpeedSort ? "grid-cols-3" : "grid-cols-1"
          )}>
            {(currentQuestion.options ?? []).map((option, i) => {
              const isCorrectOption = Array.isArray(currentQuestion.correctAnswer)
                ? currentQuestion.correctAnswer.includes(option)
                : currentQuestion.correctAnswer === option;

              let variant: string = "neutral";
              if (feedback) {
                if (isCorrectOption) variant = "correct";
                else variant = "wrong-dim";
              }

              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className={cn(
                    "rounded-xl border p-4 text-sm font-medium text-left transition-all active:scale-[0.97]",
                    isSpeedSort && "text-center py-5",
                    !feedback && "hover:border-primary/50 hover:bg-accent",
                    variant === "correct" && "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
                    variant === "wrong-dim" && "opacity-50",
                    !feedback && "border-border"
                  )}
                >
                  {!isSpeedSort && (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold mr-3">
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  {option}
                  {feedback && isCorrectOption && (
                    <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Points float */}
            {pointsEarned > 0 && (
              <motion.div
                className="absolute text-3xl font-black text-green-500"
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -60, opacity: 0, scale: 1.2 }}
                transition={{ duration: 1 }}
              >
                +{pointsEarned}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation bar */}
      <AnimatePresence>
        {feedback && lastExplanation && (
          <motion.div
            className="mt-4 rounded-xl border p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-start gap-2">
              {feedback === "correct" ? (
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <XIcon className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lastExplanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <GamePlayContent />
    </Suspense>
  );
}
