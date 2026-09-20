import { getSettings, DEFAULT_SETTINGS, getSetting } from "@/lib/settings";
import { GenelForm } from "./GenelForm";

export default async function GenelPage() {
  const settings = await getSettings();

  const initial = Object.fromEntries(
    Object.keys(DEFAULT_SETTINGS).map((key) => [
      key,
      getSetting(settings, key as keyof typeof DEFAULT_SETTINGS),
    ]),
  ) as typeof DEFAULT_SETTINGS;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Genel İçerik</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Ana sayfanın hero ve iletişim bölümündeki metinleri buradan
        güncelleyebilirsin.
      </p>
      <GenelForm initial={initial} />
    </div>
  );
}
