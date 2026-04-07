import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { MapPanel } from "@/components/MapPanel";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StatusBadge } from "@/components/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { api } from "@/lib/api";
import { calculateDistanceKm, estimateArrivalMinutes, formatDistance } from "@/lib/geo";
import { formatDate, serviceTypeLabel } from "@/lib/format";

const providerStatuses = [
  { value: "on_the_way", label: "Marcar como a caminho" },
  { value: "arrived", label: "Marcar como chegou" },
  { value: "completed", label: "Concluir atendimento" },
  { value: "cancelled", label: "Cancelar chamado" },
] as const;

export function ProviderActivePage() {
  const { data, isLoading, error, reload } = useAsyncData(() => api.providerDashboard(), []);
  const [feedback, setFeedback] = useState<string | null>(null);
  const lastSentAtRef = useRef(0);
  const {
    coordinates,
    startTracking,
    stopTracking,
    isTracking,
    error: trackingError,
  } = useGeolocation();

  useEffect(() => {
    const interval = window.setInterval(() => {
      reload();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [reload]);

  const request = data?.activeRequest ?? null;

  const providerCoordinates = useMemo(() => {
    if (coordinates) return coordinates;
    if (data?.profile.currentLatitude == null || data?.profile.currentLongitude == null) {
      return null;
    }

    return {
      latitude: data.profile.currentLatitude,
      longitude: data.profile.currentLongitude,
    };
  }, [coordinates, data]);

  const liveDistanceKm = useMemo(() => {
    if (!request || !providerCoordinates) return null;
    return calculateDistanceKm(
      providerCoordinates.latitude,
      providerCoordinates.longitude,
      request.originLatitude,
      request.originLongitude,
    );
  }, [providerCoordinates, request]);

  const etaMinutes = useMemo(() => {
    if (!request) return null;
    if (request.status === "arrived" || request.status === "completed") return 0;
    return estimateArrivalMinutes(liveDistanceKm);
  }, [liveDistanceKm, request]);

  useEffect(() => {
    if (!request) {
      stopTracking();
      return;
    }

    startTracking(async (nextCoordinates) => {
      const now = Date.now();

      if (now - lastSentAtRef.current < 8000) {
        return;
      }

      lastSentAtRef.current = now;
      await api.providerLocation({
        currentLatitude: nextCoordinates.latitude,
        currentLongitude: nextCoordinates.longitude,
      });
    });

    return () => stopTracking();
  }, [request, startTracking, stopTracking]);

  if (isLoading) return <div className="text-sm text-zinc-400">Carregando atendimento ativo...</div>;
  if (error || !data) return <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error ?? "Falha ao carregar atendimento."}</div>;

  async function handleUpdate(status: string) {
    if (!request) return;
    await api.providerUpdateStatus(request.id, status);
    setFeedback("Status atualizado com sucesso.");
    await reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Atendimento em andamento"
        title="Fluxo operacional do prestador"
        description="Atualize o status do chamado com poucos toques e mantenha o cliente informado."
      />
      {feedback ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}</p> : null}
      {request ? (
        <Panel className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Chamado ativo</p>
              <h3 className="mt-2 font-display text-3xl text-white">{serviceTypeLabel[request.serviceType]}</h3>
            </div>
            <StatusBadge status={request.status} />
          </div>
          <p className="rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-300">{request.problemDescription}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Cliente</p>
              <p className="mt-2 text-sm text-zinc-200">{request.customer?.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{request.customer?.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Origem e destino</p>
              <p className="mt-2 text-sm text-zinc-200">{request.originAddress}</p>
              <p className="mt-1 text-sm text-zinc-400">{request.destinationAddress}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
            <span>Última atualização: {formatDate(request.updatedAt)}</span>
            <span>Status atual: {request.status}</span>
            <span>Distância até o cliente: {formatDistance(liveDistanceKm)}</span>
            <span>ETA: {etaMinutes === 0 ? "Você chegou ao local" : etaMinutes ? `${etaMinutes} min` : "Calculando..."}</span>
          </div>
          <MapPanel
            center={[request.originLatitude, request.originLongitude]}
            connectPoints={Boolean(providerCoordinates)}
            points={[
              {
                id: "customer",
                position: [request.originLatitude, request.originLongitude],
                label: "Cliente aguardando no local",
                tone: "amber",
              },
              ...(providerCoordinates
                ? [
                    {
                      id: "provider",
                      position: [providerCoordinates.latitude, providerCoordinates.longitude] as [number, number],
                      label: "Seu GPS em tempo real",
                      tone: "sky" as const,
                    },
                  ]
                : []),
            ]}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">GPS do prestador</p>
              <p className="mt-2 text-sm text-zinc-200">{isTracking ? "Ativo e transmitindo" : "Parado"}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Posição atual</p>
              <p className="mt-2 text-sm text-zinc-200">
                {providerCoordinates
                  ? `${providerCoordinates.latitude.toFixed(5)}, ${providerCoordinates.longitude.toFixed(5)}`
                  : "Aguardando GPS"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Cliente</p>
              <p className="mt-2 text-sm text-zinc-200">{request.customer?.name}</p>
            </div>
          </div>
          {trackingError ? <p className="text-sm text-amber-200">{trackingError}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {providerStatuses.map((status) => (
              <button key={status.value} onClick={() => handleUpdate(status.value)} className="action-secondary">
                {status.label}
              </button>
            ))}
          </div>
        </Panel>
      ) : (
        <EmptyState title="Nenhum atendimento em andamento" description="Aceite um chamado disponível para começar a operar no painel do prestador." />
      )}
    </div>
  );
}
