import { useEffect } from 'react';
import confetti from 'canvas-confetti';

import { CheckCircle, Calendar, MapPin, User, School, GraduationCap, Hash, Download, Clock } from 'lucide-react';
import type { RegistrationRecord } from '@/types/registration';
import { SUMMIT_DATES, SUMMIT_VENUE } from '@/types/registration';

interface SuccessStepProps { registration: RegistrationRecord; }

const CONFETTI_COLORS = ['#EA580C', '#F97316', '#FDBA74', '#16A34A', '#FFEDD5'];

const CHARCOAL: [number, number, number] = [26, 24, 20];
const ORANGE: [number, number, number] = [234, 88, 12];
const MUTED: [number, number, number] = [120, 110, 100];

async function downloadReceipt(reg: RegistrationRecord) {
  const { jsPDF } = await import('jspdf');
  const ref = reg.registration_ref || `AFFS-${reg.id.slice(0, 8).toUpperCase()}`;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 56;
  let y = 0;

  // Header band
  doc.setFillColor(ORANGE[0], ORANGE[1], ORANGE[2]);
  doc.rect(0, 0, pageW, 96, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AKAL FUTURE FOUNDERS SUMMIT', margin, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${SUMMIT_DATES}  ·  9:00 AM - 5:00 PM`, margin, 62);
  doc.text(SUMMIT_VENUE, margin, 76);
  doc.setFont('helvetica', 'bold');
  doc.text('Registration Receipt', margin, 92);

  y = 130;

  // Registration ID block
  doc.setFillColor(255, 247, 237);
  doc.roundedRect(margin, y - 24, pageW - margin * 2, 52, 6, 6, 'F');
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFontSize(9);
  doc.text('REGISTRATION ID', margin + 16, y - 6);
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(ref, margin + 16, y + 14);

  y += 64;

  const rows: [string, string][] = [
    ['Student Name', reg.student_name],
    ['School', reg.school_name],
    ['Grade', reg.grade],
    ['City', reg.city],
    ['Email', reg.email],
    ['Phone', reg.phone],
    ['School Board', reg.school_board || 'Not specified'],
    ['Accompanied by Teacher/Parent', reg.accompanied ? 'Yes' : 'No'],
  ];

  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
    doc.text(String(value), margin + 200, y);
    doc.setDrawColor(240, 230, 220);
    doc.line(margin, y + 10, pageW - margin, y + 10);
    y += 32;
  });

  // Verification note
  y += 8;
  doc.setFillColor(255, 251, 235);
  const noteH = 84;
  doc.roundedRect(margin, y, pageW - margin * 2, noteH, 6, 6, 'F');
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('VERIFICATION IN PROGRESS', margin + 16, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    doc.splitTextToSize(
      'Your registration and payment screenshot have been received. Our team will inform you once your payment proof is verified. Your seat will be reserved within a few hours of confirmation.',
      pageW - margin * 2 - 32
    ),
    margin + 16,
    y + 40
  );

  // Footer
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Questions? Write to admin@akalacademy.ac.in', margin, doc.internal.pageSize.getHeight() - 44);
  doc.text('© 2026 Akal Future Founders Summit', margin, doc.internal.pageSize.getHeight() - 30);

  doc.save(`AFFS-Receipt-${ref}.pdf`);
}

export default function SuccessStep({ registration }: SuccessStepProps) {
  useEffect(() => {
    const defaults = { origin: { y: 0.6 }, colors: CONFETTI_COLORS, disableForReducedMotion: true };
    confetti({ ...defaults, particleCount: 120, spread: 80 });
    const t1 = setTimeout(() => confetti({ ...defaults, particleCount: 60, angle: 60, origin: { x: 0, y: 0.7 } }), 250);
    const t2 = setTimeout(() => confetti({ ...defaults, particleCount: 60, angle: 120, origin: { x: 1, y: 0.7 } }), 450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
        <div className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Registration Submitted</div>
        <h3 className="font-display font-bold text-2xl text-white mb-1">Thank You for Registering!</h3>
        <p className="text-sm text-white/75">We've received your details.</p>
      </div>
      <div className="p-6 lg:p-8">
        <div className="grid sm:grid-cols-2 gap-4">{details.map((detail, i) => (<div key={detail.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-summit-cream border border-summit-orange-50 animate-fade-up" style={{ animationDelay: `${200 + i * 60}ms`, animationFillMode: 'backwards' }}><div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-summit-orange-100 flex items-center justify-center"><detail.icon className="w-5 h-5 text-summit-orange-600" /></div><div className="min-w-0"><div className="text-xs text-summit-charcoal/50 font-medium mb-0.5">{detail.label}</div><div className="text-sm font-semibold text-summit-charcoal break-words">{detail.value}</div></div></div>))}</div>
        <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 font-semibold">Verification in progress</p>
            <p className="text-sm text-amber-800 mt-1 leading-relaxed">We will inform you shortly once your payment screenshot is verified. Your seat will be reserved within a few hours once the payment proof is confirmed by our team.</p>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={() => downloadReceipt(registration)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-lg active:scale-[0.97]"><Download className="w-4 h-4" />Download Receipt</button>
        </div>

        <div className="mt-8 pt-6 border-t border-summit-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-summit-orange-600" />
            <h4 className="text-sm font-semibold text-summit-charcoal">Getting to the venue</h4>
          </div>
          <div className="rounded-xl overflow-hidden border border-summit-orange-100 shadow-sm">
            <iframe
              title="Map to Akal Academy Baru Sahib, Himachal Pradesh"
              src="https://www.google.com/maps?q=Akal+Academy+Baru+Sahib,+Himachal+Pradesh&output=embed"
              className="w-full h-56 sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs text-summit-charcoal/60">
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-summit-orange-600" />22–23 October 2026</span>
            <span className="hidden sm:inline text-summit-charcoal/30">·</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-summit-orange-600" />Sessions run 9:00 AM – 5:00 PM on both days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
