export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{"// "}{children}</span>
      <span className="section-label-fill" aria-hidden />
      <span className="section-label-index">{index}</span>
    </div>
  );
}
