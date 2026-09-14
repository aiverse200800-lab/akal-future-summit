import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, User } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-summit-ink text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-5">
            <div className="font-display font-bold text-lg leading-tight mb-1">
              AKAL FUTURE FOUNDERS SUMMIT
            </div>
            <div className="text-sm text-white/40 mb-4">
              Akal Academy Baru Sahib — 40th Foundation Day
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
              <Mountain className="w-4 h-4 text-summit-orange-500" />
              22–23 October 2026
            </div>
            <div className="text-sm text-white/50">
              Akal Academy Baru Sahib, Himachal Pradesh
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Links</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Program', path: '/program' },
                { label: 'Register', path: '/register' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Home', path: '/' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-left text-sm text-white/60 hover:text-summit-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Contact</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <User className="w-4 h-4 text-summit-orange-500 shrink-0" />
                Kulpreet Kaur
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-summit-orange-500 shrink-0" />
                <a href="mailto:admin@akalacademy.ac.in" className="hover:text-summit-orange-400 transition-colors">
                  admin@akalacademy.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-summit-orange-500 shrink-0" />
                <a href="tel:+919997688579" className="hover:text-summit-orange-400 transition-colors">
                  +91 99976 88579
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/30">
            © 2026 Akal Future Founders Summit
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="w-2 h-2 rounded-full bg-summit-orange-500" />
            Two Days. One Experience. A lifetime of possibilities.
          </div>
        </div>
      </div>
    </footer>
  );
}
