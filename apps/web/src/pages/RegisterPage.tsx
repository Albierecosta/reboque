import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { useAuth } from "@/context/AuthContext";

type RegisterRole = "customer" | "provider";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [role, setRole] = useState<RegisterRole>("customer");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    documentNumber: "",
    city: "",
    state: "SP",
    vehicleType: "",
    vehiclePlate: "",
    serviceRadiusKm: "20",
  });

  if (isAuthenticated && user) {
    return <Navigate to={user.role === "customer" ? "/app/cliente" : user.role === "provider" ? "/app/prestador" : "/app/admin"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const nextPath = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
        providerProfile:
          role === "provider"
            ? {
                businessName: form.businessName,
                documentNumber: form.documentNumber,
                city: form.city,
                state: form.state,
                vehicleType: form.vehicleType,
                vehiclePlate: form.vehiclePlate,
                serviceRadiusKm: Number(form.serviceRadiusKm),
              }
            : undefined,
      });

      navigate(nextPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao criar conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="section-shell grid gap-16 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
      <div className="flex flex-col justify-center space-y-10">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-400">
          Onboarding
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Crie sua conta<span className="text-brand-500">.</span>
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            O cadastro já diferencia cliente e prestador, com perfil operacional completo para quem atende chamados na rua.
          </p>
        </div>

        <div className="space-y-4">
          {[
            "Autenticação segura",
            "Perfis dedicados",
            "Pronto para operar",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-zinc-300">
              <CheckCircle2 className="size-5 text-brand-500" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[40px] bg-brand-500/5 blur-3xl" />
        <Panel className="lg:p-12">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Escolha seu perfil</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["customer", "Cliente"],
                  ["provider", "Prestador"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value as RegisterRole)}
                    className={`rounded-xl border py-4 text-center text-sm font-bold transition-all ${
                      role === value
                        ? "border-brand-500 bg-brand-500/10 text-brand-400"
                        : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome</label>
                <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Telefone</label>
                <input className="field" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
                <input className="field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="exemplo@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Senha</label>
                <input className="field" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" />
              </div>
            </div>

            {role === "provider" ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome da empresa</label>
                  <input className="field" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} placeholder="Empresa de Reboque" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">CPF/CNPJ</label>
                  <input className="field" value={form.documentNumber} onChange={(event) => setForm({ ...form, documentNumber: event.target.value })} placeholder="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cidade</label>
                  <input className="field" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Sua cidade" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Estado</label>
                  <input className="field" maxLength={2} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value.toUpperCase() })} placeholder="SP" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Veículo</label>
                  <input className="field" value={form.vehicleType} onChange={(event) => setForm({ ...form, vehicleType: event.target.value })} placeholder="Ex: Caminhão Guincho" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Placa</label>
                  <input className="field" value={form.vehiclePlate} onChange={(event) => setForm({ ...form, vehiclePlate: event.target.value.toUpperCase() })} placeholder="ABC-1234" />
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm font-medium text-rose-400">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="action-primary w-full py-4 text-base">
              {isSubmitting ? "Criando conta..." : "Criar minha conta"}
            </button>

            <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-8 text-sm text-zinc-500">
              Já tem acesso?{" "}
              <Link to="/login" className="font-bold text-brand-400 hover:text-brand-300">
                Entrar
              </Link>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
