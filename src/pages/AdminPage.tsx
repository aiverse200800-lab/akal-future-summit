import { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, RefreshCw, Loader2, FileImage, ShieldAlert, Download, ExternalLink, Copy, Check } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';
import { Link } from 'react-router-dom';

interface RegistrationRow {
  registration_ref: string;
  student_name: string;
  school_name: string;
  grade: string;
  city: string;
  email: string;
  phone: string;
  school_board: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  accompanied: number;
  consent: number;
  proof_status: string;
  payment_proof_path: string | null;
  created_at: string;
}

const CODE_KEY = 'affs-admin-code';
const AUTO_REFRESH_MS = 5 * 60 * 1000;
const PAGE_SIZE = 50;

function CopyCell({ text, className = '', title }: { text: string; className?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button
      onClick={copy}
      title={title ?? `Click to copy: ${text}`}
      className={`inline-flex items-center gap-1.5 hover:text-summit-orange-700 transition-colors text-left ${className}`}
    >
      <span className="truncate max-w-[180px]">{text}</span>
      {copied ? <Check className="w-3 h-3 text-green-600 shrink-0" /> : <Copy className="w-3 h-3 opacity-0 group-hover/row:opacity-40 shrink-0" />}
    </button>
  );
}

function ProofThumb({ path, code, onOpen }: { path: string; code: string; onOpen: (src: string) => void }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`/api/admin/proof?path=${encodeURIComponent(path)}`, { headers: { 'x-admin-code': code } })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => { if (alive && b) setSrc(URL.createObjectURL(b)); })
      .catch(() => {});
    return () => { alive = false; };
  }, [path, code]);
  return (
    <button
      onClick={() => src && onOpen(src)}
      className="w-12 h-12 rounded-lg border border-summit-orange-100 overflow-hidden bg-summit-cream hover:border-summit-orange-400 transition-colors flex items-center justify-center"
      title="View screenshot"
    >
      {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <FileImage className="w-5 h-5 text-summit-charcoal/40" />}
    </button>
  );
}

