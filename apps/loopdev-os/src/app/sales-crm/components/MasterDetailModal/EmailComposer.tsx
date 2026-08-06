'use client';

import React, { useState } from 'react';
import { Input, Button } from '@loopdev/ui';
import { useLeadDetail } from '../../context/LeadDetailContext';

export function EmailComposer() {
  const { editedLead, emailSent, setActiveCreator } = useLeadDetail();
  const [subject, setSubject] = useState(`LoopDev Salud - Cotización de Seguro para ${editedLead.company}`);
  const [body, setBody] = useState(`Estimado/a ${editedLead.name},\n\nLe escribo de parte de LoopDev Salud para enviarle nuestra propuesta formal para ${editedLead.company}...\n\nAtentamente,\nElena Gómez`);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    emailSent(subject, body, attachments.length);
  };

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-3 font-sans text-xs">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-blue-500/5 dark:bg-blue-500/10 p-3.5 rounded-xl border border-blue-500/20 dark:border-blue-500/10 select-none w-full">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Cliente de Correo SMTP Integrado</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Redacta y simula el envío del correo electrónico formal para este lead.
          </p>
        </div>
        <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500 font-bold uppercase self-end md:self-center">
          SMTP_CLIENT: /dev/mail/send
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end select-none">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">Destinatario (Para)</label>
          <Input 
            type="text" 
            value={editedLead.email} 
            disabled 
            size="sm"
            className="w-full font-mono text-slate-500 dark:text-slate-450"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">Asunto del Correo</label>
          <Input 
            type="text" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            placeholder="Asunto del correo..."
            size="sm"
            className="w-full font-sans"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">Cuerpo del Mensaje</label>
        <textarea 
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Escribe el cuerpo del mensaje..."
          rows={5}
          className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
        />
      </div>

      {/* Attachment Upload Simulator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-t border-slate-200 dark:border-white/5 pt-3 select-none">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <input 
            type="file" 
            id="email-attach-file" 
            className="hidden" 
            multiple 
            onChange={e => {
              if (e.target.files) {
                setAttachments(Array.from(e.target.files));
              }
            }}
          />
          <label 
            htmlFor="email-attach-file" 
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer flex items-center gap-1.5 transition-all text-slate-750 dark:text-slate-350"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-3.31 2.69-6 6-6s6 2.69 6 6v10.5c0 4.41-3.59 8-8 8s-8-3.59-8-8V6h2v10.5c0 3.31 2.69 6 6 6s6-2.69 6-6V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v12.5c0 1.1.9 2 2 2s2-.9 2-2V6h2z"/>
            </svg>
            Adjuntar Archivo
          </label>
          {attachments.length > 0 && (
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {attachments.length} archivo(s) seleccionado(s)
            </span>
          )}
        </div>

        <div className="flex gap-2.5 self-end md:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            type="button" 
            onClick={() => setActiveCreator(null)}
            className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300"
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white font-bold"
            disabled={!subject.trim() || !body.trim()}
          >
            Enviar Correo
          </Button>
        </div>
      </div>
    </form>
  );
}
