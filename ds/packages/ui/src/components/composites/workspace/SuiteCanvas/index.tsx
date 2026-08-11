'use client';

import React from 'react';
import type { SuiteCanvasProps } from './types';

const modeClasses: Record<NonNullable<SuiteCanvasProps['mode']>, string> = {
  overview: 'suite-canvas--overview',
  data: 'suite-canvas--data',
  workspace: 'suite-canvas--workspace',
  split: 'suite-canvas--split',
  board: 'suite-canvas--board',
  'full-bleed': 'suite-canvas--full-bleed',
};

export const SuiteCanvas: React.FC<SuiteCanvasProps> = ({
  mode = 'overview',
  header,
  toolbar,
  localNav,
  tabs,
  contextAside,
  aside,
  footer,
  children,
  className = '',
  contentClassName = '',
}) => (
  <section
    aria-label="SuiteCanvas"
    data-canvas-mode={mode}
    className={`suite-canvas ${modeClasses[mode]} bg-shell-canvas flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${className}`}
  >
    {header ? <header className="suite-canvas__header shrink-0">{header}</header> : null}
    {toolbar ? <div className="suite-canvas__toolbar shrink-0">{toolbar}</div> : null}
    {localNav ? <nav className="suite-canvas__local-nav shrink-0">{localNav}</nav> : null}
    {tabs ? <div className="suite-canvas__tabs shrink-0">{tabs}</div> : null}
    <div className="suite-canvas__body relative flex h-full min-h-0 min-w-0 flex-1 overflow-hidden">
      {contextAside}
      <main className={`suite-canvas__content min-h-0 min-w-0 flex-1 overflow-auto ${contentClassName}`}>
        {children}
      </main>
      {aside ? (
        <aside className="suite-canvas__aside absolute inset-y-0 right-0 z-30 max-lg:static max-lg:w-full">
          {aside}
        </aside>
      ) : null}
    </div>
    {footer ? <footer className="suite-canvas__footer shrink-0">{footer}</footer> : null}
  </section>
);

export * from './types';