export default function AdminPage() {
  const [code, setCode] = useState(() => sessionStorage.getItem(CODE_KEY) ?? '');
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(CODE_KEY));
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const timer = useRef<number | null>(null);

  const load = useCallback(async (c: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'x-admin-code': c },
      });
      if (res.status === 401) {
        setAuthed(false);
        sessionStorage.removeItem(CODE_KEY);
        setCodeError('Invalid access code.');
        return;
      }
      if (res.status === 429) {
        setAuthed(false);
        sessionStorage.removeItem(CODE_KEY);
        setCodeError('Too many attempts. Please try again in a few minutes.');
        return;
      }
      const data = await res.json();
      setRows(data.registrations ?? []);
      setLastFetched(new Date());
      setAuthed(true);
    } catch {
      setCodeError('Could not load registrations. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && code) load(code);
  }, [authed, code, load]);

  useEffect(() => {
    if (!authed || !code) return;
    timer.current = window.setInterval(() => load(code), AUTO_REFRESH_MS);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [authed, code, load]);

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    const c = codeInput.trim();
    if (!c) return;
    setLoading(true);
    const res = await fetch('/api/admin/registrations', { headers: { 'x-admin-code': c } });
    if (res.status === 401) { setCodeError('Invalid access code.'); setLoading(false); return; }
    if (res.status === 429) { setCodeError('Too many attempts. Please try again in a few minutes.'); setLoading(false); return; }
    const data = await res.json();
    sessionStorage.setItem(CODE_KEY, c);
    setCode(c);
    setRows(data.registrations ?? []);
    setLastFetched(new Date());
    setAuthed(true);
    setLoading(false);
  };

  const exportCsv = () => {
    const headers = ['Reference ID', 'Student Name', 'School', 'Grade', 'City', 'Email', 'Phone', 'School Board', 'Emergency Contact', 'Emergency Phone', 'Parent/Teacher Accompanying', 'Consent', 'Proof Status', 'Submitted At'];
    const esc = (v: string | number | null) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      headers.join(','),
      ...rows.map((r) => [
        r.registration_ref, r.student_name, r.school_name, r.grade, r.city, r.email, r.phone,
        r.school_board ?? '', r.emergency_contact_name ?? '', r.emergency_contact_phone ?? '',
        r.accompanied ? 'Yes' : 'No', r.consent ? 'Yes' : 'No', r.proof_status,
        new Date(r.created_at).toLocaleString(),
      ].map(esc).join(',')),
    ];
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `affs-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!authed) {
    return (
      <div className="pt-16 min-h-screen bg-summit-cream flex items-center justify-center px-5">
        <form onSubmit={submitCode} className="w-full max-w-sm bg-white rounded-2xl border border-summit-orange-100 shadow-xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-summit-orange-50 border border-summit-orange-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-summit-orange-600" />
          </div>
          <h1 className="font-display font-bold text-2xl text-summit-charcoal mb-1">Admin Access</h1>
          <p className="text-sm text-summit-charcoal/55 mb-6">Enter your access code to view registrations.</p>
          <input
            type="password"
            inputMode="text"
            autoComplete="off"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Access code"
            className="w-full px-4 py-3 rounded-xl border border-summit-orange-100 bg-white text-sm text-summit-charcoal placeholder:text-summit-charcoal/35 focus:outline-none focus:ring-2 focus:ring-summit-orange-400 focus:border-summit-orange-400 mb-4 text-center tracking-widest"
          />
          {codeError && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 mb-4 justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />{codeError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !codeInput.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-150 active:scale-[0.97]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-summit-cream">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-summit-charcoal">Registrations</h1>
            <p className="text-sm text-summit-charcoal/55 mt-1">
              {rows.length} registration{rows.length !== 1 ? 's' : ''}
              {lastFetched && ` · Updated ${fmt(lastFetched)}`}
              {' · Auto-refresh: 5 min'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal/70 text-sm font-semibold px-5 py-2.5 rounded-xl border border-summit-orange-200 transition-colors duration-150"
            >
              <ExternalLink className="w-4 h-4" /> Go to Website
            </Link>
            <button
              onClick={exportCsv}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-2 bg-white hover:bg-summit-cream text-summit-charcoal/70 disabled:opacity-50 text-sm font-semibold px-5 py-2.5 rounded-xl border border-summit-orange-200 transition-colors duration-150"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={() => load(code)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-summit-orange-600 hover:bg-summit-orange-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 active:scale-[0.97]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-summit-orange-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
              <thead>
                <tr className="bg-summit-cream border-b border-summit-orange-100 text-left">
                  {['Reference ID', 'Student', 'School', 'Grade', 'City', 'Email', 'Phone', 'Parent/Teacher', 'Proof', 'Submitted'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-summit-charcoal/55 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-summit-orange-50">
                {pageRows.map((r) => (
                  <tr key={r.registration_ref} className="group/row hover:bg-summit-cream/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap"><CopyCell text={r.registration_ref} className="font-mono font-semibold text-summit-orange-700" /></td>
                    <td className="px-4 py-3 font-semibold text-summit-charcoal whitespace-nowrap">{r.student_name}</td>
                    <td className="px-4 py-3 text-summit-charcoal/75 max-w-[180px] truncate" title={r.school_name}>{r.school_name}</td>
                    <td className="px-4 py-3 text-summit-charcoal/75 whitespace-nowrap">{r.grade}</td>
                    <td className="px-4 py-3 text-summit-charcoal/75 whitespace-nowrap">{r.city}</td>
                    <td className="px-4 py-3"><CopyCell text={r.email} className="text-summit-charcoal/75" /></td>
                    <td className="px-4 py-3"><CopyCell text={r.phone} className="text-summit-charcoal/75 whitespace-nowrap" /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${r.accompanied ? 'bg-blue-50 text-blue-700' : 'bg-summit-charcoal/5 text-summit-charcoal/50'}`}>
                        {r.accompanied ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.payment_proof_path ? (
                        <ProofThumb path={r.payment_proof_path} code={code} onOpen={setLightboxSrc} />
                      ) : (
                        <span className="text-summit-charcoal/35 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-summit-charcoal/75">
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-summit-charcoal/45 mt-0.5">
                        {new Date(r.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && !loading && (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-summit-charcoal/45">No registrations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-summit-orange-100 bg-summit-cream/50">
              <span className="text-xs text-summit-charcoal/55">
                Page {page + 1} of {totalPages} · {rows.length} total
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-summit-orange-200 bg-white text-summit-charcoal/70 disabled:opacity-40 hover:bg-summit-cream transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-summit-orange-200 bg-white text-summit-charcoal/70 disabled:opacity-40 hover:bg-summit-cream transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt="Payment proof screenshot"
          label="Payment proof preview"
          open={!!lightboxSrc}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}
