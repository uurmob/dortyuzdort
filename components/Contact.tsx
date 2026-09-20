"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function Contact({ email }: { email: string }) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/iletisim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <section id="iletisim" className="section">
      <div className="container-page">
        <Reveal className="card mx-auto max-w-xl">
          <div className="text-center">
            <span className="eyebrow justify-center">İletişim</span>
            <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
              Projenizi konuşalım.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem]">
              Web tasarım veya AI otomasyon ihtiyacınızı anlatın, size en uygun
              yol haritasını birlikte çıkaralım.
            </p>
          </div>

          {status === "sent" ? (
            <div className="mt-8 flex flex-col items-center gap-2 py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-[var(--success)]" />
              <p className="text-[0.9375rem]">
                Mesajınız iletildi, en kısa sürede dönüş yapacağız.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-sm text-[var(--text-secondary)]">
                  İsim
                </label>
                <input
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
                  value={values.name}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)]">
                  E-posta
                </label>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
                  value={values.email}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)]">
                  Mesaj
                </label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
                  value={values.message}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, message: e.target.value }))
                  }
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-[var(--error)]">
                  Gönderilemedi, lütfen tekrar dene.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary w-full"
              >
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Gönder
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-tertiary)]">
            <Mail className="h-3.5 w-3.5" />
            <a href={`mailto:${email}`} className="link">
              {email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
