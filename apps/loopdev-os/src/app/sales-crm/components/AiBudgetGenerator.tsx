'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSalesCrm } from '../context';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Icon, 
  Button, 
  StatusPulse,
  toast
} from '@loopdev/ui';

export function AiBudgetGenerator() {
  const { 
    generatingLeadId, 
    setGeneratingLeadId,
    isGeneratingBudget, 
    setIsGeneratingBudget,
    isPreviewingPdf, 
    setIsPreviewingPdf,
    completeBudgetGeneration,
    leads 
  } = useSalesCrm();

  const lead = leads.find(l => l.id === generatingLeadId);

  if (!lead) return null;

  return (
    <>
      {isGeneratingBudget && !isPreviewingPdf && (
        <AiTerminalOverlay 
          lead={lead} 
          onFinished={() => {
            setIsGeneratingBudget(false);
            setIsPreviewingPdf(true);
          }}
          onCancel={() => {
            setIsGeneratingBudget(false);
            setGeneratingLeadId(null);
          }}
        />
      )}

      {isPreviewingPdf && (
        <PdfPreviewer 
          lead={lead} 
          onConfirm={() => {
            completeBudgetGeneration(lead.id);
            toast.show({ 
              tenantId: 'loopdev', 
              variant: 'success', 
              title: `Presupuesto enviado a ${lead.name}`,
              metadata: 'SYNC_OK' 
            });
            setIsPreviewingPdf(false);
            setGeneratingLeadId(null);
          }}
          onCancel={() => {
            setIsPreviewingPdf(false);
            setGeneratingLeadId(null);
          }}
        />
      )}
    </>
  );
}

// 1. AI TERMINAL OVERLAY
interface TerminalOverlayProps {
  lead: any;
  onFinished: () => void;
  onCancel: () => void;
}

