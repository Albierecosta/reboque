import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { statusLabel } from "@/lib/format";

export function AdminMetricsPage() {
  const { data, isLoading, error } = useAsyncData(
    async () => {
      const [dashboard, regions] = await Promise.all([api.adminDashboard(), api.adminRegions()]);
      return { dashboard, regions };
    },
    [],
  );

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando métricas...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar métricas."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Métricas e relatórios"
        title="Leitura de status e cobertura regional"
        description="Métricas básicas para acompanhamento inicial da operação e decisões do MVP."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricTile label="Pendentes" value={data.dashboard.metrics.requestsByStatus.pending ?? 0} />
        <MetricTile label="Broadcasting" value={data.dashboard.metrics.requestsByStatus.broadcasting ?? 0} />
        <MetricTile label="A caminho" value={data.dashboard.metrics.requestsByStatus.on_the_way ?? 0} />
        <MetricTile label="Cancelados" value={data.dashboard.metrics.requestsByStatus.cancelled ?? 0} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
        <Panel>
          <p className="text-sm text-zinc-400">Distribuição por status</p>
          <div className="mt-6 space-y-4">
            {(Object.entries(data.dashboard.metrics.requestsByStatus) as Array<[keyof typeof data.dashboard.metrics.requestsByStatus, number]>).map(([status, value]) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm text-zinc-300">
                  <span>{statusLabel[status as keyof typeof statusLabel]}</span>
                  <span>{value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-black/30">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.max(8, value * 18)}px` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <p className="text-sm text-zinc-400">Regiões atendidas</p>
          <div className="mt-6 space-y-3">
            {data.regions.map((region) => (
              <div key={`${region.city}-${region.state}`} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-zinc-200">
                <span>
                  {region.city}/{region.state}
                </span>
                <span className="text-amber-300">{region.providers} prestadores</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
