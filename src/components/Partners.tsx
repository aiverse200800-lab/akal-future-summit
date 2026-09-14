import { useScrollReveal } from '@/hooks/useScrollReveal';

const PARTNERS = [
  { name: 'AKAL ACADEMY BARU SAHIB', role: 'Host / 40th Foundation Day', desc: 'A residential IB, Cambridge, and CBSE school in the Himalayas, hosting the summit through its Entrepreneurship Club.' },
  { name: 'ISB MOHALI & AIC', role: 'Innovation Ecosystem Partner', desc: 'Connecting future founders to a broader innovation and startup ecosystem through ISB Mohali and the Atal Incubation Centre.' },
  { name: 'TALENTGRO GLOBAL', role: 'Program / Learning Ecosystem Partner', desc: 'Providing the learning framework, mentorship structure, and program design that powers the founder journey.' },
  { name: 'AMOEBA EDUCATION', role: 'Collaboration Partner', desc: 'Bringing hands-on learning experiences and creative problem-solving tools to the founder journey.' },
];

export default function Partners() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const partnerImage = `${import.meta.env.BASE_URL}IMG-20260910-WA0014.jpg`;

  return (
    <section id="partners" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-4 text-balance">An ecosystem built around <span className="text-summit-orange-600">future founders.</span></h2>
          <p className="text-lg text-summit-charcoal/60 max-w-2xl mb-12">Four organisations coming together to create a real, structured, and credible platform for student entrepreneurship.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERS.map((partner, i) => (
              <div key={partner.name} className="group bg-white border border-summit-orange-100 rounded-2xl p-6 hover:border-summit-orange-300 hover:shadow-xl hover:shadow-summit-orange-900/5 transition-all" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="relative h-20 w-full overflow-hidden rounded-xl border border-summit-orange-50 bg-white group-hover:bg-summit-cream transition-colors flex items-center justify-center p-3">
                  <img src={partnerImage} alt="Official summit partner logos" className="h-full w-full object-cover object-top" loading="lazy" />
                </div>
                <div className="text-xs font-semibold text-summit-orange-600 uppercase tracking-wider mb-2">{partner.role}</div>
                <div className="font-display font-bold text-base text-summit-charcoal mb-2">{partner.name}</div>
                <div className="text-sm text-summit-charcoal/55 leading-relaxed">{partner.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-3xl mx-auto"><div className="bg-white border border-summit-orange-100 rounded-xl px-6 py-4"><p className="text-sm text-summit-charcoal/60 leading-relaxed text-center">Mentor and jury lineup will be announced as speakers are officially confirmed.</p></div></div>
        </div>
      </div>
    </section>
  );
}
