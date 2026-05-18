// src/app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "otp" | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  const signInWithGoogle = async () => {
    setLoading("google");
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { setError(error.message); setLoading(null); }
  };

  const sendOTP = async () => {
    if (!email) return;
    setLoading("otp");
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
    } else {
      setOtpSent(true);
    }
    setLoading(null);
  };

  const verifyOTP = async () => {
    if (!otp) return;
    setLoading("otp");
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
    // middleware will redirect on success
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      {/* BG glow */}
      <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)" }}/>

      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#000">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
          </div>
          <span className="font-display text-3xl tracking-widest">ECHO STRIDE</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Welcome back 👋</h1>
        <p className="text-text-secondary text-sm text-center mb-8">
          Masuk untuk lanjutkan training kamu
        </p>

        {/* Google */}
        <button
          onClick={signInWithGoogle}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                     border border-border bg-surface-alt hover:bg-surface hover:border-border-hi
                     transition-all duration-200 font-semibold text-sm mb-4
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "google" ? (
            <span className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          ) : (
            <svg width={20} height={20} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading === "google" ? "Menghubungkan..." : "Lanjutkan dengan Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-xs font-medium">atau dengan email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email OTP */}
        {!otpSent ? (
          <div className="flex flex-col gap-3">
            <input
              type="email"
              className="input-field"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOTP()}
            />
            <button
              onClick={sendOTP}
              disabled={!email || !!loading}
              className="btn-primary w-full"
            >
              {loading === "otp" ? "Mengirim..." : "Kirim Kode OTP →"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-text-secondary text-sm text-center">
              Kode OTP dikirim ke <strong className="text-text-primary">{email}</strong>
            </p>
            <input
              type="text"
              className="input-field text-center font-mono text-xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
            />
            <button
              onClick={verifyOTP}
              disabled={otp.length < 6 || !!loading}
              className="btn-primary w-full"
            >
              {loading === "otp" ? "Memverifikasi..." : "Verifikasi & Masuk ✓"}
            </button>
            <button
              onClick={() => { setOtpSent(false); setOtp(""); }}
              className="text-text-muted text-sm text-center hover:text-text-secondary transition-colors"
            >
              Ganti email
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/30">
            <p className="text-danger text-sm text-center">{error}</p>
          </div>
        )}

        <p className="text-text-muted text-xs text-center mt-8">
          Dengan masuk, kamu menyetujui{" "}
          <Link href="#" className="text-accent hover:underline">Terms of Service</Link>
          {" "}dan{" "}
          <Link href="#" className="text-accent hover:underline">Privacy Policy</Link> kami.
        </p>
      </div>
    </div>
  );
}
