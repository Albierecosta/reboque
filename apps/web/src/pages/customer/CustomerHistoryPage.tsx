import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, serviceTypeLabel } from "@/lib/format";

export function CustomerHistoryPage() {
  const { data, isLoading, error } = useAsyncData(() => api.customerRequests(), []);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando histórico...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar histórico."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Histórico"
        title="Todos os seus chamados"
        description="Visualize data, origem, destino, status, preço estimado e resultado de cada atendimento."
      />
      <div className="space-y-4">
        {data.map((request) => (
          <Panel key={request.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-white">{serviceTypeLabel[request.serviceType]}</h3>
                <p className="text-sm text-zinc-400">Origem: {request.originAddress}</p>
                <p className="text-sm text-zinc-400">Destino: {request.destinationAddress}</p>
              </div>
              <div className="space-y-2 text-sm text-zinc-300 lg:text-right">
                <StatusBadge status={request.status} />
                <p>{formatCurrency(request.estimatedPrice)}</p>
                <p>{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
