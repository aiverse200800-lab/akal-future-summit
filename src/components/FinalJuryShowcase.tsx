import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AlertCircle, Lightbulb, Wrench, Mic, Eye, Zap, Wrench as Feasibility, Shield } from 'lucide-react';

const PRESENTATION = [
  { num: '01', label: 'The Problem', desc: 'What real-world problem are you solving?', icon: AlertCircle },
  { num: '02', label: 'The Solution', desc: 'What is your proposed solution?', icon: Lightbulb },
  { num: '03', label: 'The Prototype', desc: 'What did you actually build?', icon: Wrench },
  { num: '04', label: 'The Pitch', desc: 'Why should people believe in your idea?', icon: Mic },
];

const CRITERIA = [
  { label: 'Clarity', desc: 'Are the problem and solution easy to understand?', icon: Eye },
  { label: 'Innovation', desc: 'Does the idea offer a fresh or thoughtful approach?', icon: Zap },
  { label: 'Feasibility', desc: 'Could the solution realistically be built, tested, or used?', icon: Feasibility },
  { label: 'Confidence', desc: 'Can the team communicate the idea with conviction?', icon: Shield },
];

export default function FinalJuryShowcase() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="showcase" className="py-20 lg:py-28 bg-summit-charcoal text-white relative overflow-hidden">
      {/* Decorative orange glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-summit-orange-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-3 text-balance">
            THE FINAL JURY{' '}
            <span className="text-summit-orange-500">SHOWCASE</span>
          </h2>
          <p className="text-xl text-white/60 font-display font-medium mb-8">
            Four things. One founder story.
          </p>

          {/* Showcase image */}
          <div className="relative aspect-[16/5] rounded-2xl overflow-hidden border border-white/10 mb-12">
            <img
              src="https://images.pexels.com/photos/7234409/pexels-photo-7234409.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Professional business presentation in a modern conference room with attentive audience"
              className="w-full h-full object-cover opacity-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-summit-charcoal via-summit-charcoal/40 to-transparent" />
          </div>

          {/* Four presentation pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {PRESENTATION.map((item, i) => (
              <div
                key={item.num}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-summit-orange-500/30 transition-all"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="font-display font-bold text-5xl text-summit-orange-500/30 group-hover:text-summit-orange-500/50 transition-colors mb-3">
                  {item.num}
                </div>
                <div className="w-10 h-10 rounded-lg bg-summit-orange-600/20 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-summit-orange-400" />
                </div>
                <div className="font-display font-bold text-lg text-white mb-1.5">{item.label}</div>
                <div className="text-sm text-white/50 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* What the jury looks for */}
          <div className="border-t border-white/10 pt-12">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-8">
              What the jury looks for
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CRITERIA.map((crit, i) => (
                <div
                  key={crit.label}
                  className="group bg-gradient-to-br from-summit-orange-600/15 to-transparent border border-summit-orange-500/20 rounded-2xl p-6 hover:border-summit-orange-500/40 transition-all"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-summit-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <crit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-display font-bold text-xl text-white mb-2">{crit.label}</div>
                  <div className="text-sm text-white/55 leading-relaxed">{crit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
