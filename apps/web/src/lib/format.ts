import type { Role, ServiceStatus, ServiceType } from "@/types";

export const roleLabel: Record<Role, string> = {
  customer: "Cliente",
  provider: "Prestador",
  admin: "Administrador",
};

export const serviceTypeLabel: Record<ServiceType, string> = {
  reboque: "Reboque",
  pane_mecanica: "Pane mecânica",
  bateria_descarregada: "Bateria descarregada",
  pneu_furado: "Pneu furado",
  pane_seca: "Pane seca",
  chaveiro_automotivo: "Chaveiro automotivo",
  outro: "Outro",
};

export const statusLabel: Record<ServiceStatus, string> = {
  pending: "Pendente",
  broadcasting: "Buscando prestador",
  accepted: "Aceito",
  on_the_way: "A caminho",
  arrived: "No local",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number") return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return "Agora mesmo";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function statusTone(status: ServiceStatus) {
  const tones: Record<ServiceStatus, string> = {
    pending: "bg-white/5 text-zinc-400 ring-white/10",
    broadcasting: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    accepted: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    on_the_way: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
    arrived: "bg-brand-500/10 text-brand-400 ring-brand-500/20",
    completed: "bg-brand-500/20 text-brand-400 ring-brand-500/30",
    cancelled: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
  };

  return tones[status];
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function redirectPathForRole(role: Role) {
  if (role === "customer") return "/app/cliente";
  if (role === "provider") return "/app/prestador";
  return "/app/admin";
}
