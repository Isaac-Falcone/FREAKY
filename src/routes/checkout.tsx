import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft, ShoppingBag, ChevronRight, Lock, Truck, CreditCard,
  CheckCircle2, Copy, Check, ChevronDown, AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "FREAKY® — Checkout" }] }),
  component: CheckoutPage,
});

/* ─── Tipos ─────────────────────────────────────── */
type Step = "informacao" | "envio" | "pagamento" | "sucesso";
type PayMethod = "cartao" | "pix";
interface ShippingOption { id: string; label: string; desc: string; price: number; days: string; }

const SHIPPING: ShippingOption[] = [
  { id: "pac",    label: "PAC",    desc: "Correios",  price: 18.90, days: "7–12 dias úteis" },
  { id: "sedex",  label: "SEDEX",  desc: "Correios",  price: 38.90, days: "2–3 dias úteis"  },
  { id: "jadlog", label: "JADLOG", desc: ".Package",  price: 24.90, days: "5–8 dias úteis"  },
];

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
             "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

/* ─── Máscaras ───────────────────────────────────── */
const maskCEP    = (v: string) => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2");
const maskPhone  = (v: string) => { const d=v.replace(/\D/g,"").slice(0,11); return d.length<=10?d.replace(/(\d{2})(\d{4})(\d)/,"($1) $2-$3"):d.replace(/(\d{2})(\d{5})(\d)/,"($1) $2-$3"); };
const maskCard   = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
const maskExpiry = (v: string) => v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2");
const maskCVV    = (v: string) => v.replace(/\D/g,"").slice(0,4);
const maskCPF    = (v: string) => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d{3})(\d{3})(\d)/,"$1.$2.$3-$4");

function cardBrand(n: string) {
  const d = n.replace(/\s/g,"");
  if (/^4/.test(d)) return "VISA";
  if (/^5[1-5]/.test(d)) return "MASTERCARD";
  if (/^3[47]/.test(d)) return "AMEX";
  if (/^6(?:011|5)/.test(d)) return "ELO";
  return null;
}

const fmtBRL = (n: number) => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const genOrder = () => "FK-" + Math.floor(10000 + Math.random() * 90000);
const genPix   = () => Array.from({length:64},()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*62)]).join("");

/* ─── Interfaces de formulário ───────────────────── */
interface DeliveryForm {
  email: string; emailOffers: boolean; pais: string; nome: string;
  sobrenome: string; empresa: string; endereco: string; complemento: string;
  cidade: string; estado: string; cep: string; telefone: string;
  smsOffers: boolean; cpf: string;
}
interface CardForm {
  numero: string; validade: string; cvv: string; nome: string;
  parcelas: string; enderecoIgual: boolean;
}

