import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Day1 from '@/components/Day1';
import Day2 from '@/components/Day2';
import Outcomes from '@/components/Outcomes';
import SchoolImpact from '@/components/SchoolImpact';
import FinalJuryShowcase from '@/components/FinalJuryShowcase';

export default function ProgramPage() {
  return (
    <div className="pt-16">
      <Day1 />
      <Day2 />
      <Outcomes />
      <SchoolImpact />
      <FinalJuryShowcase />
      <section className="py-16 lg:py-20 bg-summit-cream">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-summit-charcoal leading-tight text-balance">
            Ready to build something <span className="text-summit-orange-600">real?</span>
          </h2>
          <p className="mt-4 text-base text-summit-charcoal/60 leading-relaxed">
            Seats are limited for this two-day immersive experience. Reserve yours now.
          </p>
          <Link
            to="/register"
            className="group mt-8 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-lg active:scale-[0.97]"
          >
            Reserve Your Seat
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
