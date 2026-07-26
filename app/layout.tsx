import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsPilot AI — Evidence-backed incident intelligence",
  description: "Detect, explain and resolve GitHub Actions and deployment incidents with verifiable AI evidence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
