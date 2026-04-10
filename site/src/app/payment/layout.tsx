import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[73px]">{children}</main>
      <Footer />
    </>
  );
}
