import { useState, useEffect, useCallback } from 'react';
import { Mountain, Trees, Sunrise, Users, Heart, Tent, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const EXPERIENCES = [
  { icon: Mountain, title: 'Nature', desc: 'Set in the Himalayan foothills near Rajgarh' },
  { icon: Sunrise, title: 'Adventure', desc: 'Outdoor activities beyond the classroom' },
  { icon: Heart, title: 'Culture', desc: 'A rich spiritual and cultural environment' },
  { icon: Users, title: 'Community', desc: 'Connect with peers across Northern India' },
  { icon: Tent, title: 'Residential', desc: 'Two nights of immersive summit living' },
  { icon: Trees, title: 'Spiritual', desc: 'A serene environment for deep thinking' },
];

const BASE_URL = import.meta.env.BASE_URL;

const CAROUSEL_IMAGES = [
  {
    src: `${BASE_URL}scene1-baru-sahib.jpg`,
    alt: 'Panoramic Himalayan mountain setting at Baru Sahib',
    caption: 'The Himalayan setting of Baru Sahib',
    tag: 'Himalayan Setting',
  },
  {
    src: `${BASE_URL}scene5-baru-sahib.jpg`,
    alt: 'Students on the Akal Academy Baru Sahib campus',
    caption: 'Campus life at Baru Sahib',
    tag: 'Campus Life',
  },
  {
    src: `${BASE_URL}baru-sahib.jpg`,
    alt: 'Akal Academy Baru Sahib campus buildings and grounds',
    caption: 'Akal Academy Baru Sahib campus',
    tag: 'Campus Life',
  },
  {
    src: `${BASE_URL}scene4-baru-sahib.jpg`,
    alt: 'Students engaged in activities at Baru Sahib',
    caption: 'Life and learning beyond the classroom',
    tag: 'Campus Life',
  },
  {
    src: `${BASE_URL}cadets-baru-sahib.jpg`,
    alt: 'NCC cadets at Akal Academy Baru Sahib',
    caption: 'Discipline and character at Baru Sahib',
    tag: 'Campus Life',
  },
];

export default function BaruSahibExperience() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % CAROUSEL_IMAGES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section id="experience" className="py-20 lg:py-28 bg-summit-charcoal text-white relative overflow-hidden">
      {/* Mountain silhouette background */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[40%] opacity-[0.06] pointer-events-none"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,500 100,200 250,350 400,80 600,300 750,150 900,320 1050,100 1200,280 1200,500" fill="white" />
        <polygon points="0,500 80,280 220,400 380,180 550,350 700,220 880,380 1100,200 1200,350 1200,500" fill="white" opacity="0.5" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: School photo carousel */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {CAROUSEL_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-summit-charcoal/70 via-transparent to-transparent" />
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                    <div className="text-xs text-summit-orange-300 font-medium uppercase tracking-wider mb-1">
                      {CAROUSEL_IMAGES[current].tag}
                    </div>
                    <div className="text-sm text-white/80">{CAROUSEL_IMAGES[current].caption}</div>
                  </div>
                </div>

                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/25"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/25"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-2 right-4 flex gap-1.5">
                  {CAROUSEL_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-summit-orange-400' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                      aria-label={`Go to photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <h2 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-balance mb-5">
                More than a classroom.{' '}
                <span className="text-summit-orange-400">A Himalayan experience.</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Hosted by the Entrepreneurship Club of Akal Academy Baru Sahib — a residential IB, Cambridge, and CBSE school in the Himalayas near Rajgarh, Himachal Pradesh. Students don't just attend a summit; they live it.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {EXPERIENCES.map((exp) => (
                  <div key={exp.title} className="group">
                    <div className="w-10 h-10 rounded-lg bg-summit-orange-600/20 flex items-center justify-center mb-2.5 group-hover:bg-summit-orange-600/30 transition-colors">
                      <exp.icon className="w-5 h-5 text-summit-orange-400" />
                    </div>
                    <div className="text-sm font-semibold text-white mb-0.5">{exp.title}</div>
                    <div className="text-xs text-white/50 leading-snug">{exp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
