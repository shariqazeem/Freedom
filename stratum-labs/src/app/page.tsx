"use client";

import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import SystemPerformance from "@/components/SystemPerformance";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian">
      {/* Hero Section */}
      <Hero />

      {/* Solutions Grid */}
      <section id="solutions">
        <BentoGrid />
      </section>

      {/* Trust & Performance */}
      <SystemPerformance />

      {/* Footer */}
      <Footer />
    </main>
  );
}
