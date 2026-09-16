import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Who can join?',
    a: 'Students from Classes 9–12, including CBSE, ICSE, Cambridge, and IB schools.',
  },
  {
    q: 'Do I need a business idea before attending?',
    a: 'No. Students are guided through problem discovery, ideation, and idea selection.',
  },
  {
    q: 'What does ₹5,000 include?',
    a: 'Summit kit, food, and 2 nights lodging.',
  },
  {
    q: 'What should I bring?',
    a: 'A charged laptop and charger if available, personal essentials, comfortable clothing, and any school or travel documents required.',
  },
  {
    q: 'Can a parent or teacher accompany an outstation student?',
    a: 'Yes. Outstation participating students can be accompanied by a teacher or parent.',
  },
  {
    q: 'Is transportation included?',
    a: 'Travel to the venue from Chandigarh can be arranged on request. Confirm final transportation terms with the organisers.',
  },
  {
    q: 'What is the refund policy?',
    a: 'Refunds and cancellations are subject to the organiser\'s final registration policy. The official policy will be displayed before payment and registration.',
  },
];

export default function FAQ() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="mb-10 sm:mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-5 sm:gap-8">
              <div className="flex items-center justify-center min-w-0">
                <img
                  src="/image%20copy.png"
                  alt="Akal Academy Baru Sahib CBSE logo"
                  className="h-10 sm:h-11 w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center min-w-0">
                <img
                  src="/image%20copy%202.png"
                  alt="ISB Mohali and Atal Incubation Centre logo"
                  className="h-10 sm:h-11 w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center min-w-0">
                <img
                  src="/image%20copy%203.png"
                  alt="TalentGro logo"
                  className="h-10 sm:h-11 w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center min-w-0">
                <img
                  src="/Amoeba_-_transparent_logo.png"
                  alt="Amoeba Education logo"
                  className="h-10 sm:h-11 w-full max-w-[150px] object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-3 text-balance">
            Frequently asked{' '}
            <span className="text-summit-orange-600">questions</span>
          </h2>
          <p className="text-lg text-summit-charcoal/60 mb-10">
            Everything you need to know before registering.
          </p>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all ${
                  openIndex === i
                    ? 'border-summit-orange-300 shadow-md'
                    : 'border-summit-orange-100 hover:border-summit-orange-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-display font-semibold text-base text-summit-charcoal group-hover:text-summit-orange-700 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-summit-orange-600 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-summit-charcoal/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
