import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { cx } from "@/lib/format";

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={cx("group inline-flex items-center gap-4 transition-all duration-300", className)}>
      <div className="relative">
        <div className="absolute -inset-2 rounded-2xl bg-brand-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-brand-400 shadow-premium transition-all duration-500 group-hover:border-brand-500/30 group-hover:text-brand-300">
          <Wrench className="size-6 transition-transform duration-500 group-hover:rotate-[30deg]" />
          <div className="absolute top-0 right-0 h-2 w-2 bg-brand-500 rounded-full border-2 border-slate-900 group-hover:scale-125 transition-all" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-xl font-black tracking-tight text-white leading-none">
          Altum<span className="text-brand-500">.</span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1.5 transition-colors group-hover:text-slate-400">
          Operação Reboque
        </span>
      </div>
    </Link>
  );
}
