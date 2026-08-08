'use client';

import React, { useState } from 'react';
import { Input, Button, Heading, Icon } from '@loopdev/ui';
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-primary/5 p-3.5 rounded-xl border border-primary/20 select-none w-full">
        <div className="flex flex-col gap-0.5">
          <Heading as="h4" size="xs" weight="bold" className="text-primary uppercase tracking-wider">Cliente de Correo SMTP Integrado</Heading>
          <p className="text-[10px] text-text-muted">
            Redacta y simula el envío del correo electrónico formal para este lead.
          </p>
        </div>
        <span className="text-[9px] font-mono text-text-muted font-bold uppercase self-end md:self-center">
          SMTP_CLIENT: /dev/mail/send
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end select-none">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] text-text-muted font-bold font-mono uppercase">Destinatario (Para)</label>
          <Input 
            type="text" 
            value={editedLead.email} 
            disabled 
            size="sm"
            className="w-full font-mono text-text-muted"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] text-text-muted font-bold font-mono uppercase">Asunto del Correo</label>
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
        <label className="text-[10px] text-text-muted font-bold font-mono uppercase">Cuerpo del Mensaje</label>
        <textarea 
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Escribe el cuerpo del mensaje..."
          rows={5}
          className="bg-background-canvas p-2.5 rounded-xl border border-border-technical text-text-main focus:outline-none resize-none font-sans"
        />
      </div>

      {/* Attachment Upload Simulator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-t border-border-technical pt-3 select-none">
        <div className="flex items-center gap-2 text-text-muted">
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
            className="px-2.5 py-1.5 rounded-xl border border-border-technical text-[10px] font-semibold hover:bg-background-subtle cursor-pointer flex items-center gap-1.5 transition-all text-text-main"
          >
              <Icon name="attach_file" size="sm" />
            Adjuntar Archivo
          </label>
          {attachments.length > 0 && (
            <span className="text-[10px] font-mono text-text-muted">
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
            className="border-border-technical hover:bg-background-subtle text-text-main"
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
