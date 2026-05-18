// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(77,158,255,0.05) 0%, transparent 70%)" }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="#000">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
          </div>
          <span className="font-display text-2xl tracking-widest text-text-primary">
            ESCAPE RUN LAB
          </span>
        </div>
        <Link href="/auth/login" className="btn-ghost text-sm py-2.5 px-5">
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-2xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-up"
          style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)" }}>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
          <span className="text-xs text-accent font-bold tracking-wider uppercase">
            Adaptive AI Running Coach
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-7xl md:text-9xl leading-none tracking-wider mb-6 animate-fade-up-1"
          style={{
            background: "linear-gradient(135deg, #F0F2F5 40%, #00E5A0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          RUN<br />SMARTER.<br />GO FURTHER.
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-md animate-fade-up-2">
          Adaptive running coach personal kamu. Bangun konsistensi lari secara
          aman dengan program yang berkembang sesuai fisikmu — khusus untuk runner Indonesia.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-3">
          <Link
            href="/auth/login"
            className="btn-primary text-base py-4 px-10 animate-glow"
          >
            Mulai Gratis — Start Free 🚀
          </Link>
          <Link href="/auth/login" className="btn-ghost text-base py-4 px-8">
            Lihat Demo
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-16 animate-fade-up-4 flex-wrap justify-center">
          {[
            ["2,400+", "Active Runners"],
            ["94%", "Completion Rate"],
            ["0", "Injuries Reported"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-4xl text-accent tracking-wide">{n}</div>
              <div className="text-xs text-text-muted font-medium mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 mt-12 justify-center animate-fade-up-5">
          {[
            "🏃 Adaptive Plans",
            "📊 Smart Dashboard",
            "💪 Injury Prevention",
            "👟 Shoe Tracker",
            "🤖 AI Coach",
            "🇮🇩 Indonesia-First",
          ].map((f) => (
            <span key={f} className="chip" style={{ cursor: "default" }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-text-muted text-xs">
        © 2025 Escape Run Lab · Built for Newbie
      </footer>
    </main>
  );
}