function AiTerminalOverlay({ lead, onFinished, onCancel }: TerminalOverlayProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const simulationSteps = [
    `[SYS] INITIALIZING COGNITIVE SERVICES MODULE (COGNITIVE_CORE v0.92)...`,
    `[SYS] ESTABLISHING SECURE CONNECTION TO CLIENT TELEMETRY PIPELINE... OK`,
    `[DB] RETRIEVING CONTACT RECORD FOR LEAD: ID=${lead.id} NAME=${lead.name.toUpperCase()}`,
    `[AI_ENG] ANALYZING INTERACTION EMAIL SENTIMENT... POSITIVE (CONFIDENCE 94%)`,
    `[AI_ENG] RUNNING PREDICTIVE CONVERSION ESTIMATE... TARGET WIN SCORE: ${lead.aiScore}%`,
    `[EXTRACT] IDENTIFYING INTERESTED PLAN: "${lead.interestedPlan || 'Más Salud'}"`,
    `[CALC] COMPUTING TARGET PRICE STRUCTURE AND CO-PAY MATRIX...`,
    `[CALC] CORPORATE COVERAGE VALUE DETERMINED: $${lead.dealValue.toLocaleString()} COP`,
    `[PDF] COMPOSING CONTRACTUAL QUOTE DRAFT STREAM... OK`,
    `[SIGN] SECURING PROPOSAL WITH CRYPTOGRAPHIC TIMESTAMP INTEGRITY...`,
    `[SYS] PIPELINE COMPILED SUCCESSFULLY. LOADING PREVIEW AGENT...`
  ];

  useEffect(() => {
    if (currentIndex < simulationSteps.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, simulationSteps[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 350 + Math.random() * 200); // realistic typing delay
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onFinished();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <TechnicalSurface 
        variant="surface" 
        depth="overlay"
        className="w-full max-w-2xl bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-slate-200"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-400 font-bold ml-2">LOOPDEV OS // AI_BUDGET_GENERATOR</span>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-200 transition-colors">
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="p-6 flex-1 flex flex-col gap-4 min-h-[300px]">
          {/* Header Data */}
          <div className="flex justify-between items-start border-b border-white/5 pb-3">
            <div className="flex flex-col gap-0.5 text-xs text-slate-400">
              <div>HOST: LOOPDEV_OS_AI_NODE_1</div>
              <div>DATE: {new Date().toISOString()}</div>
              <div>PROCESS: GENERATE_PDF_PROPOSAL</div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-2 py-1 rounded">
              <StatusPulse variant="primary" size="xs" isAnimated />
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider">RUNNING</span>
            </div>
          </div>

          {/* Logs */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto max-h-56 flex flex-col gap-1.5 text-xs leading-relaxed text-slate-300 font-mono select-text custom-scrollbar"
          >
            {logs.map((log, index) => {
              let colorClass = 'text-slate-300';
              if (log.includes('[SYS]')) colorClass = 'text-primary';
              else if (log.includes('[DB]')) colorClass = 'text-purple-400';
              else if (log.includes('[AI_ENG]')) colorClass = 'text-yellow-400';
              else if (log.includes('SUCCESS') || log.includes('OK')) colorClass = 'text-emerald-400';
              
              return (
                <div key={index} className={colorClass}>
                  {log}
                </div>
              );
            })}
            
            {currentIndex < simulationSteps.length && (
              <div className="flex items-center gap-1 text-slate-400 animate-pulse text-xs">
                <span>[LOG] Processing next segment...</span>
                <span className="w-1.5 h-3.5 bg-slate-400 inline-block" />
              </div>
            )}
          </div>
        </div>
      </TechnicalSurface>
    </div>
  );
}

// 2. PDF PREVIEWER
interface PdfPreviewerProps {
  lead: any;
  onConfirm: () => void;
  onCancel: () => void;
}

function PdfPreviewer({ lead, onConfirm, onCancel }: PdfPreviewerProps) {
  const isSanitas = lead.company.toLowerCase().includes('sanitas') || lead.company.toLowerCase().includes('logística');
  const providerName = isSanitas ? 'Sanitas' : 'Adeslas';
  const accentColor = isSanitas ? '#00548F' : '#0095DA';
  const logoText = isSanitas ? 'SANITAS SALUD' : 'ADESLAS PLENA';

  // Calculations
  const basePrice = lead.dealValue;
  const aiDiscount = Math.round(basePrice * 0.1);
  const finalPrice = basePrice - aiDiscount;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-3xl bg-[#0b0f19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 border-b border-white/5">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Vista Previa del Presupuesto IA</h3>
            <span className="text-[10px] text-slate-400 font-mono">DOCUMENT_DRAFT_GEN: QT-2026-{lead.id}</span>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 transition-colors">
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* PDF Scroll Area */}
        <div className="p-8 bg-[#111622] flex justify-center border-b border-white/5 overflow-y-auto max-h-[500px] custom-scrollbar">
          {/* Simulated PDF Page */}
          <div className="w-full max-w-2xl bg-white text-slate-900 p-8 shadow-2xl rounded-lg font-sans flex flex-col gap-6 text-left relative min-h-[700px]">
            {/* Diagonal Gridlines Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-grid-pattern" />

            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: accentColor }} />
                  <span className="text-sm font-black tracking-widest text-slate-900 uppercase font-mono">{logoText}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Proveedor Autorizado LoopDev OS</span>
              </div>
              <div className="flex flex-col items-end gap-1 font-mono text-[10px] text-slate-500">
                <div className="text-slate-900 font-bold text-xs">PRESUPUESTO DE SALUD</div>
                <div>Nº PROPUESTA: QT-2026-{lead.id}</div>
                <div>FECHA EMISIÓN: {new Date().toLocaleDateString('es-CO')}</div>
                <div>VALIDEZ: 30 DÍAS</div>
              </div>
            </div>

            {/* Client and Partner Info */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">INFORMACIÓN DEL CLIENTE</span>
                <div className="flex flex-col gap-1 font-semibold text-slate-800">
                  <div className="text-slate-900 text-sm font-bold">{lead.name}</div>
                  <div>Empresa: {lead.company}</div>
                  <div>Email: {lead.email}</div>
                  <div>Teléfono: {lead.phone}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-l border-slate-200 pl-6">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">EMITIDO POR</span>
                <div className="flex flex-col gap-1 font-semibold text-slate-800">
                  <div className="text-slate-900 text-sm font-bold">LoopDev Commercial OS</div>
                  <div>Agente: Elena Gómez</div>
                  <div>Licencia AI: #AGY-3.5-PROD</div>
                  <div>Soporte: ventas@loopdev.co</div>
                </div>
              </div>
            </div>

            {/* Details Description */}
            <div className="text-xs text-slate-600 leading-relaxed">
              De acuerdo con sus requerimientos y tras evaluar el perfil de salud corporativo mediante telemetría predictiva, nos complace presentar la propuesta económica para la suscripción médica anual.
            </div>

            {/* Coverage Pricing Table */}
            <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden mt-2">
              <div className="grid grid-cols-12 bg-slate-900 text-white font-mono text-[9px] uppercase font-bold tracking-wider p-3">
                <div className="col-span-8">DESCRIPCIÓN DE COBERTURA</div>
                <div className="col-span-4 text-right">TOTAL (COP)</div>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-8 flex flex-col gap-1">
                    <span className="font-bold text-slate-800">{lead.interestedPlan || 'Plan Completo Plus'}</span>
                    <span className="text-[10px] text-slate-400 leading-relaxed">Cobertura total hospitalaria, urgencias, consulta médica y red preferencial nacional {providerName}.</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-slate-800 py-1">
                    ${basePrice.toLocaleString()} COP
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4 bg-emerald-50/20 text-emerald-800">
                  <div className="col-span-8 flex flex-col gap-0.5">
                    <span className="font-bold">Ajuste Predictivo IA (Campaña Activa)</span>
                    <span className="text-[9px] text-emerald-600 font-semibold font-mono">DEDUCCIÓN AUTORIZADA POR SCORE DE ADHERENCIA</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-emerald-600 py-1">
                    -${aiDiscount.toLocaleString()} COP
                  </div>
                </div>
              </div>
              {/* Grand Total */}
              <div className="grid grid-cols-12 bg-slate-50 border-t border-slate-200 p-4 font-mono font-bold text-slate-900">
                <div className="col-span-8 text-right pr-6 uppercase tracking-wider text-[10px] flex items-center justify-end">TOTAL PROPUESTO ANUAL</div>
                <div className="col-span-4 text-right text-sm text-slate-900">
                  ${finalPrice.toLocaleString()} COP
                </div>
              </div>
            </div>

            {/* AI Endorsement Footer */}
            <div className="mt-auto border-t border-slate-100 pt-5 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Icon name="verified" size="sm" className="text-emerald-500 scale-90" />
                  <span className="text-[9px] font-bold text-slate-800 font-mono">FIRMA DIGITAL AUTORIZADA</span>
                </div>
                <div className="text-[8px] text-slate-400 font-mono">HASH: 40ea4d8d1aa828a2a893437c356b6c00e12e09ff</div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <div className="w-16 h-16 border-2 border-slate-200 rounded flex items-center justify-center p-1 bg-slate-50 select-none">
                  {/* Mock QR Code */}
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-60">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${(i * 3 + 1) % 2 === 0 ? 'bg-slate-800' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[7px] text-slate-400 font-mono tracking-tighter">SCAN_VERIFY_LEDGER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-900">
          <Button variant="outline" size="md" onClick={onCancel} className="border-white/10 hover:bg-slate-800 text-slate-300 font-bold">
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm} className="bg-primary hover:bg-primary/95 text-white font-bold flex items-center gap-2">
            <Icon name="send" size="sm" /> Confirmar y Enviar al Cliente
          </Button>
        </div>

      </div>
    </div>
  );
}
