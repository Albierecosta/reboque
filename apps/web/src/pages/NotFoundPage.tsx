import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">404</p>
      <h1 className="mt-4 font-display text-5xl text-white">Página não encontrada</h1>
      <p className="mt-4 max-w-xl text-base leading-8 text-zinc-400">
        Esta rota não existe no MVP atual. Volte para a home ou entre em uma área válida da plataforma.
      </p>
      <Link to="/" className="action-primary mt-8">
        Voltar para a home
      </Link>
    </div>
  );
}
