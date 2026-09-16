import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, User, School, GraduationCap, Hash, ArrowLeft, Printer, Download, Mail } from 'lucide-react';
import type { RegistrationRecord } from '@/types/registration';
import { SUMMIT_DATES, SUMMIT_VENUE } from '@/types/registration';

interface PaymentSuccessProps { registration: RegistrationRecord; }

export default function PaymentSuccess({ registration }: PaymentSuccessProps) {
  const handlePrint = () => { window.print(); };
  const handleDownload = () => {
    const content = generateConfirmationText(registration);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AFFS-Confirmation-${registration.registration_ref || registration.id.slice(0, 8)}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const details = [
    { icon: User, label: 'Student Name', value: registration.student_name },
    { icon: School, label: 'School', value: registration.school_name },
    { icon: GraduationCap, label: 'Grade', value: registration.grade },
    { icon: Calendar, label: 'Summit Date', value: SUMMIT_DATES },
    { icon: MapPin, label: 'Venue', value: SUMMIT_VENUE },
    { icon: Hash, label: 'Payment ID', value: registration.payment_id || 'N/A' },
    { icon: Hash, label: 'Registration Ref', value: registration.registration_ref || `AFFS-${registration.id.slice(0, 8).toUpperCase()}` },
  ];
  return (
    <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-xl shadow-summit-orange-900/5 overflow-hidden animate-scale-in">
      <div className="bg-gradient-to-br from-summit-orange-600 to-summit-orange-700 px-6 py-8 text-center"><div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-9 h-9 text-white" /></div><div className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Registration Confirmed</div><h3 className="font-display font-bold text-2xl text-white mb-1">Welcome to the Summit.</h3><p className="text-sm text-white/70">Akal Future Founders Summit — 22–23 October 2026</p></div>
      <div className="p-6 lg:p-8"><div className="grid sm:grid-cols-2 gap-4">{details.map((detail) => (<div key={detail.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-summit-cream border border-summit-orange-50"><div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-summit-orange-100 flex items-center justify-center"><detail.icon className="w-4.5 h-4.5 text-summit-orange-600" /></div><div className="min-w-0"><div className="text-xs text-summit-charcoal/50 font-medium mb-0.5">{detail.label}</div><div className="text-sm font-semibold text-summit-charcoal truncate">{detail.value}</div></div></div>))}</div>
        <div className="mt-5 flex items-start gap-2.5 bg-summit-orange-50 rounded-xl px-4 py-3.5"><div className="w-2 h-2 rounded-full bg-summit-orange-500 mt-1.5 flex-shrink-0" /><p className="text-sm text-summit-charcoal/60">Please save this confirmation for your records. You'll need your Registration Reference ID for any future correspondence.</p></div>
        <div className="mt-3 flex items-start gap-2.5 bg-green-50 rounded-xl px-4 py-3.5"><Mail className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-summit-charcoal/60">A confirmation email has been sent to <strong className="text-summit-charcoal">{registration.email}</strong>. You will be notified soon with further summit details.</p></div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3"><Link to="/program" className="inline-flex items-center justify-center gap-2 bg-summit-charcoal hover:bg-summit-ink text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-md"><ArrowLeft className="w-4 h-4" />Back to Program</Link><button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal text-sm font-semibold px-5 py-3 rounded-xl border border-summit-orange-200 transition-all hover:shadow-md"><Printer className="w-4 h-4" />Print Confirmation</button><button onClick={handleDownload} className="inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-summit-orange-500/25"><Download className="w-4 h-4" />Download Confirmation</button></div>
      </div>
    </div>
  );
}
function generateConfirmationText(reg: RegistrationRecord): string { const ref = reg.registration_ref || `AFFS-${reg.id.slice(0, 8).toUpperCase()}`; return `
AKAL FUTURE FOUNDERS SUMMIT
Registration Confirmation
========================================

Registration Reference: ${ref}
Payment ID: ${reg.payment_id || 'N/A'}

Student Name:     ${reg.student_name}
School:           ${reg.school_name}
Grade:            ${reg.grade}
City:             ${reg.city}
Email:            ${reg.email}
Phone:            ${reg.phone}
School Board:     ${reg.school_board || 'N/A'}
Accompanied:      ${reg.accompanied ? 'Yes' : 'No'}

Summit Date:      ${SUMMIT_DATES}
Venue:            ${SUMMIT_VENUE}

========================================
Please save this confirmation for your records.
© 2026 Akal Future Founders Summit
`; }
