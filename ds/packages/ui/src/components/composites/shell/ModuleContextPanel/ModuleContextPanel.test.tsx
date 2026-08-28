import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModuleContextPanel } from './index';

describe('ModuleContextPanel', () => {
  it('renders an accessible right-side module context surface', () => {
    render(
      <ModuleContextPanel label="ModuleContextPanel">
        <div>Module details</div>
      </ModuleContextPanel>,
    );

    expect(screen.getByRole('complementary', { name: 'ModuleContextPanel' })).toBeInTheDocument();
    expect(screen.getByText('Module details')).toBeInTheDocument();
  });

  it('uses a left border and keeps the footer separate from scrolling content', () => {
    render(
      <ModuleContextPanel label="ModuleContextPanel" width="wide" footer={<div>Panel actions</div>}>
        <div>Content</div>
      </ModuleContextPanel>,
    );

    const panel = screen.getByTestId('module-context-panel');
    expect(panel).toHaveClass('w-80', 'border-l');
    expect(panel).toHaveAttribute('data-width', 'wide');
    expect(panel).toHaveAttribute('data-content-scrollable', 'true');
    expect(panel.className).not.toMatch(/rounded/);
    expect(screen.getByText('Panel actions').parentElement).toHaveClass('border-t');
  });

  it('keeps inline presentation by default and supports overlay presentation', () => {
    const { rerender } = render(
      <ModuleContextPanel label="Inline panel">
        <div>Inline content</div>
      </ModuleContextPanel>,
    );

    expect(screen.getByTestId('module-context-panel')).not.toHaveClass('shadow-[-4px_0_16px_rgba(15,23,42,0.08)]');

    rerender(
      <ModuleContextPanel label="Overlay panel" presentation="overlay">
        <div>Overlay content</div>
      </ModuleContextPanel>,
    );

    expect(screen.getByTestId('module-context-panel')).toHaveClass('shadow-[-4px_0_16px_rgba(15,23,42,0.08)]');
    expect(screen.getByTestId('module-context-panel')).toHaveAttribute('data-presentation', 'overlay');
  });

  it('supports an extra-wide inspector for dense record details', () => {
    render(
      <ModuleContextPanel label="Record details" width="extra-wide">
        <div>Details</div>
      </ModuleContextPanel>,
    );

    expect(screen.getByTestId('module-context-panel')).toHaveClass('w-[26rem]');
  });

  it('renders an accessible close action when provided', () => {
    const onClose = vi.fn();

    render(
      <ModuleContextPanel label="Record details" onClose={onClose}>
        <div>Details</div>
      </ModuleContextPanel>,
    );

    screen.getByRole('button', { name: 'Close Record details' }).click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps header and footer outside the content scroll zone', () => {
    render(
      <ModuleContextPanel
        label="ModuleContextPanel"
        contentScrollable={false}
        headerSlot={<span>Panel tabs</span>}
        footer={<div>Footer actions</div>}
      >
        <div>Details</div>
      </ModuleContextPanel>,
    );

    const panel = screen.getByTestId('module-context-panel');
    expect(panel.querySelector('div')).toHaveClass('overflow-hidden');
    expect(panel).toHaveAttribute('data-content-scrollable', 'false');
    expect(screen.getByText('Footer actions').parentElement).toHaveClass('shrink-0', 'border-t');
  });
});