/* ─── Componente principal ───────────────────────── */
function CheckoutPage() {
  const { user, openAuthModal } = useAuth();
  const { items, total } = useCart();

  const [step, setStep]             = useState<Step>("informacao");
  const [shipOpt, setShipOpt]       = useState<ShippingOption | null>(null);
  const [payMethod, setPayMethod]   = useState<PayMethod>("cartao");
  const [coupon, setCoupon]         = useState("");
  const [couponOk, setCouponOk]     = useState(false);
  const [discount, setDiscount]     = useState(0);
  const [orderId, setOrderId]       = useState("");
  const [pixKey, setPixKey]         = useState("");
  const [pixCopied, setPixCopied]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors]         = useState<Record<string,string>>({});
  const [cepLoading, setCepLoading] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryForm>({
    email: user?.email ?? "", emailOffers: true, pais: "Brasil", nome: "",
    sobrenome: "", empresa: "", endereco: "", complemento: "", cidade: "",
    estado: "SP", cep: "", telefone: "", smsOffers: false, cpf: "",
  });

  const [card, setCard] = useState<CardForm>({
    numero: "", validade: "", cvv: "", nome: "", parcelas: "1", enderecoIgual: true,
  });

  useEffect(() => {
    if (user?.email) setDelivery(d => ({ ...d, email: user.email! }));
  }, [user?.email]);

  const fetchCEP = useCallback(async (raw: string) => {
    const digits = raw.replace(/\D/g,"");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) setDelivery(d => ({
        ...d,
        endereco:    data.logradouro  || d.endereco,
        cidade:      data.localidade  || d.cidade,
        estado:      data.uf          || d.estado,
        complemento: data.complemento || d.complemento,
      }));
    } catch { /* silencioso */ } finally { setCepLoading(false); }
  }, []);

  const shippingPrice = shipOpt?.price ?? 0;
  const grandTotal    = total + shippingPrice - discount;

  /* ─── Validações ─── */
  function validateDelivery() {
    const e: Record<string,string> = {};
    if (!delivery.sobrenome.trim()) e.sobrenome = "Obrigatório";
    if (!delivery.endereco.trim())  e.endereco  = "Obrigatório";
    if (!delivery.cidade.trim())    e.cidade    = "Obrigatório";
    if (!delivery.cep.replace(/\D/g,"").match(/^\d{8}$/)) e.cep = "CEP inválido";
    if (!delivery.telefone.replace(/\D/g,"").match(/^\d{10,11}$/)) e.telefone = "Telefone inválido";
    if (!delivery.cpf.replace(/\D/g,"").match(/^\d{11}$/)) e.cpf = "CPF inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateCard() {
    const e: Record<string,string> = {};
    if (card.numero.replace(/\s/g,"").length < 15) e.numero   = "Número inválido";
    if (!card.validade.match(/^\d{2}\/\d{2}$/))    e.validade = "Data inválida";
    if (card.cvv.length < 3)                        e.cvv      = "CVV inválido";
    if (!card.nome.trim())                          e.nome     = "Obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applyCoupon() {
    const code = coupon.toUpperCase();
    if (code === "FREAKY10") { setDiscount(Math.round(total * 0.10 * 100) / 100); setCouponOk(true); }
    else if (code === "FREAKY20") { setDiscount(Math.round(total * 0.20 * 100) / 100); setCouponOk(true); }
    else { setDiscount(0); setCouponOk(false); }
  }

  async function placeOrder() {
    if (payMethod === "cartao" && !validateCard()) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    const id  = genOrder();
    const pix = genPix();
    setOrderId(id);
    setPixKey(pix);
    if (user) {
      try {
        const { data: ord } = await supabase.from("orders").insert({
          user_id: user.id, order_number: id, status: "aprovado",
          payment_method: payMethod, subtotal: total,
          shipping_price: shippingPrice, discount, total: grandTotal,
          shipping_name: shipOpt?.label,
          delivery_name: [delivery.nome, delivery.sobrenome].filter(Boolean).join(" "),
          delivery_address: delivery.endereco, delivery_city: delivery.cidade,
          delivery_state: delivery.estado, delivery_cep: delivery.cep,
          delivery_phone: delivery.telefone, created_at: new Date().toISOString(),
        }).select().single();
        if (ord) {
          await supabase.from("order_items").insert(
            items.map(i => ({ order_id: ord.id, product_id: i.product_id, product_name: i.product.name, product_price: i.product.price, quantity: i.quantity }))
          );
        }
        for (const item of items) { await supabase.from("cart").delete().eq("id", item.id); }
      } catch { /* silencioso se tabela não criada */ }
    }
    setProcessing(false);
    setStep("sucesso");
  }

  /* ─── Guard: Sem login ─── */
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4">
        <div className="w-full max-w-md border-2 border-[#1a1a1a] bg-[#0d0d0d] p-8 text-center">
          <Lock size={32} className="mx-auto mb-4 text-[#c5ff00]" />
          <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / CHECKOUT</p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">Login Necessário</h2>
          <p className="mt-2 font-mono text-xs text-white/50">Para finalizar sua compra, faça login na sua conta FREAKY®.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={openAuthModal} className="bg-[#c5ff00] py-3 font-mono text-xs font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
              Entrar na minha conta →
            </button>
            <Link to="/" className="border border-[#333] py-3 font-mono text-xs uppercase text-white/60 hover:border-white hover:text-white">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Guard: Sacola vazia ─── */
  if (items.length === 0 && step !== "sucesso") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4">
        <div className="w-full max-w-md border-2 border-[#1a1a1a] bg-[#0d0d0d] p-8 text-center">
          <ShoppingBag size={32} className="mx-auto mb-4 text-white/20" />
          <h2 className="text-2xl font-black uppercase text-white">Sacola Vazia</h2>
          <p className="mt-2 font-mono text-xs text-white/50">Adicione produtos antes de finalizar a compra.</p>
          <Link to="/" className="mt-6 block bg-[#c5ff00] py-3 font-mono text-xs font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
            Ir para a loja →
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Tela de Sucesso ─── */
  if (step === "sucesso") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-20">
        <div className="w-full max-w-lg border-2 border-[#1a1a1a] bg-[#0d0d0d] p-8 md:p-12">
          <CheckCircle2 size={48} className="mb-6 text-[#c5ff00]" />
          <p className="font-mono text-[10px] uppercase text-[#c5ff00]">FREAKY® / PEDIDO CONFIRMADO</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
            Compra<br />Aprovada!
          </h1>
          <p className="mt-4 font-mono text-xs uppercase text-white/50">
            Você receberá um e-mail de confirmação em breve.
          </p>
          <div className="mt-8 border border-[#1a1a1a] bg-[#050505] p-4">
            <p className="font-mono text-[10px] uppercase text-white/40">Número do pedido</p>
            <p className="mt-1 text-2xl font-black text-[#c5ff00]">#{orderId}</p>
          </div>

          {payMethod === "pix" && (
            <div className="mt-6 space-y-4">
              <p className="font-mono text-[10px] uppercase text-white/60">
                ⚡ PIX — Pague em até <span className="text-[#c5ff00]">30 minutos</span>
              </p>
              <div className="flex items-center gap-2 border border-[#333] bg-[#111] p-3">
                <p className="flex-1 truncate font-mono text-[10px] text-white/60">{pixKey}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(pixKey); setPixCopied(true); setTimeout(() => setPixCopied(false), 2000); }}
                  className="shrink-0 border border-[#444] p-1.5 text-white/60 hover:border-[#c5ff00] hover:text-[#c5ff00] transition-colors"
                >
                  {pixCopied ? <Check size={14} className="text-[#c5ff00]" /> : <Copy size={14} />}
                </button>
              </div>
              {/* QR Code SVG simulado */}
              <div className="flex justify-center">
                <div className="border-2 border-white p-3">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="text-white">
                    {Array.from({length:9}).map((_,r) =>
                      Array.from({length:9}).map((_,c) => {
                        const seed = (r*9+c + (orderId.charCodeAt(r % orderId.length)||0)) % 3;
                        return seed===0 ? <rect key={`${r}-${c}`} x={c*13+1} y={r*13+1} width={12} height={12} fill="currentColor"/> : null;
                      })
                    )}
                    <rect x={1} y={1} width={36} height={36} fill="none" stroke="currentColor" strokeWidth={3}/>
                    <rect x={7} y={7} width={24} height={24} fill="currentColor"/>
                    <rect x={83} y={1} width={36} height={36} fill="none" stroke="currentColor" strokeWidth={3}/>
                    <rect x={89} y={7} width={24} height={24} fill="currentColor"/>
                    <rect x={1} y={83} width={36} height={36} fill="none" stroke="currentColor" strokeWidth={3}/>
                    <rect x={7} y={89} width={24} height={24} fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <p className="text-center font-mono text-[10px] uppercase text-white/30">
                Escaneie com seu app bancário
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link to="/profile" className="block bg-[#c5ff00] py-4 text-center font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
              Ver meus pedidos →
            </Link>
            <Link to="/" className="block border border-[#333] py-3 text-center font-mono text-xs uppercase text-white/60 hover:border-white hover:text-white">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Layout Principal (3 steps) ─── */
  const stepOrder: Step[] = ["informacao","envio","pagamento","sucesso"];
  const stepLabels = ["Informações","Envio","Pagamento"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f2ed] selection:bg-[#c5ff00] selection:text-black">
      {/* Header */}
      <header className="border-b-2 border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2 font-mono text-[10px] uppercase text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14}/> Voltar à loja
          </Link>
          <Link to="/" className="text-[1.35rem] font-black italic tracking-[-0.1em] text-[#ff9900]">FREAKY®</Link>
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/40">
            <Lock size={12} className="text-[#c5ff00]"/> Checkout Seguro
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-[#1a1a1a]">
        <div className="mx-auto flex max-w-[1400px] items-center px-5 lg:px-10">
          {stepLabels.map((label, idx) => {
            const done = currentIdx > idx;
            const active = currentIdx === idx;
            const sName = stepOrder[idx];
            return (
              <div key={sName} className="flex items-center">
                {idx > 0 && <ChevronRight size={12} className="mx-2 text-white/20"/>}
                <button
                  onClick={() => done ? setStep(sName) : undefined}
                  className={`py-3 font-mono text-[10px] uppercase transition-colors ${active?"text-[#c5ff00]":done?"cursor-pointer text-white/60 hover:text-white":"cursor-default text-white/20"}`}
                >
                  {label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid layout */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[1fr_420px]">

        {/* ════ Coluna esquerda: formulários ════ */}
        <div className="border-r border-[#1a1a1a] px-5 py-10 lg:px-10">

          {/* ── STEP 1: Informação ── */}
          {step === "informacao" && (
            <div className="space-y-8">
              {/* Contato */}
              <section>
                <SectionHeader num="1" title="Contato"/>
                <div className="space-y-3">
                  <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-4 py-3">
                    <p className="font-mono text-[9px] uppercase text-white/40">E-mail</p>
                    <p className="mt-0.5 font-mono text-sm text-white">{delivery.email}</p>
                  </div>
                  <CheckRow
                    checked={delivery.emailOffers}
                    onChange={() => setDelivery(d=>({...d,emailOffers:!d.emailOffers}))}
                    label="Receber novidades e ofertas por e-mail"
                  />
                </div>
              </section>

              {/* Endereço de entrega */}
              <section>
                <SectionHeader num="2" title="Endereço de entrega"/>
                <div className="space-y-3">
                  {/* País */}
                  <div className="relative">
                    <select
                      value={delivery.pais}
                      onChange={e => setDelivery(d=>({...d,pais:e.target.value}))}
                      className="w-full appearance-none border border-[#1a1a1a] bg-[#0d0d0d] px-4 py-3.5 font-mono text-sm text-white outline-none focus:border-[#c5ff00] transition-colors"
                    >
                      <option>Brasil</option>
                    </select>
                    <label className="absolute left-4 top-1.5 font-mono text-[9px] uppercase text-white/40">País / Região</label>
                    <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"/>
                  </div>

                  {/* Nome + Sobrenome */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nome (opcional)" value={delivery.nome} onChange={v=>setDelivery(d=>({...d,nome:v}))}/>
                    <Field label="Sobrenome" value={delivery.sobrenome} onChange={v=>setDelivery(d=>({...d,sobrenome:v}))} error={errors.sobrenome} required/>
                  </div>

                  {/* CPF */}
                  <Field label="CPF" value={delivery.cpf} onChange={v=>setDelivery(d=>({...d,cpf:maskCPF(v)}))} error={errors.cpf} required placeholder="000.000.000-00"/>

                  {/* Empresa */}
                  <Field label="Empresa (opcional)" value={delivery.empresa} onChange={v=>setDelivery(d=>({...d,empresa:v}))}/>

                  {/* CEP */}
                  <div className="relative">
                    <Field
                      label="CEP"
                      value={delivery.cep}
                      onChange={v=>{const m=maskCEP(v); setDelivery(d=>({...d,cep:m})); if(m.replace(/\D/g,"").length===8)fetchCEP(m);}}
                      error={errors.cep}
                      required
                      placeholder="00000-000"
                    />
                    {cepLoading && <span className="absolute right-3 top-4 font-mono text-[9px] uppercase text-[#c5ff00] animate-pulse">Buscando...</span>}
                  </div>

                  {/* Endereço */}
                  <Field label="Endereço" value={delivery.endereco} onChange={v=>setDelivery(d=>({...d,endereco:v}))} error={errors.endereco} required/>

                  {/* Complemento */}
                  <Field label="Complemento / Apto (opcional)" value={delivery.complemento} onChange={v=>setDelivery(d=>({...d,complemento:v}))}/>

                  {/* Cidade + Estado */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Cidade" value={delivery.cidade} onChange={v=>setDelivery(d=>({...d,cidade:v}))} error={errors.cidade} required/>
                    <div className="relative">
                      <select
                        value={delivery.estado}
                        onChange={e=>setDelivery(d=>({...d,estado:e.target.value}))}
                        className="w-full appearance-none border border-[#1a1a1a] bg-[#0d0d0d] px-4 pb-2 pt-5 font-mono text-sm text-white outline-none focus:border-[#c5ff00] transition-colors"
                      >
                        {UFS.map(uf=><option key={uf}>{uf}</option>)}
                      </select>
                      <label className="absolute left-4 top-1.5 font-mono text-[9px] uppercase text-white/40">Estado</label>
                      <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"/>
                    </div>
                  </div>

                  {/* Telefone */}
                  <Field label="Telefone" value={delivery.telefone} onChange={v=>setDelivery(d=>({...d,telefone:maskPhone(v)}))} error={errors.telefone} required placeholder="(11) 99999-9999"/>

                  {/* SMS opt-in */}
                  <CheckRow checked={delivery.smsOffers} onChange={()=>setDelivery(d=>({...d,smsOffers:!d.smsOffers}))} label="Receber novidades por SMS"/>
                </div>
              </section>

              <button onClick={()=>{if(validateDelivery())setStep("envio");}} className="w-full bg-[#c5ff00] py-4 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                Ir para o envio →
              </button>
            </div>
          )}

          {/* ── STEP 2: Envio ── */}
          {step === "envio" && (
            <div className="space-y-8">
              <DeliverySummary delivery={delivery} onEdit={()=>setStep("informacao")}/>
              <section>
                <div className="mb-6 flex items-center gap-3 border-b border-[#1a1a1a] pb-4">
                  <Truck size={16} className="text-[#c5ff00]"/>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-white">Método de Envio</h2>
                </div>
                <div className="space-y-3">
                  {SHIPPING.map(opt=>(
                    <div key={opt.id} onClick={()=>setShipOpt(opt)} className={`flex cursor-pointer items-center justify-between border p-4 transition-colors ${shipOpt?.id===opt.id?"border-[#c5ff00] bg-[#0d0d0d]":"border-[#1a1a1a] hover:border-[#333]"}`}>
                      <div className="flex items-center gap-4">
                        <Radio checked={shipOpt?.id===opt.id}/>
                        <div>
                          <p className="font-mono text-xs font-bold uppercase text-white">{opt.label} <span className="font-normal text-white/40">— {opt.desc}</span></p>
                          <p className="font-mono text-[10px] uppercase text-white/40">{opt.days}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{fmtBRL(opt.price)}</span>
                    </div>
                  ))}
                </div>
              </section>
              <button onClick={()=>shipOpt?setStep("pagamento"):undefined} disabled={!shipOpt} className="w-full bg-[#c5ff00] py-4 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-none">
                Ir para o pagamento →
              </button>
            </div>
          )}

          {/* ── STEP 3: Pagamento ── */}
          {step === "pagamento" && (
            <div className="space-y-8">
              <DeliverySummary delivery={delivery} onEdit={()=>setStep("informacao")}/>
              {shipOpt && (
                <div className="border border-[#1a1a1a] bg-[#0d0d0d]">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
                    <p className="font-mono text-[9px] uppercase text-white/40">Envio</p>
                    <button onClick={()=>setStep("envio")} className="font-mono text-[9px] uppercase text-[#c5ff00] hover:text-white transition-colors">Alterar</button>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="font-mono text-xs text-white/80">{shipOpt.label} — {shipOpt.days}</p>
                    <p className="font-mono text-xs font-bold text-white">{fmtBRL(shipOpt.price)}</p>
                  </div>
                </div>
              )}

              <section>
                <div className="mb-6 flex items-center justify-between border-b border-[#1a1a1a] pb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-[#c5ff00]"/>
                    <h2 className="font-mono text-xs uppercase tracking-widest text-white">Pagamento</h2>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[9px] uppercase text-white/25">
                    <Lock size={10}/> Seguro e criptografado
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Cartão */}
                  <div className={`border transition-colors ${payMethod==="cartao"?"border-[#c5ff00]":"border-[#1a1a1a] hover:border-[#333]"}`}>
                    <button onClick={()=>setPayMethod("cartao")} className="flex w-full items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Radio checked={payMethod==="cartao"}/>
                        <span className="font-mono text-xs font-bold uppercase text-white">Cartão de crédito</span>
                      </div>
                      <div className="flex gap-1.5">
                        {["VISA","MC","ELO","AMEX"].map(b=>(
                          <span key={b} className="border border-[#333] bg-[#111] px-1.5 py-0.5 font-mono text-[8px] text-white/60">{b}</span>
                        ))}
                      </div>
                    </button>

                    {payMethod==="cartao" && (
                      <div className="border-t border-[#1a1a1a] bg-[#0d0d0d] p-4 space-y-3">
                        <div className="relative">
                          <Field label="Número do cartão" value={card.numero} onChange={v=>setCard(c=>({...c,numero:maskCard(v)}))} error={errors.numero} required placeholder="0000 0000 0000 0000"/>
                          {cardBrand(card.numero) && <span className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#333] bg-black px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#c5ff00]">{cardBrand(card.numero)}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Validade (MM/AA)" value={card.validade} onChange={v=>setCard(c=>({...c,validade:maskExpiry(v)}))} error={errors.validade} required placeholder="MM/AA"/>
                          <Field label="CVV" value={card.cvv} onChange={v=>setCard(c=>({...c,cvv:maskCVV(v)}))} error={errors.cvv} required placeholder="000"/>
                        </div>
                        <Field label="Nome impresso no cartão" value={card.nome} onChange={v=>setCard(c=>({...c,nome:v.toUpperCase()}))} error={errors.nome} required/>
                        {/* Parcelas */}
                        <div className="relative">
                          <select value={card.parcelas} onChange={e=>setCard(c=>({...c,parcelas:e.target.value}))} className="w-full appearance-none border border-[#1a1a1a] bg-[#050505] px-4 pb-2 pt-5 font-mono text-sm text-white outline-none focus:border-[#c5ff00] transition-colors">
                            {Array.from({length:12},(_,i)=>i+1).map(n=>(
                              <option key={n} value={String(n)}>{n}x de {fmtBRL(grandTotal/n)}{n<=3?" sem juros":""}</option>
                            ))}
                          </select>
                          <label className="absolute left-4 top-1.5 font-mono text-[9px] uppercase text-white/40">Parcelas</label>
                          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"/>
                        </div>
                        {/* Endereço de cobrança */}
                        <CheckRow checked={card.enderecoIgual} onChange={()=>setCard(c=>({...c,enderecoIgual:!c.enderecoIgual}))} label="Usar endereço de entrega como cobrança"/>
                        {/* Cartão de teste */}
                        <button onClick={()=>setCard(c=>({...c,numero:"4242 4242 4242 4242",validade:"12/29",cvv:"123",nome:"TESTE FREAKY"}))} className="w-full border border-dashed border-[#333] py-2 font-mono text-[10px] uppercase text-white/25 hover:border-[#c5ff00] hover:text-[#c5ff00] transition-colors">
                          ⚡ Preencher com cartão de teste
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PIX */}
                  <div className={`border transition-colors ${payMethod==="pix"?"border-[#c5ff00]":"border-[#1a1a1a] hover:border-[#333]"}`}>
                    <button onClick={()=>setPayMethod("pix")} className="flex w-full items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Radio checked={payMethod==="pix"}/>
                        <span className="font-mono text-xs font-bold uppercase text-white">PIX</span>
                      </div>
                      <span className="border border-[#c5ff00] px-2 py-0.5 font-mono text-[9px] font-bold text-[#c5ff00]">INSTANTÂNEO</span>
                    </button>
                    {payMethod==="pix" && (
                      <div className="border-t border-[#1a1a1a] bg-[#0d0d0d] p-4">
                        <p className="font-mono text-[10px] uppercase leading-relaxed text-white/50">
                          Após confirmar, você receberá um <strong className="text-white">QR Code</strong> e uma chave <strong className="text-white">Pix Copia e Cola</strong>. Confirmação em até <strong className="text-[#c5ff00]">30 segundos</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Botão principal */}
              <button onClick={placeOrder} disabled={processing} className="w-full bg-[#c5ff00] py-5 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-wait disabled:opacity-80">
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-block h-4 w-4 animate-spin border-2 border-black border-t-transparent"/>
                    Processando transação...
                  </span>
                ) : (
                  <><Lock size={14} className="mr-2 inline"/>{payMethod==="cartao"?"Finalizar compra e pagar":"Gerar chave PIX"} — {fmtBRL(grandTotal)}</>
                )}
              </button>
              <p className="text-center font-mono text-[9px] uppercase text-white/20">
                Ao finalizar, você concorda com os <span className="cursor-pointer text-white/40 underline">Termos de uso</span> e a <span className="cursor-pointer text-white/40 underline">Política de privacidade</span> da FREAKY®.
              </p>
            </div>
          )}
        </div>

        {/* ════ Coluna direita: resumo do pedido ════ */}
        <aside className="border-l border-[#1a1a1a] bg-[#0d0d0d] px-6 py-10">
          <ul className="divide-y divide-[#1a1a1a]">
            {items.map(item=>{
              const p = parseFloat(item.product.price.replace("R$","").replace(".","").replace(",",".").trim())||0;
              return (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#111]">
                    <img src={item.product.img} alt={item.product.name} className="h-full w-full object-cover object-top"/>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-[#1a1a1a] font-mono text-[9px] text-white">{item.quantity}</span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase leading-tight text-white">{item.product.name}</p>
                      <p className="font-mono text-[9px] uppercase text-white/40">{item.product.category_label}</p>
                    </div>
                    <p className="shrink-0 font-mono text-sm font-bold text-white">
                      {fmtBRL(p * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Cupom */}
          <div className="mt-6 flex gap-2 border-t border-[#1a1a1a] pt-6">
            <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="CÓDIGO DE DESCONTO" className="flex-1 border border-[#1a1a1a] bg-[#050505] px-3 py-2.5 font-mono text-xs uppercase text-white outline-none focus:border-[#c5ff00] transition-colors placeholder:text-white/20"/>
            <button onClick={applyCoupon} className="border border-[#c5ff00] px-4 font-mono text-xs uppercase text-[#c5ff00] hover:bg-[#c5ff00] hover:text-black transition-colors">Aplicar</button>
          </div>
          {couponOk && (
            <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase text-[#c5ff00]">
              <Check size={12}/> Cupom aplicado! − {fmtBRL(discount)}
            </div>
          )}
          {coupon && !couponOk && (
            <p className="mt-2 font-mono text-[10px] uppercase text-white/25">
              Tente: <span className="text-white/40">FREAKY10</span> ou <span className="text-white/40">FREAKY20</span>
            </p>
          )}

          {/* Totalizadores */}
          <div className="mt-6 space-y-2.5 border-t border-[#1a1a1a] pt-6">
            <TotalRow label="Subtotal" value={fmtBRL(total)}/>
            {discount>0 && <TotalRow label="Desconto" value={`− ${fmtBRL(discount)}`} highlight/>}
            <TotalRow label="Frete" value={shippingPrice>0?fmtBRL(shippingPrice):"—"}/>
          </div>
          <div className="mt-5 flex items-baseline justify-between border-t-2 border-[#f4f2ed] pt-5">
            <span className="font-mono text-sm uppercase text-white">Total</span>
            <div className="text-right">
              <span className="font-mono text-[9px] uppercase text-white/30">BRL </span>
              <span className="text-2xl font-black text-white">{fmtBRL(grandTotal)}</span>
            </div>
          </div>
          {shippingPrice===0 && <p className="mt-1 text-right font-mono text-[9px] uppercase text-white/25">Selecione o frete para calcular</p>}
        </aside>
      </div>
    </div>
  );
}

/* ─── Sub-componentes ─────────────────────────────── */

function SectionHeader({num,title}:{num:string;title:string}) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-[#1a1a1a] pb-4">
      <span className="flex h-6 w-6 items-center justify-center border border-[#c5ff00] font-mono text-[10px] text-[#c5ff00]">{num}</span>
      <h2 className="font-mono text-xs uppercase tracking-widest text-white">{title}</h2>
    </div>
  );
}

function Radio({checked}:{checked:boolean}) {
  return (
    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${checked?"border-[#c5ff00]":"border-[#444]"}`}>
      {checked && <div className="h-2.5 w-2.5 rounded-full bg-[#c5ff00]"/>}
    </div>
  );
}

function CheckRow({checked,onChange,label}:{checked:boolean;onChange:()=>void;label:string}) {
  return (
    <label className="flex cursor-pointer items-center gap-3" onClick={onChange}>
      <div className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${checked?"border-[#c5ff00] bg-[#c5ff00]":"border-[#444]"}`}>
        {checked && <Check size={10} className="text-black"/>}
      </div>
      <span className="font-mono text-[10px] uppercase text-white/50">{label}</span>
    </label>
  );
}

function Field({label,value,onChange,error,required,placeholder}:{label:string;value:string;onChange:(v:string)=>void;error?:string;required?:boolean;placeholder?:string}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder??" "}
        className={`peer w-full border bg-[#0d0d0d] px-4 pb-2 pt-5 font-mono text-sm text-white outline-none transition-colors placeholder-transparent ${error?"border-red-500":"border-[#1a1a1a] focus:border-[#c5ff00]"}`}
      />
      <label className={`pointer-events-none absolute left-4 top-1.5 font-mono text-[9px] uppercase ${error?"text-red-400":"text-white/40"}`}>
        {label}{required&&" *"}
      </label>
      {error && (
        <div className="mt-1 flex items-center gap-1">
          <AlertCircle size={10} className="text-red-400"/>
          <p className="font-mono text-[9px] uppercase text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

function DeliverySummary({delivery,onEdit}:{delivery:DeliveryForm;onEdit:()=>void}) {
  return (
    <div className="border border-[#1a1a1a] bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
        <p className="font-mono text-[9px] uppercase text-white/40">Contato</p>
        <button onClick={onEdit} className="font-mono text-[9px] uppercase text-[#c5ff00] hover:text-white transition-colors">Alterar</button>
      </div>
      <div className="px-4 py-3"><p className="font-mono text-xs text-white">{delivery.email}</p></div>
      <div className="flex items-center justify-between border-t border-[#1a1a1a] px-4 py-2.5">
        <p className="font-mono text-[9px] uppercase text-white/40">Endereço</p>
        <button onClick={onEdit} className="font-mono text-[9px] uppercase text-[#c5ff00] hover:text-white transition-colors">Alterar</button>
      </div>
      <div className="px-4 py-3">
        <p className="font-mono text-xs leading-relaxed text-white/80">
          {[delivery.nome,delivery.sobrenome].filter(Boolean).join(" ")}{delivery.empresa?` — ${delivery.empresa}`:""}<br/>
          {delivery.endereco}{delivery.complemento?`, ${delivery.complemento}`:""}<br/>
          {delivery.cidade} — {delivery.estado}, {delivery.cep}
        </p>
      </div>
    </div>
  );
}

function TotalRow({label,value,highlight}:{label:string;value:string;highlight?:boolean}) {
  return (
    <div className="flex justify-between">
      <span className={`font-mono text-xs uppercase ${highlight?"text-[#c5ff00]":"text-white/50"}`}>{label}</span>
      <span className={`font-mono text-sm ${highlight?"text-[#c5ff00]":"text-white"}`}>{value}</span>
    </div>
  );
}
