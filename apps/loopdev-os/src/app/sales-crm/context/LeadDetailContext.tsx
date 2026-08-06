'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Lead, ActivityLogEntry, LeadTask, LeadDocument, useSalesCrm } from './index';

interface LeadDetailContextType {
  // Main states
  lead: Lead;
  editedLead: Lead;
  isEditing: boolean;
  isReadOnly: boolean;

  // Creators states
  activeCreator: 'note' | 'call' | 'task' | 'whatsapp' | 'email' | null;
  setActiveCreator: (creator: 'note' | 'call' | 'task' | 'whatsapp' | 'email' | null) => void;
  activeDetailCard: 'contact' | 'product' | 'source' | 'value' | null;
  setActiveDetailCard: (card: 'contact' | 'product' | 'source' | 'value' | null) => void;
  newNote: string;
  setNewNote: (val: string) => void;
  noteCategory: 'general' | 'requirement' | 'pain_point' | 'budget';
  setNoteCategory: (cat: 'general' | 'requirement' | 'pain_point' | 'budget') => void;
  notePinned: boolean;
  setNotePinned: (pinned: boolean) => void;
  newCall: { outcome: string; summary: string; date: string };
  setNewCall: React.Dispatch<
    React.SetStateAction<{ outcome: string; summary: string; date: string }>
  >;
  newTask: {
    title: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
  };
  setNewTask: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
    }>
  >;
  newWhatsAppChat: string;
  setNewWhatsAppChat: (val: string) => void;

  // Actions
  startEdit: () => void;
  cancelEdit: () => void;
  handleEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  handleSave: () => void;

  // Activity modifiers
  addNote: () => void;
  logCall: () => void;
  addTask: () => void;
  toggleTask: (task: LeadTask) => void;
  logWhatsAppChat: () => void;

  // Document modifiers
  handleDocumentUpload: (file: File, category: string) => void;
  handleDocumentDelete: (docId: string) => void;

  // Communication triggers
  whatsAppClick: () => void;
  emailSent: (subject: string, body: string, attachmentsCount: number) => void;
  handleLeadClosure: (action: 'rejected' | 'discarded', reason: string, details: string) => void;
  handleMoveToOnboarding: () => void;
  handleStatusChange: (newStage: Lead['stage']) => void;
}

const LeadDetailContext = createContext<LeadDetailContextType | undefined>(undefined);

interface LeadDetailProviderProps {
  children: React.ReactNode;
  initialLead: Lead;
  onClose: () => void;
}

type LeadHistoryEntry = Lead['history'][number];

/** Builds an updated lead while keeping activity and history ordering consistent. */
function withLeadActivity(
  lead: Lead,
  logEntry: ActivityLogEntry,
  patch: Partial<Lead> = {},
  historyEntry?: LeadHistoryEntry,
): Lead {
  return {
    ...lead,
    ...patch,
    activityLog: [logEntry, ...(lead.activityLog || [])],
    ...(historyEntry ? { history: [...lead.history, historyEntry] } : {}),
  };
}

