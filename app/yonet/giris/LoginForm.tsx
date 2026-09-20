"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      setServerError("E-posta veya şifre hatalı.");
      return;
    }

    router.push("/yonet");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-sm text-[var(--text-secondary)]">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[var(--error)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-sm text-[var(--text-secondary)]">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-[var(--error)]">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-[var(--error)]">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Giriş Yap
      </button>
    </form>
  );
}
