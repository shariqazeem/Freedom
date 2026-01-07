import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <Hero />
      <Products />
      <Work />
      <Services />
      <Footer />
    </main>
  );
}
