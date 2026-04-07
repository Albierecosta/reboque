import { Menu } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { useAuth } from "@/context/AuthContext";
import { cx, redirectPathForRole } from "@/lib/format";

const links = [
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/solicitar", label: "Solicitar atendimento" },
  { to: "/prestadores", label: "Sou prestador" },
];

export function PublicLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#090a0b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090a0b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 lg:px-8">
          <Brand />
          
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cx(
                    "text-sm font-medium transition-all duration-200 hover:text-white",
                    isActive ? "text-white" : "text-zinc-500"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to={redirectPathForRole(user.role)}
                className="action-secondary rounded-full px-5 py-2 text-xs"
              >
                Minha área
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="action-primary rounded-full px-6 py-2.5 text-xs shadow-none"
                >
                  Criar conta
                </Link>
              </>
            )}
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden">
              <Menu className="size-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
