import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Shield, Sparkles, Mic, Send, Download, AlertTriangle, Activity, Zap, UserRound, FileBadge, Stethoscope, Hospital, ScanSearch, BrainCircuit, ShieldCheck, FileSearch } from "lucide-react";
import heistScene from "@/assets/heist-scene.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fraud Detection + AI Chat" },
      { name: "description", content: "AI-powered fraud detection with real-time chat assistant" },
    ],
  }),
  component: Index,
});

const FIELDS: { name: string; placeholder: string; type?: string }[] = [
  { name: "Claim_Amount", placeholder: "Claim Amount" },
  { name: "Patient_Age", placeholder: "Patient Age" },
  { name: "Provider_Type", placeholder: "Provider Type" },
  { name: "Provider_Specialty", placeholder: "Provider Specialty" },
  { name: "Diagnosis_Code", placeholder: "Diagnosis Code" },
  { name: "Procedure_Code", placeholder: "Procedure Code" },
  { name: "Number_of_Procedures", placeholder: "Number of Procedures" },
  { name: "Admission_Type", placeholder: "Admission Type" },
  { name: "Discharge_Type", placeholder: "Discharge Type" },
  { name: "Service_Type", placeholder: "Service Type" },
  { name: "Length_of_Stay_Days", placeholder: "Length of Stay" },
  { name: "Deductible_Amount", placeholder: "Deductible" },
  { name: "CoPay_Amount", placeholder: "CoPay" },
  { name: "Number_of_Previous_Claims_Patient", placeholder: "Prev Claims Patient" },
  { name: "Number_of_Previous_Claims_Provider", placeholder: "Prev Claims Provider" },
  { name: "Provider_Patient_Distance_Miles", placeholder: "Distance (mi)" },
  { name: "Claim_Submitted_Late", placeholder: "Late (0/1)" },
  { name: "Claim_Date", placeholder: "Claim Date", type: "date" },
  { name: "Service_Date", placeholder: "Service Date", type: "date" },
  { name: "Policy_Expiration_Date", placeholder: "Policy Expiration", type: "date" },
];

type ChatMsg = { type: "user" | "bot"; text: string };

