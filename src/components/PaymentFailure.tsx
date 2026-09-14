import { XCircle, RefreshCw, Pencil } from 'lucide-react';
import type { RegistrationRecord } from '@/types/registration';

interface PaymentFailureProps {
  registration: RegistrationRecord | null;
  error?: string;
  onTryAgain: () => void;
  onEdit: () => void;
}

export default function PaymentFailure({ registration, error, onTryAgain, onEdit }: PaymentFailureProps) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 shadow-xl shadow-red-900/5 overflow-hidden animate-scale-in">
      {/* Error header */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-8 text-center">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-9 h-9 text-white" />
        </div>
        <h3 className="font-display font-bold text-2xl text-white mb-1">Payment was not completed.</h3>
        <p className="text-sm text-white/70">
          {error
            ? error
            : 'Your registration is saved, but payment hasn\'t been confirmed yet. You can try again — no need to re-enter your details.'}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 lg:p-8">
        {registration && (
          <div className="bg-summit-cream rounded-xl px-4 py-3 mb-5">
            <div className="text-xs text-summit-charcoal/50 font-medium mb-1">Registration Reference</div>
            <div className="text-sm font-semibold text-summit-charcoal">
              {registration.registration_ref || `AYFFS-${registration.id.slice(0, 8).toUpperCase()}`}
            </div>
            <div className="text-xs text-summit-charcoal/50 mt-1">
              Registered as: {registration.student_name} — {registration.school_name}
            </div>
          </div>
        )}

        <p className="text-sm text-summit-charcoal/60 mb-6">
          Don't worry — your form details are saved. Try the payment again, or go back to edit your registration information.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onTryAgain}
            className="inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-summit-orange-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal text-sm font-semibold px-5 py-3 rounded-xl border border-summit-orange-200 transition-all hover:shadow-md"
          >
            <Pencil className="w-4 h-4" />
            Edit Registration
          </button>
        </div>
      </div>
    </div>
  );
}
