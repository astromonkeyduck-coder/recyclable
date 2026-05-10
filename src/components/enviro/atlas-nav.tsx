"use client";

import { NAV_MODES, type NavMode } from "@/lib/enviro/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Globe,
  BookOpen,
  RefreshCw,
  Trees,
  GitBranch,
  BarChart3,
  Calculator,
  CloudRain,
  Zap,
  Scale,
  PenLine,
  AlertTriangle,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, React.ElementType> = {
  Globe,
  BookOpen,
  RefreshCw,
  Trees,
  GitBranch,
  BarChart3,
  Calculator,
  CloudRain,
  Zap,
  Scale,
  PenLine,
  AlertTriangle,
  Moon,
};

export function AtlasNav({
  mode,
  onModeChange,
}: {
  mode: NavMode;
  onModeChange: (m: NavMode) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <ScrollArea className="flex-1">
      <nav className="space-y-1 p-2">
        {NAV_MODES.map((item) => {
          const Icon = ICONS[item.icon] ?? Globe;
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onModeChange(item.id);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 sm:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-background transition-transform sm:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-bold text-primary">APES Atlas</span>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden sm:flex flex-col border-r bg-card transition-all ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        <div className="flex items-center justify-between border-b px-3 py-3">
          {!collapsed && (
            <span className="text-sm font-bold text-primary">APES Atlas</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
