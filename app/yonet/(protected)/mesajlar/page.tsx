import { prisma } from "@/lib/prisma";

export default async function MesajlarPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Mesajlar</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        İletişim formundan gelen mesajlar burada listelenir.
      </p>

      {messages.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--text-tertiary)]">
          Henüz mesaj yok.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold">{message.name}</h3>
                  <a
                    href={`mailto:${message.email}`}
                    className="link text-sm"
                  >
                    {message.email}
                  </a>
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {new Intl.DateTimeFormat("tr-TR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(message.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-[0.9375rem] whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
