import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRevealInit } from "@/components/ui/ScrollReveal";
import { InteractiveEffects } from "@/components/ui/InteractiveEffects";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[73px]">{children}</main>
      <Footer />
      <ScrollRevealInit />
      <InteractiveEffects />
    </>
  );
}
