import { requireRole } from "@/lib/auth/guards";

export default async function BrandDashboard() {
  const { user, profile } = await requireRole("brand");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Brand Dashboard</h1>
      <p className="text-muted-foreground mt-2">Signed in as {user.email}</p>
      <p className="text-muted-foreground">Role: {profile.role}</p>
    </div>
  );
}