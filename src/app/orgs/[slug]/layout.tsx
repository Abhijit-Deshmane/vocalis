import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface OrgLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { slug } = await params;
  const { orgSlug } = await auth();

  // Security invariant: URL slug must match session active org slug.
  if (orgSlug !== slug) {
    redirect("/");
  }

  const navItems = [
    { href: `/orgs/${slug}/dashboard`, label: "Dashboard" },
    { href: `/orgs/${slug}/members`, label: "Members" },
    { href: `/orgs/${slug}/settings`, label: "Settings" },
  ];

  return (
    <div className="flex flex-1 min-h-0">
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid #e5e7eb",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          background: "#fafafa",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: "0.5rem",
            padding: "0 0.5rem",
          }}
        >
          Organization
        </p>
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "block",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "#374151",
              textDecoration: "none",
            }}
          >
            {label}
          </Link>
        ))}
      </aside>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}