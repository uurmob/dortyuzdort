"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/yonet/genel", label: "Genel" },
  { href: "/yonet/hizmetler", label: "Hizmetler" },
  { href: "/yonet/isler", label: "İşler" },
  { href: "/yonet/mesajlar", label: "Mesajlar" },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border)]">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-[family-name:var(--font-mono)] font-bold">
            dörtyüzdört <span className="text-[var(--text-tertiary)] font-normal">/ yönet</span>
          </span>
          <nav className="hidden items-center gap-6 sm:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link text-sm",
                  pathname === link.href && "text-[var(--text)]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-[var(--text-tertiary)] sm:inline">
            {userName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/yonet/giris" })}
            className="btn btn-ghost text-sm"
          >
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
}
