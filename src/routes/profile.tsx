import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, User, MapPin, Mail, LogOut, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "FREAKY® — Perfil" }],
  }),
  component: ProfilePage,
});

type Tab = "orders" | "profile";

function ProfilePage() {
  const { user, signOut, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [marketingEmail, setMarketingEmail] = useState(true);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-[#f4f2ed]">
        <p className="font-mono text-xs uppercase">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 text-[#f4f2ed]">
        <div className="w-full max-w-md border-2 border-[#1a1a1a] bg-[#0d0d0d] p-8 text-center">
          <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / PERFIL</p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">Acesso Restrito</h2>
          <p className="mt-2 font-mono text-xs text-white/50">
            Você precisa estar conectado para visualizar seus pedidos e dados de perfil.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={openAuthModal}
              className="bg-[#c5ff00] py-3 font-mono text-xs font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Entrar na minha conta →
            </button>
            <Link
              to="/"
              className="border border-[#333] py-3 font-mono text-xs uppercase text-white/60 hover:border-white hover:text-white"
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f2ed] selection:bg-[#c5ff00] selection:text-black">
      {/* Header simples */}
      <header className="border-b-2 border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2 font-mono text-[10px] uppercase text-white/50 transition-colors hover:text-white">
            <ArrowLeft size={14} />
            Voltar à loja
          </Link>
          <Link to="/" className="text-[1.35rem] font-black italic tracking-[-0.1em] text-[#ff9900]">
            FREAKY®
          </Link>
          <div className="w-[100px]" /> {/* Spacer para centralizar logo */}
        </div>
      </header>

      {/* Container principal */}
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 py-12 md:flex-row lg:px-10 lg:py-20">
        
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <nav className="flex flex-row gap-4 border-b-2 border-[#1a1a1a] pb-4 md:flex-col md:border-b-0 md:border-l-2 md:pb-0 md:pl-6">
            <button
              onClick={() => setActiveTab("orders")}
              className={`text-left font-mono text-sm uppercase transition-colors ${
                activeTab === "orders" ? "font-bold text-[#c5ff00]" : "text-white/40 hover:text-white"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`text-left font-mono text-sm uppercase transition-colors ${
                activeTab === "profile" ? "font-bold text-[#c5ff00]" : "text-white/40 hover:text-white"
              }`}
            >
              Profile
            </button>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1">
          {activeTab === "orders" && (
            <div className="relative flex min-h-[480px] flex-col justify-center overflow-hidden border-2 border-[#1a1a1a] bg-[#0d0d0d] p-8 md:p-12">
              {/* Logo da section Hot Stuff em marca d'água no fundo */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
                <img
                  src="/hot_stuff_logo.png"
                  alt="FREAKY® logo"
                  className="w-[85%] max-w-[650px] object-contain select-none"
                  style={{ filter: "grayscale(100%) brightness(1.7)", opacity: 0.22 }}
                />
              </div>

              {/* Conteúdo */}
              <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    Bem-vindo
                  </h1>
                  <p className="font-mono text-xs uppercase text-white/60">
                    Pronto para comprar?
                  </p>
                </div>
                <Link
                  to="/"
                  className="bg-[#c5ff00] px-6 py-3 font-mono text-xs font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                >
                  Shop now →
                </Link>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="relative overflow-hidden border-2 border-[#1a1a1a] bg-[#0d0d0d] p-6 md:p-10">
              {/* Logo da section Hot Stuff em marca d'água no fundo */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
                <img
                  src="/hot_stuff_logo.png"
                  alt="FREAKY® logo"
                  className="w-[85%] max-w-[700px] object-contain select-none"
                  style={{ filter: "grayscale(100%) brightness(1.7)", opacity: 0.22 }}
                />
              </div>

              {/* Conteúdo */}
              <div className="relative z-10 space-y-10">
                {/* Contact */}
                <section>
                  <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-xl font-black uppercase text-white">Contact</h2>
                    <button className="font-mono text-[10px] uppercase text-[#c5ff00] transition-colors hover:text-white">
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-4 border border-[#222] bg-[#050505]/75 p-6 backdrop-blur-sm">
                    <Mail size={18} className="text-white/30" />
                    <div className="flex-1">
                      <p className="font-mono text-[10px] uppercase text-white/40">Email</p>
                      <p className="font-mono text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                </section>

                {/* Addresses */}
                <section>
                  <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-xl font-black uppercase text-white">Addresses</h2>
                    <button className="font-mono text-[10px] uppercase text-[#c5ff00] transition-colors hover:text-white">
                      Add +
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[#333] bg-[#050505]/50 p-12 text-center backdrop-blur-sm transition-colors hover:border-[#555] hover:bg-[#050505]/70">
                    <MapPin size={24} className="text-white/20" />
                    <p className="font-mono text-xs uppercase text-white/40">
                      Nenhum endereço adicionado
                    </p>
                  </div>
                </section>

                {/* Marketing Preferences */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-xl font-black uppercase text-white">Marketing Preferences</h2>
                  </div>
                  <div className="border border-[#222] bg-[#050505]/75 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-white/30" />
                        <span className="font-mono text-sm uppercase text-white">Email</span>
                      </div>
                      {/* Toggle Switch */}
                      <button
                        onClick={() => setMarketingEmail(!marketingEmail)}
                        className={`relative flex h-6 w-12 items-center rounded-full transition-colors ${
                          marketingEmail ? "bg-[#c5ff00]" : "bg-[#333]"
                        }`}
                      >
                        <div
                          className={`absolute flex h-4 w-4 items-center justify-center rounded-full bg-black transition-transform ${
                            marketingEmail ? "translate-x-7" : "translate-x-1"
                          }`}
                        >
                          {marketingEmail && <Check size={10} className="text-[#c5ff00]" />}
                        </div>
                      </button>
                    </div>
                    <p className="mt-4 font-mono text-[10px] uppercase text-white/40">
                      Nós não enviamos spam. Apenas drops exclusivos.
                    </p>
                  </div>
                </section>

                {/* Actions */}
                <section className="flex flex-col gap-4 border-t border-[#222] pt-8 sm:flex-row sm:items-center">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 bg-[#1a1a1a] px-6 py-3 font-mono text-xs uppercase text-white transition-colors hover:bg-red-500 hover:text-black"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="font-mono text-[10px] uppercase text-white/40 underline-offset-4 transition-colors hover:text-white hover:underline sm:ml-4"
                  >
                    Sign out of all devices
                  </button>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
