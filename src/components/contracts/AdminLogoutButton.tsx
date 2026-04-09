"use client";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
        window.location.assign("/admin/login");
      }}
    >
      Log out
    </button>
  );
}
