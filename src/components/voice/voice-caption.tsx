"use client";

import { useVoice } from "./voice-context";

/**
 * Subtle caption for the current voice line. Renders nothing when no caption.
 * Does not use aria-live to avoid conflicting with screen readers.
 */
export function VoiceCaption() {
  const { caption } = useVoice();
  if (!caption) return null;
  return (
    <p
      className="text-xs text-muted-foreground text-center py-1 px-2 max-w-md mx-auto"
      aria-hidden
    >
      {caption}
    </p>
  );
}

/** Fixed pill at bottom center for voice caption. Use inside layout. */
export function VoiceCaptionFixed() {
  const { caption } = useVoice();
  if (!caption) return null;
  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-40 pointer-events-none flex justify-center px-4"
      aria-hidden
    >
      <p className="text-xs text-muted-foreground bg-background/90 backdrop-blur rounded-full py-2 px-4 border shadow-sm max-w-sm">
        {caption}
      </p>
    </div>
  );
}
