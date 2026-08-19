import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, OrganizationSwitcher, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vocalis",
  description: "Vocalis — voice-first collaboration platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb', gap: '0.75rem' }}>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/orgs/:slug/dashboard"
                afterSelectOrganizationUrl="/orgs/:slug/dashboard"
                afterLeaveOrganizationUrl="/"
                afterSelectPersonalUrl="/"
              />
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
