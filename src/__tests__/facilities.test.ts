import { describe, it, expect } from "vitest";
import { haversineDistance, sortByDistance, filterByRadius } from "@/lib/geo/distance";
import { filterFacilities } from "@/lib/facilities/filter";
import type { FacilityWithDistance, Facility } from "@/lib/facilities/types";

describe("Haversine Distance", () => {
  it("returns 0 for same point", () => {
    const p = { lat: 40.7128, lng: -74.006 };
    expect(haversineDistance(p, p)).toBe(0);
  });

  it("calculates NYC to LA correctly (~2,451 miles)", () => {
    const nyc = { lat: 40.7128, lng: -74.006 };
    const la = { lat: 34.0522, lng: -118.2437 };
    const dist = haversineDistance(nyc, la);
    expect(dist).toBeGreaterThan(2400);
    expect(dist).toBeLessThan(2500);
  });

  it("calculates in km", () => {
    const nyc = { lat: 40.7128, lng: -74.006 };
    const la = { lat: 34.0522, lng: -118.2437 };
    const distMi = haversineDistance(nyc, la, "miles");
    const distKm = haversineDistance(nyc, la, "km");
    expect(distKm).toBeGreaterThan(distMi);
    expect(distKm / distMi).toBeCloseTo(1.609, 1);
  });

  it("is symmetric", () => {
    const a = { lat: 28.5383, lng: -81.3792 };
    const b = { lat: 30.2672, lng: -97.7431 };
    expect(haversineDistance(a, b)).toBe(haversineDistance(b, a));
  });
});

describe("sortByDistance", () => {
  const items = [
    { id: "far", coordinates: { lat: 34.0522, lng: -118.2437 } },
    { id: "near", coordinates: { lat: 40.758, lng: -73.9855 } },
    { id: "mid", coordinates: { lat: 39.7392, lng: -104.9903 } },
  ];
  const from = { lat: 40.7128, lng: -74.006 };

  it("sorts by distance ascending", () => {
    const sorted = sortByDistance(items, from);
    expect(sorted[0].id).toBe("near");
    expect(sorted[2].id).toBe("far");
  });

  it("adds distanceMiles and distanceKm", () => {
    const sorted = sortByDistance(items, from);
    expect(sorted[0].distanceMiles).toBeGreaterThan(0);
    expect(sorted[0].distanceKm).toBeGreaterThan(sorted[0].distanceMiles);
  });
});

describe("filterByRadius", () => {
  const items = [
    { id: "a", distanceMiles: 5 },
    { id: "b", distanceMiles: 15 },
    { id: "c", distanceMiles: 30 },
    { id: "d", distanceMiles: 50 },
  ];

  it("filters within radius", () => {
    expect(filterByRadius(items, 10)).toHaveLength(1);
    expect(filterByRadius(items, 25)).toHaveLength(2);
    expect(filterByRadius(items, 100)).toHaveLength(4);
  });
});

function makeFacility(overrides: Partial<FacilityWithDistance>): FacilityWithDistance {
  return {
    id: "test",
    name: "Test Facility",
    category: "recycling_center",
    address: { street: "123 Main St", city: "Test", region: "TS", postalCode: "12345", country: "US" },
    coordinates: { lat: 0, lng: 0 },
    acceptedMaterials: ["paper", "plastic"],
    distanceMiles: 5,
    distanceKm: 8,
    ...overrides,
  };
}

describe("filterFacilities", () => {
  const facilities: FacilityWithDistance[] = [
    makeFacility({ id: "a", category: "recycling_center", acceptedMaterials: ["batteries", "paper"], distanceMiles: 5, hours: "Mon-Fri 9am-5pm" }),
    makeFacility({ id: "b", category: "hazardous_waste", acceptedMaterials: ["paint", "chemicals"], distanceMiles: 15 }),
    makeFacility({ id: "c", category: "electronics", acceptedMaterials: ["electronics", "phones"], distanceMiles: 30 }),
    makeFacility({ id: "d", category: "textiles", acceptedMaterials: ["clothing", "shoes"], distanceMiles: 50, name: "Goodwill" }),
  ];

  it("filters by category", () => {
    const result = filterFacilities(facilities, { categories: ["hazardous_waste"] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });

  it("filters by multiple categories", () => {
    const result = filterFacilities(facilities, {
      categories: ["recycling_center", "electronics"],
    });
    expect(result).toHaveLength(2);
  });

  it("filters by material", () => {
    const result = filterFacilities(facilities, { materials: ["batteries"] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("filters by distance", () => {
    const result = filterFacilities(facilities, { maxDistanceMiles: 20 });
    expect(result).toHaveLength(2);
  });

  it("filters by search query", () => {
    const result = filterFacilities(facilities, { searchQuery: "goodwill" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("d");
  });

  it("combines multiple filters", () => {
    const result = filterFacilities(facilities, {
      maxDistanceMiles: 40,
      materials: ["electronics"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c");
  });

  it("returns all when no filters applied", () => {
    const result = filterFacilities(facilities, {});
    expect(result).toHaveLength(4);
  });
});
