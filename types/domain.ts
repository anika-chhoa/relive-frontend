export interface RelivUser {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
   isAdmin?: boolean;
}

export type ItemCondition = "Like New" | "Good" | "Fair" | "Needs Repair";

export interface Item {
  _id: string;
  title: string;
  category: string;
  condition: ItemCondition | string;
  price: number;
  location: string;
  shortDescription: string;
  fullDescription: string;
  images: string[]; 
  sellerId: string;
  sellerName?: string;
  status: "active" | "sold" | "removed";
  buyerId?: string;
  soldAt?: string;
  createdAt: string;
  updatedAt: string;
  // This is the SELLER's aggregate rating (across all their listings),
  // not a per-item rating — see Review below for why.
  avgRating?: number;
  reviewCount?: number;
}

// Reviews are about the seller, not the one-off item — see backend
// types/domain.ts for the full reasoning. itemId/itemTitle are kept
// only as display context for "reviewed after buying {itemTitle}".
export interface Review {
  _id: string;
  sellerId: string;
  itemId: string;
  itemTitle?: string;
  rating: number;
  comment: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerImage: string | null;
  createdAt: string;
}

export interface SellerReviewsResponse {
  reviews: Review[];
  avgRating: number;
  count: number;
}

export interface CreateReviewPayload {
  itemId: string;
  rating: number;
  comment: string;
}

export interface CheckoutSessionResponse {
  url: string;
}

export interface PaymentSessionStatus {
  status: string;
  itemId?: string;
  amountTotal: number | null;
  currency: string | null;
}

export type ListingLength = "short" | "medium" | "detailed";

export interface GenerateDescriptionInput {
  title: string;
  keywords?: string;
  category?: string;
  condition?: string;
  length: ListingLength;
}

export interface GenerateDescriptionOutput {
  shortDescription: string;
  fullDescription: string;
}

export interface ImproveDescriptionInput {
  text: string;
  field: "short" | "full";
}

export interface CreateItemPayload {
  title: string;
  category: string;
  condition: string;
  price: string | number;
  location: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
}

export interface CreateItemResponse extends Item {
  id: string;
}

export type SortOption = "newest" | "price-low" | "price-high";

export interface ItemsListParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
  excludeId?: string;
}

export interface ItemsListResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  activeListings: number;
  totalSalesAmount: number;
  salesCount: number;
  itemsPurchased: number;
  totalPurchasesAmount: number;
  sellerRating: number;
  reviewCount: number;
}

export interface RecentSaleOrPurchase {
  _id: string;
  title: string;
  price: number;
  soldAt: string;
  sellerName?: string;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentSales: RecentSaleOrPurchase[];
  recentPurchases: RecentSaleOrPurchase[];
  recentReviews: Review[];
  salesOverTime: MonthlyTotal[];
  categoryBreakdown: CategoryCount[];
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalGMV: number;
  totalReviews: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface AdminOverviewResponse {
  stats: AdminStats;
  salesOverTime: MonthlyTotal[];
  categoryBreakdown: CategoryCount[];
  newUsersOverTime: MonthlyCount[];
}

export interface AdminUser {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  provider: "credentials" | "google";
  suspended: boolean;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CategoryCountItem {
  category: string;
  count: number;
}

export interface PublicStats {
  totalUsers: number;
  totalListings: number;
  totalGMV: number;
  totalReviews: number;
}