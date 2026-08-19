import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrganizationProfile } from "@clerk/nextjs";

interface SettingsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { slug } = await params;
  const { orgSlug, has } = await auth();

  if (orgSlug !== slug) redirect("/");

  // Only org:admin can access settings
  if (!has({ role: "org:admin" })) {
    redirect(`/orgs/${slug}/dashboard`);
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
        Organization Settings
      </h1>
      <OrganizationProfile routing="hash" />
    </div>
  );
}