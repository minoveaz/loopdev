'use client';

import React from 'react';
import {
  SUITE_CANVAS_GAP_CLASSES,
  SUITE_CANVAS_GEOMETRY,
  SUITE_CANVAS_GEOMETRY_CLASSES,
  SUITE_CANVAS_GRID_CLASSES,
  SUITE_CANVAS_MAX_WIDTH_CLASSES,
  SUITE_CANVAS_MOBILE_GRID_CLASSES,
  SUITE_CANVAS_OVERFLOW_X_CLASSES,
  SUITE_CANVAS_PADDING_CLASSES,
  type SuiteCanvasProps,
} from './types';

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
  geometryPreset,
  scrollResetKey,
  header,
  toolbar,
  localNav,
  tabs,
  contextAside,
  aside,
  asidePresentation = 'inline',
  footer,
  children,
  className = '',
  contentClassName = '',
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const resolvedGeometryPreset = geometryPreset ?? {
    mode,
    geometry: SUITE_CANVAS_GEOMETRY[mode],
    columns: 12,
    mobileColumns: 4,
    maxWidth: 'bounded' as const,
    padding: 'comfortable' as const,
    gap: 'md' as const,
    overflowX: 'hidden' as const,
    overflowY: 'canvas' as const,
  };
  const geometryClasses = [
    SUITE_CANVAS_GEOMETRY_CLASSES[resolvedGeometryPreset.geometry],
    SUITE_CANVAS_MAX_WIDTH_CLASSES[resolvedGeometryPreset.maxWidth],
    SUITE_CANVAS_PADDING_CLASSES[resolvedGeometryPreset.padding],
    SUITE_CANVAS_GAP_CLASSES[resolvedGeometryPreset.gap],
    SUITE_CANVAS_GRID_CLASSES[resolvedGeometryPreset.columns],
    SUITE_CANVAS_MOBILE_GRID_CLASSES[resolvedGeometryPreset.columns],
    SUITE_CANVAS_OVERFLOW_X_CLASSES[resolvedGeometryPreset.overflowX],
  ].join(' ');

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      contentRef.current.scrollLeft = 0;
    }
  }, [scrollResetKey]);

  return (
    <section
      aria-label="SuiteCanvas"
      data-canvas-mode={mode}
      data-canvas-geometry={SUITE_CANVAS_GEOMETRY[mode]}
      data-canvas-geometry-preset={resolvedGeometryPreset.geometry}
      data-canvas-columns={resolvedGeometryPreset.columns}
      data-canvas-mobile-columns={resolvedGeometryPreset.mobileColumns}
      data-canvas-padding={resolvedGeometryPreset.padding}
      data-canvas-overflow-x={resolvedGeometryPreset.overflowX}
      className={`suite-canvas ${modeClasses[mode]} bg-shell-canvas flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden max-lg:h-full max-lg:min-h-0 max-lg:overflow-x-hidden max-lg:overflow-y-hidden ${className}`}
    >
      {header ? <header className="suite-canvas__header shrink-0">{header}</header> : null}
      {toolbar ? <div className="suite-canvas__toolbar shrink-0">{toolbar}</div> : null}
      {localNav ? <nav className="suite-canvas__local-nav shrink-0">{localNav}</nav> : null}
      {tabs ? <div className="suite-canvas__tabs shrink-0">{tabs}</div> : null}
      <div className="suite-canvas__body relative flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 overflow-hidden max-lg:h-full max-lg:flex-col max-lg:overflow-x-hidden max-lg:overflow-y-hidden">
        {contextAside}
        <div
          ref={contentRef}
          tabIndex={0}
          className={`suite-canvas__content min-h-0 w-full min-w-0 max-w-full flex-1 overflow-y-auto max-lg:overflow-y-auto max-lg:overflow-x-hidden ${geometryClasses} ${contentClassName}`}
        >
          {children}
        </div>
        {aside ? (
          <aside
            className={`suite-canvas__aside z-30 max-lg:static max-lg:w-full ${asidePresentation === 'overlay' ? 'absolute inset-y-0 right-0 shadow-[-4px_0_16px_rgba(15,23,42,0.08)]' : 'relative shrink-0'}`}
          >
            {aside}
          </aside>
        ) : null}
      </div>
      {footer ? <footer className="suite-canvas__footer shrink-0">{footer}</footer> : null}
    </section>
  );
};

export * from './types';
