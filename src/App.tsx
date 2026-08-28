import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* ══════════════════════════════════════════════════════════
   CONFIG — update these before deploying
   ══════════════════════════════════════════════════════════ */

const FACEBOOK_LINK = "https://www.facebook.com/ayomideolalekanmacho";
const WHATSAPP_LINK = "https://wa.link/w6j4g9";
const WHATSAPP_NUMBER = "2349160956794"; // TODO: Replace with your actual WhatsApp number (with country code, no +)

// Backend endpoint for Telegram notifications.
// Deploy the included telegram server and put the URL here.
// NEVER put your bot token in this frontend file.
const TELEGRAM_ENDPOINT = "https://macho-notify.olalekanayomide475.workers.dev/"; // e.g. "https://your-server.com/notify"

function buildWhatsAppLink(details?: { name: string; whatsapp: string; location: string; role: string }) {
  const msg = details
    ? `Hi Macho, I just went through your website and I'm interested in learning more about the opportunity.\n\nName: ${details.name}\nLocation: ${details.location}\nI'm a: ${details.role}\nMy WhatsApp: ${details.whatsapp}`
    : "Hi Macho, I just went through your website and I'm interested in learning more about the opportunity.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const STORAGE_KEY = "macho_prospect";

/* ══════════════════════════════════════════════════════════
   PERSISTENCE — localStorage for device-level state
   ══════════════════════════════════════════════════════════ */

interface ProspectState {
  banned: boolean;
  banReason?: string;
  choiceLocked?: "never-heard" | "heard-before" | "already-member";
  detailsSubmitted: boolean;
  details?: { name: string; whatsapp: string; location: string; role: string };
  quitReason?: string;
  memberStatus?: "active" | "quit";
  sessionCount: number;
  firstVisit: string;
}

const DEFAULT_STATE: ProspectState = {
  banned: false,
  detailsSubmitted: false,
  sessionCount: 0,
  firstVisit: new Date().toISOString(),
};

function loadState(): ProspectState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_STATE }; }
}

function saveState(state: ProspectState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function banDevice(reason: string) {
  const s = loadState();
  s.banned = true;
  s.banReason = reason;
  saveState(s);
}

/* ══════════════════════════════════════════════════════════
   TELEGRAM — send events to your bot via backend
   ══════════════════════════════════════════════════════════ */

async function sendTelegram(event: string, data: Record<string, unknown> = {}) {
  if (!TELEGRAM_ENDPOINT) return;
  try {
    const state = loadState();
    await fetch(TELEGRAM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        deviceId: getDeviceId(),
        currentState: { banned: state.banned, choiceLocked: state.choiceLocked, detailsSubmitted: state.detailsSubmitted },
        ...data,
      }),
    });
  } catch {}
}

function getDeviceId(): string {
  let id = localStorage.getItem("macho_did");
  if (!id) { id = crypto.randomUUID?.() || Math.random().toString(36).slice(2); localStorage.setItem("macho_did", id); }
  return id;
}

/* ══════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════════════════════ */

function cn(...c: Array<string | false | null | undefined>) { return c.filter(Boolean).join(" "); }

// Logo: put your Macho Team logo at public/macho-team-logo.png (or .svg)
// If still using the old logo, keep the old filename below
const LOGO_PATH = "/macho-team-logo.png";

function Logo({ size = "default", className = "" }: { size?: "small" | "default" | "large"; className?: string }) {
  return (
    <img src={LOGO_PATH} alt="Macho Team logo"
      className={cn("shrink-0 rounded-xl bg-white object-contain ring-1 ring-white/15",
        size === "small" && "h-10 w-10 p-1", size === "default" && "h-12 w-12 p-1.5", size === "large" && "h-20 w-20 p-2.5", className)}
      width={size === "large" ? 80 : size === "small" ? 40 : 48}
      height={size === "large" ? 80 : size === "small" ? 40 : 48} loading="eager" />
  );
}

