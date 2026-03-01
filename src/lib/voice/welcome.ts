/**
 * Welcoming voice lines for when the page loads / first interaction.
 * Store-greeter vibe: encouraging, warm, and returning-visitor aware.
 */

const WELCOME_LINES = [
  "[warmly] Hey! Thanks for coming by. How are ya?",
  "[cheerfully] Welcome in! Good to see you.",
  "[warmly] Hey there! Ready to sort some stuff?",
  "[cheerfully] Oh hey! Thanks for stopping by.",
  "[playfully] Well hello! The bins are happy to see you.",
  "[warmly] Hi! Glad you're here. What can we figure out today?",
  "[cheerfully] Hey, thanks for coming! Let's do this.",
  "[warmly] Hello! Good to have you. How can we help?",
  "[playfully] Welcome back to the show! Ready when you are.",
  "[cheerfully] Hi there! Thanks for dropping in.",
];

const RETURNING_LINES = [
  "[excited] Wow, second day in a row! Love it!",
  "[cheerfully] You're back! Nice. Welcome in again!",
  "[playfully] Look who it is! Good to see you again!",
  "[warmly] Back so soon? We're into it. Hey!",
  "[excited] Again? You're on a roll! Welcome back!",
  "[cheerfully] Hey, you came back! The bins missed you.",
  "[warmly] Good to see you again! What are we sorting today?",
  "[playfully] Second time's the charm! Welcome back!",
];

const STORAGE_KEY = "itr_last_visit";

function getToday(): string {
  return new Date().toDateString();
}

function wasYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

export function isReturningVisitor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = localStorage.getItem(STORAGE_KEY);
    if (!last) return false;
    return wasYesterday(last);
  } catch {
    return false;
  }
}

export function recordVisit(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, getToday());
  } catch {
    // ignore
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function getWelcomeLine(): string {
  return isReturningVisitor() ? pick(RETURNING_LINES) : pick(WELCOME_LINES);
}