function Index() {
  const formRef = useRef<HTMLFormElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<{ ok: boolean; html: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { type: "bot", text: "Hi! I'm your AI fraud assistant. Ask me anything about claims, risks, or patterns." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  async function handlePredict(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const r = await res.json();
      if (r.success) {
        setResult({
          ok: true,
          html: `Fraud Probability: ${r.fraud_probability}<br>Risk: ${r.risk_level}<br>Action: ${r.recommended_action}`,
        });
      } else {
        setResult({ ok: false, html: `Error: ${r.error}` });
      }
    } catch (err) {
      setResult({ ok: false, html: `Error: ${(err as Error).message}` });
    } finally {
      setLoading(false);
    }
  }

  async function sendChat() {
    const msg = chatInput.trim();
    if (!msg || streaming) return;
    setMessages((m) => [...m, { type: "user", text: msg }]);
    setChatInput("");
    setStreaming(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/chat_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: msg }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      setMessages((m) => [...m, { type: "bot", text: "" }]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { type: "bot", text: fullText };
          return copy;
        });
        requestAnimationFrame(() => {
          if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        });
      }
    } catch (err) {
      setMessages((m) => [...m, { type: "bot", text: `Error: ${(err as Error).message}` }]);
    } finally {
      setStreaming(false);
    }
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => setChatInput(event.results[0][0].transcript);
    recognition.start();
  }

  async function downloadPDF() {
    if (!result) return;
    const text = result.html.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "");
    const res = await fetch("http://127.0.0.1:5000/download_pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fraud_report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="relative min-h-screen grid-bg overflow-hidden">
      {/* Floating orbs */}
      <div className="orb-1 pointer-events-none fixed top-20 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.6 0.28 300), transparent)" }} />
      <div className="orb-2 pointer-events-none fixed bottom-20 -right-32 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.6 0.25 200), transparent)" }} />
      <div className="orb-1 pointer-events-none fixed top-1/2 left-1/2 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.7 0.28 330), transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="slide-up mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative" style={{ perspective: "600px" }}>
              {/* Orbiting ring */}
              <div className="absolute inset-0 spin-slow" style={{ pointerEvents: "none" }}>
                <div className="absolute -inset-2 rounded-full border border-dashed" style={{ borderColor: "oklch(0.7 0.25 300 / 0.3)" }} />
              </div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl float-anim pulse-glow-anim icon-3d" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-3d)" }}>
                <Shield className="h-8 w-8 text-black" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bounce-in" style={{ background: "var(--lime)", boxShadow: "0 0 12px var(--lime)" }} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient md:text-4xl">FraudGuard AI</h1>
              <p className="text-sm text-muted-foreground">Neural fraud detection · Realtime intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              { label: "Models", value: "v4.2" },
              { label: "Accuracy", value: "84%" },
              { label: "Status", value: "Live", live: true },
            ].map((s) => (
              <div key={s.label} className="glass-card hover-tilt hidden px-4 py-2 md:block">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  {s.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--lime)" }} />
                      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--lime)" }} />
                    </span>
                  )}
                  <span className={s.live ? "text-gradient" : ""}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* HERO */}
        <section className="slide-up mb-12 text-center" style={{ animationDelay: "0.05s" }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase" style={{ background: "linear-gradient(145deg, oklch(0.25 0.08 280 / 0.6), oklch(0.15 0.05 280 / 0.4))", border: "1px solid oklch(1 0 0 / 0.12)", color: "var(--cyan)" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--lime)" }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--lime)" }} />
            </span>
            Neural Engine Online
          </div>
          <h2 className="hero-title text-gradient">FRAUD AGENT</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            An autonomous AI sentinel that hunts insurance fraud in real time — scoring claims, mapping risk, and explaining every decision.
          </p>
        </section>

        {/* FRAUD HEIST SCENE — animated narrative */}
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--cyan)" }}>Live Threat Simulation</div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">A fraudster strikes — the agent gives chase</h3>
            </div>
            <div className="hidden text-right text-xs text-muted-foreground md:block">
              <div className="font-mono text-lg text-foreground">&lt;120ms</div>
              detection latency
            </div>
          </div>

          <div className="glass-card relative overflow-hidden p-0">
            {/* cinematic backdrop */}
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "21 / 9" }}>
              <video
                  src="/heist-scene.mp4"
                  poster={heistScene}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "saturate(1.05) contrast(1.05)" }}
                />

              {/* vignette + bottom fade */}
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.02 270 / 0.65) 100%)" }} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg, transparent, oklch(0.08 0.02 270 / 0.85))" }} />

              {/* HUD scanline */}
              <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40" style={{ background: "repeating-linear-gradient(180deg, transparent 0 3px, oklch(0.8 0.18 200 / 0.05) 3px 4px)" }} />
              {/* moving scan beam */}
              <div className="pointer-events-none absolute inset-y-0 w-32 opacity-60" style={{ background: "linear-gradient(90deg, transparent, oklch(0.8 0.18 200 / 0.25), transparent)", animation: "scan-beam 4s linear infinite" }} />

              {/* TARGET LOCK on thief */}
              <div className="pointer-events-none absolute" style={{ left: "52%", top: "28%", width: "22%", height: "58%", animation: "target-pulse 1.8s ease-in-out infinite" }}>
                <div className="absolute inset-0 rounded-sm" style={{ border: "1.5px solid oklch(0.65 0.27 25)", boxShadow: "0 0 24px oklch(0.65 0.27 25 / 0.6), inset 0 0 18px oklch(0.65 0.27 25 / 0.25)" }} />
                {/* corners */}
                {["-top-1 -left-1 border-l-2 border-t-2","-top-1 -right-1 border-r-2 border-t-2","-bottom-1 -left-1 border-l-2 border-b-2","-bottom-1 -right-1 border-r-2 border-b-2"].map(c => (
                  <span key={c} className={`absolute h-3 w-3 ${c}`} style={{ borderColor: "oklch(0.88 0.22 130)" }} />
                ))}
                <div className="absolute -top-7 left-0 flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider" style={{ background: "oklch(0.65 0.27 25 / 0.85)", color: "oklch(0.98 0 0)" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  TARGET LOCKED · 98.7%
                </div>
                <div className="absolute -bottom-7 right-0 font-mono text-[10px]" style={{ color: "oklch(0.88 0.22 130)" }}>
                  ID #4471 · FRAUD CONFIRMED
                </div>
              </div>

              {/* HUD corners */}
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded px-2 py-1 font-mono text-[10px] tracking-widest" style={{ background: "oklch(0.08 0.02 270 / 0.6)", border: "1px solid oklch(0.8 0.18 200 / 0.3)", color: "var(--cyan)" }}>
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--lime)", boxShadow: "0 0 8px var(--lime)", animation: "blink-dot 1s ease-in-out infinite" }} />
                LIVE · CAM-07
              </div>
              <div className="pointer-events-none absolute right-3 top-3 rounded px-2 py-1 font-mono text-[10px] tracking-widest" style={{ background: "oklch(0.08 0.02 270 / 0.6)", border: "1px solid oklch(1 0 0 / 0.15)", color: "var(--foreground)" }}>
                REC ● {new Date().toISOString().slice(0,10)}
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                <div className="flex items-center gap-2" style={{ color: "oklch(0.65 0.27 25)" }}>
                  <AlertTriangle className="h-3 w-3" />
                  ALERT · Unauthorized claim extraction at Cityview Hospital
                </div>
                <div className="flex items-center gap-2" style={{ color: "var(--lime)" }}>
                  <Shield className="h-3 w-3" />
                  AGENT DEPLOYED · Pursuit &lt; 120 ms
                </div>
              </div>
            </div>
          </div>
        </section>



        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT - Fraud Form */}
          <section className="glass-card slide-up relative overflow-hidden p-7" style={{ animationDelay: "0.1s" }}>
            <div className="scanline-overlay" />
            <div className="relative mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl float-anim icon-3d" style={{ background: "linear-gradient(135deg, oklch(0.7 0.25 300 / 0.4), oklch(0.7 0.2 200 / 0.4))", border: "1px solid oklch(1 0 0 / 0.15)", boxShadow: "0 8px 20px oklch(0.7 0.25 300 / 0.3)" }}>
                <Activity className="h-5 w-5" style={{ color: "var(--cyan)" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Claim Analysis</h2>
                <p className="text-xs text-muted-foreground">Submit claim details for AI fraud scoring</p>
              </div>
            </div>

            <form ref={formRef} onSubmit={handlePredict} className="relative space-y-3">
              <div className="stagger-in grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <input
                    key={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    type={f.type || "text"}
                    className="neo-input"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading} className="btn-3d mt-4 flex w-full items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black spin-slow" style={{ animationDuration: "0.8s" }} />
                    Analyzing Patterns...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Predict Fraud
                  </>
                )}
              </button>
            </form>

            {result && (
              <div
                className="bounce-in mt-6 rounded-2xl p-5"
                style={{
                  background: result.ok ? "linear-gradient(145deg, oklch(0.25 0.08 280 / 0.8), oklch(0.15 0.05 280 / 0.6))" : "linear-gradient(145deg, oklch(0.3 0.15 25 / 0.6), oklch(0.2 0.1 25 / 0.4))",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                  boxShadow: "var(--shadow-3d), 0 0 40px oklch(0.7 0.25 300 / 0.2)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 pulse-glow-anim" style={{ color: result.ok ? "var(--magenta)" : "var(--destructive)", borderRadius: "999px" }} />
                  <h3 className="font-semibold tracking-tight">{result.ok ? "Analysis Result" : "Error"}</h3>
                </div>
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: result.html }} />
              </div>
            )}

            <button onClick={downloadPDF} disabled={!result} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0" style={{ background: "linear-gradient(145deg, oklch(0.25 0.05 270 / 0.6), oklch(0.15 0.03 270 / 0.6))", border: "1px solid oklch(1 0 0 / 0.1)", color: "var(--foreground)", boxShadow: "0 4px 12px oklch(0 0 0 / 0.3)" }}>
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </section>

          {/* RIGHT - Chat */}
          <section className="glass-card slide-up flex flex-col p-7" style={{ animationDelay: "0.2s" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className={`relative h-14 w-14 shrink-0 ${streaming ? "agent--thinking" : chatInput.length > 0 ? "agent--watching" : ""}`}>
                {/* thinking ring */}
                <svg className="think-ring absolute inset-0 opacity-0 transition-opacity" viewBox="0 0 56 56" style={{ transformOrigin: "center" }}>
                  <circle cx="28" cy="28" r="26" fill="none" stroke="var(--magenta)" strokeWidth="2" strokeDasharray="8 6" opacity="0.7" />
                </svg>
                {/* glow */}
                <div className="agent-glow absolute -inset-1 rounded-full opacity-0 transition-opacity blur-md" style={{ background: "radial-gradient(circle, var(--cyan), transparent 70%)" }} />
                {/* face */}
                <svg viewBox="0 0 56 56" className="relative h-14 w-14">
                  <defs>
                    <linearGradient id="agentGrad" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.7 0.28 330)" />
                      <stop offset="100%" stopColor="oklch(0.7 0.22 300)" />
                    </linearGradient>
                  </defs>
                  <circle cx="28" cy="28" r="22" fill="url(#agentGrad)" stroke="oklch(1 0 0 / 0.25)" strokeWidth="1.5" />
                  {/* headset */}
                  <path d="M10 26 Q10 12 28 12 Q46 12 46 26" fill="none" stroke="oklch(0.15 0.02 270)" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="6" y="24" width="6" height="10" rx="2" fill="oklch(0.15 0.02 270)" />
                  <rect x="44" y="24" width="6" height="10" rx="2" fill="oklch(0.15 0.02 270)" />
                  {/* eyes */}
                  <g className="agent-eye">
                    <ellipse cx="21" cy="28" rx="3.5" ry="4" fill="oklch(0.98 0 0)" />
                    <circle className="agent-pupil" cx="21" cy="28" r="1.8" fill="oklch(0.15 0.02 270)" />
                  </g>
                  <g className="agent-eye" style={{ animationDelay: "0.1s" }}>
                    <ellipse cx="35" cy="28" rx="3.5" ry="4" fill="oklch(0.98 0 0)" />
                    <circle className="agent-pupil" cx="35" cy="28" r="1.8" fill="oklch(0.15 0.02 270)" />
                  </g>
                  {/* mouth */}
                  <ellipse className="agent-mouth" cx="28" cy="38" rx="4" ry="1.6" fill="oklch(0.15 0.02 270)" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">AI Fraud Assistant</h2>
                <p className="text-xs text-muted-foreground transition-colors">
                  {streaming ? <span style={{ color: "var(--magenta)" }}>● Thinking…</span> : chatInput.length > 0 ? <span style={{ color: "var(--cyan)" }}>● Watching you type…</span> : "Voice enabled · Realtime streaming"}
                </p>
              </div>
            </div>

            <div
              ref={chatBoxRef}
              className="scrollbar-fancy relative flex-1 space-y-3 overflow-y-auto rounded-2xl p-4"
              style={{
                minHeight: "480px",
                maxHeight: "calc(100vh - 320px)",
                background: "linear-gradient(145deg, oklch(0.08 0.02 270 / 0.8), oklch(0.12 0.03 270 / 0.6))",
                border: "1px solid oklch(1 0 0 / 0.06)",
                boxShadow: "inset 0 2px 8px oklch(0 0 0 / 0.4)",
              }}
            >
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isEmptyStreaming = streaming && isLast && m.type === "bot" && !m.text;
                return (
                  <div key={i} className={`chat-bubble flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                      style={
                        m.type === "user"
                          ? { background: "var(--gradient-primary)", color: "oklch(0.1 0 0)", boxShadow: "0 6px 18px oklch(0.7 0.25 300 / 0.45), inset 0 1px 0 oklch(1 0 0 / 0.3)", borderBottomRightRadius: "0.375rem" }
                          : { background: "linear-gradient(145deg, oklch(0.25 0.05 270 / 0.9), oklch(0.18 0.04 270 / 0.7))", border: "1px solid oklch(1 0 0 / 0.08)", borderBottomLeftRadius: "0.375rem", boxShadow: "0 4px 12px oklch(0 0 0 / 0.3)" }
                      }
                    >
                      {isEmptyStreaming ? (
                        <span className="inline-flex items-center">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </span>
                      ) : (
                        m.text
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask about fraud patterns, risk scores..."
                className="neo-input flex-1"
              />
              <button onClick={sendChat} disabled={streaming} className="btn-3d flex items-center gap-2 px-5 disabled:opacity-60">
                <Send className="h-4 w-4" />
              </button>
              <button onClick={startVoice} className="flex items-center justify-center rounded-xl px-4 transition-all duration-300 hover:scale-110 hover:rotate-6" style={{ background: "linear-gradient(145deg, oklch(0.4 0.2 330), oklch(0.3 0.15 300))", border: "1px solid oklch(1 0 0 / 0.2)", boxShadow: "0 6px 18px oklch(0.7 0.25 330 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.25)", color: "white" }} title="Voice input">
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>

        <footer className="slide-up mt-10 text-center text-xs text-muted-foreground" style={{ animationDelay: "0.3s" }}>
          <span className="text-gradient font-medium">FraudGuard AI</span> · Neural detection engine · Enterprise grade security
        </footer>
      </div>
    </div>
  );
}

