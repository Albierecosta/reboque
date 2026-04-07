import { statusLabel, statusTone } from "@/lib/format";
import type { ServiceStatus } from "@/types";

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const toneClasses = statusTone(status);
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${toneClasses}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}
