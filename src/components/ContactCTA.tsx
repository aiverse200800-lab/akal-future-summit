import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Mail, Phone, HelpCircle } from 'lucide-react';

export default function ContactCTA() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="contact" className="py-20 lg:py-28 bg-summit-charcoal text-white relative overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[50%] opacity-[0.04] pointer-events-none"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,500 150,200 320,350 480,80 680,300 850,150 1050,350 1200,200 1200,500" fill="white" />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-summit-orange-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5 text-balance">
            Your idea doesn't have to{' '}
            <span className="text-summit-orange-500">stay an idea.</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bring your curiosity. Find a problem. Build something. Take the stage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-500 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-xl hover:shadow-summit-orange-500/30 active:scale-[0.97]"
            >
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/program"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-base px-7 py-3.5 rounded-xl border border-white/10 transition-[background-color,border-color] duration-150"
            >
              Explore the Program
            </Link>
          </div>

          <div className="mb-12" />

          <div className="pt-10 border-t border-white/10">
            <div className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-6">Need help with registration?</div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-2.5 p-5 rounded-xl bg-white/5 border border-white/5">
                <Mail className="w-6 h-6 text-summit-orange-400" />
                <div className="text-sm text-white/50 font-medium">Email</div>
                <a href="mailto:admin@akalacademy.ac.in" className="text-sm sm:text-[0.9375rem] text-white font-semibold hover:text-summit-orange-400 transition-colors break-all">admin@akalacademy.ac.in</a>
              </div>
              <div className="flex flex-col items-center gap-2.5 p-5 rounded-xl bg-white/5 border border-white/5">
                <Phone className="w-6 h-6 text-summit-orange-400" />
                <div className="text-sm text-white/50 font-medium">Phone</div>
                <a href="tel:+919997688579" className="text-sm sm:text-[0.9375rem] text-white font-semibold hover:text-summit-orange-400 transition-colors">+91 99976 88579</a>
              </div>
              <div className="flex flex-col items-center gap-2.5 p-5 rounded-xl bg-white/5 border border-white/5">
                <HelpCircle className="w-6 h-6 text-summit-orange-400" />
                <div className="text-sm text-white/50 font-medium">Registration Help</div>
                <span className="text-sm sm:text-[0.9375rem] text-white font-semibold">Kulpreet Kaur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
