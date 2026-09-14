import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BookOpen, Users2, Lightbulb, FileCheck, MessageSquare, Briefcase, Home } from 'lucide-react';

const IMPACT = [
  { icon: BookOpen, title: 'Structured Entrepreneurship', desc: 'A complete, guided program — not a one-off workshop.' },
  { icon: Users2, title: 'Student Collaboration', desc: 'Teams form, build, and present together across schools.' },
  { icon: Lightbulb, title: 'Innovation Exposure', desc: 'Students experience real ideation and prototyping.' },
  { icon: FileCheck, title: 'Practical Project Outcomes', desc: 'Tangible prototypes and pitch decks students can showcase.' },
  { icon: MessageSquare, title: 'Communication Development', desc: 'Pitching practice builds confidence and clarity.' },
  { icon: Briefcase, title: 'Mentor & Industry Exposure', desc: 'Direct access to the ISB AIC and TalentGro ecosystem.' },
  { icon: Home, title: 'Residential Learning', desc: 'A memorable two-night immersive experience in the Himalayas.' },
];

export default function SchoolImpact() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="school-impact" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
            <div className="lg:col-span-6">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight text-balance">
                Why schools should bring their{' '}
                <span className="text-summit-orange-600">students</span>
              </h2>
            </div>
            <div className="lg:col-span-6 flex items-end">
              <p className="text-lg text-summit-charcoal/60 leading-relaxed">
                The summit gives schools a structured, outcome-driven entrepreneurship experience that complements academic learning — with real projects, real mentors, and a real stage.
              </p>
            </div>
          </div>

          {/* Impact grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMPACT.map((item, i) => (
              <div
                key={item.title}
                className="group flex gap-4 p-5 rounded-xl border border-summit-orange-50 hover:border-summit-orange-200 hover:bg-summit-cream transition-all"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-summit-orange-50 flex items-center justify-center group-hover:bg-summit-orange-100 transition-colors">
                  <item.icon className="w-5 h-5 text-summit-orange-600" />
                </div>
                <div>
                  <div className="font-display font-semibold text-base text-summit-charcoal mb-1">{item.title}</div>
                  <div className="text-sm text-summit-charcoal/55 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
