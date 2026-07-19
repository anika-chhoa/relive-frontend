import type {
  GenerateDescriptionInput,
  GenerateDescriptionOutput,
  ImproveDescriptionInput,
  CreateItemPayload,
  CreateItemResponse,
  Item,
  ItemsListParams,
  ItemsListResponse,
  SellerReviewsResponse,
  Review,
  CreateReviewPayload,
  CheckoutSessionResponse,
  PaymentSessionStatus,
  RelivUser,
  DashboardResponse,
  AdminOverviewResponse,
  AdminUser,
} from "@/types/domain";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Demo credentials — pre-seeded in the backend so the "Try demo login"
// button on the Login page can auto-fill the form (not auto-submit).
export const DEMO_CREDENTIALS = {
  email: "demo@relive.app",
  password: "DemoRelive123!",
};

// --- Custom credentials auth (backend-issued JWT, not Better Auth) ------

interface AuthResponse {
  user: RelivUser;
}

interface FieldErrorResponse {
  error?: string;
  errors?: Record<string, string>;
}

async function parseAuthError(res: Response): Promise<string> {
  const data: FieldErrorResponse = await res.json().catch(() => ({}));
  if (data.error) return data.error;
  if (data.errors) return Object.values(data.errors)[0];
  return "Something went wrong. Please try again.";
}

export async function registerWithCredentials(input: {
  name: string;
  email: string;
  password: string;
  image?: string;
}): Promise<RelivUser> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseAuthError(res));
  const data: AuthResponse = await res.json();
  return data.user;
}

export async function loginWithCredentials(input: {
  email: string;
  password: string;
}): Promise<RelivUser> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseAuthError(res));
  const data: AuthResponse = await res.json();
  return data.user;
}

// Called once after a Google redirect completes — converts Better Auth's
// session into our own app JWT (relive_jwt cookie), so the rest of the
// app never has to know the person signed in with Google.
export async function syncGoogleSession(): Promise<RelivUser> {
  const res = await fetch(`${API_URL}/api/auth/sync-session`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Could not complete Google sign-in");
  const data: AuthResponse = await res.json();
  return data.user;
}

export async function fetchCurrentUser(): Promise<RelivUser | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data: AuthResponse = await res.json();
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

async function requestSignature(kind: "avatar" | "item"): Promise<CloudinarySignatureResponse> {
  const path = kind === "avatar" ? "/api/uploads/signature" : "/api/uploads/signature/item";
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Could not get upload signature");
  return res.json();
}

async function uploadToCloudinary(file: File, sig: CloudinarySignatureResponse): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!uploadRes.ok) throw new Error("Image upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

// Asks the backend for a Cloudinary signature (signed upload), then
// uploads the file directly to Cloudinary from the browser.
// Keeps the Cloudinary API secret server-side only.
export async function uploadAvatarToCloudinary(file: File): Promise<string> {
  const sig = await requestSignature("avatar");
  return uploadToCloudinary(file, sig);
}

// Same idea, item-images folder + requires a logged-in seller (backend enforces it).
export async function uploadItemImageToCloudinary(file: File): Promise<string> {
  const sig = await requestSignature("item");
  return uploadToCloudinary(file, sig);
}

// --- AI Smart Listing Assistant (Add Item page) -------------------------

export async function generateListingDescription(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  const res = await fetch(`${API_URL}/api/ai/generate-description`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not generate a description");
  return data as GenerateDescriptionOutput;
}

export async function improveListingText(input: ImproveDescriptionInput): Promise<string> {
  const res = await fetch(`${API_URL}/api/ai/improve-description`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not improve this text");
  return data.improved as string;
}

// --- Items ---------------------------------------------------------------

export async function createItem(payload: CreateItemPayload): Promise<CreateItemResponse> {
  const res = await fetch(`${API_URL}/api/items`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not create the listing");
  return data as CreateItemResponse;
}

export async function getMyItems(): Promise<{ items: Item[] }> {
  const res = await fetch(`${API_URL}/api/items/mine`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load your listings");
  return data as { items: Item[] };
}

export async function updateItem(id: string, payload: CreateItemPayload): Promise<Item> {
  const res = await fetch(`${API_URL}/api/items/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not update this listing");
  return data as Item;
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not delete this listing");
}

export async function getItems(params: ItemsListParams): Promise<ItemsListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.minPrice) query.set("minPrice", params.minPrice);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);
  if (params.sort) query.set("sort", params.sort);
  if (params.excludeId) query.set("excludeId", params.excludeId);
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 8));

  const res = await fetch(`${API_URL}/api/items?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load listings");
  return data as ItemsListResponse;
}

export async function getItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_URL}/api/items/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load this item");
  return data as Item;
}

// --- Reviews ---------------------------------------------------------------

export async function getSellerReviews(sellerId: string): Promise<SellerReviewsResponse> {
  const res = await fetch(`${API_URL}/api/reviews/seller/${sellerId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load reviews");
  return data as SellerReviewsResponse;
}

export async function getFeaturedReviews(limit = 6): Promise<Review[]> {
  const res = await fetch(`${API_URL}/api/reviews/featured?limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load reviews");
  return data.reviews as Review[];
}

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not submit your review");
  return data as Review;
}

// --- Payments (Stripe) ------------------------------------------------

export async function createCheckoutSession(itemId: string): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start checkout");
  return data as CheckoutSessionResponse;
}

export async function getPaymentSessionStatus(sessionId: string): Promise<PaymentSessionStatus> {
  const res = await fetch(`${API_URL}/api/payments/session/${sessionId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not find this payment");
  return data as PaymentSessionStatus;
}


export async function getMyDashboard(): Promise<DashboardResponse> {
  const res = await fetch(`${API_URL}/api/dashboard/me`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load your dashboard");
  return data as DashboardResponse;
}

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const res = await fetch(`${API_URL}/api/admin/overview`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load admin overview");
  return data as AdminOverviewResponse;
}

export async function getAdminItems(): Promise<{ items: Item[] }> {
  const res = await fetch(`${API_URL}/api/admin/items`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load listings");
  return data as { items: Item[] };
}

export async function adminDeleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not remove this listing");
}

export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  const res = await fetch(`${API_URL}/api/admin/users`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load users");
  return data as { users: AdminUser[] };
}

export async function toggleSuspendUser(id: string, suspended: boolean): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/users/${id}/suspend`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suspended }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not update this user");
}
