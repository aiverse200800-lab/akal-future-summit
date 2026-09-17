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
  accompanied?: string;
  consent?: string;
}

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const BOARDS = ['CBSE', 'ICSE', 'Cambridge (CIE)', 'IB', 'Other'];

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
      } else if (!/^\d{10}$/.test(data.phone.trim())) {
        e.phone = 'Please enter a valid 10-digit phone number';
      }
      if (data.emergency_contact_phone && !/^\d{10}$/.test(data.emergency_contact_phone.trim())) {
        e.emergency_contact_phone = 'Please enter a valid 10-digit phone number';
      }
      if (!data.accompanied) e.accompanied = 'Please select yes or no';
      if (!data.consent) e.consent = 'Please confirm the information is correct';
      return e;
    };

    const handleChange = (field: keyof FormDataType, value: string | boolean) => {
      setData((prev: FormDataType) => ({ ...prev, [field]: value }));
      if (touched[field as string]) {
        const newErrors = { ...errors };
        delete newErrors[field as keyof FormErrors];
        const tempData = { ...data, [field]: value };
        if (field === 'email' && tempData.email) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempData.email)) {
            newErrors.email = 'Please enter a valid email address';
          }
        }
        if (field === 'phone' && tempData.phone) {
          if (!/^\d{10}$/.test(tempData.phone.trim())) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
          }
        }
        if (field === 'emergency_contact_phone' && tempData.emergency_contact_phone) {
          if (!/^\d{10}$/.test(tempData.emergency_contact_phone.trim())) {
            newErrors.emergency_contact_phone = 'Please enter a valid 10-digit phone number';
          }
        }
        if (field === 'accompanied' && !tempData.accompanied) {
          newErrors.accompanied = 'Please select yes or no';
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
        accompanied: true,
        consent: true,
      });

      if (Object.keys(validationErrors).length === 0) {
        onSubmit(data);
      } else {
        const firstError = Object.keys(validationErrors)[0];
        const el = document.getElementById(`field-${firstError}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const inputClass = (field: string) => `
      w-full px-4 py-3 rounded-xl border bg-white text-summit-charcoal text-sm
      transition-[border-color,box-shadow] duration-150 outline-none
      ${errors[field as keyof FormErrors] && touched[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-summit-orange-100 focus:border-summit-orange-400 focus:ring-2 focus:ring-summit-orange-100'
      }
    `;

    const labelClass = 'block text-sm font-semibold text-summit-charcoal mb-1.5';
    const errorClass = 'flex items-center gap-1.5 text-xs text-red-500 mt-1.5';

    return (
      <form ref={ref} onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-summit-orange-100 shadow-lg shadow-summit-orange-900/5 p-6 lg:p-8">
        {/* Honeypot — invisible to humans, catches bots */}
        <input
          type="text"
          name="website"
          value={data.website}
          onChange={(e) => handleChange('website', e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="grid sm:grid-cols-2 gap-5">
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
              placeholder="Enter your full name"
              aria-required="true"
              aria-invalid={!!errors.student_name}
            />
            {errors.student_name && touched.student_name && (
              <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.student_name}</div>
            )}
          </div>

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
              placeholder="Enter your school name"
              aria-required="true"
              aria-invalid={!!errors.school_name}
            />
            {errors.school_name && touched.school_name && (
              <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.school_name}</div>
            )}
          </div>

          <div id="field-grade">
            <label htmlFor="grade" className={labelClass}>
              Grade <span className="text-summit-orange-600">*</span>
            </label>
            <select id="grade" value={data.grade} onChange={(e) => handleChange('grade', e.target.value)} onBlur={() => handleBlur('grade')} className={inputClass('grade')} aria-required="true" aria-invalid={!!errors.grade}>
              <option value="">Select your grade</option>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.grade && touched.grade && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.grade}</div>}
          </div>

          <div id="field-city">
            <label htmlFor="city" className={labelClass}>
              City <span className="text-summit-orange-600">*</span>
            </label>
            <input id="city" type="text" value={data.city} onChange={(e) => handleChange('city', e.target.value)} onBlur={() => handleBlur('city')} className={inputClass('city')} placeholder="Enter your city" aria-required="true" aria-invalid={!!errors.city} />
            {errors.city && touched.city && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.city}</div>}
          </div>

          <div id="field-email">
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-summit-orange-600">*</span>
            </label>
            <input id="email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} className={inputClass('email')} placeholder="Enter your email" aria-required="true" aria-invalid={!!errors.email} />
            {errors.email && touched.email && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.email}</div>}
          </div>

          <div id="field-phone">
            <label htmlFor="phone" className={labelClass}>
              Phone Number <span className="text-summit-orange-600">*</span>
            </label>
            <input id="phone" type="tel" inputMode="numeric" maxLength={10} value={data.phone} onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} onBlur={() => handleBlur('phone')} className={inputClass('phone')} placeholder="10-digit phone number" aria-required="true" aria-invalid={!!errors.phone} />
            {errors.phone && touched.phone && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</div>}
          </div>

          <div>
            <label htmlFor="school_board" className={labelClass}>
              School Board <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <select id="school_board" value={data.school_board} onChange={(e) => handleChange('school_board', e.target.value)} className={inputClass('school_board')}>
              <option value="">Select board</option>
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div id="field-accompanied">
            <label className={labelClass}>
              Teacher / Parent Accompanying? <span className="text-summit-orange-600">*</span>
            </label>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((opt) => (
                <label key={opt} className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-summit-orange-100 bg-white cursor-pointer transition-colors duration-150 hover:border-summit-orange-300">
                  <input
                    type="checkbox"
                    checked={data.accompanied === opt}
                    onChange={(e) => handleChange('accompanied', e.target.checked ? opt : '')}
                    className="w-5 h-5 rounded border-summit-orange-200 text-summit-orange-600 focus:ring-summit-orange-400 cursor-pointer"
                  />
                  <span className="text-sm text-summit-charcoal/70 capitalize">{opt}</span>
                </label>
              ))}
            </div>
            {errors.accompanied && touched.accompanied && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.accompanied}</div>}
          </div>

          <div>
            <label htmlFor="emergency_contact_name" className={labelClass}>
              Emergency Contact Name <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <input id="emergency_contact_name" type="text" value={data.emergency_contact_name} onChange={(e) => handleChange('emergency_contact_name', e.target.value)} className={inputClass('emergency_contact_name')} placeholder="Enter emergency contact name" />
          </div>

          <div id="field-emergency_contact_phone">
            <label htmlFor="emergency_contact_phone" className={labelClass}>
              Emergency Contact Phone <span className="text-summit-charcoal/30 font-normal">(optional)</span>
            </label>
            <input id="emergency_contact_phone" type="tel" inputMode="numeric" maxLength={10} value={data.emergency_contact_phone} onChange={(e) => handleChange('emergency_contact_phone', e.target.value.replace(/\D/g, '').slice(0, 10))} onBlur={() => handleBlur('emergency_contact_phone')} className={inputClass('emergency_contact_phone')} placeholder="10-digit phone number" aria-invalid={!!errors.emergency_contact_phone} />
            {errors.emergency_contact_phone && touched.emergency_contact_phone && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.emergency_contact_phone}</div>}
          </div>
        </div>

        <div id="field-consent" className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={data.consent} onChange={(e) => handleChange('consent', e.target.checked)} onBlur={() => handleBlur('consent')} className="mt-0.5 w-5 h-5 rounded border-summit-orange-200 text-summit-orange-600 focus:ring-summit-orange-400 cursor-pointer" aria-required="true" aria-invalid={!!errors.consent} />
            <span className="text-sm text-summit-charcoal/70 leading-relaxed">I confirm that the information provided is correct.</span>
          </label>
          {errors.consent && touched.consent && <div className={errorClass}><AlertCircle className="w-3.5 h-3.5" />{errors.consent}</div>}
        </div>

        <button type="submit" className="group w-full mt-7 inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 text-white font-semibold text-base px-6 py-4 rounded-xl transition-[background-color,box-shadow,transform] duration-150 hover:shadow-xl hover:shadow-summit-orange-500/25 active:scale-[0.97]">
          Continue to Payment
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    );
  }
);

RegistrationForm.displayName = 'RegistrationForm';
export default RegistrationForm;
