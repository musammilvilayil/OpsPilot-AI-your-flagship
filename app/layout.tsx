import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://opspilot-web-ztwr.onrender.com"),
  title: {
    default: "OpsPilot AI — Evidence-backed incident intelligence",
    template: "%s · OpsPilot AI"
  },
  description: "Detect, explain and resolve GitHub Actions and deployment incidents with verifiable AI evidence and developer-controlled recovery plans.",
  applicationName: "OpsPilot AI",
  authors: [{ name: "Muhammad Musammil", url: "https://github.com/musammilvilayil" }],
  keywords: ["DevOps", "AI incident response", "GitHub Actions", "Next.js", "FastAPI", "PostgreSQL"],
  openGraph: {
    title: "OpsPilot AI — Fix failed deployments with evidence",
    description: "A production-minded AI incident detection and resolution platform.",
    type: "website",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "OpsPilot AI",
    description: "Evidence-backed DevOps incident intelligence."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050912",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
