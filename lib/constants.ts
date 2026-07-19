import type { ListingLength } from "@/types/domain";

export const CATEGORIES: string[] = [
  "Electronics & Gadgets",
  "Furniture & Home",
  "Fashion & Accessories",
  "Vehicles",
  "Books & Stationery",
  "Sports & Outdoor",
  "Baby & Kids",
  "Home Appliances",
];

export const CONDITIONS: string[] = ["Like New", "Good", "Fair", "Needs Repair"];

export const LENGTH_OPTIONS: { value: ListingLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "detailed", label: "Detailed" },
];
