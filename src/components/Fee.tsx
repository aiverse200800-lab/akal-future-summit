import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, Package, Utensils, BedDouble, Bus, ArrowRight } from 'lucide-react';

const INCLUDED = [
  { icon: Package, label: 'Summit Kit' },
  { icon: Utensils, label: 'Food' },
  { icon: BedDouble, label: '2 Nights Lodging' },
];

export default function Fee() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="fee" className="py-20 lg:py-28 bg-summit-warm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold text-summit-charcoal/50 uppercase tracking-widest mb-2">Per Student</div>
              <div className="font-display font-bold text-6xl sm:text-7xl text-summit-orange-600 leading-none">₹5,000</div>
              <div className="mt-3 text-lg text-summit-charcoal/60 font-display font-semibold">
                Everything you need for the summit.
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 overflow-hidden">
                <div className="p-6 lg:p-8">
                  <div className="text-xs font-semibold text-summit-orange-600 uppercase tracking-wider mb-5">What's Included</div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {INCLUDED.map((item) => (
                      <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-summit-cream border border-summit-orange-50">
                        <div className="w-12 h-12 rounded-xl bg-summit-orange-100 flex items-center justify-center mb-3">
                          <item.icon className="w-6 h-6 text-summit-orange-600" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-summit-orange-600" />
                          <span className="text-sm font-semibold text-summit-charcoal">{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-5 border-t border-summit-orange-50">
                    <div className="flex items-start gap-3">
                      <Bus className="w-5 h-5 text-summit-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-summit-charcoal/60">
                        <span className="font-medium text-summit-charcoal">Travel to the venue from Chandigarh</span> can be arranged on request. Transportation is not included in the participation fee.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-summit-charcoal px-6 lg:px-8 py-5 flex items-center justify-between">
                  <div className="text-white/80 text-sm">
                    Ready to join? Reserve your seat today.
                  </div>
                  <a href="#register" className="group inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-lg active:scale-[0.97]">
                    Register
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
