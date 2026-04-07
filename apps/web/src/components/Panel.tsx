import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8 shadow-premium backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]",
        className,
      )}
    >
      {children}
    </div>
  );
}
