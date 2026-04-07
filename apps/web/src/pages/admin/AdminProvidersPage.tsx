import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/api";

export function AdminProvidersPage() {
  const { data, isLoading, error, reload } = useAsyncData(() => api.adminProviders(), []);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleApproval(userId: string, isApproved: boolean) {
    await api.adminApproveProvider(userId, isApproved);
    setFeedback(isApproved ? "Prestador aprovado." : "Prestador reprovado.");
    await reload();
  }

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando prestadores...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar prestadores."}</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Prestadores"
        title="Aprovação e cobertura"
        description="Avalie cadastros profissionais, situação atual e operação em cada região."
      />
      {feedback ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}</p> : null}
      <div className="space-y-4">
        {data.map((provider) => (
          <Panel key={provider.id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="font-display text-2xl text-white">{provider.businessName}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {provider.user?.name} • {provider.city}/{provider.state} • {provider.serviceRadiusKm} km
                </p>
                <p className="mt-1 text-sm text-zinc-500">{provider.vehicleType} • {provider.vehiclePlate}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleApproval(provider.userId, true)} className="action-primary">
                  Aprovar
                </button>
                <button onClick={() => handleApproval(provider.userId, false)} className="action-secondary">
                  Reprovar
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
