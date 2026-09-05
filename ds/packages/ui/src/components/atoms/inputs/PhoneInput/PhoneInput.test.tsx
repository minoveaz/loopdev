import React, { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PhoneInput } from './index';

const copy = {
  countryPlaceholder: 'Country',
  countrySelectLabel: 'Country code',
  countrySearchLabel: 'Search countries',
  countrySearchPlaceholder: 'Search by country or calling code',
  countryNoResultsLabel: 'No countries found.',
};

describe('PhoneInput', () => {
  it('uses consumer copy and preserves external accessibility relationships', () => {
    render(
      <>
        <PhoneInput
          id="phone"
          label="Phone number"
          {...copy}
          numberInputProps={{
            'aria-describedby': 'phone-help',
            'aria-invalid': true,
          }}
        />
        <span id="phone-help">Include the international calling code.</span>
      </>,
    );

    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-describedby', 'phone-help');
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards focus to the native phone input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} id="phone" label="Phone number" {...copy} />);

    act(() => ref.current?.focus());
    expect(screen.getByLabelText('Phone number')).toHaveFocus();
  });

  it('uses paired semantic tokens for the field, value, placeholder, trigger and focus', () => {
    const { container } = render(
      <PhoneInput id="phone" label="Phone number" placeholder="Enter a phone number" {...copy} />,
    );
    const input = screen.getByLabelText('Phone number');
    const field = container.querySelector('.lpd-phone-input');
    const trigger = screen.getByRole('button', { name: 'Country code' });

    expect(field).toHaveClass('bg-lpd-bg-base', 'text-lpd-text-base');
    expect(field?.className).toContain('[&_.PhoneInputInput]:text-lpd-text-base');
    expect(field?.className).toContain('[&_.PhoneInputInput]:placeholder:text-lpd-text-muted');
    expect(field?.className).toContain('[&_.PhoneInputInput]:caret-primary');
    expect(field?.className).toContain('[&_.PhoneInputCountryIcon]:border-0');
    expect(field?.className).toContain('[&_.PhoneInputCountryIconImg]:border-0');
    expect(input).toHaveClass('PhoneInputInput');
    expect(trigger).toHaveClass('text-lpd-text-base', 'focus-visible:ring-primary/30');
    expect(field?.className).not.toContain('dark:bg-surface-dark');
  });

  it.each(['Spain', '+34', '34'])('finds Spain when searching for %s', async (query) => {
    const user = userEvent.setup();
    render(<PhoneInput id="phone" label="Phone number" defaultCountry="US" {...copy} />);

    await user.click(screen.getByRole('button', { name: 'Country code' }));
    const search = screen.getByRole('combobox', { name: 'Search countries' });
    await user.type(search, query);

    expect(screen.getByRole('option', { name: /Spain\s+\+34/ })).toBeInTheDocument();
  });

  it('selects Spain and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    render(
      <PhoneInput
        id="phone"
        label="Phone number"
        defaultCountry="US"
        onCountryChange={onCountryChange}
        {...copy}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Country code' });

    await user.click(trigger);
    await user.type(screen.getByRole('combobox', { name: 'Search countries' }), 'Spain');
    await user.click(screen.getByRole('option', { name: /Spain\s+\+34/ }));

    expect(trigger).toHaveTextContent('+34');
    expect(onCountryChange).toHaveBeenCalledWith('ES');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('keeps the country list scrollable for long option sets', async () => {
    const user = userEvent.setup();
    render(<PhoneInput id="phone" label="Phone number" {...copy} />);

    await user.click(screen.getByRole('button', { name: 'Country code' }));

    expect(screen.getByRole('listbox')).toHaveClass(
      'lpd-phone-country-list',
      'overflow-y-scroll',
      'overscroll-contain',
      '[touch-action:pan-y]',
    );
    expect(screen.getByRole('listbox')).toHaveAttribute('role', 'listbox');
  });

  it('selects the active country with the keyboard', async () => {
    const user = userEvent.setup();
    render(<PhoneInput id="phone" label="Phone number" defaultCountry="US" {...copy} />);
    const trigger = screen.getByRole('button', { name: 'Country code' });

    await user.click(trigger);
    const search = screen.getByRole('combobox', { name: 'Search countries' });
    await user.type(search, 'Spain');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(trigger).toHaveTextContent('+34');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<PhoneInput id="phone" label="Phone number" {...copy} />);
    const trigger = screen.getByRole('button', { name: 'Country code' });

    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Country code' })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(trigger).toHaveFocus();
  });

  it('closes on outside interaction and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <PhoneInput id="phone" label="Phone number" {...copy} />
        <button type="button">Outside action</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Country code' });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside action' }));

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(trigger).toHaveFocus();
  });

  it('has no accessibility violations when closed', async () => {
    const { container } = render(
      <PhoneInput
        id="phone"
        label="Phone number"
        helperText="Include the international calling code."
        {...copy}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    render(
      <PhoneInput
        id="phone"
        label="Phone number"
        helperText="Include the international calling code."
        {...copy}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Country code' }));
    expect(
      await axe(screen.getByRole('dialog', { name: 'Country code' }), {
        rules: { region: { enabled: false } },
      }),
    ).toHaveNoViolations();
  }, 15_000);
});
