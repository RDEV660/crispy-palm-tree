import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/contracts/AdminLogoutButton";
import { verifyAdminSessionJwt } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/contracts/constants";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifyAdminSessionJwt(token))) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin/contracts" className="text-sm font-semibold tracking-tight">
            Ohana Events · Contracts
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Home
            </Link>
            <Link
              href="/admin/contracts"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All contracts
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