function Reveal({ children, className = "", delay = 0, variant = "up" }: { children: ReactNode; className?: string; delay?: number; variant?: "up" | "left" | "right" | "scale" }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const cls = variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : variant === "scale" ? "reveal-scale" : "reveal";
  return <div ref={ref} className={cn(cls, visible && "reveal-visible", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const c = "h-full w-full";
  const icons: Record<string, ReactNode> = {
    arrow: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    down: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    facebook: <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M14.1 8.5V6.7c0-.8.5-1 1-1h1.4V3.1c-.7-.1-1.5-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.7v1.8H8.2v2.9h2.4V21h3.1v-9.6h2.5l.4-2.9h-2.5Z"/></svg>,
    whatsapp: <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.2 11.2 0 0 0 3.4 17.7L2 22l4.4-1.4A11.2 11.2 0 0 0 22 10.3a11.1 11.1 0 0 0-1.5-6.8ZM12 19.1c-1.7 0-3.2-.5-4.6-1.4l-.3-.2-2.6.8.8-2.5-.2-.3A8.3 8.3 0 1 1 12 19.1Zm4.7-6.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1a6.8 6.8 0 0 1-3.4-3c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.8.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.1-.2-.2-.4-.3Z"/></svg>,
    close: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    share: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8"/><path d="m8.6 13.5 6.8 3.9M15.4 6.6l-6.8 3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    warning: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.8 1.7 18.4A2 2 0 0 0 3.4 21h17.2a2 2 0 0 0 1.7-2.6L13.7 3.8a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    lock: <svg className={c} viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    user: <svg className={c} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  };
  return <span className={cn("inline-flex", className)} aria-hidden="true">{icons[name]}</span>;
}

/* ══════════════════════════════════════════════════════════
   BANNED SCREEN — shown when device is blocked
   ══════════════════════════════════════════════════════════ */

function BannedScreen() {
  const state = loadState();
  const reason = state.banReason || "";

  const isActiveMember = reason === "active_member";
  const isQuit = reason === "quit_reason_submitted";
  const isNotInterested = reason.startsWith("not_interested");

  let heading = "Thank you for your time.";
  let message = "We appreciate your visit.";

  if (isActiveMember) {
    heading = "Thank you for your time.";
    message = "Since you're already active in the business, this website was designed for new people exploring the opportunity for the first time. We wish you the best on your journey — keep pushing.";
  } else if (isQuit) {
    heading = "Thank you for your feedback.";
    message = "We appreciate you sharing your experience. We're always working to improve, and your feedback helps. We wish you the best going forward.";
  } else if (isNotInterested) {
    heading = "No problem at all.";
    message = "We understand it's not for everyone. If you ever change your mind in the future, you're always welcome to reach out to Macho directly.";
  }

  return (
    <div className="banned-bg flex min-h-screen items-center justify-center px-6 text-center text-white">
      <div>
        <Logo size="large" className="mx-auto mb-8" />
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{heading}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-[#A7B0C0]">{message}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/7 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/12">
            <Icon name="facebook" className="h-5 w-5" /> Follow Macho on Facebook
          </a>
          {isNotInterested && (
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/7 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/12">
              <Icon name="whatsapp" className="h-5 w-5" /> Message Macho on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════ */

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return <div className="scroll-progress" style={{ width: `${pct}%` }} />;
}

/* ══════════════════════════════════════════════════════════
   DETAILS MODAL — collects name, whatsapp, location, role
   ══════════════════════════════════════════════════════════ */

function DetailsModal({ open, onClose, onSubmit, canSkip = true }: {
  open: boolean; onClose: () => void;
  onSubmit: (d: { name: string; whatsapp: string; location: string; role: string }) => void;
  canSkip?: boolean;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => { if (open) document.body.style.overflow = "hidden"; else document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!open) return null;

  const valid = name.trim() && whatsapp.trim() && location.trim() && role;
  const submit = () => { if (valid) onSubmit({ name: name.trim(), whatsapp: whatsapp.trim(), location: location.trim(), role }); };

  return (
    <div className="modal-overlay fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={canSkip ? onClose : undefined} />
      <div className="modal-panel relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        {canSkip && (
          <button type="button" onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-white/15" aria-label="Close">
            <Icon name="close" className="h-5 w-5" />
          </button>
        )}

        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4C542]/15 text-[#F4C542]">
          <Icon name="user" className="h-6 w-6" />
        </div>
        <h3 className="mt-3 pr-10 text-2xl font-black tracking-tight text-white">Before we continue</h3>
        <p className="mt-2 text-base text-[#A7B0C0]">
          Tell me a bit about yourself so I know how to help you best.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3.5 text-white placeholder:text-[#A7B0C0]/60 focus:border-[#F4C542]/50 focus:outline-none focus:ring-1 focus:ring-[#F4C542]/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">WhatsApp number</label>
            <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="e.g. 08012345678"
              className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3.5 text-white placeholder:text-[#A7B0C0]/60 focus:border-[#F4C542]/50 focus:outline-none focus:ring-1 focus:ring-[#F4C542]/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Akure, Ondo State"
              className="w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3.5 text-white placeholder:text-[#A7B0C0]/60 focus:border-[#F4C542]/50 focus:outline-none focus:ring-1 focus:ring-[#F4C542]/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">What best describes you?</label>
            <div className="grid grid-cols-2 gap-2">
              {["Student", "Employee", "Self-employed", "Job seeker"].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={cn("rounded-xl border px-4 py-3 text-sm font-bold transition",
                    role === r ? "border-[#F4C542] bg-[#F4C542]/15 text-[#F4C542]" : "border-white/12 bg-white/5 text-white hover:bg-white/10")}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="button" onClick={submit} disabled={!valid}
          className={cn("mt-6 flex w-full min-h-14 items-center justify-center rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition",
            valid ? "bg-[#F4C542] text-[#0B1220] hover:-translate-y-0.5 hover:bg-[#ffd866]" : "bg-white/10 text-white/40 cursor-not-allowed")}>
          Continue
        </button>
        {canSkip && (
          <button type="button" onClick={onClose} className="mt-3 w-full py-3 text-sm font-semibold text-[#A7B0C0] transition hover:text-white">
            I'll fill this in later
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════ */

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0B1220]/85 backdrop-blur-xl">
      <nav className="flex items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]" aria-label="Go to top">
          <Logo size="small" />
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-[0.14em] text-white">MACHO TEAM</span>
            <span className="block text-xs font-semibold text-[#F4C542]/80">FHG</span>
          </span>
        </button>
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#F4C542] px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866]">
          <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
        </a>
      </nav>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO — full width, spacious
   ══════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B1220] pt-20 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.34),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(244,197,66,0.18),transparent_27%),linear-gradient(135deg,#0B1220_0%,#111827_48%,#07101d_100%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-30" />

      <div className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-6 pb-16 text-center sm:px-10 lg:px-16">
        <Reveal>
          <Logo size="large" className="gold-glow mx-auto mb-8" />
          <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#F4C542]/90">Macho Team</p>
          <h1 className="mx-auto max-w-5xl text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-[0.92] tracking-[-0.05em]">
            You're working hard.<br />
            <span className="text-[#F4C542]">But is it building the life you actually want?</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-[#D4DAE5]">
            I asked myself that same question. Here's what I found — and why I think it could matter for you too.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <button type="button" onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-12 flex flex-col items-center gap-2 text-[#A7B0C0] transition hover:text-white">
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Scroll to begin</span>
            <Icon name="down" className="scroll-pulse h-6 w-6" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   STORY — full width, spacious
   ══════════════════════════════════════════════════════════ */

function Story() {
  return (
    <section id="story" className="scroll-mt-20 bg-[#111827] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-[#F4C542]">My Story</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-[-0.04em]">
            I was doing everything "right" — and still going nowhere.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12 space-y-7 text-lg leading-9 text-[#D4DAE5] sm:text-xl sm:leading-10">
            <p>
              I was a fashion designer apprentice. Two years learning tailoring — I could sew almost any style of clothes.
              I was also trying to get into FUTA. On paper, I was on a path.
            </p>
            <p>But then I looked at my boss — the person whose level I was working towards — and I asked myself one honest question:</p>
          </div>
        </Reveal>

        <Reveal delay={120} variant="scale">
          <blockquote className="gold-glow my-12 rounded-3xl border-l-4 border-[#F4C542] bg-[#0B1220] p-8 text-2xl font-black leading-snug tracking-[-0.02em] text-white sm:p-10 sm:text-3xl">
            "Can this path actually get me to where I want to be? Can I hit ₦1 million? ₦10 million? Can people see me and say — that person is building something?"
          </blockquote>
        </Reveal>

        <Reveal delay={160}>
          <div className="space-y-7 text-lg leading-9 text-[#D4DAE5] sm:text-xl sm:leading-10">
            <p>The honest answer was no. Not with what I was doing.</p>
            <p>
              Then my elder brother introduced me to a business opportunity. I didn't fully understand it at first — he just told me what I could gain.
              But when I got in and it was properly explained to me, I saw something that made sense.
            </p>
            <p>
              I saw a system where <strong className="text-white">my work input determines my income output.</strong> I could structure how much I wanted to earn.
              I could build skills that people pay real money for. And I could build a business alongside it.
            </p>
            <p>
              Today, I have over 5 digital skills — website design, app development, graphic design, AI tools, and more.
              I earn from my skills. I build with a team. And I can see a real path forward.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   YOUR TURN — role-based dropdowns
   ══════════════════════════════════════════════════════════ */

const ROLE_CONTENT: Record<string, { title: string; lines: string[] }> = {
  Student: {
    title: "You're a student",
    lines: [
      "You'll graduate eventually. Then what? NYSC, then job hunting, then maybe a ₦50–80k starting salary if you're lucky.",
      "What if you had real skills and income before you even left school?",
      "What if your classmates are sending CVs while you're already earning?",
      "This business gives you the chance to build something while you're still studying — so you graduate with more than just a certificate.",
    ],
  },
  Employee: {
    title: "You're working a job",
    lines: [
      "Your salary has a ceiling. Your promotion depends on someone else's decision. You trade your time for a fixed amount every month.",
      "How much can you realistically save in the next 3 years? Is it enough for the car, the house, the life you actually want?",
      "What if you could build a second income stream alongside your job — one where your effort determines your earnings, not your job title?",
    ],
  },
  "Self-employed": {
    title: "You're running your own thing",
    lines: [
      "You eat what you kill. No customers today means no income today. You trade time for money every single day.",
      "Scaling is hard. Hiring is expensive. And if you stop working, everything stops.",
      "What if you could build an additional income source that doesn't depend on you showing up every single day? Something that grows even when your main business has a slow month?",
    ],
  },
  "Job seeker": {
    title: "You're looking for work",
    lines: [
      "The job market is tough. You send applications, wait for callbacks, go for interviews — and most of the time, nothing happens.",
      "While you're waiting for someone to give you a chance, what if you built your own?",
      "Real skills. Real income. Starting now. Not after someone decides you're qualified enough — but because you decided to start.",
    ],
  },
};

function YourTurn() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="your-turn" className="scroll-mt-20 bg-[#0B1220] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-blue-300">Your Turn</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-[-0.04em]">
            Now let's talk about you.
          </h2>
          <p className="mt-5 text-xl leading-9 text-[#D4DAE5]">
            Where are you right now? Pick the one that fits — and see what this could mean for you.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {Object.entries(ROLE_CONTENT).map(([role, content], i) => (
            <Reveal key={role} delay={i * 80}>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151E2E] transition-colors hover:border-white/20">
                <button type="button" onClick={() => setExpanded(expanded === role ? null : role)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]">
                  <span className="text-lg font-black tracking-tight">{role}</span>
                  <Icon name="down" className={cn("h-5 w-5 text-[#A7B0C0] transition-transform duration-300", expanded === role && "rotate-180")} />
                </button>
                {expanded === role && (
                  <div className="dropdown-enter border-t border-white/8 px-6 pb-6 pt-5">
                    <p className="mb-4 text-base font-bold text-[#F4C542]">{content.title}</p>
                    <div className="space-y-4 text-base leading-8 text-[#D4DAE5]">
                      {content.lines.map((line, j) => <p key={j}>{line}</p>)}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   OFFER TEASER — 2-in-1 model
   ══════════════════════════════════════════════════════════ */

function OfferTeaser() {
  return (
    <section id="offer" className="scroll-mt-20 bg-[#111827] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-blue-300">What We Do</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-[-0.04em]">
            A 2‑in‑1 business model.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-[#D4DAE5]">
            One side teaches you a high-income digital skill — so you can earn from what you learn.
            The other side builds you a team-based business with real long-term income potential.
            Both sides work together in one system.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Reveal delay={80} variant="left">
            <div className="h-full rounded-3xl border border-white/10 bg-[#0B1220] p-8 text-left transition hover:-translate-y-1 hover:border-blue-300/40 sm:p-10">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-blue-300">Side 1</p>
              <h3 className="text-2xl font-black tracking-tight">Learn a digital skill</h3>
              <p className="mt-4 text-lg leading-8 text-[#A7B0C0]">
                Get trained in a real skill. Build your profile. Find clients. Get paid. Access the global market — not just your local area.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160} variant="right">
            <div className="h-full rounded-3xl border border-white/10 bg-[#0B1220] p-8 text-left transition hover:-translate-y-1 hover:border-[#F4C542]/40 sm:p-10">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#F4C542]">Side 2</p>
              <h3 className="text-2xl font-black tracking-tight">Build a team business</h3>
              <p className="mt-4 text-lg leading-8 text-[#A7B0C0]">
                Work with a team. Share products. Introduce people. Build something that grows as your team grows — with real structure behind it.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-12 text-lg leading-8 text-[#A7B0C0]">
            The first side handles your present. The second side builds your future.<br />
            Your output determines your income — nothing is guaranteed, but the structure is real.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEREST GATEWAY — locked choices, honesty notice, dead ends
   ══════════════════════════════════════════════════════════ */

type InterestStep =
  | "intro"
  | "never-heard"
  | "heard-before"
  | "already-member"
  | "member-status"
  | "quit-reason"
  | "exit-thankyou"
  | "exit-soft";

function InterestGateway({ state, setState, onDetailsNeeded }: {
  state: ProspectState;
  setState: (s: ProspectState) => void;
  onDetailsNeeded: () => void;
}) {
  const [step, setStep] = useState<InterestStep>("intro");
  const [quitReason, setQuitReason] = useState("");
  const locked = state.choiceLocked;

  const lockChoice = useCallback((choice: ProspectState["choiceLocked"]) => {
    const s = { ...state, choiceLocked: choice };
    saveState(s);
    setState(s);
    sendTelegram("option_selected", { choice });
  }, [state, setState]);

  const handleBan = useCallback((reason: string) => {
    banDevice(reason);
    sendTelegram("dead_end_reached", { reason });
    setTimeout(() => window.location.reload(), 100);
  }, []);

  const handleQuitSubmit = () => {
    if (!quitReason.trim()) return;
    sendTelegram("quit_reason_submitted", { reason: quitReason.trim() });
    handleBan("quit_reason_submitted");
  };

  const handleProceedToWhatsApp = () => {
    if (!state.detailsSubmitted) { onDetailsNeeded(); return; }
    sendTelegram("proceeding_to_whatsapp", { details: state.details });
    window.location.href = buildWhatsAppLink(state.details);
  };

  return (
    <section id="interest" className="scroll-mt-20 bg-[#0B1220] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-[#F4C542]">Next Step</p>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-[-0.04em]">
            Are you interested in learning more?
          </h2>
        </Reveal>

        {/* Honesty notice */}
        {step === "intro" && !locked && (
          <Reveal delay={80}>
            <div className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-400/8 p-6">
              <div className="flex items-start gap-3">
                <Icon name="lock" className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-amber-300">Please answer honestly.</p>
                  <p className="mt-1 text-sm text-amber-200/70">
                    Your response will be recorded and cannot be changed on this device. Choose the option that truly applies to you.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* INITIAL OPTIONS — or show locked state */}
        {step === "intro" && (
          <div className="mt-10">
            {locked ? (
              <div className="rounded-2xl border border-white/10 bg-[#151E2E] p-6">
                <div className="flex items-center gap-3">
                  <Icon name="check" className="h-5 w-5 text-green-400" />
                  <p className="font-bold text-white">
                    You selected: {locked === "never-heard" ? "I've never heard of it" : locked === "heard-before" ? "I've heard of it before" : "I'm already a member"}
                  </p>
                </div>
                <button type="button" onClick={() => setStep(locked)} className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#F4C542] transition hover:underline">
                  Continue <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              <Reveal delay={120}>
                <p className="mb-6 text-lg text-[#D4DAE5]">Have you heard about what we do before?</p>
                <div className="grid gap-4">
                  <GatewayButton onClick={() => { lockChoice("never-heard"); setStep("never-heard"); }}>
                    No, I've never heard of it
                  </GatewayButton>
                  <GatewayButton onClick={() => { lockChoice("heard-before"); setStep("heard-before"); }}>
                    Yes, I've heard of it but I didn't join
                  </GatewayButton>
                  <GatewayButton onClick={() => { lockChoice("already-member"); setStep("already-member"); }} variant="muted">
                    I'm already a member
                  </GatewayButton>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {/* NEVER HEARD */}
        {step === "never-heard" && (
          <Reveal>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#151E2E] p-8 sm:p-10">
              <h3 className="text-2xl font-black tracking-tight">Would you like a brief explanation?</h3>
              <p className="mt-3 text-lg text-[#A7B0C0]">
                I've put together a clear breakdown of how everything works — the model, what you'd be doing, and what to expect. No pressure, just information.
              </p>
              <div className="mt-8 grid gap-4">
                <button type="button" onClick={handleProceedToWhatsApp}
                  className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#F4C542] px-6 py-4 text-sm font-black uppercase tracking-widest text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866]">
                  <Icon name="whatsapp" className="h-5 w-5" /> Yes, let's talk on WhatsApp
                </button>
                <GatewayButton onClick={() => { setStep("exit-soft"); handleBan("not_interested_never_heard"); }} variant="muted">
                  No, I'm not interested
                </GatewayButton>
              </div>
            </div>
          </Reveal>
        )}

        {/* HEARD BEFORE */}
        {step === "heard-before" && (
          <Reveal>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#151E2E] p-8 sm:p-10">
              <h3 className="text-2xl font-black tracking-tight">Are you open to hearing more about it?</h3>
              <p className="mt-3 text-lg text-[#A7B0C0]">
                Different teams run things differently. I've put together a proper explanation of how we do things at Macho Team — it might be different from what you've seen before.
              </p>
              <div className="mt-8 grid gap-4">
                <button type="button" onClick={handleProceedToWhatsApp}
                  className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#F4C542] px-6 py-4 text-sm font-black uppercase tracking-widest text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866]">
                  <Icon name="whatsapp" className="h-5 w-5" /> Yes, let's talk on WhatsApp
                </button>
                <GatewayButton onClick={() => { setStep("exit-soft"); handleBan("not_interested_heard_before"); }} variant="muted">
                  No, not this time
                </GatewayButton>
              </div>
            </div>
          </Reveal>
        )}

        {/* ALREADY A MEMBER */}
        {step === "already-member" && (
          <Reveal>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#151E2E] p-8 sm:p-10">
              <h3 className="text-2xl font-black tracking-tight">Thanks for letting me know.</h3>
              <p className="mt-3 text-lg text-[#A7B0C0]">Quick question — are you still active in the business?</p>
              <div className="mt-8 grid gap-4">
                <GatewayButton onClick={() => { setStep("exit-thankyou"); handleBan("active_member"); }}>
                  Yes, I'm still in
                </GatewayButton>
                <GatewayButton onClick={() => setStep("quit-reason")}>
                  No, I left / I'm no longer active
                </GatewayButton>
              </div>
            </div>
          </Reveal>
        )}

        {/* QUIT REASON */}
        {step === "quit-reason" && (
          <Reveal>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#151E2E] p-8 sm:p-10">
              <h3 className="text-2xl font-black tracking-tight">I understand. Can I ask what happened?</h3>
              <p className="mt-3 text-lg text-[#A7B0C0]">Your feedback helps me understand how to serve people better. This is completely anonymous.</p>
              <textarea value={quitReason} onChange={e => setQuitReason(e.target.value)} rows={4} placeholder="What made you leave or stop?"
                className="mt-6 w-full rounded-xl border border-white/15 bg-white/7 px-4 py-3.5 text-white placeholder:text-[#A7B0C0]/60 focus:border-[#F4C542]/50 focus:outline-none focus:ring-1 focus:ring-[#F4C542]/30" />
              <button type="button" onClick={handleQuitSubmit} disabled={!quitReason.trim()}
                className={cn("mt-4 flex w-full min-h-14 items-center justify-center rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest transition",
                  quitReason.trim() ? "bg-[#F4C542] text-[#0B1220] hover:-translate-y-0.5 hover:bg-[#ffd866]" : "bg-white/10 text-white/40 cursor-not-allowed")}>
                Submit
              </button>
            </div>
          </Reveal>
        )}

        {/* THANK YOU (active member) */}
        {step === "exit-thankyou" && (
          <Reveal>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#151E2E] p-8 text-center sm:p-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                <Icon name="check" className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Thank you for your time.</h3>
              <p className="mt-3 text-lg text-[#A7B0C0]">
                Since you're already in the business, this website was designed for new people exploring the opportunity for the first time.
                I wish you the best on your journey. Keep pushing.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function GatewayButton({ children, onClick, variant = "default" }: { children: ReactNode; onClick: () => void; variant?: "default" | "muted" }) {
  return (
    <button type="button" onClick={onClick}
      className={cn("flex min-h-14 items-center justify-center rounded-2xl px-6 py-4 text-base font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]",
        variant === "default" && "border border-white/10 bg-white/7 text-white hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/12",
        variant === "muted" && "text-[#A7B0C0] hover:bg-white/5 hover:text-white")}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070d18] px-6 pb-28 pt-12 text-white sm:px-10 lg:px-16 lg:pb-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Logo size="default" />
          <div>
            <p className="text-lg font-black tracking-tight">Macho Team</p>
            <p className="text-sm text-[#A7B0C0]">FHG</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" aria-label="Facebook"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/7 text-white transition hover:-translate-y-0.5 hover:bg-white/12">
            <Icon name="facebook" className="h-5 w-5" />
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/7 text-white transition hover:-translate-y-0.5 hover:bg-white/12">
            <Icon name="whatsapp" className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="mt-6 border-t border-white/10 pt-5 text-sm text-[#A7B0C0]">
        <p>© 2026 Macho Team. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING WHATSAPP
   ══════════════════════════════════════════════════════════ */

function FloatingWhatsApp() {
  return (
    <>
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_50px_rgba(37,211,102,0.28)] transition hover:-translate-y-1 lg:flex">
        <Icon name="whatsapp" className="h-7 w-7" />
      </a>
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
        className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] lg:hidden">
        Chat with Macho on WhatsApp
      </a>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   APP — orchestrates everything
   ══════════════════════════════════════════════════════════ */

export default function App() {
  const [prospectState, setProspectState] = useState<ProspectState>(loadState);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsShownCount, setDetailsShownCount] = useState(0);
  const detailsPromptedRef = useRef(false);
  const secondPromptRef = useRef(false);

  // Check if banned
  const isBanned = prospectState.banned;

  // Track session
  useEffect(() => {
    const s = loadState();
    s.sessionCount += 1;
    saveState(s);
    setProspectState(s);
    sendTelegram("page_visit", { sessionCount: s.sessionCount });
  }, []);

  // First details popup — after 5 seconds
  useEffect(() => {
    if (isBanned || prospectState.detailsSubmitted) return;
    const timer = setTimeout(() => {
      if (!detailsPromptedRef.current) {
        detailsPromptedRef.current = true;
        setDetailsOpen(true);
        setDetailsShownCount(1);
        sendTelegram("details_popup_shown", { which: "first_timed" });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isBanned, prospectState.detailsSubmitted]);

  // Second details popup — when they scroll to the interest section
  useEffect(() => {
    if (isBanned || prospectState.detailsSubmitted || secondPromptRef.current) return;
    const target = document.getElementById("interest");
    if (!target) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !secondPromptRef.current && !loadState().detailsSubmitted) {
        secondPromptRef.current = true;
        setDetailsOpen(true);
        setDetailsShownCount(2);
        sendTelegram("details_popup_shown", { which: "second_scroll" });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(target);
    return () => obs.disconnect();
  }, [isBanned, prospectState.detailsSubmitted]);

  const handleDetailsSubmit = useCallback((d: { name: string; whatsapp: string; location: string; role: string }) => {
    const s = { ...prospectState, detailsSubmitted: true, details: d };
    saveState(s);
    setProspectState(s);
    setDetailsOpen(false);
    sendTelegram("details_submitted", { ...d, collectedBy: detailsShownCount === 1 ? "first_popup" : detailsShownCount === 2 ? "second_popup" : "gateway_required" });
  }, [prospectState, detailsShownCount]);

  const handleDetailsNeeded = useCallback(() => {
    setDetailsShownCount(3);
    setDetailsOpen(true);
    sendTelegram("details_popup_shown", { which: "gateway_required" });
  }, []);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Organization", name: "Macho Team", url: window.location.href,
    founder: { "@type": "Person", name: "Ayomide Olalekan", alternateName: "Macho" },
  }), []);

  if (isBanned) return <BannedScreen />;

  return (
    <div className="min-h-screen bg-[#0B1220] font-sans text-white selection:bg-[#F4C542] selection:text-[#0B1220]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Fixed background photo — stays visible faintly while scrolling */}
      {/* Replace /images/macho-photo.jpg with your actual photo path */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <img src="/images/macho-photo.jpg" alt="" className="h-full w-full object-cover object-top opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/60 via-transparent to-[#0B1220]/80" />
      </div>

      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Story />
        <YourTurn />
        <OfferTeaser />
        <InterestGateway state={prospectState} setState={setProspectState} onDetailsNeeded={handleDetailsNeeded} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <DetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} onSubmit={handleDetailsSubmit} canSkip={detailsShownCount < 3} />
    </div>
  );
}
