import { forwardRef, useState, type FormEvent } from 'react';
import type { FormDataType } from './Registration';

import { ArrowRight, AlertCircle } from 'lucide-react';

interface RegistrationFormProps {
  initialData: FormDataType;
  onSubmit: (data: FormDataType) => void;
}

interface FormErrors {
  student_name?: string;
  school_name?: string;
  grade?: string;
  city?: string;
  email?: string;
  phone?: string;
  emergency_contact_phone?: string;
  consent?: string;
}

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const BOARDS = ['CBSE', 'ICSE', 'Cambridge (CIE)', 'IB', 'Other'];
const DIETARY = ['None', 'Vegetarian', 'Other'];

const RegistrationForm = forwardRef<HTMLFormElement, RegistrationFormProps>(
  ({ initialData, onSubmit }, ref) => {
    const [data, setData] = useState<FormDataType>(initialData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({} as Record<string, boolean>);

    const validate = (): FormErrors => {
      const e: FormErrors = {};
      if (!data.student_name.trim()) e.student_name = 'Student name is required';
      if (!data.school_name.trim()) e.school_name = 'School name is required';
      if (!data.grade) e.grade = 'Please select your grade';
      if (!data.city.trim()) e.city = 'City is required';
      if (!data.email.trim()) {
        e.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        e.email = 'Please enter a valid email address';
      }
      if (!data.phone.trim()) {
        e.phone = 'Phone number is required';
      } else if (!/^[+]?[\d\s\-()]{10,15}$/.test(data.phone)) {
        e.phone = 'Please enter a valid phone number';
      }
      if (data.emergency_contact_phone && !/^[+]?[\d\s\-()]{10,15}$/.test(data.emergency_contact_phone)) {
        e.emergency_contact_phone = 'Please enter a valid phone number';
      }
      if (!data.consent) e.consent = 'Please confirm the information is correct';
      return e;
    };

    const handleChange = (field: keyof FormDataType, value: string | boolean) => {
      setData((prev: FormDataType) => ({ ...prev, [field]: value }));
      if (touched[field as string]) {
        const newErrors = { ...errors };
        delete (newErrors as any)[field];
        // Re-validate this field
        const tempData = { ...data, [field]: value };
        if (field === 'email' && tempData.email) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
            newErrors.email = 'Please enter a valid email address';
          }
        }
        if (field === 'phone' && tempData.phone) {
          if (!/^[+]?[\d\s\-()]{10,15}$/.test(tempData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
          }
        }
        if (field === 'emergency_contact_phone' && tempData.emergency_contact_phone) {
          if (!/^[+]?[\d\s\-()]{10,15}$/.test(tempData.emergency_contact_phone)) {
            newErrors.emergency_contact_phone = 'Please enter a valid phone number';
          }
        }
        setErrors(newErrors);
      }
    };

    const handleBlur = (field: keyof FormDataType) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const e = validate();
      setErrors(e);
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      setErrors(validationErrors);
      setTouched({
        student_name: true,
        school_name: true,
        grade: true,
        city: true,
        email: true,
        phone: true,
        consent: true,
      });

      if (Object.keys(validationErrors).length === 0) {
        onSubmit(data);
      } else {
        // Scroll to first error
        const firstError = Object.keys(validationErrors)[0];
        const el = document.getElementById(`field-${firstError}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const inputClass = (field: string) => `
      w-full px-4 py-3 rounded-xl border bg-white text-summit-charcoal text-sm
      transition-all outline-none
      ${errors[field as keyof FormErrors] && touched[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-summit-orange-100 focus:border-summit-orange-400 focus:ring-2 focus:ring-summit-orange-100'
      }
    `;

    const labelClass = 'block text-sm font-semibold text-summit-charcoal mb-1.5';
    const errorClass = 'flex items-center gap-1.5 text-xs text-red-500 mt-1.5';

    return (
      <form ref={ref} onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 p-6 lg:p-8">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Student Full Name */}
          <div id="field-student_name">
            <label htmlFor="student_name" className={labelClass}>
              Student Full Name <span className="text-summit-orange-600">*</span>
            </label>
            <input
              id="student_name"
              type="text"
              value={data.student_name}
              onChange={(e) => handleChange('student_name', e.target.value)}
              onBlur={() => handleBlur('student_name')}
              className={inputClass('student_name')}
              placeholder="e.g. Amandeep Singh"
              aria-required="true"
              aria-invalid={!!errors.student_name}
            />
            {errors.student_name && touched.student_name && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.student_name}
              </div>
            )}
          </div>

          {/* School Name */}
          <div id="field-school_name">
            <label htmlFor="school_name" className={labelClass}>
              School Name <span className="text-summit-orange-600">*</span>
            </label>
            <input
              id="school_name"
              type="text"
              value={data.school_name}
              onChange={(e) => handleChange('school_name', e.target.value)}
              onBlur={() => handleBlur('school_name')}
              className={inputClass('school_name')}
              placeholder="e.g. Akal Academy Baru Sahib"
              aria-required="true"
              aria-invalid={!!errors.school_name}
            />
            {errors.school_name && touched.school_name && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.school_name}
              </div>
            )}
          </div>

          {/* Grade */}
          <div id="field-grade">
            <label htmlFor="grade" className={labelClass}>
              Grade <span className="text-summit-orange-600">*</span>
            </label>
            <select
              id="grade"
              value={data.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              onBlur={() => handleBlur('grade')}
              className={inputClass('grade')}
              aria-required="true"
              aria-invalid={!!errors.grade}
            >
              <option value="">Select your grade</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.grade && touched.grade && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.grade}
              </div>
            )}
          </div>

          {/* City */}
          <div id="field-city">
            <label htmlFor="city" className={labelClass}>
              City <span className="text-summit-orange-600">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={inputClass('city')}
              placeholder="e.g. Chandigarh"
              aria-required="true"
              aria-invalid={!!errors.city}
            />
            {errors.city && touched.city && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.city}
              </div>
            )}
          </div>

          {/* Email */}
          <div id="field-email">
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-summit-orange-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={inputClass('email')}
              placeholder="student@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && touched.email && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div id="field-phone">
            <label htmlFor="phone" className={labelClass}>
              Phone Number <span className="text-summit-orange-600">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={inputClass('phone')}
              placeholder="+91 98765 43210"
              aria-required="true"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && touched.phone && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* School Board */}
          <div>
            <label htmlFor="school_board" className={labelClass}>
              School Board <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <select
              id="school_board"
              value={data.school_board}
              onChange={(e) => handleChange('school_board', e.target.value)}
              className={inputClass('school_board')}
            >
              <option value="">Select board</option>
              {BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Teacher / Parent Accompanying */}
          <div>
            <label className={labelClass}>
              Teacher / Parent Accompanying? <span className="text-summit-orange-600">*</span>
            </label>
            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => handleChange('accompanied', true)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  data.accompanied
                    ? 'bg-summit-orange-600 text-white border-summit-orange-600'
                    : 'bg-white text-summit-charcoal/70 border-summit-orange-100 hover:border-summit-orange-300'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleChange('accompanied', false)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  !data.accompanied
                    ? 'bg-summit-orange-600 text-white border-summit-orange-600'
                    : 'bg-white text-summit-charcoal/70 border-summit-orange-100 hover:border-summit-orange-300'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label htmlFor="emergency_contact_name" className={labelClass}>
              Emergency Contact Name <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <input
              id="emergency_contact_name"
              type="text"
              value={data.emergency_contact_name}
              onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
              className={inputClass('emergency_contact_name')}
              placeholder="Parent / guardian name"
            />
          </div>

          {/* Emergency Contact Phone */}
          <div id="field-emergency_contact_phone">
            <label htmlFor="emergency_contact_phone" className={labelClass}>
              Emergency Contact Phone <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <input
              id="emergency_contact_phone"
              type="tel"
              value={data.emergency_contact_phone}
              onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
              onBlur={() => handleBlur('emergency_contact_phone')}
              className={inputClass('emergency_contact_phone')}
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.emergency_contact_phone}
            />
            {errors.emergency_contact_phone && touched.emergency_contact_phone && (
              <div className={errorClass}>
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.emergency_contact_phone}
              </div>
            )}
          </div>

          {/* Dietary Requirements */}
          <div className="sm:col-span-2">
            <label htmlFor="dietary_requirements" className={labelClass}>
              Dietary Requirements <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <select
              id="dietary_requirements"
              value={data.dietary_requirements}
              onChange={(e) => handleChange('dietary_requirements', e.target.value)}
              className={inputClass('dietary_requirements')}
            >
              <option value="">Select preference</option>
              {DIETARY.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Consent checkbox */}
        <div id="field-consent" className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => handleChange('consent', e.target.checked)}
              onBlur={() => handleBlur('consent')}
              className="mt-0.5 w-5 h-5 rounded border-summit-orange-200 text-summit-orange-600 focus:ring-summit-orange-400 cursor-pointer"
              aria-required="true"
              aria-invalid={!!errors.consent}
            />
            <span className="text-sm text-summit-charcoal/70 leading-relaxed">
              I confirm that the information provided is correct.
            </span>
          </label>
          {errors.consent && touched.consent && (
            <div className={errorClass}>
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.consent}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group w-full mt-7 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-base px-6 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-summit-orange-500/25 hover:scale-[1.01] active:scale-[0.99]"
        >
          Continue to Payment — ₹5,000
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-summit-charcoal/40 mt-3">
          You'll be redirected to Razorpay Checkout to complete your payment securely.
        </p>
      </form>
    );
  }
);

RegistrationForm.displayName = 'RegistrationForm';
export default RegistrationForm;
