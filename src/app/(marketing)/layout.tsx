import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Tweaks } from "@/components/site/Tweaks";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Tweaks />
    </>
  );
}
