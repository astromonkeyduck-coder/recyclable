type OpenStatus =
  | { isOpen: true; closesAt: string | null }
  | { isOpen: false; opensAt: string | null }
  | { isOpen: null; raw: string };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_PATTERNS: Record<string, number[]> = {
  "Mon-Fri": [1, 2, 3, 4, 5],
  "Mon-Sat": [1, 2, 3, 4, 5, 6],
  "Mon-Sun": [0, 1, 2, 3, 4, 5, 6],
  "Tue-Sat": [2, 3, 4, 5, 6],
  "Tue-Sun": [0, 2, 3, 4, 5, 6],
  "Thu-Mon": [0, 1, 4, 5, 6],
  "Fri-Sat": [5, 6],
  "Sat-Sun": [0, 6],
};

function parseTime(timeStr: string): number | null {
  const cleaned = timeStr.trim().toLowerCase();

  if (cleaned === "24/7") return 0;

  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3];

  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getOpenStatus(hoursStr: string | undefined): OpenStatus {
  if (!hoursStr) return { isOpen: null, raw: "Hours not available" };

  if (hoursStr.toLowerCase().includes("24/7")) {
    return { isOpen: true, closesAt: null };
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const segments = hoursStr.split(",").map((s) => s.trim());

  for (const segment of segments) {
    for (const [pattern, days] of Object.entries(DAY_PATTERNS)) {
      if (!segment.startsWith(pattern)) continue;
      if (!days.includes(currentDay)) continue;

      const timesPart = segment.slice(pattern.length).trim();
      const timeMatch = timesPart.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      if (!timeMatch) continue;

      const openTime = parseTime(timeMatch[1]);
      const closeTime = parseTime(timeMatch[2]);
      if (openTime === null || closeTime === null) continue;

      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        const closeH = Math.floor(closeTime / 60);
        const closeM = closeTime % 60;
        const period = closeH >= 12 ? "PM" : "AM";
        const displayH = closeH > 12 ? closeH - 12 : closeH === 0 ? 12 : closeH;
        const closesAt = closeM > 0 ? `${displayH}:${String(closeM).padStart(2, "0")} ${period}` : `${displayH} ${period}`;
        return { isOpen: true, closesAt };
      }

      if (currentMinutes < openTime) {
        const openH = Math.floor(openTime / 60);
        const openM = openTime % 60;
        const period = openH >= 12 ? "PM" : "AM";
        const displayH = openH > 12 ? openH - 12 : openH === 0 ? 12 : openH;
        const opensAt = openM > 0 ? `${displayH}:${String(openM).padStart(2, "0")} ${period}` : `${displayH} ${period}`;
        return { isOpen: false, opensAt };
      }

      return { isOpen: false, opensAt: null };
    }

    for (let d = 0; d < 7; d++) {
      const dayName = DAY_NAMES[d];
      if (!segment.startsWith(dayName) && !segment.includes(dayName)) continue;
      if (d !== currentDay) continue;

      const timeMatch = segment.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      if (!timeMatch) continue;

      const openTime = parseTime(timeMatch[1]);
      const closeTime = parseTime(timeMatch[2]);
      if (openTime === null || closeTime === null) continue;

      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        return { isOpen: true, closesAt: null };
      }
      return { isOpen: false, opensAt: null };
    }
  }

  return { isOpen: null, raw: hoursStr };
}

export function formatOpenStatus(status: OpenStatus): { text: string; color: string } {
  if (status.isOpen === null) {
    return { text: (status as { raw: string }).raw, color: "text-muted-foreground" };
  }
  if (status.isOpen) {
    const suffix = status.closesAt ? ` · Closes ${status.closesAt}` : "";
    return { text: `Open now${suffix}`, color: "text-green-600 dark:text-green-400" };
  }
  const suffix = status.opensAt ? ` · Opens ${status.opensAt}` : "";
  return { text: `Closed${suffix}`, color: "text-red-500 dark:text-red-400" };
}
