import { AdminPortal } from "@/components/admin-portal";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

type AdminPageProps = { params: Promise<{ section?: string[] }> };

export default async function AdminPage({ params }: AdminPageProps) {
  const { section = [] } = await params;
  const user = await getChatGPTUser();
  const allowedEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const localDemo = process.env.NODE_ENV === "development";
  const authorised = localDemo || Boolean(user && allowedEmails.includes(user.email.toLowerCase()));

  if (!authorised) {
    return (
      <main className="admin-access"><div><p>MAH Administration</p><h1>Authorised access only.</h1><p>Sign in with an approved administrator account. Add authorised addresses to the secure ADMIN_EMAILS environment setting before launch.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- SIWC requires top-level browser navigation. */}
        <a href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Sign in securely</a>
      </div></main>
    );
  }

  return <AdminPortal initialSection={section[0] || "overview"} userName={user?.displayName || "Local administrator"} demoMode={localDemo} />;
}
