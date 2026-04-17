import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRevealInit } from "@/components/ui/ScrollReveal";
import { InteractiveEffects } from "@/components/ui/InteractiveEffects";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legacy-theme">
      <Header />
      <main className="flex-1 pt-[73px]">{children}</main>
      <Footer />
      <ScrollRevealInit />
      <InteractiveEffects />
    </div>
  );
}
