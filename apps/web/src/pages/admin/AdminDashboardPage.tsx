import { Activity, ChevronRight, Zap } from "lucide-react";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatDate, serviceTypeLabel } from "@/lib/format";

export function AdminDashboardPage() {
  const { data, isLoading, error } = useAsyncData(() => api.adminDashboard(), []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );
  
  if (error || !data) return (
    <div className="glass-card !bg-rose-500/5 !border-rose-500/20 p-8 text-center">
      <p className="text-rose-400 font-bold">{error ?? "Falha ao carregar painel."}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        eyebrow="Operações"
        title="Painel de Controle"
        description="Monitoramento centralizado de usuários, prestadores e chamados em tempo real."
      />

      <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
        <MetricTile 
          label="Usuários totais" 
          value={data.metrics.usersCount} 
          trend={{ value: "+12%", positive: true }}
        />
        <MetricTile 
          label="Prestadores aprovados" 
          value={data.metrics.providersApproved} 
          trend={{ value: "+4", positive: true }}
        />
        <MetricTile 
          label="Aguardando aprovação" 
          value={data.metrics.providersPending} 
          support="pendentes"
        />
        <MetricTile 
          label="Chamados concluídos" 
          value={data.metrics.requestsByStatus.completed ?? 0} 
          trend={{ value: "+28%", positive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel className="!p-0 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-black text-white tracking-tight">Fluxo de Atendimento</h3>
                <p className="mt-1 text-sm text-slate-500 font-medium">Últimas 24 horas de operação</p>
              </div>
              <button className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors">VER TODOS</button>
            </div>
            
            <div className="divide-y divide-white/5">
              {data.latestRequests.map((request) => (
                <div key={request.id} className="group flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-all duration-300">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-white/5 text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/20 transition-all">
                    <Activity className="size-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white truncate">{serviceTypeLabel[request.serviceType]}</p>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 font-medium truncate">
                      {request.customer?.name} <span className="mx-1 text-slate-700">•</span> {request.originAddress}
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-white">{formatDate(request.createdAt)}</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">ID: #{request.id.slice(0, 8)}</p>
                  </div>
                  
                  <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="bg-brand-500/5 border-brand-500/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-glow mb-6">
              <Zap className="size-6 fill-current" />
            </div>
            <h3 className="font-display text-xl font-black text-white tracking-tight">Despacho Inteligente</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 font-medium">
              O sistema está otimizando rotas para 12 chamados ativos no momento. ETA médio reduzido em 15% hoje.
            </p>
            <button className="mt-6 w-full action-primary !py-3 !text-xs">OTIMIZAR AGORA</button>
          </Panel>

          <Panel className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex h-2 w-2 relative">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative h-2 w-2 rounded-full bg-brand-500"></span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Heatmap</h3>
            <p className="mt-4 text-2xl font-black text-white tracking-tight">Zona Sul</p>
            <p className="mt-1 text-xs text-brand-400 font-bold uppercase">ALTA DEMANDA</p>
            <div className="mt-6 flex gap-1 h-12 items-end">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-brand-500/20 rounded-t-sm group cursor-pointer relative">
                  <div className="absolute bottom-0 w-full bg-brand-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
