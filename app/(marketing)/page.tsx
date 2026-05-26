import { MotionWrapper } from "@/components/motion-wrapper";
import {
  BotShowcase,
  CalendarShowcase,
  Footer,
  FooterCta,
  Hero,
  HowItWorks,
  KpiTiles,
  Nav,
} from "@/features/landing";

export default function LandingPage() {
  return (
    <MotionWrapper>
      <div style={{ background: "var(--cream-100)", minHeight: "100vh" }}>
        <Nav />
        <Hero />
        <HowItWorks />
        <BotShowcase />
        <CalendarShowcase />
        <KpiTiles />
        <FooterCta />
        <Footer />
      </div>
    </MotionWrapper>
  );
}
