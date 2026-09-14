import Hero from '@/components/Hero';
import About from '@/components/About';
import Program from '@/components/Program';
import Participation from '@/components/Participation';
import BaruSahibExperience from '@/components/BaruSahibExperience';
import Fee from '@/components/Fee';
import FinalJuryShowcase from '@/components/FinalJuryShowcase';
import ContactCTA from '@/components/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Program />
      <Participation />
      <BaruSahibExperience />
      <Fee />
      <FinalJuryShowcase />
      <ContactCTA />
    </>
  );
}
