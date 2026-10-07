import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Müşteri önizleme sayfaları: public/<firma>/index.html → /<firma>
  async rewrites() {
    return [{ source: "/este", destination: "/este/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
