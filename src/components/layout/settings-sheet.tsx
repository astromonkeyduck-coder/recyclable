"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVoice } from "@/components/voice/voice-context";
import { useSfx } from "@/components/sfx/sfx-context";
import { useInstall } from "@/components/install/install-context";
import { Button } from "@/components/ui/button";
import { Smartphone, Share, Download } from "lucide-react";

type SettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { enabled, setEnabled, reducedMotion } = useVoice();
  const sfx = useSfx();
  const { canInstallNative, promptInstall, isStandalone } = useInstall();
  const [showInstallSteps, setShowInstallSteps] = useState(false);

  const handleToggle = () => {
    sfx.tap();
    setEnabled(!enabled);
  };

  const handleInstallClick = async () => {
    sfx.tap();
    if (canInstallNative) {
      await promptInstall();
    } else {
      setShowInstallSteps(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-4 space-y-6 overflow-y-auto">
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

          {!isStandalone && (
            <div className="pt-2 border-t">
              <p className="font-medium text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                Install app
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                {canInstallNative
                  ? "One tap to add to your home screen."
                  : "Add a shortcut to your home screen for quick access."}
              </p>
              <Button
                className="w-full gap-2"
                onClick={handleInstallClick}
                size="sm"
              >
                <Download className="h-4 w-4" />
                {canInstallNative ? "Install app" : "How to install"}
              </Button>
              {!canInstallNative && (
                <div className="space-y-3 text-xs text-muted-foreground mt-4">
                  <div className="rounded-lg bg-muted/60 p-3">
                    <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Share className="h-3.5 w-3.5" />
                      iPhone / iPad
                    </p>
                    <p>
                      Tap the <strong>Share</strong> button at the bottom of Safari (square with arrow), then scroll and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-3">
                    <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      <Share className="h-3.5 w-3.5" />
                      Android
                    </p>
                    <p>
                      Tap the <strong>menu</strong> (⋮) in the browser, then choose <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isStandalone && (
            <div className="pt-2 border-t">
              <p className="font-medium text-sm flex items-center gap-2 text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                App installed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;re using the installed app.
              </p>
            </div>
          )}
        </div>
      </SheetContent>

      <Dialog open={showInstallSteps} onOpenChange={setShowInstallSteps}>
        <DialogContent className="sm:max-w-md" aria-describedby="install-steps-desc">
          <DialogHeader>
            <DialogTitle>Add to home screen</DialogTitle>
          </DialogHeader>
          <div id="install-steps-desc" className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                <Share className="h-3.5 w-3.5" />
                iPhone / iPad
              </p>
              <p>
                1. Tap the <strong>Share</strong> button at the bottom of Safari (square with arrow).<br />
                2. Scroll and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                <Share className="h-3.5 w-3.5" />
                Android
              </p>
              <p>
                Tap the <strong>menu</strong> (⋮) in the browser, then choose <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong>.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
