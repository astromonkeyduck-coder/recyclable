"use client";

import { useLocation } from "@/hooks/use-location";
import { useProviderList } from "@/hooks/use-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown, Check, LocateFixed } from "lucide-react";
import { useSfx } from "@/components/sfx/sfx-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NUDGE_KEY = "itr-location-nudge-seen";

export function LocationSelector() {
  const { providerId, setProviderId, isLoaded, detectLocation } = useLocation();
  const { data: providers, isLoading } = useProviderList();
  const sfx = useSfx();
  const [showNudge, setShowNudge] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const seen = localStorage.getItem(NUDGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setShowNudge(true), 1500);
      return () => clearTimeout(t);
    }
  }, [isLoaded]);

  const dismissNudge = () => {
    setShowNudge(false);
    localStorage.setItem(NUDGE_KEY, "1");
  };

  const currentProvider = providers?.find((p) => p.id === providerId);
  const displayName = currentProvider?.displayName ?? "Select location";

  if (!isLoaded) return null;

  return (
    <div className="relative">
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) dismissNudge();
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-sm font-medium relative"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate sm:max-w-[180px]">
              {displayName}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
            {showNudge && (
              <motion.span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Choose your location</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading && (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          )}
          {providers?.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => {
                sfx.pop();
                setProviderId(p.id, p.displayName);
                dismissNudge();
              }}
              className="gap-2"
            >
              <Check
                className={`h-3.5 w-3.5 ${p.id === providerId ? "opacity-100" : "opacity-0"}`}
              />
              {p.displayName}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              sfx.tap();
              setDetecting(true);
              dismissNudge();
              await detectLocation();
              setDetecting(false);
            }}
            className="gap-2"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            {detecting ? "Detecting..." : "Detect my location"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            More cities coming soon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* First-visit nudge tooltip */}
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 z-50 w-52 rounded-lg border bg-popover px-3 py-2 shadow-lg text-xs text-popover-foreground"
          >
            <p className="font-medium">Set your city</p>
            <p className="text-muted-foreground mt-0.5">
              Get disposal rules specific to your area
            </p>
            <div className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-l border-t bg-popover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
