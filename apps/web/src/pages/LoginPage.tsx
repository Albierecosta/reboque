import { useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Panel } from "@/components/Panel";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === "customer" ? "/app/cliente" : user.role === "provider" ? "/app/prestador" : "/app/admin"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const nextPath = await login(email, password);
      navigate(nextPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="section-shell grid gap-16 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
      <div className="flex flex-col justify-center space-y-10">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-400">
          <ShieldCheck className="size-4" />
          Acesso seguro
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Bem-vindo<span className="text-brand-500">.</span>
          </h1>
          <p className="text-lg leading-relaxed text-zinc-400">
            Acesse a plataforma com suas credenciais para entrar no painel administrativo ou no seu ambiente operacional.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[40px] bg-brand-500/5 blur-3xl" />
        <Panel className="lg:p-12">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Login</h2>
              <p className="mt-2 text-zinc-500">Insira suas credenciais para continuar.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
                <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="exemplo@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Senha</label>
                <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
              </div>
              
              {error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm font-medium text-rose-400">
                  {error}
                </div>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="action-primary w-full py-4 text-base">
                {isSubmitting ? "Autenticando..." : "Entrar na plataforma"}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-8 text-sm text-zinc-500">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="font-bold text-brand-400 hover:text-brand-300">
                Criar cadastro
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
