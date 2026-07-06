import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";
import DashboardWrapper from "@/components/Dashboard/DashboardWrapper";

export default async function CreatorLayout({ children }) {
  const profile = await getUserProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "creator") redirect("/dashboard");
  if (profile.verification_status !== "approved") redirect("/creator");

  return (
    <DashboardWrapper>
      <div className="min-h-screen">
        {children}
      </div>
    </DashboardWrapper>
  );
}

