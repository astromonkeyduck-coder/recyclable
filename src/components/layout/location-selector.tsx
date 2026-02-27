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
import { MapPin, ChevronDown, Check } from "lucide-react";

export function LocationSelector() {
  const { providerId, setProviderId, isLoaded } = useLocation();
  const { data: providers, isLoading } = useProviderList();

  const currentProvider = providers?.find((p) => p.id === providerId);
  const displayName = currentProvider?.displayName ?? "Select location";

  if (!isLoaded) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-sm font-medium">
          <MapPin className="h-3.5 w-3.5" />
          <span className="max-w-[120px] truncate sm:max-w-[180px]">{displayName}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
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
            onClick={() => setProviderId(p.id)}
            className="gap-2"
          >
            <Check
              className={`h-3.5 w-3.5 ${p.id === providerId ? "opacity-100" : "opacity-0"}`}
            />
            {p.displayName}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          More cities coming soon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
