import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, Package, Utensils, BedDouble, Bus, MapPinned, ExternalLink, ArrowRight } from 'lucide-react';

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
              <div className="relative">
                <div className="absolute -top-6 -left-2 font-display font-bold text-[10rem] text-summit-orange-200/50 leading-none select-none pointer-events-none hidden lg:block">
                  ₹
                </div>
                <div className="relative">
                  <div className="text-sm font-semibold text-summit-charcoal/50 uppercase tracking-wider mb-2">Per Student</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display font-bold text-7xl sm:text-8xl text-summit-orange-600 leading-none">₹5,000</span>
                  </div>
                  <div className="text-lg text-summit-charcoal/60 font-display font-semibold">
                    Everything you need for the summit.
                  </div>
                </div>
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
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Register
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-summit-orange-600 text-xs font-semibold uppercase tracking-wider mb-3">
                <MapPinned className="w-4 h-4" />
                How to reach
              </div>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-summit-charcoal mb-4">
                Join us at Baru Sahib.
              </h3>
              <p className="text-base text-summit-charcoal/60 leading-relaxed mb-4">
                Travel to the venue from Chandigarh can be arranged on request.
              </p>
              <p className="text-sm text-summit-charcoal/60 leading-relaxed mb-6">
                Transportation is not included in the participation fee.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Akal+Academy+Baru+Sahib%2C+Himachal+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-summit-orange-700 hover:text-summit-orange-600 transition-colors"
              >
                Open location in Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="lg:col-span-7 min-h-[300px] rounded-2xl overflow-hidden border border-summit-orange-100 shadow-lg bg-white">
              <iframe
                title="Map showing Akal Academy Baru Sahib"
                src="https://www.google.com/maps?q=Akal%20Academy%20Baru%20Sahib%2C%20Himachal%20Pradesh&output=embed"
                className="w-full h-full min-h-[300px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
