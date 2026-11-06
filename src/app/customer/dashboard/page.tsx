import { requireRole } from "@/lib/auth/guards";

export default async function CustomerDashboard() {
  const { user, profile } = await requireRole("customer");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      <p className="text-muted-foreground mt-2">Signed in as {user.email}</p>
      <p className="text-muted-foreground">Role: {profile.role}</p>
    </div>
  );
}