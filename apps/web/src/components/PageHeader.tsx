import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_24px_rgba(0,0,0,0.1)] lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
