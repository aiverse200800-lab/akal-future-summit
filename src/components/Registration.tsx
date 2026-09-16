import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { RegistrationRecord } from '@/types/registration';
import RegistrationForm from './RegistrationForm';
import PaymentPage from './PaymentPage';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailure from './PaymentFailure';
import { Loader2 } from 'lucide-react';

type AppState = 'form' | 'processing' | 'payment' | 'success' | 'failure';

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
  const [paymentToken, setPaymentToken] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleValidSubmit = async (data: FormDataType) => {
    if (appState === 'processing' || appState === 'payment') return;
    setFormData(data);
    setAppState('processing');
    setError('');
    try {
      const { data: result, error: rpcError } = await supabase.rpc('create_registration', { p_data: data });
      if (rpcError || !result?.registration || !result?.payment_token) {
        throw new Error(rpcError?.message || 'Failed to save registration. Please try again.');
      }
      setRegistration(result.registration as RegistrationRecord);
      setPaymentToken(result.payment_token as string);
      setAppState('payment');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setAppState('failure');
    }
  };

  const handleProofComplete = (record: RegistrationRecord) => {
    setRegistration(record);
    setAppState('success');
  };

  const handleEditRegistration = () => {
    setAppState('form');
    setError('');
  };

  const handleTryAgain = () => {
    if (registration && paymentToken) setAppState('payment');
    else setAppState('form');
  };

  return (
    <section id="register" className="py-20 lg:py-28 bg-summit-cream relative overflow-hidden">
      <div className="absolute top-20 left-0 w-64 h-64 bg-summit-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-summit-charcoal leading-tight mb-3 text-balance">Reserve Your <span className="text-summit-orange-600">Seat</span></h2>
        <p className="text-lg text-summit-charcoal/60 mb-10">Complete the form below to register for the Akal Future Founders Summit.</p>

        {appState === 'form' && <RegistrationForm ref={formRef} initialData={formData} onSubmit={handleValidSubmit} />}
        {appState === 'processing' && <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg p-12 text-center"><Loader2 className="w-10 h-10 text-summit-orange-600 animate-spin mx-auto mb-4" /><div className="font-display font-bold text-lg text-summit-charcoal mb-1">Saving your registration...</div><div className="text-sm text-summit-charcoal/50">Please don't close this window.</div></div>}
        {appState === 'payment' && registration && paymentToken && <PaymentPage registration={registration} paymentToken={paymentToken} onComplete={handleProofComplete} />}
        {appState === 'success' && registration && <PaymentSuccess registration={registration} />}
        {appState === 'failure' && <PaymentFailure registration={registration} error={error} onTryAgain={handleTryAgain} onEdit={handleEditRegistration} />}
      </div>
    </section>
  );
}
