import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function GirisPage() {
  const session = await auth();
  if (session) redirect("/yonet");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <div className="hero-spotlight" style={{ "--mx": "50%", "--my": "30%" } as React.CSSProperties} />
      <div className="card relative w-full max-w-sm">
        <span className="font-[family-name:var(--font-mono)] text-lg font-bold">
          dörtyüzdört
        </span>
        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
          Yönetim paneli
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
