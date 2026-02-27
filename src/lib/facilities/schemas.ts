import { z } from "zod";

export const FacilityCategorySchema = z.enum([
  "recycling_center",
  "dropoff",
  "hazardous_waste",
  "electronics",
  "plastic_bags",
  "textiles",
  "other",
]);

export const FacilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: FacilityCategorySchema,
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  acceptedMaterials: z.array(z.string()),
  hours: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  lastVerified: z.string().optional(),
});

export const FacilityProviderSchema = z.object({
  id: z.string().min(1),
  coverage: z.object({
    country: z.string().min(1),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
  source: z.object({
    name: z.string().min(1),
    url: z.string().optional(),
    license: z.string().optional(),
  }),
  facilities: z.array(FacilitySchema).min(1),
});

export const GeocodeResultSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  displayName: z.string(),
});
