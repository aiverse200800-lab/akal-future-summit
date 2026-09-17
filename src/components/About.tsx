import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ImageLightbox from './ImageLightbox';

export default function About() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [imgOpen, setImgOpen] = useState(false);
  const schoolImage = `${import.meta.env.BASE_URL}baru-sahib-location.jpeg`;

  return (
    <section id="about" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-11 gap-8 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight text-balance mb-6">Where young ideas meet the <span className="text-summit-orange-600">real world.</span></h2>
              <button
                type="button"
                onClick={() => setImgOpen(true)}
                aria-label="Open campus photo in full-size preview"
                className="block w-full relative overflow-hidden rounded-2xl border border-summit-orange-100 bg-white p-2 shadow-lg transition-shadow hover:shadow-xl sm:p-3 cursor-zoom-in focus-visible:ring-2 focus-visible:ring-summit-orange-500 focus-visible:ring-offset-2"
              >
                <img src={schoolImage} alt="Akal Academy Baru Sahib campus location in the Himalayas" className="w-full h-auto rounded-xl object-contain" loading="lazy" />
              </button>
            </div>
            <div className="lg:col-span-7">
              <div className="inline-flex items-center rounded-md border border-summit-charcoal/40 bg-white px-3 py-2 text-xs font-medium text-summit-charcoal mb-5">Akal Academy, Baru Sahib<br />In collaboration with AIC ISB Mohali</div>
              <div className="space-y-4 text-[1.0625rem] text-summit-charcoal/70 leading-[1.8] mb-6">
                <p>Hosted by the <strong className="font-semibold text-summit-charcoal">AABS Entrepreneurship Club</strong> — a residential IB/Cambridge/CBSE school chain of <strong className="font-semibold text-summit-orange-700">129 academies</strong> rooted in faith and traditions, nestled in the foothills of the Himalayas near Rajgarh, Himachal Pradesh — the summit brings together business mindset, adventure, nature, culture and meaningful connections.</p>
                <p>Away from the familiar classroom environment, participants experience the energy of collaboration while immersing themselves in the natural beauty and unique spirit of <strong className="font-semibold text-summit-charcoal">Baru Sahib</strong>.</p>
                <p>It is an opportunity to learn, challenge oneself, build confidence, and make new connections — creating memories that extend far beyond the two days.</p>
              </div>
              <Link to="/program" className="group mt-3 inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-lg active:scale-[0.97]">View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox
        src={schoolImage}
        alt="Akal Academy Baru Sahib campus location in the Himalayas, full size"
        label="Campus photo preview"
        open={imgOpen}
        onClose={() => setImgOpen(false)}
      />
    </section>
  );
}
