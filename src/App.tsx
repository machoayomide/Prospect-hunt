import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const FACEBOOK_LINK = "https://www.facebook.com/ayomideolalekanmacho";
const WHATSAPP_LINK = "https://wa.link/w6j4g9";

const ANALYTICS_PLACEHOLDERS = {
  metaPixelId: "META_PIXEL_ID",
  googleAnalyticsId: "GOOGLE_ANALYTICS_ID",
};

type TrackingWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function trackEvent(name: string, properties: Record<string, string | number | boolean> = {}) {
  const trackingWindow = window as TrackingWindow;

  if (typeof trackingWindow.fbq === "function") {
    trackingWindow.fbq("trackCustom", name, properties);
  }

  if (typeof trackingWindow.gtag === "function") {
    trackingWindow.gtag("event", name, properties);
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
}

function Logo({ size = "default", className = "" }: { size?: "small" | "default" | "large"; className?: string }) {
  return (
    <img
      src="/macho-ayomide-logo.svg"
      alt="Macho Ayomide official logo"
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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const common = "h-full w-full";
  const icons: Record<string, ReactNode> = {
    menu: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    close: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    arrow: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    facebook: (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.1 8.5V6.7c0-.8.5-1 1-1h1.4V3.1c-.7-.1-1.5-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.7v1.8H8.2v2.9h2.4V21h3.1v-9.6h2.5l.4-2.9h-2.5Z" />
      </svg>
    ),
    whatsapp: (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.2 11.2 0 0 0 3.4 17.7L2 22l4.4-1.4A11.2 11.2 0 0 0 22 10.3a11.1 11.1 0 0 0-1.5-6.8ZM12 19.1c-1.7 0-3.2-.5-4.6-1.4l-.3-.2-2.6.8.8-2.5-.2-.3A8.3 8.3 0 1 1 12 19.1Zm4.7-6.2c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1a6.8 6.8 0 0 1-3.4-3c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.8.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.2-1.3-.1-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
    student: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m3 8.5 9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6.5 10.2v4.1c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    worker: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7h11A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-7Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    freelancer: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 18.5 18.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 6h10v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10.5V18h7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    direction: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m10 13 4-2-4-2v4Z" fill="currentColor" />
      </svg>
    ),
    location: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    check: (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4.2 4L19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return <span className={cn("inline-flex", className)}>{icons[name]}</span>;
}

function SocialLink({ type, label, compact = false }: { type: "facebook" | "whatsapp"; label: string; compact?: boolean }) {
  const href = type === "facebook" ? FACEBOOK_LINK : WHATSAPP_LINK;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onClick={() => trackEvent(type === "facebook" ? "Facebook click" : "WhatsApp CTA click", { placement: label })}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/7 text-white transition hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]",
        compact ? "h-10 w-10" : "gap-2 px-4 py-3 text-sm font-semibold",
      )}
    >
      <Icon name={type} className="h-5 w-5" />
      {!compact && <span>{type === "facebook" ? "Facebook" : "WhatsApp"}</span>}
    </a>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  onClick,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.08em] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]",
        variant === "primary" &&
          "bg-[#F4C542] text-[#0B1220] shadow-[0_18px_44px_rgba(244,197,66,0.25)] hover:-translate-y-0.5 hover:bg-[#ffd866]",
        variant === "secondary" && "border border-white/15 bg-white/8 text-white hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-white/12",
        variant === "ghost" && "text-white hover:bg-white/8",
        className,
      )}
    >
      {children}
      <Icon name="arrow" className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "What You'll Learn", id: "learn" },
    { label: "How It Works", id: "how-it-works" },
    { label: "FAQ", id: "faq" },
  ];

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0B1220]/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
          aria-label="Go to home"
        >
          <Logo size="small" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black tracking-[0.16em] text-white">AYOMIDE OLALEKAN</span>
            <span className="block text-xs font-semibold text-[#F4C542]">Macho</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#A7B0C0] transition hover:bg-white/7 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <SocialLink type="facebook" label="Header Facebook" compact />
          <ButtonLink href={WHATSAPP_LINK} onClick={() => trackEvent("WhatsApp CTA click", { placement: "header" })} className="px-5">
            WhatsApp
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/7 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] lg:hidden"
          aria-label={open ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden border-t border-white/8 bg-[#0B1220]/96 transition-all duration-300 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              <Logo size="small" />
              <div>
                <p className="text-sm font-black tracking-[0.14em] text-white">AYOMIDE OLALEKAN</p>
                <p className="text-xs font-semibold text-[#A7B0C0]">Entrepreneur / Freelancer / Personal Growth</p>
              </div>
            </div>
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SocialLink type="facebook" label="Mobile menu Facebook" />
              <SocialLink type="whatsapp" label="Mobile menu WhatsApp" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative isolate min-h-screen overflow-hidden bg-[#0B1220] pt-24 text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.34),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(244,197,66,0.18),transparent_27%),linear-gradient(135deg,#0B1220_0%,#111827_48%,#07101d_100%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-35" />
      <div className="hero-orbit absolute right-[-22rem] top-14 -z-10 h-[42rem] w-[42rem] rounded-full border border-blue-400/20" />
      <div className="hero-orbit hero-orbit-slow absolute bottom-[-28rem] left-[-22rem] -z-10 h-[48rem] w-[48rem] rounded-full border border-[#F4C542]/14" />
      <div className="pointer-events-none absolute bottom-6 right-[-2rem] -z-10 text-[14rem] font-black leading-none tracking-[-0.12em] text-white/[0.04] sm:text-[18rem] lg:hidden">
        M
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
        <Reveal className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <Logo size="large" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F4C542]">Macho Ayomide</p>
              <p className="mt-1 text-sm font-medium text-[#A7B0C0]">Akure, Ondo State, Nigeria</p>
            </div>
          </div>

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-300">Entrepreneur / Freelancer / Digital Skills / Personal Growth</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            BUILD YOURSELF. <span className="block text-[#F4C542]">BUILD ANOTHER SOURCE OF INCOME.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#D4DAE5] sm:text-xl">
            Explore a practical way to develop yourself, learn useful skills and work on an additional income stream alongside what you're already doing.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={WHATSAPP_LINK} onClick={() => trackEvent("Hero CTA click", { destination: "whatsapp" })}>
              LET'S TALK ON WHATSAPP
            </ButtonLink>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/7 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]"
            >
              EXPLORE HOW IT WORKS
            </button>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative hidden min-h-[34rem] lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hero-mark relative h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_60%)]">
              <div className="absolute inset-14 rounded-full border border-white/10" />
              <div className="absolute inset-24 rounded-full border border-[#F4C542]/18" />
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[34%] bg-white/6 shadow-[0_0_120px_rgba(59,130,246,0.23)] backdrop-blur-sm" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] text-[15rem] font-black leading-none tracking-[-0.12em] text-white/90">M</span>
              <div className="absolute left-16 top-20 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_38px_rgba(59,130,246,0.9)]" />
              <div className="absolute bottom-24 right-20 h-4 w-4 rounded-full bg-[#F4C542] shadow-[0_0_38px_rgba(244,197,66,0.8)]" />
              <div className="absolute right-20 top-16 h-20 w-20 rotate-12 border border-white/15" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionHeader({ label, title, text }: { label?: string; title: string; text?: string }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      {label && <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-[#F4C542]">{label}</p>}
      <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-[#A7B0C0] sm:text-lg">{text}</p>}
    </Reveal>
  );
}

function About() {
  return (
    <section id="about" className="relative scroll-mt-24 bg-[#0B1220] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(244,197,66,0.14),transparent_30%)]" />
            <div className="relative flex min-h-80 flex-col justify-between">
              <div className="flex items-center gap-4">
                <Logo size="large" />
                <div>
                  <p className="text-2xl font-black tracking-[-0.04em]">Macho Ayomide</p>
                  <p className="text-sm text-[#A7B0C0]">Building stores. Driving real revenue.</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Personal brand</p>
                <p className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.04em]">
                  A practical page for people who want to learn, grow and make better use of their time.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#F4C542]">Hi, I'm Ayomide.</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">A young entrepreneur based in Akure.</h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-[#D4DAE5]">
            <p>
              I'm an entrepreneur and freelancer based in Akure, Ondo State. I'm interested in personal development, entrepreneurship, digital skills and building different income streams.
            </p>
            <p>
              I'm creating this page for people who are also interested in learning, growing and exploring something they can work on alongside what they already do.
            </p>
          </div>
          <div className="mt-8">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-white">CONNECT WITH ME</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SocialLink type="facebook" label="About Facebook" />
              <SocialLink type="whatsapp" label="About WhatsApp" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AudienceCards() {
  const audiences = [
    {
      icon: "student",
      title: "STUDENTS",
      text: "Looking for something productive you can develop alongside your studies?",
    },
    {
      icon: "worker",
      title: "WORKING PROFESSIONALS",
      text: "Interested in building something additional without abandoning your current work?",
    },
    {
      icon: "freelancer",
      title: "FREELANCERS & ENTREPRENEURS",
      text: "Already working for yourself but interested in another direction or income stream?",
    },
    {
      icon: "direction",
      title: "PEOPLE LOOKING FOR A NEW DIRECTION",
      text: "Want to learn, meet people, develop yourself and explore something different?",
    },
  ];

  return (
    <section className="scroll-mt-24 bg-[#0B1220] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="WHO IS THIS FOR?" text="You may already be doing something. That's fine." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 70}>
              <article className="group h-full rounded-[1.75rem] border border-white/10 bg-[#151E2E] p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-300/50 hover:bg-[#18243a] hover:shadow-[0_24px_70px_rgba(37,99,235,0.16)]">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-300 ring-1 ring-blue-300/20 transition group-hover:scale-105 group-hover:text-[#F4C542]">
                  <Icon name={audience.icon} className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black tracking-[-0.02em] text-white">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">{audience.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningAreas() {
  const areas = [
    {
      title: "PERSONAL DEVELOPMENT",
      items: ["Confidence", "Communication", "Discipline", "Goal setting", "Leadership"],
    },
    {
      title: "BUSINESS SKILLS",
      items: ["Customer relationship", "Presentation", "Sales skills", "Teamwork", "Consistency"],
    },
    {
      title: "PRACTICAL EXPERIENCE",
      items: ["Working with people", "Following a structured system", "Training", "Taking responsibility", "Building productive habits"],
    },
  ];

  return (
    <section id="learn" className="scroll-mt-24 bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="What can you develop?"
          title="MORE THAN JUST AN INCOME"
          text="The goal is not simply to make money. The process can also help you develop yourself and learn how to work with people."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {areas.map((area, index) => (
            <Reveal key={area.title} delay={index * 90}>
              <article className="group h-full rounded-[1.75rem] border border-white/10 bg-[#0B1220] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#F4C542]/40 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4C542] text-sm font-black text-[#0B1220]">0{index + 1}</span>
                  <h3 className="text-lg font-black tracking-[-0.02em]">{area.title}</h3>
                </div>
                <ul className="space-y-3">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#D4DAE5]">
                      <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[#A7B0C0]">
          These are presented as areas you may develop through training and participation. The actual model, expectations and income structure should be explained before you decide.
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "LEARN",
      text: "First, understand what the system involves and decide whether it is something that interests you.",
    },
    {
      title: "GET TRAINED",
      text: "Learn the basic skills, processes and expectations.",
    },
    {
      title: "TAKE ACTION",
      text: "Apply what you learn and participate according to the time you can realistically commit.",
    },
    {
      title: "GROW",
      text: "Continue developing your skills, relationships and income potential over time.",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-[#0B1220] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="HOW IT WORKS" text="A simple path from curiosity to clear understanding and practical action." />
        <div className="relative mt-14">
          <div className="absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-blue-400 via-[#F4C542] to-blue-400/30 md:left-1/2 md:block" />
          <div className="grid gap-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <article className={cn("timeline-card relative md:grid md:grid-cols-2 md:gap-10", index % 2 === 1 && "md:[&>div]:col-start-2")}>
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#151E2E] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-blue-300/40">
                    <span className="mb-5 inline-flex rounded-full bg-blue-500/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-300/20">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-black tracking-[-0.03em] text-white">{step.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#A7B0C0]">{step.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeCommitment() {
  const examples = ["SCHOOL", "WORK", "BUSINESS", "FREELANCING"];

  return (
    <section className="bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#F4C542]">Time commitment</p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
            YOU DON'T HAVE TO ABANDON WHAT YOU'RE ALREADY DOING.
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-[#D4DAE5]">
            <p>You may already be in school, working, running a business, freelancing or learning a skill.</p>
            <p>The idea is to explore something you can work on alongside your existing responsibilities.</p>
            <p>The actual time commitment depends on your availability and the activities involved.</p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {examples.map((example, index) => (
            <Reveal key={example} delay={index * 70}>
              <div className="group rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#F4C542]/40">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-black tracking-[0.04em] text-white">{example}</span>
                  <span className="text-3xl font-black text-[#F4C542]">+</span>
                  <span className="rounded-full bg-blue-500/15 px-4 py-2 text-sm font-black text-blue-200">THIS</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhysicalOffice() {
  return (
    <section className="bg-[#0B1220] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#151E2E] p-7 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(244,197,66,0.16),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(37,99,235,0.22),transparent_35%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4C542] text-[#0B1220] shadow-[0_20px_60px_rgba(244,197,66,0.18)]">
                <Icon name="location" className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-200">Transparency</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">THIS IS NOT PURELY ONLINE.</h2>
                <div className="mt-5 space-y-4 text-lg leading-8 text-[#D4DAE5]">
                  <p>There is a physical office where training and activities take place.</p>
                  <p>This gives you the opportunity to learn in person, interact with other people and understand the process properly.</p>
                  <p>The location, schedule and requirements will be explained before you make any decision.</p>
                </div>
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/7 px-5 py-3 text-sm font-bold text-white">
                  <Icon name="location" className="h-5 w-5 text-[#F4C542]" />
                  Akure, Ondo State, Nigeria
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SelfCheck() {
  const questions = [
    {
      question: "What best describes you?",
      options: ["Student", "Worker", "Entrepreneur", "Freelancer", "Other"],
    },
    {
      question: "What are you currently looking for?",
      options: ["Additional income", "Personal development", "New experience", "Better use of my spare time", "All of these"],
    },
    {
      question: "How much time could you realistically commit?",
      options: ["2-4 hours", "5-7 hours", "8-10 hours", "10+ hours", "Not sure yet"],
    },
    {
      question: "Are you open to participating in physical activities/training when necessary?",
      options: ["Yes", "Occasionally", "I need more information", "No"],
    },
  ];

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [started, setStarted] = useState(false);
  const completed = Object.keys(answers).length === questions.length;

  const handleAnswer = (questionIndex: number, option: string) => {
    if (!started) {
      setStarted(true);
      trackEvent("Self-check started");
    }

    setAnswers((current) => {
      const next = { ...current, [questionIndex]: option };
      if (Object.keys(next).length === questions.length && Object.keys(current).length !== questions.length) {
        trackEvent("Self-check completed");
      }
      return next;
    });
  };

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <section className="bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader title="COULD THIS BE RIGHT FOR YOU?" text="Take a quick self-check." />
        <Reveal className="mt-12">
          <div className="rounded-[2rem] border border-white/10 bg-[#0B1220] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:p-8">
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-[#A7B0C0]">
                <span>Self-check progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#F4C542] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid gap-6">
              {questions.map((item, questionIndex) => (
                <fieldset key={item.question} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <legend className="px-1 text-lg font-black tracking-[-0.02em] text-white">{item.question}</legend>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.options.map((option) => {
                      const selected = answers[questionIndex] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => handleAnswer(questionIndex, option)}
                          className={cn(
                            "rounded-full border px-4 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542]",
                            selected
                              ? "border-[#F4C542] bg-[#F4C542] text-[#0B1220]"
                              : "border-white/10 bg-white/7 text-[#D4DAE5] hover:border-blue-300/50 hover:bg-white/12 hover:text-white",
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            {completed && (
              <div className="mt-8 rounded-[1.5rem] border border-[#F4C542]/35 bg-[#F4C542]/10 p-6">
                <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Thanks for completing the self-check.</h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[#D4DAE5]">
                  Based on what you've selected, the best next step is to speak with Ayomide directly so you can understand exactly what is involved.
                </p>
                <ButtonLink
                  href={WHATSAPP_LINK}
                  onClick={() => trackEvent("WhatsApp CTA click", { placement: "self-check" })}
                  className="mt-6"
                >
                  CHAT WITH AYOMIDE
                </ButtonLink>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function NextSteps() {
  const steps = [
    ["1", "SEND A MESSAGE", "Tell Ayomide you're interested."],
    ["2", "GET THE FULL EXPLANATION", "Understand what it involves, how the system works, the time commitment, location and requirements."],
    ["3", "ASK QUESTIONS", "Ask anything you need to know."],
    ["4", "MAKE YOUR DECISION", "Decide for yourself whether it is suitable for you."],
  ];

  return (
    <section className="bg-[#0B1220] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="NO PRESSURE TO DECIDE BEFORE YOU UNDERSTAND IT." text="Messaging Ayomide is only the next step for getting clear information." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, text], index) => (
            <Reveal key={title} delay={index * 70}>
              <article className="h-full rounded-[1.5rem] border border-white/10 bg-[#151E2E] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-300/40">
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-sm font-black text-blue-200 ring-1 ring-blue-300/20">{number}</span>
                <h3 className="text-lg font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#A7B0C0]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    ["Is this completely online?", "No. There is a physical office where activities and training can take place."],
    ["Can I do this alongside school?", "The idea is to work around your existing responsibilities. Your available time should be discussed before you start."],
    ["Do I need previous experience?", "Previous experience is not necessarily required. The relevant training and expectations will be explained to you."],
    [
      "How much can I earn?",
      "Income is not guaranteed and depends on the actual model, your activities, performance and other factors. The income structure will be explained clearly before you make a decision.",
    ],
    ["Do I have to quit my current work or studies?", "No. The intention is to explore something that can potentially be done alongside what you are already doing."],
    ["Where are you based?", "Akure, Ondo State, Nigeria."],
    [
      "What happens after I contact you?",
      "I'll explain what the opportunity involves, how it works, the requirements, time commitment and other important details. You can then decide whether you want to proceed.",
    ],
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-[#111827] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader title="FAQ" text="Clear answers before you start any conversation." />
        <Reveal className="mt-12 divide-y divide-white/10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B1220]">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            return (
              <div key={question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    const nextIndex = isOpen ? null : index;
                    setOpenIndex(nextIndex);
                    if (nextIndex !== null) trackEvent("FAQ opened", { question });
                  }}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-bold text-white transition hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F4C542] sm:px-7"
                >
                  <span>{question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-xl text-[#F4C542]">{isOpen ? "-" : "+"}</span>
                </button>
                <div id={panelId} role="region" className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}> 
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-6 text-base leading-7 text-[#A7B0C0] sm:px-7">{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.28),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(244,197,66,0.14),transparent_30%)]" />
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <Logo size="large" className="mx-auto mb-7" />
        <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">READY TO FIND OUT MORE?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#D4DAE5]">
          You don't have to make a decision now. Just get the full information first, ask your questions and decide whether it fits what you're looking for.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={WHATSAPP_LINK} onClick={() => trackEvent("Final CTA clicked", { destination: "whatsapp" })}>
            CHAT WITH AYOMIDE ON WHATSAPP
          </ButtonLink>
          <ButtonLink href={FACEBOOK_LINK} variant="secondary" onClick={() => trackEvent("Facebook click", { placement: "final" })}>
            FOLLOW ME ON FACEBOOK
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070d18] px-4 pb-28 pt-10 text-white sm:px-6 lg:px-8 lg:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo size="default" />
          <div>
            <p className="text-lg font-black tracking-[-0.02em]">Ayomide Olalekan</p>
            <p className="text-sm text-[#A7B0C0]">Entrepreneur / Freelancer / Personal Growth</p>
            <p className="mt-1 text-sm text-[#A7B0C0]">Akure, Ondo State, Nigeria</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SocialLink type="facebook" label="Footer Facebook" compact />
          <SocialLink type="whatsapp" label="Footer WhatsApp" compact />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-sm text-[#A7B0C0]">
        <p>© 2026 Ayomide Olalekan. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FloatingWhatsAppButton() {
  return (
    <>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Ayomide on WhatsApp"
        onClick={() => trackEvent("WhatsApp CTA click", { placement: "floating" })}
        className="fixed bottom-6 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_50px_rgba(37,211,102,0.28)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] lg:flex"
      >
        <Icon name="whatsapp" className="h-7 w-7" />
      </a>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent("WhatsApp CTA click", { placement: "mobile-bottom" })}
        className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C542] lg:hidden"
      >
        💬 Chat on WhatsApp
      </a>
    </>
  );
}

export default function App() {
  useEffect(() => {
    trackEvent("Page view", {
      page: "Ayomide Olalekan landing page",
      metaPixelPlaceholder: ANALYTICS_PLACEHOLDERS.metaPixelId,
      googleAnalyticsPlaceholder: ANALYTICS_PLACEHOLDERS.googleAnalyticsId,
    });
  }, []);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Ayomide Olalekan",
      alternateName: "Macho",
      jobTitle: "Entrepreneur and Freelancer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Akure",
        addressRegion: "Ondo State",
        addressCountry: "NG",
      },
      sameAs: [FACEBOOK_LINK],
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#0B1220] font-sans text-white selection:bg-[#F4C542] selection:text-[#0B1220]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-[#F4C542] focus:px-4 focus:py-3 focus:font-bold focus:text-[#0B1220]"
      >
        Skip to main content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <AudienceCards />
        <LearningAreas />
        <HowItWorks />
        <TimeCommitment />
        <PhysicalOffice />
        <SelfCheck />
        <NextSteps />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}