/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DocumentIntelligenceWorkbench } from './DocumentIntelligenceWorkbench';
import { WorkbenchPrototypeProvider } from './workbench-context';

describe('DocumentIntelligenceWorkbench preparation', () => {
  it('does not render a review placeholder beside the upload surface', () => {
    render(
      <WorkbenchPrototypeProvider>
        <DocumentIntelligenceWorkbench />
      </WorkbenchPrototypeProvider>,
    );

    expect(screen.queryByText('Revisión de campos')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Seleccionar documento')).toBeInTheDocument();
  });
});
