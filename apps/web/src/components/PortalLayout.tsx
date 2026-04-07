import type { ReactNode } from "react";
import { LogOut, MapPinned, Shield, Siren, UserCircle2, Wrench } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { useAuth } from "@/context/AuthContext";
import { portalLabels } from "@/data/content";
import { cx, roleLabel } from "@/lib/format";
import type { Role } from "@/types";

const navigation: Record<Role, Array<{ to: string; label: string }>> = {
  customer: [
    { to: "/app/cliente", label: "Dashboard" },
    { to: "/app/cliente/nova-solicitacao", label: "Nova solicitação" },
    { to: "/app/cliente/acompanhar", label: "Acompanhar" },
    { to: "/app/cliente/historico", label: "Histórico" },
    { to: "/app/cliente/perfil", label: "Perfil" },
  ],
  provider: [
    { to: "/app/prestador", label: "Dashboard" },
    { to: "/app/prestador/chamados", label: "Chamados disponíveis" },
    { to: "/app/prestador/ativo", label: "Atendimento ativo" },
    { to: "/app/prestador/historico", label: "Histórico" },
    { to: "/app/prestador/perfil", label: "Perfil" },
  ],
  admin: [
    { to: "/app/admin", label: "Dashboard" },
    { to: "/app/admin/usuarios", label: "Usuários" },
    { to: "/app/admin/prestadores", label: "Prestadores" },
    { to: "/app/admin/chamados", label: "Chamados" },
    { to: "/app/admin/metricas", label: "Métricas" },
    { to: "/app/admin/configuracoes", label: "Configurações" },
  ],
};

const roleIcon: Record<Role, ReactNode> = {
  customer: <Siren className="size-4" />,
  provider: <Wrench className="size-4" />,
  admin: <Shield className="size-4" />,
};

export function PortalLayout({ role }: { role: Role }) {
  const { logout, user } = useAuth();
  const copy = portalLabels[role];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="mx-auto flex max-w-[1600px] gap-6 p-4 lg:p-6 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col gap-8 lg:flex glass-card p-6 !rounded-[32px]">
          <div className="px-2">
            <Brand />
          </div>
          
          <div className="flex flex-col gap-2 flex-1">
            <p className="px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Plataforma</p>
            <nav className="flex flex-col gap-1.5">
              {navigation[role].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/app/${role === "customer" ? "cliente" : role === "provider" ? "prestador" : "admin"}`}
                  className={({ isActive }) =>
                    cx(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-brand-500 text-white shadow-glow"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto space-y-4">
            <div className="rounded-3xl bg-slate-900/50 p-5 border border-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <MapPinned className="size-5" />
              </div>
              <p className="mt-4 text-sm font-bold text-white tracking-tight">Status da Operação</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 font-medium">Sistema operando normalmente em toda Grande SP.</p>
            </div>

            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut className="size-4" />
              Sair da conta
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          {/* Top Header */}
          <header className="flex shrink-0 items-center justify-between glass-card !rounded-[32px] px-8 py-4">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 text-brand-400 shadow-premium">
                {roleIcon[role]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">{roleLabel[role]}</span>
                  <div className="flex h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">{copy.headline}</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-2xl bg-slate-900/50 px-4 py-2 border border-white/5 sm:flex">
                <div className="flex h-2 w-2 relative">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative h-2 w-2 rounded-full bg-brand-500"></span>
                </div>
                <span className="text-xs font-bold text-slate-300">SISTEMA ONLINE</span>
              </div>
              
              <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                  <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tighter">Ver perfil</span>
                </div>
                <div className="h-11 w-11 rounded-2xl border-2 border-white/5 bg-slate-900 flex items-center justify-center text-slate-400 group-hover:border-brand-500/30 transition-all">
                  <UserCircle2 className="size-6" />
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            <div className="pb-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
