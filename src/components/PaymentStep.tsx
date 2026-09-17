import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Upload, CheckCircle, X } from 'lucide-react';

const QR_SRC = `${import.meta.env.BASE_URL}payment-qr.jpg`;

interface PaymentStepProps {
  initialFile: File | null;
  onBack: () => void;
  onNext: (file: File) => void;
}

const MAX_SIZE = 5 * 1024 * 1024;
const COMPRESS_ABOVE = 500 * 1024; // skip compression for already-small files
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

// Downscale + re-encode to JPEG so multi-MB phone screenshots upload quickly.
async function compressImage(f: File): Promise<File> {
  if (f.size <= COMPRESS_ABOVE) return f;
  try {
    const bitmap = await createImageBitmap(f);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return f;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob || blob.size >= f.size) return f;
    const name = f.name.replace(/\.(png|jpe?g)$/i, '') || 'payment-proof';
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
  } catch {
    return f;
  }
}

export default function PaymentStep({ initialFile, onBack, onNext }: PaymentStepProps) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | null) => {
    setError('');
    if (!f) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (!['image/png', 'image/jpeg'].includes(f.type)) {
      setError('Only PNG or JPG images are accepted.');
      return;
    }
    if (f.size > MAX_SIZE) {
      setError('Image must be under 5 MB.');
      return;
    }
    setCompressing(true);
    try {
      setFile(await compressImage(f));
    } finally {
      setCompressing(false);
    }
  };

  const handleNext = () => {
    if (compressing) return;
    if (!file) {
      setError('Please upload your fee screenshot to continue.');
      return;
    }
    onNext(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 p-6 lg:p-8 animate-scale-in">
      <div className="text-center mb-6">
        <h3 className="font-display font-bold text-xl text-summit-charcoal mb-1">Pay the Registration Fee</h3>
        <ol className="mt-4 text-left text-sm text-summit-charcoal/65 space-y-1.5 max-w-xs mx-auto">
          <li className="flex gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-summit-orange-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>Scan &amp; pay via any UPI app.</li>
          <li className="flex gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-summit-orange-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>Upload the fee screenshot below.</li>
        </ol>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-3 rounded-2xl border-2 border-summit-orange-100 shadow-sm">
          <img src={QR_SRC} alt="UPI payment QR code for the Akal Future Founders Summit registration fee" className="w-64 h-64 sm:w-72 sm:h-72 object-contain outline outline-1 outline-black/10 rounded-lg" width="288" height="288" />
        </div>
      </div>

      <div>
        <label htmlFor="payment_proof" className="block text-sm font-semibold text-summit-charcoal mb-1.5">
          Fee Screenshot <span className="text-summit-orange-600">*</span>{' '}
          <span className="text-summit-charcoal/60 font-normal">(PNG or JPG — max 5 MB)</span>
        </label>
        {file ? (
          <div className="flex items-center justify-between gap-2 w-full px-4 py-3.5 rounded-xl border-2 border-green-300 bg-green-50 text-green-700 text-sm font-medium">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="truncate max-w-[240px]">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => handleFile(null)}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-green-700/60 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
              aria-label="Remove uploaded screenshot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="payment_proof"
            className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl border-2 border-dashed border-summit-orange-200 bg-summit-cream/50 text-summit-charcoal/60 text-sm font-medium cursor-pointer transition-colors duration-150 hover:border-summit-orange-400 hover:text-summit-charcoal"
          >
            <Upload className="w-5 h-5" />
            {compressing ? 'Optimizing image…' : 'Upload fee screenshot'}
          </label>
        )}
        <input
          ref={inputRef}
          id="payment_proof"
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <img src={URL.createObjectURL(file)} alt="Preview of uploaded payment screenshot" className="mt-3 mx-auto max-h-40 rounded-xl outline outline-1 outline-black/10 animate-scale-in" />
        )}
        {error && <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</div>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        <button type="button" onClick={onBack} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal text-sm font-semibold px-6 py-4 rounded-xl border border-summit-orange-200 transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button type="button" onClick={handleNext} className="group flex-1 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-base px-6 py-4 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-xl hover:shadow-summit-orange-500/25 active:scale-[0.97]">
          Review Details
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
