"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, ExternalLink, Navigation } from "lucide-react";
import type { FacilityWithDistance } from "@/lib/facilities/types";
import { FACILITY_CATEGORY_META } from "@/lib/facilities/types";
import { formatOpenStatus, getOpenStatus } from "@/lib/facilities/hours";
import { cn } from "@/lib/utils";

type FacilityCardProps = {
  facility: FacilityWithDistance;
  isSelected?: boolean;
  onSelect?: (facility: FacilityWithDistance) => void;
  index?: number;
};

function getDirectionsUrl(facility: FacilityWithDistance): string {
  const addr = encodeURIComponent(
    `${facility.address.street}, ${facility.address.city}, ${facility.address.region} ${facility.address.postalCode}`
  );
  const isIos =
    typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (isIos) {
    return `maps://maps.apple.com/?daddr=${addr}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
}

export function FacilityCard({ facility, isSelected, onSelect, index = 0 }: FacilityCardProps) {
  const meta = FACILITY_CATEGORY_META[facility.category];
  const openStatus = getOpenStatus(facility.hours);
  const statusDisplay = formatOpenStatus(openStatus);
  const directionsUrl = getDirectionsUrl(facility);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-shadow hover:shadow-md",
          isSelected && "ring-2 ring-primary shadow-md"
        )}
        onClick={() => onSelect?.(facility)}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${meta.color}15`,
                    color: meta.color,
                  }}
                >
                  {meta.icon} {meta.label}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-tight truncate">
                {facility.name}
              </h3>
            </div>
            {facility.distanceMiles > 0 && (
              <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                {facility.distanceMiles < 1
                  ? `${(facility.distanceMiles * 5280).toFixed(0)} ft`
                  : `${facility.distanceMiles.toFixed(1)} mi`}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              {facility.address.street}, {facility.address.city}, {facility.address.region}{" "}
              {facility.address.postalCode}
            </span>
          </div>

          {/* Hours / open status */}
          {facility.hours && (
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className={statusDisplay.color}>{statusDisplay.text}</span>
            </div>
          )}

          {/* Accepted materials */}
          <div className="flex flex-wrap gap-1">
            {facility.acceptedMaterials.slice(0, 5).map((mat) => (
              <span
                key={mat}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {mat}
              </span>
            ))}
            {facility.acceptedMaterials.length > 5 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                +{facility.acceptedMaterials.length - 5} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button asChild size="sm" variant="default" className="h-8 gap-1.5 text-xs flex-1">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-3 w-3" />
                Directions
              </a>
            </Button>
            {facility.phone && (
              <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                <a href={`tel:${facility.phone}`}>
                  <Phone className="h-3 w-3" />
                  Call
                </a>
              </Button>
            )}
            {facility.website && (
              <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0">
                <a href={facility.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>

          {/* Notes */}
          {facility.notes && (
            <p className="text-[11px] text-muted-foreground/70 italic">{facility.notes}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
