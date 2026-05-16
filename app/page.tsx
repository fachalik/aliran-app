import {
  BotShowcase,
  CalendarShowcase,
  CoreValues,
  Faq,
  Footer,
  FooterCta,
  Hero,
  KpiTiles,
  LogoStrip,
  Nav,
  Testimonial,
  Welcome,
} from "@/features/landing";

export default function LandingPage() {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.93 0.04 220) 0%, transparent 50%), var(--cream-100)",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <Hero />
      <LogoStrip />
      <Welcome />
      <KpiTiles />
      <CoreValues />
      <BotShowcase />
      <CalendarShowcase />
      {/* <Testimonial /> */}
      <Faq />
      <FooterCta />
      <Footer />
    </div>
  );
}
