import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Users, Search, Lightbulb, CheckCircle, Wrench, Presentation } from 'lucide-react';

const STAGES = [
  { num: '01', label: 'Meet', desc: 'Icebreakers & networking — form your team', icon: Users },
  { num: '02', label: 'Discover', desc: 'Founder mindset & problem hunt — find what matters', icon: Search },
  { num: '03', label: 'Ideate', desc: 'Mentor-guided ideation & design thinking', icon: Lightbulb },
  { num: '04', label: 'Validate', desc: 'Idea selection & mini jury pitching round', icon: CheckCircle },
  { num: '05', label: 'Prototype', desc: 'Skill-building workshop & first prototype', icon: Wrench },
  { num: '06', label: 'Pitch', desc: 'Initial pitch practice before social evening', icon: Presentation },
];

export default function Day1() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="day1" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap items-baseline gap-4 mb-3">
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-summit-charcoal leading-none">
              DAY <span className="text-summit-orange-600">01</span>
            </h2>
            <div className="text-lg font-display font-semibold text-summit-charcoal/50">
              Problem to Prototype
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-10 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-summit-orange-50 text-summit-orange-700 font-medium px-3 py-1.5 rounded-full">
              22 October 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-summit-warm text-summit-charcoal/70 font-medium px-3 py-1.5 rounded-full">
              9:00 AM – 4:00 PM
            </span>
          </div>

          <p className="text-lg text-summit-charcoal/60 max-w-2xl mb-12">
            Day one takes students from first introductions to a working prototype — discovering problems, generating ideas, and building something tangible.
          </p>

          {/* Vertical timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-summit-orange-300 via-summit-orange-400 to-summit-orange-300" />

            <div className="space-y-6">
              {STAGES.map((stage, i) => (
                <div
                  key={stage.num}
                  className="relative flex items-start gap-5 group"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-summit-orange-300 flex items-center justify-center shadow-sm group-hover:border-summit-orange-500 group-hover:shadow-md transition-all">
                      <stage.icon className="w-5 h-5 text-summit-orange-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-summit-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {stage.num}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-summit-cream border border-summit-orange-50 rounded-xl px-5 py-4 group-hover:border-summit-orange-200 group-hover:shadow-sm transition-all">
                    <div className="font-display font-bold text-lg text-summit-charcoal mb-0.5">{stage.label}</div>
                    <div className="text-sm text-summit-charcoal/60 leading-relaxed">{stage.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social evening note */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-summit-charcoal text-white rounded-xl px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-summit-orange-500 animate-pulse" />
              <span className="text-sm font-medium">Day 1 closes with a social evening — connect with fellow founders.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
