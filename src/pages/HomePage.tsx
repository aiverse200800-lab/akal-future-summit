import Hero from '@/components/Hero';
import About from '@/components/About';
import Program from '@/components/Program';
import BaruSahibExperience from '@/components/BaruSahibExperience';
import ContactCTA from '@/components/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Program />
      <BaruSahibExperience />
      <ContactCTA />
    </>
  );
}
