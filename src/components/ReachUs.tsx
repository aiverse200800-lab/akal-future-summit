import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MapPin, Plane, Train, Bus, ExternalLink, Navigation } from 'lucide-react';

const TRAVEL_OPTIONS = [
  {
    icon: Plane,
    title: 'By Air',
    desc: 'Fly to Chandigarh, the nearest major airport. Onward travel to Baru Sahib can be arranged on request.',
  },
  {
    icon: Train,
    title: 'By Train',
    desc: 'Chandigarh is the nearest major railhead. Onward travel to Baru Sahib can be arranged on request.',
  },
  {
    icon: Bus,
    title: 'By Road / Bus',
    desc: 'Travel from Chandigarh to Baru Sahib can be arranged on request for participants.',
  },
];

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Akal+Academy+Baru+Sahib+Himachal+Pradesh';

export default function ReachUs() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="reach" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-summit-orange-600 uppercase tracking-widest mb-3">
                <MapPin className="w-3.5 h-3.5" /> How to Reach
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-summit-charcoal leading-tight text-balance mb-5">
                Join us at Baru Sahib.
              </h2>
              <p className="text-[1.0625rem] text-summit-charcoal/65 leading-[1.8] mb-6">
                Travel to the venue from Chandigarh can be arranged on request. Transportation is not included in the participation fee.
              </p>

              <div className="space-y-4 mb-7">
                {TRAVEL_OPTIONS.map((opt) => (
                  <div key={opt.title} className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-summit-orange-50 border border-summit-orange-100 flex items-center justify-center">
                      <opt.icon className="w-5 h-5 text-summit-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-summit-charcoal mb-0.5">{opt.title}</div>
                      <div className="text-sm text-summit-charcoal/60 leading-relaxed">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-lg active:scale-[0.97]"
              >
                Open Location in Maps
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="lg:col-span-7">
              {mapLoaded ? (
                <div className="rounded-2xl overflow-hidden border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 bg-summit-cream animate-fade-in">
                  <iframe
                    title="Map showing the location of Akal Academy Baru Sahib, Himachal Pradesh"
                    src="https://www.google.com/maps?q=Akal+Academy+Baru+Sahib,+Himachal+Pradesh&output=embed"
                    className="w-full h-72 sm:h-80 lg:h-[26rem]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMapLoaded(true)}
                  className="group w-full h-72 sm:h-80 lg:h-[26rem] rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 bg-gradient-to-br from-summit-cream to-summit-orange-50 flex flex-col items-center justify-center gap-4 transition-colors duration-150 hover:border-summit-orange-300 focus-visible:ring-2 focus-visible:ring-summit-orange-500 focus-visible:ring-offset-2"
                  aria-label="Load interactive map of Akal Academy Baru Sahib"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-summit-orange-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                    <Navigation className="w-6 h-6 text-summit-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-summit-charcoal">Akal Academy Baru Sahib, Himachal Pradesh</div>
                    <div className="text-xs text-summit-charcoal/55 mt-1">Tap to load the interactive map</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
