import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PenLine, Sparkles, Palette, Rocket, Mic } from 'lucide-react';

const STAGES = [
  { num: '01', label: 'Prompt Better', desc: 'Refine your idea with structured AI prompting techniques', icon: PenLine },
  { num: '02', label: 'Build with Lovable', desc: 'Use AI-assisted building tools to create a working prototype', icon: Sparkles },
  { num: '03', label: 'Create Brand Basics', desc: 'Shape a basic brand identity — name, logo direction, and voice', icon: Palette },
  { num: '04', label: 'Plan Social Launch', desc: 'Map out how you would take your idea to the world', icon: Rocket },
  { num: '05', label: 'Pitch & Present', desc: 'Focused pitch prep, main stage pitching, and confidence under pressure', icon: Mic },
];

export default function Day2() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="day2" className="py-20 lg:py-28 bg-summit-warm relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap items-baseline gap-4 mb-3">
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-summit-charcoal leading-none">
              DAY <span className="text-summit-orange-600">02</span>
            </h2>
            <div className="text-lg font-display font-semibold text-summit-charcoal/50">
              Build, Brand & Pitch
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-10 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-summit-orange-50 text-summit-orange-700 font-medium px-3 py-1.5 rounded-full">
              23 October 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white text-summit-charcoal/70 font-medium px-3 py-1.5 rounded-full">
              9:00 AM – 4:00 PM
            </span>
          </div>

          <p className="text-lg text-summit-charcoal/60 max-w-2xl mb-12">
            Day two transforms ideas into polished presentations. Students refine their concept, use AI-assisted building tools, create a basic brand identity, plan a launch strategy, and take the main stage.
          </p>

          {/* Horizontal stage cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STAGES.map((stage, i) => (
              <div
                key={stage.num}
                className="group bg-white border border-summit-orange-100 rounded-xl p-5 hover:border-summit-orange-300 hover:shadow-lg hover:shadow-summit-orange-900/5 transition-all"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-summit-orange-50 flex items-center justify-center group-hover:bg-summit-orange-100 transition-colors">
                    <stage.icon className="w-5 h-5 text-summit-orange-600" />
                  </div>
                  <span className="font-display font-bold text-2xl text-summit-orange-600">
                    {stage.num}
                  </span>
                </div>
                <div className="font-display font-bold text-base text-summit-charcoal mb-1">{stage.label}</div>
                <div className="text-xs text-summit-charcoal/55 leading-relaxed">{stage.desc}</div>
              </div>
            ))}
          </div>

          {/* Awards & certification */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="bg-summit-charcoal text-white rounded-xl px-6 py-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-summit-orange-500 animate-pulse" />
              <span className="text-sm font-medium">Day 2 closes with awards, certification, and a final social evening.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
