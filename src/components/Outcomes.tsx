import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Brain, Puzzle, PenTool, Cpu, Palette, Mic } from 'lucide-react';

const OUTCOMES = [
  { num: '01', label: 'Founder Mindset', desc: 'Think like an entrepreneur — spot opportunities, take initiative, embrace uncertainty.', icon: Brain },
  { num: '02', label: 'Problem-Solving Skills', desc: 'Break down real-world challenges and build structured solutions.', icon: Puzzle },
  { num: '03', label: 'Design Thinking Experience', desc: 'Apply human-centered design from discovery to prototype.', icon: PenTool },
  { num: '04', label: 'AI-Assisted Prototyping', desc: 'Use modern AI tools to accelerate building and validation.', icon: Cpu },
  { num: '05', label: 'Branding & Storytelling', desc: 'Craft a brand identity and narrative that resonates.', icon: Palette },
  { num: '06', label: 'Pitching & Communication', desc: 'Present ideas with clarity, confidence, and conviction.', icon: Mic },
];

const ADDITIONAL = ['Teamwork', 'Networking', 'Real-world exposure', 'Confidence', 'Entrepreneurial thinking'];

export default function Outcomes() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="outcomes" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-summit-charcoal leading-tight mb-4 text-balance">
            More Than a{' '}
            <span className="text-summit-orange-600">Certificate.</span>
          </h2>
          <p className="text-lg text-summit-charcoal/60 max-w-2xl mb-12">
            Students walk away with skills and experiences that extend far beyond the summit itself.
          </p>

          {/* Outcomes grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OUTCOMES.map((outcome, i) => (
              <div
                key={outcome.num}
                className="group relative bg-white border border-summit-orange-100 rounded-2xl p-6 hover:border-summit-orange-300 hover:shadow-xl hover:shadow-summit-orange-900/5 transition-all overflow-hidden"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Hover accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-summit-orange-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-summit-orange-50 flex items-center justify-center group-hover:bg-summit-orange-100 transition-colors">
                    <outcome.icon className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <span className="font-display font-bold text-3xl text-summit-orange-100 group-hover:text-summit-orange-200 transition-colors">
                    {outcome.num}
                  </span>
                </div>
                <div className="font-display font-bold text-lg text-summit-charcoal mb-1.5">{outcome.label}</div>
                <div className="text-sm text-summit-charcoal/55 leading-relaxed">{outcome.desc}</div>
              </div>
            ))}
          </div>

          {/* Additional outcomes */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-summit-charcoal/50 uppercase tracking-wider mr-2">Also gain:</span>
            {ADDITIONAL.map((item) => (
              <span key={item} className="inline-flex items-center px-4 py-2 bg-white border border-summit-orange-100 rounded-full text-sm font-medium text-summit-charcoal/70 hover:border-summit-orange-300 transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
