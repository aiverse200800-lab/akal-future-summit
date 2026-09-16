import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, User, School, GraduationCap, Hash, ArrowLeft, Printer, Download } from 'lucide-react';
import type { RegistrationRecord } from '@/types/registration';
import { SUMMIT_DATES, SUMMIT_VENUE } from '@/types/registration';

interface PaymentSuccessProps { registration: RegistrationRecord; }

export default function PaymentSuccess({ registration }: PaymentSuccessProps) {
  const handlePrint = () => window.print();
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
    { icon: Hash, label: 'Registration ID', value: registration.registration_ref || `AFFS-${registration.id.slice(0, 8).toUpperCase()}` },
  ];
  return (
    <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-xl shadow-summit-orange-900/5 overflow-hidden animate-scale-in">
      <div className="bg-gradient-to-br from-summit-orange-600 to-summit-orange-700 px-6 py-8 text-center">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-9 h-9 text-white" /></div>
        <div className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Steps Complete</div>
        <h3 className="font-display font-bold text-2xl text-white mb-1">🎉 Congratulations!</h3>
        <p className="text-sm text-white/75">Your registration steps are complete.</p>
      </div>
      <div className="p-6 lg:p-8">
        <div className="grid sm:grid-cols-2 gap-4">{details.map((detail) => (<div key={detail.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-summit-cream border border-summit-orange-50"><div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-summit-orange-100 flex items-center justify-center"><detail.icon className="w-4.5 h-4.5 text-summit-orange-600" /></div><div className="min-w-0"><div className="text-xs text-summit-charcoal/50 font-medium mb-0.5">{detail.label}</div><div className="text-sm font-semibold text-summit-charcoal break-words">{detail.value}</div></div></div>))}</div>
        <div className="mt-5 bg-summit-orange-50 rounded-xl px-4 py-4"><p className="text-sm text-summit-charcoal/70">Your payment proof has been submitted successfully.</p><p className="text-sm text-summit-charcoal/70 mt-1"><strong>Your payment proof has been submitted for verification.</strong> Payment is not marked as verified until an authorized admin completes verification.</p></div>
        <div className="mt-4 p-4 rounded-xl bg-summit-cream border border-summit-orange-50"><p className="text-sm text-summit-charcoal/70">Thank you for registering for the <strong className="text-summit-charcoal">Akal Future Founders Summit</strong>.</p></div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3"><Link to="/program" className="inline-flex items-center justify-center gap-2 bg-summit-charcoal hover:bg-summit-ink text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-md"><ArrowLeft className="w-4 h-4" />Back to Program</Link><button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal text-sm font-semibold px-5 py-3 rounded-xl border border-summit-orange-200 transition-all hover:shadow-md"><Printer className="w-4 h-4" />Print Confirmation</button><button onClick={handleDownload} className="inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg"><Download className="w-4 h-4" />Download Confirmation</button></div>
      </div>
    </div>
  );
}

function generateConfirmationText(reg: RegistrationRecord): string {
  const ref = reg.registration_ref || `AFFS-${reg.id.slice(0, 8).toUpperCase()}`;
  return `\nAKAL FUTURE FOUNDERS SUMMIT\nRegistration Steps Complete\n========================================\n\nRegistration ID: ${ref}\n\nStudent Name:     ${reg.student_name}\nSchool:           ${reg.school_name}\nGrade:            ${reg.grade}\nCity:             ${reg.city}\nEmail:            ${reg.email}\nPhone:            ${reg.phone}\nSchool Board:     ${reg.school_board || 'N/A'}\nAccompanied:      ${reg.accompanied ? 'Yes' : 'No'}\n\nPayment Status:   Proof Submitted / Verification Pending\n\nSummit Date:      ${SUMMIT_DATES}\nVenue:            ${SUMMIT_VENUE}\n\n========================================\nYour payment proof has been submitted for verification.\n© 2026 Akal Future Founders Summit\n`;
}
