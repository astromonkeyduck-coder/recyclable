"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useVoice } from "@/components/voice/voice-context";
import { useSfx } from "@/components/sfx/sfx-context";
import { Button } from "@/components/ui/button";

type SettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { enabled, setEnabled, reducedMotion } = useVoice();
  const sfx = useSfx();

  const handleToggle = () => {
    sfx.tap();
    setEnabled(!enabled);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-4 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Voice reactions</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Short spoken feedback after scan and game events
              </p>
              {reducedMotion && (
                <p className="text-xs text-muted-foreground mt-1">
                  Disabled when &quot;Reduce motion&quot; is on
                </p>
              )}
            </div>
            <Button
              variant={enabled ? "default" : "outline"}
              size="sm"
              onClick={handleToggle}
              disabled={reducedMotion}
              aria-pressed={enabled}
              aria-label={enabled ? "Voice reactions on" : "Voice reactions off"}
            >
              {enabled ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
