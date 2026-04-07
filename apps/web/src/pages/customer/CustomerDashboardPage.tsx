import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { MapPanel } from "@/components/MapPanel";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, serviceTypeLabel } from "@/lib/format";

import { Activity, ArrowRight, Calendar, MapPin, Navigation, Star } from "lucide-react";

export function CustomerDashboardPage() {
  const { data, isLoading, error } = useAsyncData(() => api.customerRequests(), []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );

  if (error || !data) return (
    <div className="glass-card !bg-rose-500/5 !border-rose-500/20 p-8 text-center">
      <p className="text-rose-400 font-bold">{error ?? "Falha ao carregar dados."}</p>
    </div>
  );

  const activeRequest = data.find((request) => !["completed", "cancelled"].includes(request.status));
  const completedCount = data.filter((request) => request.status === "completed").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          eyebrow="Área do Cliente"
          title="Olá! Como podemos ajudar hoje?"
          description="Sua central de socorro veicular inteligente e acompanhamento em tempo real."
        />
        <Link to="/app/cliente/nova-solicitacao" className="action-primary group !px-8 !py-4 shadow-glow">
          <Activity className="size-5" />
          Solicitar Reboque
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricTile 
          label="Meus Pedidos" 
          value={data.length} 
          support="Total histórico" 
        />
        <MetricTile 
          label="Status Atual" 
          value={activeRequest ? "Em Curso" : "Disponível"} 
          trend={activeRequest ? { value: "Ativo", positive: true } : undefined}
        />
        <MetricTile 
          label="Concluídos" 
          value={completedCount} 
          support="Atendimentos finalizados" 
        />
      </div>

      {activeRequest ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel className="!p-0 overflow-hidden border-brand-500/20 bg-brand-500/[0.02]">
            <div className="p-8 space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500">Chamado em Andamento</span>
                  </div>
                  <h3 className="font-display text-4xl font-black text-white tracking-tight">
                    {serviceTypeLabel[activeRequest.serviceType]}
                  </h3>
                </div>
                <StatusBadge status={activeRequest.status} />
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-slate-500">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Local de Retirada</p>
                    <p className="mt-1 text-sm font-medium text-slate-200 leading-relaxed">{activeRequest.originAddress}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 text-slate-500">
                    <Navigation className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Destino</p>
                    <p className="mt-1 text-sm font-medium text-slate-200 leading-relaxed">{activeRequest.destinationAddress}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-slate-900/50 border border-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-white">Resumo do Problema</p>
                  <Calendar className="size-4 text-slate-600" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{activeRequest.problemDescription}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-sm font-bold text-white">
                  Investimento Estimado: <span className="text-brand-400">{formatCurrency(activeRequest.estimatedPrice)}</span>
                </div>
                <Link to="/app/cliente/acompanhar" className="action-primary !py-2.5 !text-xs !rounded-xl">
                  Acompanhar ao vivo
                </Link>
              </div>
            </div>
          </Panel>

          <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-premium min-h-[400px]">
            <MapPanel
              center={[activeRequest.originLatitude, activeRequest.originLongitude]}
              className="h-full"
              points={[
                { id: "origin", position: [activeRequest.originLatitude, activeRequest.originLongitude], label: "Você", tone: "emerald" },
                ...(activeRequest.provider?.providerProfile?.currentLatitude != null &&
                activeRequest.provider?.providerProfile?.currentLongitude != null
                  ? [
                      {
                        id: "provider",
                        position: [
                          activeRequest.provider.providerProfile.currentLatitude,
                          activeRequest.provider.providerProfile.currentLongitude,
                        ] as [number, number],
                        label: activeRequest.provider.providerProfile.businessName,
                        tone: "sky" as const,
                      },
                    ]
                  : []),
              ]}
            />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-card p-4 !rounded-2xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-brand-400">
                  <Activity className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Sincronizando GPS</p>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5 uppercase tracking-tighter">Última atualização agora mesmo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState 
          title="Nenhum chamado ativo" 
          description="Quando você precisar de ajuda, clique no botão acima para solicitar um reboque. Estaremos prontos para te atender." 
        />
      )}

      <Panel className="!p-0 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-black text-white tracking-tight">Atendimentos Recentes</h3>
          <Link to="/app/cliente/historico" className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest">Ver Histórico</Link>
        </div>
        
        <div className="divide-y divide-white/5">
          {data.slice(0, 4).map((request) => (
            <div key={request.id} className="group flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-white/5 text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/20 transition-all">
                <Star className="size-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white truncate">{serviceTypeLabel[request.serviceType]}</p>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500 font-medium truncate">
                  {request.originAddress}
                </p>
              </div>
              
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-white">{formatDate(request.createdAt)}</p>
                <p className="mt-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">ID: #{request.id.slice(0, 8)}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
