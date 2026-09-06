import React, { useState } from 'react';
import { Mail, ShieldCheck, Sparkles, Users } from 'lucide-react';

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
              className="text-xs font-bold text-slate-700 block mb-1"
            >
              Introduce tu correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="cimo-auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)] focus:bg-white transition-all min-h-[42px]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-xl transition-all shadow-sm min-h-[44px] mt-1 active:scale-95"
          >
            Continuar con Magic Link o Código
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
          <div>
            <label htmlFor="cimo-auth-otp" className="text-xs font-bold text-slate-700 block mb-1">
              Código de verificación (enviado a {email})
            </label>
            <input
              id="cimo-auth-otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1 2 3 4"
              className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)] focus:bg-white transition-all min-h-[42px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-xl transition-all shadow-sm min-h-[44px] active:scale-95"
          >
            Verificar y entrar
          </button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-xs text-slate-500 hover:text-slate-800 text-center mt-1"
          >
            Cambiar email
          </button>
        </form>
      )}

      {/* Benefits List */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Users className="w-4 h-4 text-[var(--lpd-brand-primary)] flex-shrink-0" />
          <span>Únete a microgrupos (Crews) y crea tus propios planes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[var(--lpd-brand-primary)] flex-shrink-0" />
          <span>Perfiles verificados y valoraciones post-actividad</span>
        </div>
      </div>
    </div>
  );
};
