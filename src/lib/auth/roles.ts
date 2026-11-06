export const ROLES = ["influencer", "brand", "customer", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  influencer: "/influencer/dashboard",
  brand: "/brand/dashboard",
  customer: "/customer/dashboard",
  admin: "/admin/dashboard",
};

export const ROLE_PREFIXES: Record<Role, string> = {
  influencer: "/influencer",
  brand: "/brand",
  customer: "/customer",
  admin: "/admin",
};