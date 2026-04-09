import type { ReactNode } from "react";

export default function AdminPublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">{children}</div>
  );
}
