
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Overview } from '../pages/system/Overview';
import { ColorsTokens } from '../pages/system/ColorsTokens';
import { Typography } from '../pages/system/Typography';
import { DesignPrinciples } from '../pages/system/DesignPrinciples';
import { FoundationComponents } from '../pages/system/FoundationComponents';
import { InteractionPatterns } from '../pages/system/InteractionPatterns';
import { AdvancedUI } from '../pages/system/AdvancedUI';
import { AdvancedUI2 } from '../pages/system/AdvancedUI2';
import { ApplicationExamples } from '../pages/system/ApplicationExamples';
import { Illustrations } from '../pages/system/Illustrations';
import { DataTables } from '../pages/system/DataTables';
import { DataVisualizations } from '../pages/system/DataVisualizations';
import { NavigationStructure } from '../pages/system/NavigationStructure';
import { ComplexForms } from '../pages/system/ComplexForms';
import { NotificationsAndWorkflows } from '../pages/system/NotificationsAndWorkflows';
import { ManagementEditing } from '../pages/system/ManagementEditing';
import { OverlaysFeedback } from '../pages/system/OverlaysFeedback';
import { UserRoleManagement } from '../pages/system/UserRoleManagement';
import { SettingsExamples } from '../pages/system/SettingsExamples';
import { Collaboration } from '../pages/system/Collaboration';
import { AutomationRules } from '../pages/system/AutomationRules';
import { MetricsKPIs } from '../pages/system/MetricsKPIs';
import { FunctionalLibrary } from '../pages/functional/FunctionalLibrary';
import { ExamplesOne } from '../pages/ExamplesOne';
import { ExamplesThree } from '../pages/ExamplesThree';
import { KanbanBoard } from '../pages/system/KanbanBoard';
import { KanbanElements } from '../pages/system/KanbanElements';
import { SystemLayout } from '../components/layout/SystemLayout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* System Documentation Routes wrapped in SystemLayout */}
        <Route path="/system" element={<SystemLayout />}>
          <Route index element={<Overview />} />
          <Route path="colors" element={<ColorsTokens />} />
          <Route path="typography" element={<Typography />} />
          <Route path="illustrations" element={<Illustrations />} />
          <Route path="navigation" element={<NavigationStructure />} />
          <Route path="foundation" element={<FoundationComponents />} />
          <Route path="complex-forms" element={<ComplexForms />} />
          <Route path="management" element={<ManagementEditing />} />
          <Route path="notifications" element={<NotificationsAndWorkflows />} />
          <Route path="interaction" element={<InteractionPatterns />} />
          <Route path="principles" element={<DesignPrinciples />} />
          <Route path="advanced-ui" element={<AdvancedUI />} />
          <Route path="advanced-ui-2" element={<AdvancedUI2 />} />
          <Route path="examples" element={<ApplicationExamples />} />
          <Route path="data-tables" element={<DataTables />} />
          <Route path="data-visualizations" element={<DataVisualizations />} />
          <Route path="overlays" element={<OverlaysFeedback />} />
          <Route path="users" element={<UserRoleManagement />} />
          <Route path="settings" element={<SettingsExamples />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="automation" element={<AutomationRules />} />
          <Route path="metrics" element={<MetricsKPIs />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="kanban-elements" element={<KanbanElements />} />
        </Route>

        {/* Functional Library Routes */}
        <Route path="/functional" element={<SystemLayout />}>
          <Route index element={<FunctionalLibrary />} />
        </Route>

        {/* Examples 1 Route */}
        <Route path="/examples-1" element={<SystemLayout />}>
          <Route index element={<ExamplesOne />} />
        </Route>

        {/* Examples 3 Route */}
        <Route path="/examples-3" element={<SystemLayout />}>
          <Route index element={<ExamplesThree />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