export const LeadDetailProvider: React.FC<LeadDetailProviderProps> = ({
  children,
  initialLead,
  onClose,
}) => {
  const { updateLead } = useSalesCrm();
  const [editedLead, setEditedLead] = useState<Lead>(initialLead);
  const [isEditing, setIsEditing] = useState(false);

  // Creators state
  const [activeCreator, setActiveCreator] = useState<
    'note' | 'call' | 'task' | 'whatsapp' | 'email' | null
  >(null);
  const [activeDetailCard, setActiveDetailCard] = useState<
    'contact' | 'product' | 'source' | 'value' | null
  >(null);
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState<
    'general' | 'requirement' | 'pain_point' | 'budget'
  >('general');
  const [notePinned, setNotePinned] = useState(false);
  const [newCall, setNewCall] = useState({
    outcome: 'Conectado',
    summary: '',
    date: new Date().toISOString().slice(0, 16),
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().slice(0, 16),
    priority: 'medium' as 'high' | 'medium' | 'low',
  });
  const [newWhatsAppChat, setNewWhatsAppChat] = useState('');

  // Sync state if initialLead changes
  useEffect(() => {
    queueMicrotask(() => {
      setEditedLead(initialLead);
      setIsEditing(false);
      setActiveCreator(null);
      setActiveDetailCard(null);
      setNewNote('');
      setNoteCategory('general');
      setNotePinned(false);
      setNewCall({
        outcome: 'Conectado',
        summary: '',
        date: new Date().toISOString().slice(0, 16),
      });
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date().toISOString().slice(0, 16),
        priority: 'medium',
      });
      setNewWhatsAppChat('');
    });
  }, [initialLead]);

  const isReadOnly = ['won', 'lost', 'rejected', 'discarded'].includes(initialLead.stage);

  const startEdit = useCallback(() => {
    if (isReadOnly) return;
    setEditedLead(initialLead);
    setIsEditing(true);
  }, [initialLead, isReadOnly]);

  const cancelEdit = useCallback(() => {
    setEditedLead(initialLead);
    setIsEditing(false);
  }, [initialLead]);

  const handleEditChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedLead((prev) => {
        // Support nested updates if editing client info vs quote info
        if (name === 'firstName' || name === 'lastName') {
          const spaceIdx = prev.name.indexOf(' ');
          const currentFirst = spaceIdx !== -1 ? prev.name.substring(0, spaceIdx) : prev.name;
          const currentLast = spaceIdx !== -1 ? prev.name.substring(spaceIdx + 1) : '';
          const nextFirst = name === 'firstName' ? value : currentFirst;
          const nextLast = name === 'lastName' ? value : currentLast;
          return { ...prev, name: `${nextFirst} ${nextLast}`.trim() };
        }
        if (
          name === 'dealValue' ||
          name === 'winProbability' ||
          name === 'height' ||
          name === 'weight' ||
          name === 'annualPremium' ||
          name === 'landingVisits'
        ) {
          return { ...prev, [name]: Number(value) || 0 };
        }
        return { ...prev, [name]: value };
      });
    },
    [],
  );

  const handleSave = useCallback(() => {
    // Commit locally edited lead to the global store
    updateLead(editedLead);
    setIsEditing(false);
  }, [editedLead, updateLead]);

  const addNote = useCallback(() => {
    if (!newNote.trim()) return;
    const logEntry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      actor: 'Elena Gómez',
      type: 'NOTE',
      action: 'Nota registrada',
      details: newNote,
      category: noteCategory,
      pinned: notePinned,
    };
    const updatedLead = withLeadActivity(
      initialLead,
      logEntry,
      {},
      {
        date: new Date().toISOString().split('T')[0],
        action: 'Nota agregada: ' + newNote.substring(0, 30) + '...',
        actor: 'Elena Gómez (Sales)',
      },
    );
    updateLead(updatedLead);
    setNewNote('');
    setNoteCategory('general');
    setNotePinned(false);
    setActiveCreator(null);
  }, [initialLead, newNote, noteCategory, notePinned, updateLead]);

  const logCall = useCallback(() => {
    if (!newCall.summary.trim()) return;
    const logEntry: ActivityLogEntry = {
      timestamp: new Date(newCall.date).toISOString(),
      actor: 'Elena Gómez',
      type: 'CALL',
      action: `Llamada Registrada (${newCall.outcome})`,
      details: newCall.summary,
    };
    const updatedLead = withLeadActivity(
      initialLead,
      logEntry,
      {},
      {
        date: new Date().toISOString().split('T')[0],
        action: `Llamada registrada: ${newCall.outcome}`,
        actor: 'Elena Gómez (Sales)',
      },
    );
    updateLead(updatedLead);
    setNewCall({ outcome: 'Conectado', summary: '', date: new Date().toISOString().slice(0, 16) });
    setActiveCreator(null);
  }, [initialLead, newCall, updateLead]);

  const addTask = useCallback(() => {
    if (!newTask.title.trim()) return;
    const nextTaskId = `T-${100 + (initialLead.tasks?.length || 0) + 1}`;
    const taskEntry: LeadTask = {
      id: nextTaskId,
      title: newTask.title,
      description: newTask.description || undefined,
      status: 'Pending',
      dueDate: new Date(newTask.dueDate).toISOString(),
      priority: newTask.priority,
    };
    const logEntry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      actor: 'Elena Gómez',
      type: 'TASK_CREATED',
      action: `Tarea creada: ${newTask.title}`,
      details: newTask.description || undefined,
    };
    const updatedLead = withLeadActivity(
      initialLead,
      logEntry,
      {
        tasks: [...(initialLead.tasks || []), taskEntry],
      },
      {
        date: new Date().toISOString().split('T')[0],
        action: `Tarea asignada: ${newTask.title}`,
        actor: 'Elena Gómez (Sales)',
      },
    );
    updateLead(updatedLead);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date().toISOString().slice(0, 16),
      priority: 'medium',
    });
    setActiveCreator(null);
  }, [initialLead, newTask, updateLead]);

  const toggleTask = useCallback(
    (taskToToggle: LeadTask) => {
      const nextStatus = taskToToggle.status === 'Completed' ? 'Pending' : 'Completed';
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: nextStatus === 'Completed' ? 'TASK_COMPLETED' : 'TASK_CREATED',
        action:
          nextStatus === 'Completed'
            ? `Tarea completada: ${taskToToggle.title}`
            : `Tarea reactivada: ${taskToToggle.title}`,
      };
      const updatedLead = withLeadActivity(
        initialLead,
        logEntry,
        {
          tasks: (initialLead.tasks || []).map((t) =>
            t.id === taskToToggle.id
              ? {
                  ...t,
                  status: nextStatus,
                  completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
                }
              : t,
          ),
        },
        {
          date: new Date().toISOString().split('T')[0],
          action:
            nextStatus === 'Completed'
              ? `Tarea completada: ${taskToToggle.title}`
              : `Tarea reabierta: ${taskToToggle.title}`,
          actor: 'Elena Gómez (Sales)',
        },
      );
      updateLead(updatedLead);
    },
    [initialLead, updateLead],
  );

  const handleDocumentUpload = useCallback(
    (file: File, category: string) => {
      const nextDocId = `D-${100 + (initialLead.documents?.length || 0) + 1}`;
      const docEntry: LeadDocument = {
        id: nextDocId,
        name: file.name,
        category: category,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
      };
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: 'DOCUMENT',
        action: `Documento cargado: ${file.name} (Categoría: ${category})`,
      };
      const updatedLead = withLeadActivity(
        initialLead,
        logEntry,
        {
          documents: [...(initialLead.documents || []), docEntry],
        },
        {
          date: new Date().toISOString().split('T')[0],
          action: `Archivo subido: ${file.name}`,
          actor: 'Elena Gómez (Sales)',
        },
      );

      updateLead(updatedLead);
    },
    [initialLead, updateLead],
  );

  const handleDocumentDelete = useCallback(
    (docId: string) => {
      const doc = initialLead.documents?.find((d) => d.id === docId);
      if (!doc) return;
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: 'DOCUMENT',
        action: `Documento eliminado: ${doc.name}`,
      };
      const updatedLead = withLeadActivity(initialLead, logEntry, {
        documents: (initialLead.documents || []).filter((d) => d.id !== docId),
      });
      updateLead(updatedLead);
    },
    [initialLead, updateLead],
  );

  const whatsAppClick = useCallback(() => {
    const logEntry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      actor: 'Elena Gómez',
      type: 'GENERIC',
      action: 'Conversación de WhatsApp iniciada',
    };
    const updatedLead = withLeadActivity(initialLead, logEntry);
    updateLead(updatedLead);

    const cleaned = initialLead.phone.replace(/\D/g, '');
    const formattedPhone = initialLead.phone.startsWith('+') ? cleaned : `57${cleaned}`; // Default code 57 (Colombia)

    let url = `https://wa.me/${formattedPhone}`;
    if (newWhatsAppChat && newWhatsAppChat.trim()) {
      url += `?text=${encodeURIComponent(newWhatsAppChat.trim())}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }, [initialLead, updateLead, newWhatsAppChat]);

  const emailSent = useCallback(
    (subject: string, body: string, attachmentsCount: number) => {
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: 'GENERIC',
        action: 'Correo electrónico enviado',
        details: `Asunto: "${subject}" | Adjuntos: ${attachmentsCount}`,
      };
      const updatedLead = withLeadActivity(
        initialLead,
        logEntry,
        {},
        {
          date: new Date().toISOString().split('T')[0],
          action: `Email enviado: ${subject}`,
          actor: 'Elena Gómez (Sales)',
        },
      );
      updateLead(updatedLead);
      setActiveCreator(null);
    },
    [initialLead, updateLead],
  );

  const handleLeadClosure = useCallback(
    (action: 'rejected' | 'discarded', reason: string, details: string) => {
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: 'STATUS_CHANGE',
        action: `Lead cerrado como: ${action.toUpperCase()}`,
        details: `Motivo: ${reason} | Detalles: ${details}`,
      };
      const updatedLead = withLeadActivity(
        initialLead,
        logEntry,
        {
          stage: action,
          closureReason: reason,
          closureDetails: details,
        },
        {
          date: new Date().toISOString().split('T')[0],
          action: `Oportunidad cerrada: ${action.toUpperCase()} (${reason})`,
          actor: 'Elena Gómez (Sales)',
        },
      );
      updateLead(updatedLead);
      onClose();
    },
    [initialLead, updateLead, onClose],
  );

  const handleMoveToOnboarding = useCallback(() => {
    const logEntry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      actor: 'Elena Gómez',
      type: 'STATUS_CHANGE',
      action: 'Lead movido a ONBOARDING',
      details: 'Contratación iniciada.',
    };
    const updatedLead = withLeadActivity(
      initialLead,
      logEntry,
      {
        stage: 'won', // Converted / Won triggers onboarding dashboard
      },
      {
        date: new Date().toISOString().split('T')[0],
        action: 'Contratación e inducción iniciadas',
        actor: 'Elena Gómez (Sales)',
      },
    );
    updateLead(updatedLead);
    onClose();
  }, [initialLead, updateLead, onClose]);
  const handleStatusChange = useCallback(
    (newStage: Lead['stage']) => {
      const logEntry: ActivityLogEntry = {
        timestamp: new Date().toISOString(),
        actor: 'Elena Gómez',
        type: 'STATUS_CHANGE',
        action: `Etapa cambiada a: ${newStage.toUpperCase()}`,
      };
      const updatedLead = withLeadActivity(
        initialLead,
        logEntry,
        {
          stage: newStage,
        },
        {
          date: new Date().toISOString().split('T')[0],
          action: `Etapa cambiada a: ${newStage.toUpperCase()}`,
          actor: 'Elena Gómez (Sales)',
        },
      );
      updateLead(updatedLead);
    },
    [initialLead, updateLead],
  );

  const logWhatsAppChat = useCallback(() => {
    if (!newWhatsAppChat.trim()) return;
    const logEntry: ActivityLogEntry = {
      timestamp: new Date().toISOString(),
      actor: 'Elena Gómez',
      type: 'GENERIC',
      action: 'Conversación de WhatsApp registrada',
      details: newWhatsAppChat,
    };
    const updatedLead = withLeadActivity(
      initialLead,
      logEntry,
      {},
      {
        date: new Date().toISOString().split('T')[0],
        action: 'Conversación de WhatsApp registrada',
        actor: 'Elena Gómez (Sales)',
      },
    );
    updateLead(updatedLead);
    setNewWhatsAppChat('');
    setActiveCreator(null);
  }, [newWhatsAppChat, initialLead, updateLead]);

  return (
    <LeadDetailContext.Provider
      value={{
        lead: initialLead,
        editedLead,
        isEditing,
        isReadOnly,
        activeCreator,
        setActiveCreator,
        activeDetailCard,
        setActiveDetailCard,
        newNote,
        setNewNote,
        noteCategory,
        setNoteCategory,
        notePinned,
        setNotePinned,
        newCall,
        setNewCall,
        newTask,
        setNewTask,
        newWhatsAppChat,
        setNewWhatsAppChat,
        startEdit,
        cancelEdit,
        handleEditChange,
        handleSave,
        addNote,
        logCall,
        addTask,
        toggleTask,
        logWhatsAppChat,
        handleDocumentUpload,
        handleDocumentDelete,
        whatsAppClick,
        emailSent,
        handleLeadClosure,
        handleMoveToOnboarding,
        handleStatusChange,
      }}
    >
      {children}
    </LeadDetailContext.Provider>
  );
};

export const useLeadDetail = () => {
  const context = useContext(LeadDetailContext);
  if (!context) throw new Error('useLeadDetail must be used within a LeadDetailProvider');
  return context;
};
