import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type Tab = "login" | "signup";

export function AuthModal() {
  const { authModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }

    setLoading(true);
    if (tab === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setError("Email ou senha incorretos.");
      } else {
        closeAuthModal();
        reset();
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess("Conta criada! Verifique seu e-mail para confirmar o cadastro, depois faça login.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[60] w-full max-w-md -translate-x-1/2 -translate-y-1/2 border-2 border-[#f4f2ed] bg-[#050505] p-8 shadow-[8px_8px_0_#c5ff00]">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / ACESSO</p>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#f4f2ed]">
              {tab === "login" ? "Entrar" : "Criar conta"}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="border border-[#333] p-1.5 text-white/60 transition-colors hover:border-[#f4f2ed] hover:text-white"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-[#1a1a1a]">
          {(["login", "signup"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`mr-6 pb-3 font-mono text-xs uppercase transition-colors ${
                tab === t
                  ? "border-b-2 border-[#c5ff00] text-[#c5ff00]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase text-white/60">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-[#333] bg-[#0d0d0d] px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#f4f2ed]"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase text-white/60">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#333] bg-[#0d0d0d] px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#f4f2ed]"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
              {error}
            </p>
          )}

          {/* Sucesso */}
          {success && (
            <p className="border border-[#c5ff00]/30 bg-[#c5ff00]/10 px-3 py-2 font-mono text-xs text-[#c5ff00]">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c5ff00] py-3.5 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
          >
            {loading ? "Aguarde..." : tab === "login" ? "Entrar →" : "Criar conta →"}
          </button>
        </form>

        {/* Trocar aba */}
        <p className="mt-6 text-center font-mono text-[10px] uppercase text-white/40">
          {tab === "login" ? (
            <>Não tem conta?{" "}
              <button onClick={() => handleTabChange("signup")} className="text-[#c5ff00] hover:underline">
                Criar conta
              </button>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button onClick={() => handleTabChange("login")} className="text-[#c5ff00] hover:underline">
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </>
  );
}
