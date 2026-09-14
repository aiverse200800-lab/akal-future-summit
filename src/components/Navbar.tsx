import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Program', path: '/program' },
  { label: 'Register', path: '/register' },
  { label: 'FAQ', path: '/faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const logoUrl = `${import.meta.env.BASE_URL}40_FD_Logo_new%20copy.png`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-summit-orange-100' : 'bg-white/80 backdrop-blur-sm'}`}>
      <nav className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="group flex items-center gap-2 text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-summit-charcoal/10 bg-white p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
              <img src={logoUrl} alt="Akal Academy 40th Foundation Day logo" className="h-full w-full object-contain" />
            </span>
            <div>
              <div className="font-display font-bold text-sm sm:text-base leading-tight tracking-tight text-summit-charcoal">Akal Academy Baru Sahib</div>
            </div>
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
            <div className="text-center"><div className="font-display text-sm font-bold leading-tight text-summit-charcoal">AKAL FUTURE FOUNDERS SUMMIT</div></div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${location.pathname === item.path ? 'text-summit-orange-700 bg-summit-orange-50' : 'text-summit-charcoal/70 hover:text-summit-orange-600 hover:bg-summit-orange-50/50'}`}>{item.label}</Link>
            ))}
            <Link to="/register" className="ml-2 inline-flex items-center gap-1.5 border border-summit-charcoal/40 bg-white hover:bg-summit-warm text-summit-charcoal text-sm font-semibold px-4 py-2.5 rounded-lg transition-all hover:shadow-md">Register <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -mr-2 text-summit-charcoal" aria-label="Toggle menu" aria-expanded={mobileOpen}>{mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-summit-orange-100 shadow-lg animate-slide-down">
            <div className="px-5 py-4 space-y-1">
              {NAV_ITEMS.map((item) => <Link key={item.path} to={item.path} className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-summit-orange-700 bg-summit-orange-50' : 'text-summit-charcoal/80 hover:bg-summit-warm'}`}>{item.label}</Link>)}
              <Link to="/register" className="block w-full text-center mt-2 border border-summit-charcoal/30 bg-white hover:bg-summit-warm text-summit-charcoal text-sm font-semibold px-4 py-3 rounded-lg transition-colors">Register</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
