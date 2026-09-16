import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RegistrationRecord } from '@/types/registration';
import RegistrationForm from './RegistrationForm';
import PaymentSuccess from './PaymentSuccess';
import { Loader2, XCircle, Pencil } from 'lucide-react';

type AppState = 'form' | 'processing' | 'success' | 'failure';

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
  accompanied: boolean;
  consent: boolean;
}

const EMPTY_FORM: FormDataType = {
  student_name: '', school_name: '', grade: '', city: '', email: '', phone: '',
  school_board: '', emergency_contact_name: '', emergency_contact_phone: '',
  accompanied: false, consent: false,
};

export default function Registration() {
  const [appState, setAppState] = useState<AppState>('form');
  const [formData, setFormData] = useState<FormDataType>(EMPTY_FORM);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleValidSubmit = async (data: FormDataType) => {
    if (appState === 'processing') return;
    setFormData(data);
    setAppState('processing');
    setError('');
    try {
      const { data: result, error: rpcError } = await supabase.rpc('create_registration', { p_data: data });
      if (rpcError || !result?.registration) {
        throw new Error(rpcError?.message || 'Failed to save registration. Please try again.');
      }
      setRegistration(result.registration as RegistrationRecord);
      setAppState('success');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setAppState('failure');
    }
  };

  const handleEditRegistration = () => {
    setAppState('form');
    setError('');
  };

  return (
    <section id="register" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="absolute top-20 left-0 w-64 h-64 bg-summit-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-3 text-balance">Reserve Your <span className="text-summit-orange-600">Seat</span></h2>
        <p className="text-lg text-summit-charcoal/60 mb-10">Complete the form below to register for the Akal Future Founders Summit.</p>

        {appState === 'form' && <RegistrationForm ref={formRef} initialData={formData} onSubmit={handleValidSubmit} />}
        {appState === 'processing' && (
          <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg p-12 text-center">
            <Loader2 className="w-10 h-10 text-summit-orange-600 animate-spin mx-auto mb-4" />
            <div className="font-display font-bold text-lg text-summit-charcoal mb-1">Saving your registration...</div>
            <div className="text-sm text-summit-charcoal/50">Please don't close this window.</div>
          </div>
        )}
        {appState === 'success' && registration && <PaymentSuccess registration={registration} />}
        {appState === 'failure' && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-xl overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle className="w-9 h-9 text-white" /></div>
              <h3 className="font-display font-bold text-2xl text-white mb-1">Registration could not be completed.</h3>
              <p className="text-sm text-white/80">{error || 'Something went wrong while saving your registration.'}</p>
            </div>
            <div className="p-6 lg:p-8 text-center">
              <button onClick={handleEditRegistration} className="inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg"><Pencil className="w-4 h-4" />Back to Registration</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
