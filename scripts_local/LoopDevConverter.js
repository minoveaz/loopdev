const fs = require('fs');
const path = require('path');

/**
 * LoopDev Automator v2.1
 * Fixed template string syntax and improved transformation logic.
 */

const MAPPINGS = {
  // Spacing
  'p-1': 'padding={1}', 'p-2': 'padding={2}', 'p-3': 'padding={3}', 'p-4': 'padding={4}', 
  'p-5': 'padding={5}', 'p-6': 'padding={6}', 'p-8': 'padding={8}', 'p-10': 'padding={10}',
  'px-4': 'paddingX={4}', 'px-5': 'paddingX={5}', 'px-6': 'paddingX={6}',
  'py-2.5': 'paddingY={3}', 'py-4': 'paddingY={4}', 'py-6': 'paddingY={6}',
  'gap-1': 'gap={1}', 'gap-2': 'gap={2}', 'gap-3': 'gap={3}', 'gap-4': 'gap={4}', 'gap-6': 'gap={6}',

  // Colors
  'bg-primary': 'background="primary"',
  'bg-white': 'background="base"',
  'bg-slate-50': 'background="subtle"',
  'border-slate-200': 'border',
  'border-slate-300': 'border',
  'text-primary': 'color="primary"',
  
  // Radius
  'rounded-lg': 'radius="lg"',
  'rounded-xl': 'radius="xl"',
  'rounded-2xl': 'radius="2xl"',
  'rounded-3xl': 'radius="3xl"',
  'rounded-full': 'radius="full"',
};

function convertClasses(className) {
  if (!className) return { props: '', remaining: '' };
  let classes = className.split(' ');
  let props = [];
  let remaining = [];

  classes.forEach(c => {
    if (MAPPINGS[c]) props.push(MAPPINGS[c]);
    else remaining.push(c);
  });

  return { props: props.join(' '), remaining: remaining.join(' ') };
}

function processCode(sourceCode) {
  let result = sourceCode;

  // 1. Transform Structure tags
  result = result.replace(/<div className="[^"]*flex flex-col[^"]*"/g, (match) => match.replace('<div', '<Stack'));
  result = result.replace(/<div className="[^"]*flex flex-row[^"]*"/g, (match) => match.replace('<div', '<Inline'));
  result = result.replace(/<div className="[^"]*flex[^"]*"/g, (match) => match.replace('<div', '<Inline'));

  // 2. Transform Form tags
  result = result.replace(/<input[^>]*type="checkbox"[^>]*\/>/g, '<Checkbox />');
  result = result.replace(/<input[^>]*type="radio"[^>]*\/>/g, '<RadioGroupItem />');
  result = result.replace(/<label/g, '<Label');
  result = result.replace(/<\/label>/g, '</Label>');

  // 3. Process ClassNames into Props
  const classRegex = /className="([^"]*)"/g;
  result = result.replace(classRegex, (match, p1) => {
    const { props, remaining } = convertClasses(p1);
    if (!props) return match;
    return `${props} className="${remaining}"`.trim();
  });

  return result;
}

const [,, type, componentName, sourceFile] = process.argv;

if (!type || !componentName || !sourceFile) {
  console.log('Usage: node LoopDevConverter.js <atoms|molecules|organisms> <Name> <Path>');
  process.exit(1);
}

const sourceCode = fs.readFileSync(sourceFile, 'utf8');
const cleanCode = processCode(sourceCode);

const targetDir = path.join(__dirname, `../ds/packages/ui/src/components/${type}`);
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const componentPath = path.join(targetDir, `${componentName}.tsx`);
const storyPath = path.join(targetDir, `${componentName}.stories.tsx`);

// 1. Generate Component File
const componentContent = `import React from 'react';
import { cn } from '@/helpers/cn';
import { Stack, Inline, Box, Container } from '@/components/layout';
import { Button, Checkbox, Label, RadioGroup, RadioGroupItem } from '@/components/atoms';

export const ${componentName} = () => {
  return (
    <>
      ${cleanCode}
    </>
  );
};
`;

// 2. Generate Story File
const storyContent = `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '🧩 Molecules/Forms/${componentName}',
  component: ${componentName},
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {};
`;

fs.writeFileSync(componentPath, componentContent);
fs.writeFileSync(storyPath, storyContent);

console.log('✅ Component created at: ' + componentPath);
console.log('✅ Story created at: ' + storyPath);