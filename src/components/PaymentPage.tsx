import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Loader2, Upload, QrCode } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { RegistrationRecord } from '@/types/registration';

interface PaymentPageProps {
  registration: RegistrationRecord;
  paymentToken: string;
  onComplete: (record: RegistrationRecord) => void;
}

const QR_IMAGE = 'https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=20&data=upi%3A%2F%2Fpay%3Fpa%3Dpulkitmangla111-1%40okicici%26pn%3DPulkit%2520Mangla%26aid%3DuGICAgIC_gs7CKg';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function PaymentPage({ registration, paymentToken, onComplete }: PaymentPageProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const amount = import.meta.env.VITE_EVENT_AMOUNT;

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleFile = (selected: File | undefined) => {
    setError('');
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (!selected) return;
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Please upload a JPG, JPEG, PNG, WEBP, or PDF file.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File is too large. Please choose a file up to 5 MB.');
      return;
    }
    setFile(selected);
    if (selected.type.startsWith('image/')) setPreview(URL.createObjectURL(selected));
  };

  const submitProof = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const form = new FormData();
      form.append('registrationId', registration.id);
      form.append('paymentToken', paymentToken);
      form.append('file', file);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-payment-proof`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: form,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Payment proof could not be uploaded. Please try again.');
      onComplete({ ...registration, payment_status: 'proof_submitted', proof_status: 'uploaded', registration_status: 'verification_pending', payment_proof_path: result.path || null, payment_submitted_at: result.payment_submitted_at || new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment proof could not be uploaded. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-xl shadow-summit-orange-900/5 overflow-hidden">
      <div className="bg-summit-charcoal px-6 py-7 text-center">
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3"><CreditCard className="w-7 h-7 text-white" /></div>
        <h3 className="font-display font-bold text-2xl text-white">Complete Your Payment</h3>
        <p className="text-sm text-white/60 mt-1">Your registration has been saved. Complete payment and submit your proof.</p>
      </div>
      <div className="p-6 lg:p-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-summit-cream border border-summit-orange-50"><div className="text-xs text-summit-charcoal/50 mb-1">Name</div><div className="font-semibold text-summit-charcoal break-words">{registration.student_name}</div></div>
          <div className="p-4 rounded-xl bg-summit-cream border border-summit-orange-50"><div className="text-xs text-summit-charcoal/50 mb-1">Registration ID</div><div className="font-semibold text-summit-charcoal break-all">{registration.registration_ref}</div></div>
        </div>
        {amount && <div className="mb-6 p-4 rounded-xl bg-summit-orange-50 border border-summit-orange-100"><div className="text-xs text-summit-charcoal/50 mb-1">Amount</div><div className="font-bold text-lg text-summit-charcoal">{amount}</div></div>}
        <div className="rounded-2xl border border-summit-orange-100 bg-summit-cream p-5 sm:p-7 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-summit-charcoal mb-4"><QrCode className="w-5 h-5 text-summit-orange-600" /> Scan & Pay</div>
          <div className="mx-auto w-full max-w-[420px] bg-white rounded-xl p-3 shadow-sm border border-summit-orange-50"><img src={QR_IMAGE} alt="Payment QR code for Pulkit Mangla, UPI ID pulkitmangla111-1@okicici" className="block w-full h-auto object-contain" /></div>
          <p className="text-sm text-summit-charcoal/65 mt-5">Scan the QR code using your UPI/payment app and complete the payment.</p>
          <p className="text-sm text-summit-charcoal/65 mt-2">After completing the payment, upload your payment screenshot/proof below.</p>
        </div>
        {!showUpload ? (
          <button type="button" onClick={() => setShowUpload(true)} className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold px-6 py-4 rounded-xl transition-all hover:shadow-lg"><CheckCircle2 className="w-5 h-5" />I Have Completed Payment</button>
        ) : (
          <div className="mt-6 rounded-2xl border border-summit-orange-100 p-5 sm:p-6">
            <h4 className="font-display font-bold text-lg text-summit-charcoal">Upload Payment Proof</h4>
            <p className="text-sm text-summit-charcoal/55 mt-1 mb-4">JPG, JPEG, PNG, WEBP or PDF · Maximum 5 MB</p>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-summit-orange-200 bg-summit-cream/50 px-4 text-center hover:border-summit-orange-400 transition-colors">
              <Upload className="w-7 h-7 text-summit-orange-600 mb-2" />
              <span className="text-sm font-semibold text-summit-charcoal">Choose payment screenshot</span>
              <span className="text-xs text-summit-charcoal/45 mt-1">or drag and drop it here</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
            {file && <div className="mt-4 rounded-xl bg-summit-cream p-3 text-sm text-summit-charcoal"><div className="font-semibold break-all">{file.name}</div><div className="text-xs text-summit-charcoal/50 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</div>{preview && <img src={preview} alt="Payment proof preview" className="mt-3 max-h-72 w-full object-contain rounded-lg bg-white" />}</div>}
            {error && <div className="mt-4 flex items-start gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</div>}
            <button type="button" disabled={!file || submitting} onClick={submitProof} className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl transition-all">{submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting Proof...</> : <>Submit Payment Proof</>}</button>
          </div>
        )}
      </div>
    </div>
  );
}
