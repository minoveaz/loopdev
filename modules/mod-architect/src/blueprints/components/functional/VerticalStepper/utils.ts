
import React from 'react';

export interface VerticalStep {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode; // For custom interactive content like buttons/forms
}

export const PROJECT_SETUP_STEPS: VerticalStep[] = [
  { 
    id: '1', 
    title: 'Project Setup', 
    description: 'Configure your repository and environment.' 
  },
  { 
    id: '2', 
    title: 'Integration', 
    description: 'Connect your data sources.',
    content: 'interactive-demo' // Placeholder to signal specific rendering in demo
  },
  { 
    id: '3', 
    title: 'Deployment', 
    description: 'Review and publish your app.' 
  }
];
