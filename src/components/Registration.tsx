import { useState, useRef, useEffect } from 'react';
import type { RegistrationRecord } from '@/types/registration';
import RegistrationForm from './RegistrationForm';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import SuccessStep from './SuccessStep';
import { XCircle, Pencil, Check } from 'lucide-react';

type Step = 'details' | 'payment' | 'review' | 'submitting' | 'success' | 'failure';

export interface FormDataType {
  student_name: string;
  school_name: string;
  grade: string;
  city: string;
  email: string;
  phone: string;
  school_board: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  accompanied: string;
  consent: boolean;
  payment_proof: File | null;
  website: string; // honeypot — hidden from real users, bots auto-fill it
}

const EMPTY_FORM: FormDataType = {
  student_name: '', school_name: '', grade: '', city: '', email: '', phone: '',
  school_board: '', emergency_contact_name: '', emergency_contact_phone: '',
  accompanied: '', consent: false, payment_proof: null, website: '',
};

const DRAFT_KEY = 'affs-registration-draft';
const STEPS = ['Your Details', 'Registration Fee', 'Review'] as const;

function loadDraft(): FormDataType {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    return { ...EMPTY_FORM, ...JSON.parse(raw), payment_proof: null };
  } catch {
    return EMPTY_FORM;
  }
}

export default function Registration() {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState<FormDataType>(loadDraft);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToForm = () => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    const rest = { ...formData, payment_proof: null };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(rest)); } catch { /* storage unavailable */ }
  }, [formData]);

  const handleDetailsNext = (data: FormDataType) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep('payment');
    scrollToForm();
  };

  const handlePaymentNext = (file: File) => {
    setFormData((prev) => ({ ...prev, payment_proof: file }));
    setStep('review');
    scrollToForm();
  };

  const handleConfirm = async () => {
    if (step === 'submitting') return;
    setStep('submitting');
    setError('');
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'payment_proof') continue;
        if (key === 'accompanied') { body.append('accompanied', String(value === 'yes')); continue; }
        body.append(key, String(value));
      }
      if (formData.payment_proof) body.append('payment_proof', formData.payment_proof);

      const res = await fetch('/api/register', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(45000),
      });
      const result = await res.json();
      if (!res.ok || !result?.registration) {
        throw new Error(result?.error || 'Failed to save registration. Please try again.');
      }
      setRegistration(result.registration as RegistrationRecord);
      localStorage.removeItem(DRAFT_KEY);
      setStep('success');
      scrollToForm();
    } catch (err) {
      console.error('Registration error:', err);
      const isTimeout = err instanceof DOMException && err.name === 'TimeoutError';
      setError(
        isTimeout
          ? 'The request timed out — please check your connection and try again.'
          : err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
      setStep('failure');
    }
  };

  const stepIndex = step === 'details' ? 0 : step === 'payment' ? 1 : 2;
  const showProgress = step !== 'success' && step !== 'failure';

  return (
    <section ref={sectionRef} id="register" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="absolute top-20 left-0 w-64 h-64 bg-summit-orange-100/40 rounded-full blur-3xl pointer-events-none hidden sm:block" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-3 text-balance">Reserve Your <span className="text-summit-orange-600">Seat</span></h2>
        <p className="text-lg text-summit-charcoal/60 mb-8">Complete the form below to register for the Akal Future Founders Summit.</p>



        {showProgress && (
          <ol className="flex items-center justify-center gap-2 mb-8" aria-label="Registration progress">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  i < stepIndex ? 'bg-green-500 text-white' : i === stepIndex ? 'bg-summit-orange-600 text-white' : 'bg-summit-orange-100 text-summit-charcoal/40'
                }`}>
                  {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className={`text-xs font-semibold hidden sm:block ${i === stepIndex ? 'text-summit-charcoal' : 'text-summit-charcoal/40'}`}>{label}</span>
                {i < STEPS.length - 1 && <span className={`h-px w-10 sm:w-16 ${i < stepIndex ? 'bg-green-400' : 'bg-summit-orange-100'}`} />}
              </li>
            ))}
          </ol>
        )}

        {step === 'details' && <RegistrationForm ref={formRef} initialData={formData} onSubmit={handleDetailsNext} />}
        {step === 'payment' && (
          <PaymentStep
            initialFile={formData.payment_proof}
            onBack={() => setStep('details')}
            onNext={handlePaymentNext}
          />
        )}
        {(step === 'review' || step === 'submitting') && (
          <ReviewStep
            data={formData}
            submitting={step === 'submitting'}
            onEditDetails={() => setStep('details')}
            onEditPayment={() => setStep('payment')}
            onConfirm={handleConfirm}
          />
        )}
        {step === 'success' && registration && <SuccessStep registration={registration} />}
        {step === 'failure' && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-xl overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle className="w-9 h-9 text-white" /></div>
              <div className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Submission Failed</div>
              <h3 className="font-display font-bold text-2xl text-white mb-1">Something went wrong</h3>
              <p className="text-sm text-white/75">Don't worry — your details are saved in this browser.</p>
            </div>
            <div className="p-6 lg:p-8 text-center">
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>
              <button onClick={() => { setStep('review'); setError(''); }} className="inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150 active:scale-[0.97]">
                <Pencil className="w-4 h-4" /> Review &amp; Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
