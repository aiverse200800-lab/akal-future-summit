import { Pencil, Loader2, ShieldCheck, User, School, GraduationCap, MapPin, Mail, Phone, Users, FileImage, AlertTriangle, Calendar } from 'lucide-react';
import type { FormDataType } from './Registration';
import { SUMMIT_DATES, SUMMIT_VENUE } from '@/types/registration';

interface ReviewStepProps {
  data: FormDataType;
  submitting: boolean;
  onEditDetails: () => void;
  onEditPayment: () => void;
  onConfirm: () => void;
}

export default function ReviewStep({ data, submitting, onEditDetails, onEditPayment, onConfirm }: ReviewStepProps) {
  const details = [
    { icon: User, label: 'Student Name', value: data.student_name },
    { icon: School, label: 'School', value: data.school_name },
    { icon: GraduationCap, label: 'Grade', value: data.grade },
    { icon: MapPin, label: 'City', value: data.city },
    { icon: Mail, label: 'Email', value: data.email },
    { icon: Phone, label: 'Phone', value: data.phone },
    { icon: School, label: 'School Board', value: data.school_board || '—' },
    { icon: Users, label: 'Accompanying Adult', value: data.accompanied === 'yes' ? 'Yes' : 'No' },
    { icon: User, label: 'Emergency Contact', value: data.emergency_contact_name || '—' },
    { icon: Phone, label: 'Emergency Phone', value: data.emergency_contact_phone || '—' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 p-6 lg:p-8 animate-scale-in">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="font-display font-bold text-xl text-summit-charcoal mb-1">Review Your Details</h3>
          <p className="text-sm text-summit-charcoal/60">Please check everything carefully before submitting.</p>
        </div>
        <button type="button" onClick={onEditDetails} className="inline-flex items-center gap-1.5 text-xs font-semibold text-summit-orange-600 hover:text-summit-orange-700 shrink-0 mt-1">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {details.map((d) => (
          <div key={d.label} className="flex items-start gap-3 p-3 rounded-xl bg-summit-cream border border-summit-orange-50">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-summit-orange-100 flex items-center justify-center">
              <d.icon className="w-4 h-4 text-summit-orange-600" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-summit-charcoal/50 font-medium mb-0.5">{d.label}</div>
              <div className="text-sm font-semibold text-summit-charcoal break-words">{d.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-4 mt-6 mb-2">
        <h4 className="text-sm font-semibold text-summit-charcoal">Fee Screenshot</h4>
        <button type="button" onClick={onEditPayment} className="inline-flex items-center gap-1.5 text-xs font-semibold text-summit-orange-600 hover:text-summit-orange-700 shrink-0">
          <Pencil className="w-3.5 h-3.5" /> Change
        </button>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
        <FileImage className="w-5 h-5 text-green-600 shrink-0" />
        <span className="text-sm font-medium text-green-800 truncate">{data.payment_proof?.name}</span>
        {data.payment_proof && (
          <img src={URL.createObjectURL(data.payment_proof)} alt="Fee screenshot preview" className="ml-auto h-12 w-12 object-cover rounded-lg outline outline-1 outline-black/10" />
        )}
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Your seat will be confirmed within a few hours once our team verifies your fee payment.
        </p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={submitting}
        className="group w-full mt-6 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base px-6 py-4 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-xl hover:shadow-summit-orange-500/25 active:scale-[0.97]"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" /> Confirm &amp; Submit Registration
          </>
        )}
      </button>

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-sm text-summit-charcoal/70">
        <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4 text-summit-orange-600" />{SUMMIT_DATES} · 9:00 AM – 5:00 PM</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-summit-orange-600" />{SUMMIT_VENUE}</span>
      </div>
    </div>
  );
}
