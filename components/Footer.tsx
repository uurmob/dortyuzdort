export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-[var(--text-tertiary)] sm:flex-row">
        <span className="font-[family-name:var(--font-mono)] text-[var(--text)]">
          dörtyüzdört
        </span>
        <span>
          © {year} dörtyüzdört. Tüm hakları saklıdır.
        </span>
      </div>
    </footer>
  );
}
