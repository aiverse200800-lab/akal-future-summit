import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

const BASE_URL = import.meta.env.BASE_URL;

export default function Hero() {
  const [posterLoadFailed, setPosterLoadFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox]);

  return (
    <section className="relative min-h-[92svh] flex items-center overflow-hidden pt-16 bg-summit-cream">
      <div className="absolute inset-0"><img src="https://images.pexels.com/photos/32464426/pexels-photo-32464426.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Snow-covered Himalayan peaks under a dramatic sky" className="w-full h-full object-cover opacity-40" loading="eager" fetchPriority="high" /><div className="absolute inset-0 bg-gradient-to-b from-summit-cream/65 via-summit-cream/45 to-summit-cream/95" /></div>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <svg className="absolute bottom-14 left-0 right-0 w-full h-[30%] opacity-[0.07] pointer-events-none" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,400 200,120 380,280 520,60 720,240 900,100 1200,300 1200,400" fill="none" stroke="#EA580C" strokeWidth="2" /><polygon points="0,400 150,200 320,320 480,140 680,300 850,180 1050,320 1200,220 1200,400" fill="none" stroke="#EA580C" strokeWidth="1.5" /><polygon points="0,400 100,280 280,360 450,220 620,340 800,260 1000,360 1200,280 1200,400" fill="none" stroke="#EA580C" strokeWidth="1" /></svg>
      <div className="absolute top-20 right-0 w-72 h-72 bg-summit-orange-500/8 rounded-bl-[120px] hidden lg:block" /><div className="absolute top-32 right-16 w-48 h-48 bg-summit-orange-400/6 rounded-full hidden lg:block" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          <div className="min-w-0">
            <div className="mb-6 animate-fade-in"><div className="grid w-full max-w-lg grid-cols-4 items-center gap-2 sm:gap-4"><div className="flex items-center justify-center"><img src={`${BASE_URL}AkalAcademy%20(1).png`} alt="Akal Academy Baru Sahib CBSE logo" className="h-9 w-full object-contain sm:h-10" loading="eager" /></div><div className="flex items-center justify-center"><img src={`${BASE_URL}Retina%20Logo%20(1).png`} alt="AIC ISB Mohali logo" className="h-9 w-full object-contain sm:h-10" loading="eager" /></div><div className="flex items-center justify-center"><img src={`${BASE_URL}TalentGro%20(2).png`} alt="TalentGro logo" className="h-9 w-full object-contain sm:h-10" loading="eager" /></div><div className="flex items-center justify-center"><img src={`${BASE_URL}Amoeba_-_transparent_logo.png`} alt="Amoeba Education logo" className="h-9 w-full object-contain sm:h-10" loading="eager" /></div></div></div>
            <h1 className="hero-title w-full max-w-full font-display font-bold tracking-[-0.03em] text-summit-charcoal leading-[0.95] text-[clamp(1.65rem,8.8vw,3.5rem)] sm:text-[clamp(2rem,6vw,4rem)] lg:text-[clamp(2.75rem,4.1vw,5.5rem)]"><span className="hero-title-line block whitespace-nowrap">AKAL FUTURE</span><span className="hero-title-line block whitespace-nowrap"><span className="text-summit-orange-600">FOUNDERS</span>{' '}<span className="text-summit-charcoal">SUMMIT</span></span></h1>
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl font-display font-semibold text-summit-charcoal/80 leading-snug text-balance">Two Days <span className="text-summit-orange-500 font-normal" aria-hidden="true">·</span> One Summit <span className="text-summit-orange-500 font-normal" aria-hidden="true">·</span>{' '}<span className="text-summit-orange-600">A Lifetime of Possibilities</span></p>
            <p className="mt-5 text-base sm:text-[1.0625rem] text-summit-charcoal/65 max-w-xl leading-[1.8]">AFFS, in collaboration with <strong className="font-semibold text-summit-charcoal">AIC ISB Mohali</strong>, offers a unique platform for high school students to unleash their entrepreneurial potential, transform ideas into possibilities, and develop crucial business skills through hands-on experiences, real-world challenges, and expert mentorship.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3"><Link to="/register" className="group inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-xl hover:shadow-summit-orange-500/30 active:scale-[0.97]">Reserve Your Seat<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link><Link to="/program" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-summit-warm text-summit-charcoal font-semibold text-base px-7 py-3.5 rounded-xl border border-summit-orange-200 transition-[background-color,box-shadow] duration-150 hover:shadow-md">Explore the Program</Link></div>
          </div>
          <div className="min-w-0 w-full flex justify-center lg:justify-end">
            <button
              type="button"
              onClick={() => !posterLoadFailed && setLightboxOpen(true)}
              className="relative block w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] rounded-2xl bg-white p-1.5 shadow-xl shadow-summit-charcoal/10 outline outline-1 outline-black/5 transition-[box-shadow] duration-150 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-summit-orange-500 focus-visible:ring-offset-2 cursor-zoom-in animate-fade-in"
              aria-label="Open summit poster in full-size preview"
            >
              {posterLoadFailed ? (
                <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-[#fff5e9] via-white to-[#f9d8bd] p-6 text-summit-charcoal sm:p-8"><div className="flex items-start justify-between border-b border-summit-orange-600/20 pb-4"><div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-summit-orange-600">Akal Academy, Baru Sahib</div><div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-summit-charcoal/60">40th Foundation Day</div></div><div className="text-right text-[10px] font-bold uppercase tracking-widest text-summit-charcoal/60">2026</div></div><div className="flex h-full flex-col justify-center pb-8 pt-8"><div className="text-xs font-bold uppercase tracking-[0.24em] text-summit-orange-600">Akal</div><div className="mt-2 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight sm:text-5xl">Future<br /><span className="text-summit-orange-600">Founders</span></div><div className="mt-2 font-display text-xl font-bold uppercase tracking-[0.12em]">Summit</div><div className="mt-8 h-px w-16 bg-summit-orange-600" /><div className="mt-4 text-sm font-semibold text-summit-charcoal/70">22–23 October 2026</div><div className="mt-1 text-xs text-summit-charcoal/60">Bhai Gurdass Hall, Baru Sahib</div></div><div className="rounded-lg bg-summit-charcoal px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white">Where Ideas Meet Opportunity</div></div>
              ) : (
                <img src={`${BASE_URL}hero-poster.png`} alt="Akal Future Founders Summit 2026 event poster" className="h-auto w-full rounded-[0.65rem] object-contain" loading="eager" fetchPriority="high" onError={() => setPosterLoadFailed(true)} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-summit-charcoal text-white py-3 overflow-hidden"><div className="flex animate-marquee whitespace-nowrap">{[...Array(2)].map((_, i) => (<div key={i} className="flex items-center gap-8 px-4 text-sm font-medium text-white/80"><span>22–23 OCTOBER 2026</span><span className="text-summit-orange-500">●</span><span>BHAI GURDASS HALL, BARU SAHIB</span><span className="text-summit-orange-500">●</span><span>CLASSES 9–12</span><span className="text-summit-orange-500">●</span><span>CBSE • ICSE • CAMBRIDGE • IB</span><span className="text-summit-orange-500">●</span></div>))}</div></div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-summit-ink/80 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Summit poster preview"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-150"
            aria-label="Close poster preview"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={`${BASE_URL}hero-poster.png`}
            alt="Akal Future Founders Summit 2026 event poster, full size"
            className="max-h-[90vh] max-w-full w-auto rounded-xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
