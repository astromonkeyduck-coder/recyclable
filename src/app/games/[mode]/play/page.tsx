"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Zap, Check, XIcon, Lightbulb, Flame } from "lucide-react";
import Link from "next/link";
import { createSession, createDailyChallenge } from "@/lib/games/engine";
import { scoreAnswer } from "@/lib/games/scoring";
import { suggestDifficulty } from "@/lib/games/progress";
import { GAME_MODES_META } from "@/lib/games/types";
import type { GameModeData, GameSession, AnswerRecord, DifficultyLabel, Question } from "@/lib/games/types";
import { cn } from "@/lib/utils";
import { ConfettiBurst } from "@/components/games/confetti";
import { CountdownRing } from "@/components/games/countdown-ring";
import { useVoice } from "@/components/voice/voice-context";

const CORRECT_MESSAGES = ["Correct!", "Nice one!", "Nailed it!", "Right on!", "Yes!"];
const WRONG_MESSAGES = ["Not quite!", "Oops!", "So close!", "Wrong one!", "Nope!"];
const STREAK_MESSAGES = ["On fire!", "Unstoppable!", "Streak master!", "Keep going!"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CATEGORY_EMOJI: Record<string, string> = {
  recycling: "♻️",
  climate: "🌍",
  waste: "🗑️",
  materials: "🧪",
  energy: "⚡",
};

function GamePlayContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeId = params.mode as string;
  const isDaily = searchParams.get("daily") === "true";
  const modeMeta = GAME_MODES_META.find((m) => m.id === modeId);
  const modeColor = modeMeta?.color ?? "#3B82F6";

  const { data: modeData } = useQuery<GameModeData>({
    queryKey: ["game-mode", modeId],
    queryFn: async () => {
      const res = await fetch(`/api/games/${modeId}`);
      if (!res.ok) throw new Error("Failed to load game");
      return res.json();
    },
  });

  const { playVoice } = useVoice();
  const [session, setSession] = useState<GameSession | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [lastExplanation, setLastExplanation] = useState("");
  const [lastFunFact, setLastFunFact] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const questionStartRef = useRef(Date.now());

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

      setSelectedAnswer(answer);
      setFeedback(isCorrect ? "correct" : "wrong");
      setPointsEarned(points);
      setLastExplanation(currentQuestion.explanation);
      setLastFunFact(currentQuestion.funFact ?? null);

      if (isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
        if (newStreak >= 3) {
          setFeedbackMessage(pickRandom(STREAK_MESSAGES));
        } else {
          setFeedbackMessage(pickRandom(CORRECT_MESSAGES));
        }
        playVoice("correct_answer", { streakCount: newStreak });
      } else {
        setFeedbackMessage(pickRandom(WRONG_MESSAGES));
        playVoice("incorrect_answer");
      }

      setTimeout(() => {
        const newAnswers = [...session.answers, record];
        const newIndex = session.currentIndex + 1;

        if (newIndex >= session.questions.length) {
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
        setSelectedAnswer(null);
        setPointsEarned(0);
        setLastFunFact(null);
        questionStartRef.current = Date.now();
      }, lastFunFact || currentQuestion.funFact ? 2800 : 1500);
    },
    [session, currentQuestion, feedback, modeId, router, lastFunFact, playVoice]
  );

  // Timer for speed-sort
  const [timer, setTimer] = useState<number | null>(null);
  const [timerTotal, setTimerTotal] = useState<number | null>(null);
  useEffect(() => {
    if (!currentQuestion || !currentQuestion.timeLimit) {
      setTimer(null);
      setTimerTotal(null);
      return;
    }
    setTimer(currentQuestion.timeLimit);
    setTimerTotal(currentQuestion.timeLimit);
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

  const streakLevel = useMemo(() => {
    if (!session) return 0;
    if (session.streak >= 8) return 3;
    if (session.streak >= 5) return 2;
    if (session.streak >= 3) return 1;
    return 0;
  }, [session?.streak]);

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
    <div className="relative mx-auto max-w-lg px-4 py-6">
      {/* Mode-colored accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-b-full"
        style={{ backgroundColor: modeColor }}
      />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/games"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <motion.span
            className="font-bold tabular-nums"
            key={session.score}
            initial={{ scale: 1.3, color: modeColor }}
            animate={{ scale: 1, color: "var(--foreground)" }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {session.score}
          </motion.span>

          {/* Streak fire */}
          {session.streak >= 2 && (
            <motion.span
              className="flex items-center gap-1 text-xs font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={session.streak}
            >
              <motion.span
                animate={{
                  scale: streakLevel >= 3 ? [1, 1.3, 1] : streakLevel >= 2 ? [1, 1.2, 1] : [1, 1.1, 1],
                }}
                transition={{ repeat: Infinity, duration: streakLevel >= 3 ? 0.4 : 0.6 }}
              >
                <Flame className={cn(
                  "h-3.5 w-3.5",
                  streakLevel >= 3 ? "text-red-500" : streakLevel >= 2 ? "text-orange-500" : "text-yellow-500"
                )} />
              </motion.span>
              <span className={cn(
                streakLevel >= 3 ? "text-red-500" : streakLevel >= 2 ? "text-orange-500" : "text-yellow-500"
              )}>
                {session.streak}x
              </span>
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
          {timer !== null && timerTotal !== null && (
            <CountdownRing remaining={timer} total={timerTotal} className="h-9 w-9" />
          )}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="relative mb-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-30" style={{ backgroundColor: modeColor }} />
            <CardContent className="p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{CATEGORY_EMOJI[currentQuestion.category] ?? "📦"}</span>
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
              const isSelected = selectedAnswer === option;

              let variant: string = "neutral";
              if (feedback) {
                if (isCorrectOption) variant = "correct";
                else if (isSelected) variant = "wrong";
                else variant = "dim";
              }

              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: variant === "dim" ? 0.4 : 1,
                    y: 0,
                    x: variant === "wrong" ? [0, -6, 6, -4, 4, 0] : 0,
                    scale: variant === "correct" ? [1, 1.03, 1] : 1,
                  }}
                  transition={{
                    delay: i * 0.04,
                    duration: variant === "wrong" ? 0.4 : 0.2,
                    ease: variant === "wrong" ? "easeInOut" : [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "relative rounded-xl border p-4 text-sm font-medium text-left transition-colors active:scale-[0.97]",
                    isSpeedSort && "text-center py-5",
                    !feedback && "hover:border-primary/50 hover:bg-accent",
                    variant === "correct" && "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 shadow-[0_0_12px_-3px_rgba(34,197,94,0.4)]",
                    variant === "wrong" && "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
                    variant === "dim" && "opacity-40",
                    !feedback && "border-border"
                  )}
                >
                  {!isSpeedSort && (
                    <span className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold mr-3 transition-colors",
                      variant === "correct" ? "bg-green-500 text-white" : variant === "wrong" ? "bg-red-400 text-white" : "bg-muted"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  {option}
                  {feedback && isCorrectOption && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="inline-block ml-2"
                    >
                      <Check className="inline h-4 w-4 text-green-500" />
                    </motion.span>
                  )}
                  {feedback && isSelected && !isCorrectOption && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="inline-block ml-2"
                    >
                      <XIcon className="inline h-4 w-4 text-red-400" />
                    </motion.span>
                  )}

                  {/* Confetti on correct answer button */}
                  {variant === "correct" && <ConfettiBurst trigger={showConfetti} count={12} />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay: floating points */}
      <AnimatePresence>
        {feedback && pointsEarned > 0 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-3xl font-black text-green-500"
              initial={{ y: 0, opacity: 1, scale: 0.5 }}
              animate={{ y: -60, opacity: 0, scale: 1.2 }}
              transition={{ duration: 1 }}
            >
              +{pointsEarned}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation + fun fact bar */}
      <AnimatePresence>
        {feedback && lastExplanation && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Feedback message */}
            <motion.p
              className={cn(
                "text-sm font-semibold text-center",
                feedback === "correct" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
              )}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {feedbackMessage}
            </motion.p>

            {/* Explanation */}
            <div className="rounded-xl border p-4">
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
            </div>

            {/* Fun fact callout */}
            {lastFunFact && (
              <motion.div
                className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-4"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
                      Did you know?
                    </p>
                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      {lastFunFact}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
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
