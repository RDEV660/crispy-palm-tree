"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/contracts";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Contract admin</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Sign in with the owner password.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setBusy(true);
          try {
            const res = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({ password }),
            });
            if (!res.ok) {
              let message = "Login failed";
              try {
                const data = (await res.json()) as { error?: string };
                message = data.error ?? message;
              } catch {
                message = res.status === 401 ? "Invalid password" : `Error ${res.status}`;
              }
              throw new Error(message);
            }
            const dest = nextPath.startsWith("/admin") ? nextPath : "/admin/contracts";
            window.location.assign(dest);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div>
          <label htmlFor="pw" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
