import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { loadDevVarsIntoProcessEnv } from "./src/lib/load-dev-vars";

loadDevVarsIntoProcessEnv();

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/ohana-logo-v2.png", permanent: false }];
  },
};

export default withNextIntl(nextConfig);

// Cloudflare local dev only — skip on Vercel so builds stay standard Next.js
if (process.env.VERCEL !== "1") {
  void import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
