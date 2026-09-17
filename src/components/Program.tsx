import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Program() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const programImage = `${import.meta.env.BASE_URL}certificate.jpg`;

  return (
    <section id="program" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-5 text-balance">Program Flow</h2>
              <div className="space-y-4 text-[1.0625rem] text-summit-charcoal/70 leading-[1.8]">
                <p>Bringing together aspiring innovators from <strong className="font-semibold text-summit-charcoal">Grades 9–12</strong> across CBSE, ICSE, Cambridge (CIE) and IB schools of Northern India — hosted at Akal Academy Baru Sahib, where learning extends far beyond the classroom.</p>
                <p>Over two immersive days, participants ideate, validate, innovate and pitch their business ideas, working alongside mentors from <strong className="font-semibold text-summit-charcoal">AIC ISB Mohali, TalentGro Global and the Amoeba team</strong>.</p>
                <p><strong className="font-semibold text-summit-orange-700">AFFS is more than an entrepreneurship summit</strong> — it's a journey from thought to possibility.</p>
              </div>
              <Link to="/program" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-summit-orange-600 px-7 py-3.5 text-base font-semibold text-white shadow-md transition-[background-color,box-shadow,transform] duration-150 hover:bg-summit-orange-700 hover:shadow-lg active:scale-[0.97]">View Details <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-summit-orange-100 bg-white p-2 shadow-lg sm:p-3 lg:sticky lg:top-24">
                <img src={programImage} alt="Certificate awarded to participants at the Akal Future Founders Summit" className="h-auto w-full rounded-xl object-contain outline outline-1 outline-black/5" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
