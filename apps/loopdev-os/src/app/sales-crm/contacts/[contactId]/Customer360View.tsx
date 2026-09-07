'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle, FlaskConical } from 'lucide-react';
import {
  Button,
  ModuleHeader,
  ModuleContextPanel,
  SuiteCanvas,
  TechnicalSurface,
} from '@loopdev/ui';

import { useCustomer360Data } from './hooks/useCustomer360Data';
import { contactName } from './components/types';
import type { CustomerTabKey } from './components/types';

import { CustomerHero } from './components/CustomerHero';
import { CustomerMobileTabBar } from './components/CustomerMobileTabBar';
import { CustomerDesktopTabs } from './components/CustomerDesktopTabs';
import { CustomerQuickActionSheet } from './components/CustomerQuickActionSheet';
import { ContactDetailDrawerContent } from './components/ContactDetailDrawerContent';

import { ContactDetailsPanel } from './components/panels/ContactDetailsPanel';
import { TimelinePanel } from './components/panels/TimelinePanel';
import { OpportunitiesPanel } from './components/panels/OpportunitiesPanel';
import { TasksPanel } from './components/panels/TasksPanel';
import { NotesPanel } from './components/panels/NotesPanel';

interface Customer360ViewProps {
  contactId: string;
}

export function Customer360View({ contactId }: Customer360ViewProps) {
  const {
    activeOrganizationId,
    view,
    setView,
    isLoading,
    error,
    loadCustomer360,
    copiedEmail,
    copiedPhone,
    copyToClipboard,
    lifecycleStage,
    setLifecycleStage,
    isSimulationActive,
    toggleSimulation,
    displayedOpportunities,
    displayedTasks,
    displayedTimeline,
    displayedNotes,
    displayedLeads,
    totalPipelineValue,
    openTasksCount,
    isOpportunitiesSimulated,
    isTasksSimulated,
    isTimelineSimulated,
    isNotesSimulated,
    isLeadsSimulated,
  } = useCustomer360Data(contactId);

  const [activeTab, setActiveTab] = useState<CustomerTabKey>('timeline');
  const [showMobileActionSheet, setShowMobileActionSheet] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  useEffect(() => {
    const handleQuickAction = () => {
      setShowMobileActionSheet(true);
    };
    window.addEventListener('loopdev:quick-action', handleQuickAction);
    return () => {
      window.removeEventListener('loopdev:quick-action', handleQuickAction);
    };
  }, []);

  if (!activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing Customer 360...</div>;
  }

  const name = view ? contactName(view) : 'Customer 360';

  const handleContactUpdated = (updated: import('@loopdev/contracts').CrmContact) => {
    setView((prev) => (prev ? { ...prev, contact: updated } : prev));
  };

  return (
    <SuiteCanvas
      mode="workspace"
      scrollResetKey={contactId}
      contentClassName="h-full flex flex-col min-h-0 pb-36 lg:pb-6"
      header={
        <ModuleHeader
          segments={[
            { id: 'contacts', label: 'Contacts', href: '/sales-crm/contacts' },
            { id: 'customer-360', label: name },
          ]}
          leftSlot={
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Link
                href="/sales-crm/contacts"
                className="text-text-muted hover:text-text-main font-medium transition-colors"
              >
                Contacts
              </Link>
              <ChevronRight className="text-text-muted h-4 w-4" aria-hidden="true" />
              <span className="text-text-main max-w-[200px] truncate font-semibold sm:max-w-xs">
                {name}
              </span>
            </div>
          }
          ariaLabel="Customer 360 header"
        />
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-text-muted text-sm font-medium">Loading customer record...</p>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="border-status-error/40 bg-status-error/10 text-status-error shadow-xs flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void loadCustomer360()}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {view && !isLoading ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 sm:gap-6">
          {/* Simulation Mode Info Banner */}
          {isSimulationActive && (
            <div className="shadow-xs flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  <strong>Modo Simulación Activo:</strong> Los elementos con borde discontinuo y
                  etiqueta{' '}
                  <span className="rounded bg-amber-500/20 px-1 py-0.5 font-mono font-bold">
                    SIM
                  </span>{' '}
                  son datos proyectados para verificar la experiencia visual y geométrica del OS.
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSimulation}
                className="shrink-0 font-medium underline transition-colors hover:text-amber-900 dark:hover:text-amber-100"
              >
                Desactivar
              </button>
            </div>
          )}

          {/* 1. HERO SURFACE: Visible on Desktop, or ONLY on 'contact' tab in Mobile */}
          <CustomerHero
            view={view}
            name={name}
            contactId={contactId}
            lifecycleStage={lifecycleStage}
            setLifecycleStage={setLifecycleStage}
            totalPipelineValue={totalPipelineValue}
            openTasksCount={openTasksCount}
            leadsCount={displayedLeads.length}
            timelineCount={displayedTimeline.length}
            isOpportunitiesSimulated={isOpportunitiesSimulated}
            isTasksSimulated={isTasksSimulated}
            isLeadsSimulated={isLeadsSimulated}
            isTimelineSimulated={isTimelineSimulated}
            isMobileOnlyTab={activeTab === 'contact'}
            onEditContact={() => setIsEditDrawerOpen(true)}
          />

          {/* 2. TWO EQUAL-HEIGHT PANELS (Desktop) / Active Tab Pane (Mobile) */}
          <div className="grid min-h-[480px] min-w-0 flex-1 items-stretch gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* LEFT PANEL: Permanent Contact Record on Desktop (hidden on mobile) */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="divide-border-subtle hidden h-full min-h-0 flex-col divide-y overflow-y-auto p-6 lg:flex"
            >
              <ContactDetailsPanel
                view={view}
                displayedLeads={displayedLeads}
                isLeadsSimulated={isLeadsSimulated}
                isSimulationActive={isSimulationActive}
                copiedEmail={copiedEmail}
                copiedPhone={copiedPhone}
                copyToClipboard={copyToClipboard}
                onEditContact={() => setIsEditDrawerOpen(true)}
              />
            </TechnicalSurface>

            {/* RIGHT PANEL: Workspace Tabs and Active Content */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="flex h-full min-h-0 flex-col overflow-hidden"
            >
              {/* Desktop Tabs Header (>= 1024px) */}
              <CustomerDesktopTabs
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                timelineCount={displayedTimeline.length}
                opportunitiesCount={displayedOpportunities.length}
                tasksCount={displayedTasks.length}
                notesCount={displayedNotes.length}
                isTimelineSimulated={isTimelineSimulated}
                isOpportunitiesSimulated={isOpportunitiesSimulated}
                isTasksSimulated={isTasksSimulated}
                isNotesSimulated={isNotesSimulated}
              />

              {/* Workspace Content Pane */}
              <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto p-4 pb-28 sm:p-6 lg:pb-6">
                {/* Mobile 'contact' tab */}
                {activeTab === 'contact' ? (
                  <div className="flex w-full min-w-0 flex-1 flex-col lg:hidden">
                    <ContactDetailsPanel
                      view={view}
                      displayedLeads={displayedLeads}
                      isLeadsSimulated={isLeadsSimulated}
                      isSimulationActive={isSimulationActive}
                      copiedEmail={copiedEmail}
                      copiedPhone={copiedPhone}
                      copyToClipboard={copyToClipboard}
                      onEditContact={() => setIsEditDrawerOpen(true)}
                    />
                  </div>
                ) : null}

                {/* Timeline tab */}
                {activeTab === 'timeline' ? (
                  <TimelinePanel
                    displayedTimeline={displayedTimeline}
                    isTimelineSimulated={isTimelineSimulated}
                  />
                ) : null}

                {/* Opportunities tab */}
                {activeTab === 'opportunities' ? (
                  <OpportunitiesPanel
                    name={name}
                    displayedOpportunities={displayedOpportunities}
                    isOpportunitiesSimulated={isOpportunitiesSimulated}
                  />
                ) : null}

                {/* Tasks tab */}
                {activeTab === 'tasks' ? (
                  <TasksPanel
                    name={name}
                    contactId={contactId}
                    displayedTasks={displayedTasks}
                    isTasksSimulated={isTasksSimulated}
                  />
                ) : null}

                {/* Notes tab */}
                {activeTab === 'notes' ? (
                  <NotesPanel displayedNotes={displayedNotes} isNotesSimulated={isNotesSimulated} />
                ) : null}
              </div>
            </TechnicalSurface>
          </div>

          {/* CAPA 2: Mobile Floating Segmented Tab Bar */}
          <CustomerMobileTabBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            timelineCount={displayedTimeline.length}
            opportunitiesCount={displayedOpportunities.length}
            openTasksCount={openTasksCount}
          />

          {/* Mobile Quick Action Sheet Modal */}
          <CustomerQuickActionSheet
            isOpen={showMobileActionSheet}
            onClose={() => setShowMobileActionSheet(false)}
            name={name}
            contactId={contactId}
            phone={view.contact.phone}
            email={view.contact.email}
            onEditContact={() => setIsEditDrawerOpen(true)}
          />
        </div>
      ) : null}

      {/* Slide-Over Drawer (Untitled UI Drawer on Desktop / Native iOS Modal on Mobile) */}
      {view && activeOrganizationId && (
        <ModuleContextPanel
          label={`Ficha Técnica · ${name}`}
          visible={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          presentation="overlay"
          width="drawer"
          headerSlot={
            <button
              type="submit"
              form="customer-360-contact-edit-form"
              className="text-primary text-sm font-bold transition-opacity hover:opacity-80 active:opacity-50 sm:hidden"
            >
              Guardar
            </button>
          }
        >
          <ContactDetailDrawerContent
            contact={view.contact}
            organizationId={activeOrganizationId}
            onClose={() => setIsEditDrawerOpen(false)}
            onContactUpdated={handleContactUpdated}
          />
        </ModuleContextPanel>
      )}
    </SuiteCanvas>
  );
}
