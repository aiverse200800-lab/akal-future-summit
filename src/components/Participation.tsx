import { useScrollReveal } from '@/hooks/useScrollReveal';
import { GraduationCap, School, MapPin, Users, ArrowRight } from 'lucide-react';

const BOARDS = ['CBSE', 'ICSE', 'Cambridge (CIE)', 'IB'];

export default function Participation() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="participate" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-6 text-balance">
                Who can{' '}
                <span className="text-summit-orange-600">participate?</span>
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-summit-orange-50 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-summit-charcoal mb-1">Classes 9–12</div>
                    <div className="text-sm text-summit-charcoal/55">Open to students currently in Class 9 through Class 12.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-summit-orange-50 flex items-center justify-center">
                    <School className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-lg text-summit-charcoal mb-2">School Boards</div>
                    <div className="flex flex-wrap gap-2">
                      {BOARDS.map((board) => (
                        <span key={board} className="px-3.5 py-1.5 bg-summit-cream border border-summit-orange-100 rounded-full text-sm font-medium text-summit-charcoal/70">
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-summit-orange-50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-summit-charcoal mb-1">Northern India</div>
                    <div className="text-sm text-summit-charcoal/55">Schools across Northern India are invited to participate.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-summit-orange-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-summit-charcoal mb-1">Individual or School</div>
                    <div className="text-sm text-summit-charcoal/55">Register individually or through your school. Students work in teams during the summit.</div>
                  </div>
                </div>
              </div>

              <a
                href="#register"
                className="group mt-8 inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-base px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-summit-orange-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="lg:col-span-5">
              <div className="relative bg-summit-charcoal rounded-2xl p-8 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-summit-orange-600/15 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="text-xs font-semibold text-summit-orange-400 uppercase tracking-wider mb-4">Quick Check</div>

                  <div className="space-y-3">
                    {[
                      'Are you in Class 9, 10, 11, or 12?',
                      'Are you from a CBSE, ICSE, Cambridge, or IB school?',
                      'Are you based in Northern India?',
                      'Do you want to build something real?',
                    ].map((q, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/80">
                        <div className="w-6 h-6 rounded-full bg-summit-orange-600 flex items-center justify-center flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{q}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-sm text-white/50">
                      If you checked all four — this summit is for you.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
