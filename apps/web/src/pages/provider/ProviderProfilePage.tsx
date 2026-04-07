import { useState, type FormEvent } from "react";
import { LocateFixed } from "lucide-react";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { api } from "@/lib/api";

export function ProviderProfilePage() {
  const { user, refreshUser } = useAuth();
  const profile = user?.providerProfile;
  const { requestLocation, isLocating } = useGeolocation(
    profile?.currentLatitude && profile?.currentLongitude
      ? { latitude: profile.currentLatitude, longitude: profile.currentLongitude }
      : undefined,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: profile?.businessName ?? "",
    documentNumber: profile?.documentNumber ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "SP",
    vehicleType: profile?.vehicleType ?? "",
    vehiclePlate: profile?.vehiclePlate ?? "",
    serviceRadiusKm: String(profile?.serviceRadiusKm ?? 20),
  });

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api.providerUpdateProfile({
      ...form,
      serviceRadiusKm: Number(form.serviceRadiusKm),
    });
    setFeedback("Perfil profissional atualizado.");
    await refreshUser();
  }

  async function handleAvailability(isOnline: boolean) {
    const position = isOnline ? await requestLocation() : null;

    await api.providerAvailability({
      isOnline,
      currentLatitude: position?.latitude,
      currentLongitude: position?.longitude,
    });

    setFeedback(isOnline ? "Prestador marcado como online." : "Prestador marcado como offline.");
    await refreshUser();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil do prestador"
        title="Dados profissionais e presença em campo"
        description="Atualize as informações da operação e ative sua disponibilidade quando estiver pronto para receber chamados."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MetricTile label="Aprovação" value={profile?.isApproved ? "Aprovado" : "Em análise"} support="Gestão feita pelo administrador" />
        <MetricTile label="Status atual" value={profile?.isOnline ? "Online" : "Offline"} support="Use sua localização para receber chamados" />
        <MetricTile label="Raio de atendimento" value={`${profile?.serviceRadiusKm ?? 0} km`} support={`${profile?.city ?? "-"} / ${profile?.state ?? "-"}`} />
      </div>

      <Panel>
        <form className="space-y-4" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Empresa</label>
              <input className="field" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Documento</label>
              <input className="field" value={form.documentNumber} onChange={(event) => setForm({ ...form, documentNumber: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Cidade</label>
              <input className="field" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Estado</label>
              <input className="field" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Tipo de veículo</label>
              <input className="field" value={form.vehicleType} onChange={(event) => setForm({ ...form, vehicleType: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Placa</label>
              <input className="field" value={form.vehiclePlate} onChange={(event) => setForm({ ...form, vehiclePlate: event.target.value.toUpperCase() })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">Raio de atendimento (km)</label>
              <input className="field" type="number" min="1" value={form.serviceRadiusKm} onChange={(event) => setForm({ ...form, serviceRadiusKm: event.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="action-primary">
              Salvar perfil
            </button>
            <button type="button" onClick={() => handleAvailability(true)} className="action-secondary">
              <LocateFixed className="size-4" />
              {isLocating ? "Capturando localização..." : "Ficar online"}
            </button>
            <button type="button" onClick={() => handleAvailability(false)} className="action-secondary">
              Ficar offline
            </button>
          </div>

          {feedback ? <p className="text-sm text-emerald-200">{feedback}</p> : null}
        </form>
      </Panel>
    </div>
  );
}
