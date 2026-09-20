import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNav } from "./AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/yonet/giris");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AdminNav userName={session.user?.name ?? session.user?.email ?? ""} />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
