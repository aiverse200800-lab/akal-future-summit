import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProgramPage from '@/pages/ProgramPage';
import RegisterPage from '@/pages/RegisterPage';
import FAQPage from '@/pages/FAQPage';
import ScrollToTop from '@/components/ScrollToTop';
import BackToTop from '@/components/BackToTop';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />

      <div className="min-h-screen bg-summit-cream">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>

        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
