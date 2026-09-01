"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // messaggio generico: non riveliamo se l'email esiste
      setErr("Email o password non corretti.");
      setLoading(false);
      return;
    }

    const dest = searchParams.get("redirect") || "/admin";
    router.push(dest);
    router.refresh();
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {err && <div className="admin-msg err">{err}</div>}

      <button className="btn btn-green" type="submit" disabled={loading}>
        {loading ? "Accesso in corso…" : "Accedi"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Area riservata</h1>
        <p className="sub">Accesso alla gestione del blog Aleclima.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
