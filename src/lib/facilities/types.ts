export type FacilityCategory =
  | "recycling_center"
  | "dropoff"
  | "hazardous_waste"
  | "electronics"
  | "plastic_bags"
  | "textiles"
  | "other";

export type FacilityAddress = {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Facility = {
  id: string;
  name: string;
  category: FacilityCategory;
  address: FacilityAddress;
  coordinates: Coordinates;
  acceptedMaterials: string[];
  hours?: string;
  phone?: string;
  website?: string;
  notes?: string;
  lastVerified?: string;
};

export type FacilityWithDistance = Facility & {
  distanceMiles: number;
  distanceKm: number;
};

export type FacilityProvider = {
  id: string;
  coverage: {
    country: string;
    region?: string;
    city?: string;
  };
  source: {
    name: string;
    url?: string;
    license?: string;
  };
  facilities: Facility[];
};

export const FACILITY_CATEGORY_META: Record<
  FacilityCategory,
  { label: string; color: string; icon: string }
> = {
  recycling_center: { label: "Recycling Center", color: "#3B82F6", icon: "♻️" },
  dropoff: { label: "Drop-off", color: "#F97316", icon: "📍" },
  hazardous_waste: { label: "Hazardous Waste", color: "#EF4444", icon: "⚠️" },
  electronics: { label: "E-Waste", color: "#8B5CF6", icon: "💻" },
  plastic_bags: { label: "Plastic Bags", color: "#06B6D4", icon: "🛍️" },
  textiles: { label: "Textiles", color: "#EC4899", icon: "👕" },
  other: { label: "Other", color: "#6B7280", icon: "📦" },
};
