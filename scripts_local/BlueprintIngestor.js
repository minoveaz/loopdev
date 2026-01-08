const fs = require('fs');
const path = require('path');

/**
 * LOOPDEV BLUEPRINT INGESTOR v1.1
 * Fixed path resolution for monorepo structure.
 */

const CLASS_MAPPINGS = {
  'bg-background-dark': 'bg-shell-canvas',
  'bg-surface-dark': 'bg-surface-elevated',
  'bg-white': 'bg-white',
  'bg-slate-50': 'bg-background-subtle',
  'bg-slate-100': 'bg-background-subtle',
  'bg-slate-800': 'bg-background-subtle-dark',
  'bg-blue-50': 'bg-primary/5',
  'border-slate-200': 'border-border-technical',
  'border-slate-700': 'border-border-technical',
  'border-slate-800': 'border-border-technical',
  'border-border-dark': 'border-border-technical',
  'text-slate-900': 'text-text-main',
  'text-slate-500': 'text-text-muted',
  'text-slate-400': 'text-text-muted opacity-60',
  'text-slate-300': 'text-text-main opacity-80',
  'text-[#0d121b]': 'text-text-main',
  'rounded-xl': 'rounded-2xl',
};

function translateClasses(html) {
  return html.replace(/className="([^"]*)"/g, (match, classes) => {
    const list = classes.split(' ');
    const translated = list.map(c => CLASS_MAPPINGS[c] || c);
    return `className="${translated.join(' ')}"`;
  });
}

function translateIcons(html) {
  return html.replace(/<span[^>]*material-symbols-outlined[^>]*>([\s\S]*?)<\/span>/g, (match, iconName) => {
    const name = iconName.trim();
    return `<Icon name="${name}" size="sm" />`;
  });
}

function extractBlock(source, keyword) {
  const lines = source.split('\n');
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(keyword)) {
      for (let j = i; j >= 0; j--) {
        if (lines[j].includes('<div') || lines[j].includes('<section')) {
          startIdx = j;
          break;
        }
      }
      break;
    }
  }
  if (startIdx === -1) return null;
  const content = lines.slice(startIdx, startIdx + 100).join('\n');
  return content;
}

const [,, sourceFile, componentName, keyword, category] = process.argv;

if (!sourceFile || !componentName) {
  console.log('Usage: node BlueprintIngestor.js <LabPath> <Name> <Keyword> <Category>');
  process.exit(1);
}

// Robust path resolution
const projectRoot = process.cwd(); // Assuming we are in /workspaces/codespaces-blank/loopdev
const dsPath = path.resolve(projectRoot, 'ds/packages/ui/src/components/composites', category || 'utilities', componentName);

if (!fs.existsSync(dsPath)) fs.mkdirSync(dsPath, { recursive: true });

const sourcePath = path.resolve(projectRoot, sourceFile);
const sourceCode = fs.readFileSync(sourcePath, 'utf8');
const rawBlock = extractBlock(sourceCode, keyword);

if (!rawBlock) {
  console.error('Error: Could not find block with keyword: ' + keyword);
  process.exit(1);
}

const industrialCode = translateIcons(translateClasses(rawBlock));

const indexContent = `'use client';

import React from 'react';
import { LpdText, Icon } from '../../../../atoms';
import { ${componentName}Props } from './types';

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="industrial-ingest-container">
      ${industrialCode}
    </div>
  );
};
`;

const typesContent = `export interface ${componentName}Props {
  className?: string;
}
`;

const verificationStory = `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './index';

const meta: Meta<typeof ${componentName}> = {
  title: '🔍 Verification/${componentName}',
  component: ${componentName},
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-12 p-8 bg-shell-canvas min-h-screen">
        <section className="flex flex-col gap-4">
          <header className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
            <span className="text-[10px] font-bold text-primary uppercase">Status: Verification Pending</span>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-micro font-mono opacity-40 uppercase tracking-widest">// BLUEPRINT (LAB)</h4>
              <div className="p-6 bg-[#0f1115] border border-white/5 rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all overflow-hidden">
                <p className="text-white text-xs opacity-40">Lab Content (Reference Only)</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-micro font-mono text-primary uppercase tracking-widest">// INDUSTRIAL (DS)</h4>
              <div className="p-6 bg-shell-canvas border border-border-technical rounded-2xl">
                <Story />
              </div>
            </div>
          </div>
        </section>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Comparison: Story = {};
`;

fs.writeFileSync(path.join(dsPath, 'index.tsx'), indexContent);
fs.writeFileSync(path.join(dsPath, 'types.ts'), typesContent);
fs.writeFileSync(path.join(dsPath, `${componentName}.verification.stories.tsx`), verificationStory);

console.log('🚀 INGESTION COMPLETE! Component created at: ' + dsPath);
