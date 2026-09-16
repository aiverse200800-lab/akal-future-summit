import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Program() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const programImage = `${import.meta.env.BASE_URL}ChatGPT_Image_Sep_13%2C_2026%2C_11_22_25_AM.png`;

  return (
    <section id="program" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-4 text-balance">Program Flow</h2>
          <div className="max-w-5xl space-y-5 text-base text-summit-charcoal/75 leading-relaxed mb-12">
            <p className="font-bold text-summit-charcoal">TWO DAYS | ONE EXPERIENCE | A LIFETIME OF POSSIBILITIES.</p>
            <p>Bringing together aspiring innovators from Grades 9–12 across CBSE, ICSE, Cambridge (CIE) and IB schools of Northern India, the summit is hosted at Akal Academy Baru Sahib, Himachal Pradesh—a setting where learning extends far beyond the classroom.</p>
            <p>Over two immersive days, participants will have the opportunity to ideate, validate, innovate and pitch their business ideas, working alongside mentors and experts from ISB &amp; AIC, TalentGro Global and Amoeba Team. From identifying real-world problems to shaping solutions, refining business models and pitching ideas, AFFS takes students through the exciting journey from thought to possibility.</p>
            <p><strong className="text-summit-charcoal">AFFS is more than an entrepreneurship summit.</strong><br />It is an opportunity to learn, challenge oneself, build confidence, make new connections and create memories that extend far beyond the two days.</p>
          </div>
          <div className="mt-10">
            <div className="overflow-hidden rounded-2xl border border-summit-orange-100 bg-white p-2 shadow-lg sm:p-3">
              <img src={programImage} alt="Six-stage Akal Young Future Founders Summit journey from meeting and discovery to pitching" className="h-auto w-full rounded-xl object-contain" loading="lazy" />
            </div>
            <Link to="/program" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f8cda9] px-7 py-3.5 text-base font-semibold text-summit-charcoal shadow-md transition-all hover:bg-[#f5bd8f] hover:shadow-lg">Explore the Program <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
