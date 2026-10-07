// Single source of truth for horizontal alignment across all sections.
// max-w-[1200px] matches the design system; px-6 (24px) on mobile, px-10
// (40px) on md+. Every section wraps its content in this so left edges align.
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1200px] px-6 md:px-10 ${className ?? ""}`}>
      {children}
    </div>
  );
}