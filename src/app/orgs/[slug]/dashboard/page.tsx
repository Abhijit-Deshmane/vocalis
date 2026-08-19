import { auth, clerkClient } from "@clerk/nextjs/server";

interface DashboardPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { slug } = await params;
  const { orgId, orgRole } = await auth();

  let memberCount = 0;
  if (orgId) {
    const clerk = await clerkClient();
    const { totalCount } = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
    memberCount = totalCount;
  }

  const isAdmin = orgRole === "org:admin";

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
          color: "#111827",
        }}
      >
        Welcome to <span style={{ color: "#4f46e5" }}>{slug}</span>
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Your organization dashboard
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Members card */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "1.25rem",
            background: "#fff",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
            Members
          </p>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#111827" }}>
            {memberCount}
          </p>
        </div>

        {/* Role card */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "1.25rem",
            background: "#fff",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
            Your Role
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: isAdmin ? "#ede9fe" : "#f3f4f6",
              color: isAdmin ? "#4f46e5" : "#374151",
            }}
          >
            {isAdmin ? "Admin" : "Member"}
          </span>
        </div>
      </div>
    </div>
  );
}