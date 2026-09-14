import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function About() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left: Heading + image */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center rounded-md border border-summit-charcoal/40 bg-white px-3 py-2 text-xs font-medium text-summit-charcoal mb-4">
                Akal Academy, Baru Sahib<br />In collaboration with ISB
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight text-balance mb-6">
                Where young ideas meet the <span className="text-summit-orange-600">real world.</span>
              </h2>
              <a
                href="https://www.akalacademy.in/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit the Akal Academy website"
                className="group block relative aspect-square overflow-hidden rounded-2xl border border-summit-orange-100 bg-white p-2 shadow-lg transition-shadow hover:shadow-xl sm:p-3"
              >
                <img
                  src="/Akal_School.jpg%20copy.jpeg"
                  alt="Akal School campus in the mountains"
                  className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </a>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-7">
              <div className="space-y-4 text-base text-summit-charcoal/70 leading-relaxed mb-6">
                <p>Hosted by the AABS Entrepreneurship Club, a residential IB/Cambridge/CBSE contemporary school chain of 129 academies, based on faith and traditions, nestled in the foothills of the Himalayas near Rajgarh, Himachal Pradesh, a setting where learning extends far beyond the classroom, the summit brings together business mindset, adventure, nature, culture and meaningful connections.</p>
                <p>Away from the familiar classroom environment, participants experience the energy of collaboration while immersing themselves in the natural beauty and unique spirit of Baru Sahib.</p>
                <p>It is an opportunity to learn, challenge oneself, build confidence, make new connections and create memories that extend far beyond the two days.</p>
              </div>

              <Link
                to="/program"
                className="group mt-8 inline-flex items-center gap-2 bg-summit-charcoal hover:bg-summit-charcoal/90 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg"
              >
                Explore the Program
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
