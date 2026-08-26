import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const FACEBOOK_LINK = "https://www.facebook.com/ayomideolalekanmacho";
const WHATSAPP_LINK = "https://wa.link/w6j4g9";
const SECOND_SITE_LINK = "#"; // TODO: Replace with your actual second website URL

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/* ── Shared Components ── */

function Logo({ size = "default", className = "" }: { size?: "small" | "default" | "large"; className?: string }) {
  return (
    <img
      src="/macho-ayomide-logo.svg"
      alt="Macho Team logo"
      className={cn(
        "shrink-0 rounded-xl bg-white object-contain ring-1 ring-white/15",
        size === "small" && "h-10 w-10 p-1",
        size === "default" && "h-12 w-12 p-1.5",
        size === "large" && "h-16 w-16 p-2",
        className,
      )}
      width={size === "large" ? 64 : size === "small" ? 40 : 48}
      height={size === "large" ? 64 : size === "small" ? 40 : 48}
      loading="eager"
    />
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", visible && "reveal-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const c = "h-full w-full";
  const icons: Record<string, ReactNode> = {
    arrow: (
      <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    facebook: (
      <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.1 8.5V6.7c0-.8.5-1 1-1h1.4V3.1c-.7-.1-1.5-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.7v1.8H8.2v2.9h2.4V21h3.1v-9.6h2.5l.4-2.9h-2.5Z" />
      </svg>
    ),
    whatsapp: (
      <svg className={c} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.2 11.2 0 0 0 3.4 17.7L2 22l4.4-1.4A11.2 11.2 0 0 0 22 10.3a11.1 11.1 0 0 0-1.5-6.8ZM12 19.1c-1.7 0-3.2-.5-4.6-1.4l-.3-.2-2.6.8.8-2.5-.2-.3A8.3 8.3 0 1 1 12 19.1Zm4.7-6.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1a6.8 6.8 0 0 1-3.4-3c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.8.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
    close: (
      <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    share: (
      <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.6 13.5 6.8 3.9M15.4 6.6l-6.8 3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    menu: (
      <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M10.3 3.8 1.7 18.4A2 2 0 0 0 3.4 21h17.2a2 2 0 0 0 1.7-2.6L13.7 3.8a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return <span className={cn("inline-flex", className)}>{icons[name]}</span>;
}

/* ── Navbar ── */

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0B1220]/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          aria-label="Go to top"
        >
          <Logo size="small" />
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-[0.14em] text-white">MACHO TEAM</span>
            <span className="block text-xs font-semibold text-[#F4C542]/80">FHG</span>
          </span>
        </button>

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#F4C542] px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
      </nav>
    </header>
  );
}

/* ── Hero ── */

function Hero({ onOpenFilter }: { onOpenFilter: () => void }) {
  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B1220] pt-20 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.34),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(244,197,66,0.18),transparent_27%),linear-gradient(135deg,#0B1220_0%,#111827_48%,#07101d_100%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-30" />

      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-5xl flex-col items-center justify-center px-4 pb-12 text-center sm:px-6">
        <Reveal>
          <Logo size="large" className="mx-auto mb-6" />
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-[#F4C542]/80">Macho Team</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            You're working hard. <span className="text-[#F4C542]">But is it building the life you actually want?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#D4DAE5]">
            I asked myself that same question. Here's what I found — and why I think it could matter for you too.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => scrollToSection("story")}
              className="group inline-flex min-h-12 items-center justify-center rounded-full bg-[#F4C542] px-7 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#0B1220] shadow-[0_18px_44px_rgba(244,197,66,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffd866] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
            >
              Hear my story
              <Icon name="arrow" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onOpenFilter}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/7 px-7 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
            >
              I'm interested
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Story ── */

function Story() {
  return (
    <section id="story" className="scroll-mt-20 bg-[#111827] px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#F4C542]">My Story</p>
          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">I was doing everything "right" — and still going nowhere.</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 space-y-6 text-lg leading-8 text-[#D4DAE5]">
            <p>
              I was a fashion designer apprentice. Two years in tailoring — I could sew almost any style of clothes.
              I was also trying to get into FUTA. On paper, I was on a path.
            </p>
            <p>
              But I looked at my boss — the person whose level I was working towards — and I asked myself a honest question:
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <blockquote className="my-8 rounded-2xl border-l-4 border-[#F4C542] bg-[#0B1220] p-6 text-xl font-black leading-snug tracking-[-0.02em] text-white sm:text-2xl">
            "Can this path actually get me to where I want to be? Can I hit ₦1 million? ₦10 million? Can people see me and say — that person is building something?"
          </blockquote>
        </Reveal>

        <Reveal delay={160}>
          <div className="space-y-6 text-lg leading-8 text-[#D4DAE5]">
            <p>
              The honest answer was no. Not with what I was doing.
            </p>
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

/* ── Offer Teaser ── */

function OfferTeaser({ onOpenFilter }: { onOpenFilter: () => void }) {
  return (
    <section id="offer" className="scroll-mt-20 bg-[#0B1220] px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-blue-300">What we do</p>
          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">A 2‑in‑1 business model.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#D4DAE5]">
            One side teaches you a high-income digital skill — so you can earn from what you learn.
            The other side builds you a team-based business with real long-term income potential.
            Both sides work together in one system.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#151E2E] p-6 text-left transition hover:-translate-y-1 hover:border-blue-300/40">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-blue-300">Side 1</p>
              <h3 className="text-xl font-black tracking-[-0.02em]">Learn a digital skill</h3>
              <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
                Get trained. Build your profile. Find clients. Get paid. Access the global market with a real skill.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#151E2E] p-6 text-left transition hover:-translate-y-1 hover:border-[#F4C542]/40">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-[#F4C542]">Side 2</p>
              <h3 className="text-xl font-black tracking-[-0.02em]">Build a team business</h3>
              <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
                Work with a team. Share products. Introduce people. Build something that grows as your team grows.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-10 text-base leading-7 text-[#A7B0C0]">
            The first side handles your present. The second side builds your future. Your output determines your income — nothing is guaranteed, but the structure is real.
          </p>
          <button
            type="button"
            onClick={onOpenFilter}
            className="group mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#F4C542] px-7 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#0B1220] shadow-[0_18px_44px_rgba(244,197,66,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffd866] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          >
            I want to know more
            <Icon name="arrow" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Filter Modal ── */

type FilterStep = "initial" | "never-heard" | "heard-before" | "already-member" | "exit";

function FilterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<FilterStep>("initial");

  useEffect(() => {
    if (open) setStep("initial");
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Macho Team", url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      alert("Link copied!");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          aria-label="Close"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        {step === "initial" && (
          <div>
            <h3 className="pr-10 text-2xl font-black tracking-[-0.03em] text-white">Have you heard about what we do before?</h3>
            <p className="mt-3 text-base leading-7 text-[#A7B0C0]">Just so I know where you're coming from.</p>
            <div className="mt-8 grid gap-3">
              <ModalButton onClick={() => setStep("never-heard")}>
                No, I've never heard of it
              </ModalButton>
              <ModalButton onClick={() => setStep("heard-before")}>
                Yes, I've heard of it but didn't join
              </ModalButton>
              <ModalButton onClick={() => setStep("already-member")} variant="muted">
                I'm already a member
              </ModalButton>
            </div>
          </div>
        )}

        {step === "never-heard" && (
          <div>
            <h3 className="pr-10 text-2xl font-black tracking-[-0.03em] text-white">Would you like a brief explanation?</h3>
            <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
              I've put together a clear breakdown of how everything works — the model, what you'd be doing, and what to expect. No pressure, just information.
            </p>
            <div className="mt-8 grid gap-3">
              <a
                href={SECOND_SITE_LINK}
                className="group flex min-h-14 items-center justify-center rounded-2xl bg-[#F4C542] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.06em] text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
              >
                Yes, show me how it works
                <Icon name="arrow" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <ModalButton onClick={() => setStep("exit")} variant="muted">
                Not right now
              </ModalButton>
            </div>
          </div>
        )}

        {step === "heard-before" && (
          <div>
            <h3 className="pr-10 text-2xl font-black tracking-[-0.03em] text-white">Are you open to hearing more about it?</h3>
            <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
              Different teams run things differently. I've put together a proper explanation of how we do things at Macho Team — it might be different from what you've seen before.
            </p>
            <div className="mt-8 grid gap-3">
              <a
                href={SECOND_SITE_LINK}
                className="group flex min-h-14 items-center justify-center rounded-2xl bg-[#F4C542] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.06em] text-[#0B1220] transition hover:-translate-y-0.5 hover:bg-[#ffd866] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
              >
                Yes, I'm interested
                <Icon name="arrow" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <ModalButton onClick={() => setStep("exit")} variant="muted">
                Not this time
              </ModalButton>
            </div>
          </div>
        )}

        {step === "already-member" && (
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
              <Icon name="warning" className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Thanks for letting me know.</h3>
            <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
              If you're already registered under another team, I can't bring you into Macho Team — it would affect both our accounts. That's just how the system works.
            </p>
            <p className="mt-4 text-base leading-7 text-[#A7B0C0]">
              If you need support with your current journey, your best bet is to connect with your upline. I wish you well.
            </p>
            <div className="mt-8 grid gap-3">
              <a
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
              >
                <Icon name="facebook" className="h-5 w-5" />
                Follow me on Facebook
              </a>
              <ModalButton onClick={onClose} variant="muted">Close</ModalButton>
            </div>
          </div>
        )}

        {step === "exit" && (
          <div>
            <h3 className="pr-10 text-2xl font-black tracking-[-0.03em] text-white">No problem at all.</h3>
            <p className="mt-3 text-base leading-7 text-[#A7B0C0]">
              If you ever change your mind, this page will be here. In the meantime — you can stay connected or share this with someone who might be interested.
            </p>
            <div className="mt-8 grid gap-3">
              <a
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
              >
                <Icon name="facebook" className="h-5 w-5" />
                Follow Macho on Facebook
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
              >
                <Icon name="share" className="h-5 w-5" />
                Share this with a friend
              </button>
              <ModalButton onClick={onClose} variant="muted">Close</ModalButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalButton({ children, onClick, variant = "default" }: { children: ReactNode; onClick: () => void; variant?: "default" | "muted" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-14 items-center justify-center rounded-2xl px-6 py-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]",
        variant === "default" && "border border-white/10 bg-white/7 text-white hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/12",
        variant === "muted" && "text-[#A7B0C0] hover:bg-white/5 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

/* ── Footer ── */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070d18] px-4 pb-28 pt-10 text-white sm:px-6 lg:pb-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Logo size="default" />
          <div>
            <p className="text-lg font-black tracking-[-0.02em]">Macho Team</p>
            <p className="text-sm text-[#A7B0C0]">FHG</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/7 text-white transition hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          >
            <Icon name="facebook" className="h-5 w-5" />
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/7 text-white transition hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-5xl border-t border-white/10 pt-5 text-sm text-[#A7B0C0]">
        <p>© 2026 Macho Team. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ── Floating WhatsApp ── */

function FloatingWhatsApp() {
  return (
    <>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_50px_rgba(37,211,102,0.28)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] lg:flex"
      >
        <Icon name="whatsapp" className="h-7 w-7" />
      </a>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] lg:hidden"
      >
        💬 Chat with Macho on WhatsApp
      </a>
    </>
  );
}

/* ── App ── */

export default function App() {
  const [filterOpen, setFilterOpen] = useState(false);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Macho Team",
      url: window.location.href,
      founder: {
        "@type": "Person",
        name: "Ayomide Olalekan",
        alternateName: "Macho",
      },
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#0B1220] font-sans text-white selection:bg-[#F4C542] selection:text-[#0B1220]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />
      <main>
        <Hero onOpenFilter={() => setFilterOpen(true)} />
        <Story />
        <OfferTeaser onOpenFilter={() => setFilterOpen(true)} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
