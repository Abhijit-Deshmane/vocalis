import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { orgSlug, orgId, orgRole } = await auth();

  // Slug must match the active org in the session
  if (orgSlug !== slug) {
    return NextResponse.json({ error: "Forbidden: wrong organization" }, { status: 403 });
  }

  // Must be a member of the org (any role)
  if (!orgRole) {
    return NextResponse.json({ error: "Forbidden: not an org member" }, { status: 403 });
  }

  const clerk = await clerkClient();
  const { data } = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId!,
  });

  const members = data.map((m) => ({
    id: m.id,
    role: m.role,
    createdAt: m.createdAt,
    user: {
      id: m.publicUserData?.userId,
      firstName: m.publicUserData?.firstName,
      lastName: m.publicUserData?.lastName,
      identifier: m.publicUserData?.identifier,
      imageUrl: m.publicUserData?.imageUrl,
    },
  }));

  return NextResponse.json({ members });
}