import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MembersPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { slug } = await params;
  const { orgId, orgSlug, orgRole, has } = await auth();

  if (!orgId || orgSlug !== slug) redirect("/");

  // All org members (admin + member) can view the member list.
  // Non-members (no orgRole) should not be here — redirect to home.
  if (!orgRole) {
    redirect("/");
  }

  const clerk = await clerkClient();
  const { data: members } = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Only admins can manage/invite members
  const canManage = has({ role: "org:admin" });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
            Members
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            {members.length} member{members.length !== 1 ? "s" : ""} in this organization
          </p>
        </div>
        {canManage && (
          <a
            href={`/orgs/${slug}/settings`}
            style={{
              padding: "0.5rem 1rem",
              background: "#4f46e5",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Invite members
          </a>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {members.map((membership, idx) => {
          const user = membership.publicUserData;
          const name =
            [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.identifier ||
            "Unknown";
          const isAdmin = membership.role === "org:admin";
          return (
            <div
              key={membership.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                borderBottom:
                  idx < members.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
            >
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={name}
                  width={36}
                  height={36}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#e0e7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#4f46e5",
                    flexShrink: 0,
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, color: "#111827", fontSize: "0.875rem" }}>
                  {name}
                </p>
                {user?.identifier && (
                  <p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "1px" }}>
                    {user.identifier}
                  </p>
                )}
              </div>
              <span
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: isAdmin ? "#ede9fe" : "#f3f4f6",
                  color: isAdmin ? "#4f46e5" : "#6b7280",
                }}
              >
                {isAdmin ? "Admin" : "Member"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}