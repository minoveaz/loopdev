import React, { useState } from 'react';
import { Mail, ShieldCheck, Users } from 'lucide-react';

export interface CimoAuthModalContentProps {
  onSuccess?: (email: string) => void;
}

export const CimoAuthModalContent: React.FC<CimoAuthModalContentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    onSuccess?.(email);
  };

  return (
    <div className="flex flex-col gap-4">
      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="cimo-auth-email"
              className="mb-1 block text-xs font-bold text-slate-700"
            >
              Introduce tu correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="cimo-auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@ejemplo.com"
                className="min-h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 min-h-[44px] w-full rounded-xl bg-[var(--lpd-brand-primary)] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--lpd-brand-primary-hover)] active:scale-95"
          >
            Continuar con Magic Link o Código
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
          <div>
            <label htmlFor="cimo-auth-otp" className="mb-1 block text-xs font-bold text-slate-700">
              Código de verificación (enviado a {email})
            </label>
            <input
              id="cimo-auth-otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1 2 3 4"
              className="min-h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center font-mono text-lg tracking-widest transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)]"
            />
          </div>

          <button
            type="submit"
            className="min-h-[44px] w-full rounded-xl bg-[var(--lpd-brand-primary)] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--lpd-brand-primary-hover)] active:scale-95"
          >
            Verificar y entrar
          </button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="mt-1 text-center text-xs text-slate-500 hover:text-slate-800"
          >
            Cambiar email
          </button>
        </form>
      )}

      {/* Benefits List */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Users className="h-4 w-4 flex-shrink-0 text-[var(--lpd-brand-primary)]" />
          <span>Únete a microgrupos (Crews) y crea tus propios planes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 text-[var(--lpd-brand-primary)]" />
          <span>Perfiles verificados y valoraciones post-actividad</span>
        </div>
      </div>
    </div>
  );
};
