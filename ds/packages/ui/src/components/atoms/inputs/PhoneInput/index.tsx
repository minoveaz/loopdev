'use client';

import React, { forwardRef, useState } from 'react';
import PhoneNumberInput, {
  type Country,
  type Props as LibraryPhoneInputProps,
  getCountryCallingCode,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { cn } from '../../../../helpers/cn';

export interface PhoneInputProps
  extends Omit<LibraryPhoneInputProps<React.InputHTMLAttributes<HTMLInputElement>>, 'onChange' | 'value' | 'className'> {
  value?: string;
  onChange?: (value?: string) => void;
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
  defaultCountry?: Country;
}

type CountryCodeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> & {
  value?: Country;
  onChange: (country?: Country) => void;
  options: Array<{ value?: Country; label: string; divider?: boolean }>;
  iconComponent?: React.ComponentType<{ country?: Country; label?: string; aspectRatio?: number }>;
  onCountryChange?: (country?: Country) => void;
};

const CountryCodeSelect = forwardRef<HTMLSelectElement, CountryCodeSelectProps>(
  ({ value, onChange, options, iconComponent: Icon, onCountryChange, ...props }, ref) => {
    const selectedOption = options.find((option) => option.value === value);
    const sortedOptions = [...options].sort((first, second) => {
      if (first.divider || second.divider) return Number(Boolean(first.divider)) - Number(Boolean(second.divider));
      if (!first.value) return -1;
      if (!second.value) return 1;
      return getCountryCallingCode(first.value).localeCompare(getCountryCallingCode(second.value), undefined, { numeric: true })
        || first.label.localeCompare(second.label);
    });
    return (
      <div className="relative flex h-full min-w-[5.75rem] shrink-0 items-center border-r border-border-subtle pl-2 pr-1.5">
        {Icon && value && (
          <Icon country={value} label={selectedOption?.label} aspectRatio={1} />
        )}
        <span className="pointer-events-none ml-1.5 whitespace-nowrap text-sm font-medium text-text-main">
          {value ? `+${getCountryCallingCode(value)}` : 'País'}
        </span>
        <select
          {...props}
          ref={ref}
          value={value ?? 'ZZ'}
          onChange={(event) => {
            const country = (event.target.value === 'ZZ' ? undefined : event.target.value) as Country | undefined;
            onCountryChange?.(country);
            onChange(country);
          }}
          aria-label="Código de país"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {sortedOptions.map((option) => (
            <option key={option.divider ? 'divider' : option.value ?? 'international'} value={option.divider ? '|' : option.value ?? 'ZZ'} disabled={option.divider}>
              {option.value ? `+${getCountryCallingCode(option.value)} ${option.label}` : option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none ml-auto text-xs text-text-muted">⌄</span>
      </div>
    );
  },
);

CountryCodeSelect.displayName = 'CountryCodeSelect';

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({
    value,
    onChange,
    error,
    label,
    helperText,
    id,
    className,
    defaultCountry = 'ES',
    ...props
  }, ref) => {
    const messageId = `${id ?? 'phone-input'}-${error ? 'error' : 'help'}`;
    const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedValue = event.clipboardData.getData('text').trim();
      if (!pastedValue.startsWith('+')) return;

      const parsed = parsePhoneNumberFromString(pastedValue);
      if (!parsed?.country) return;

      event.preventDefault();
      setSelectedCountry(parsed.country);
      (onChange ?? (() => undefined))(parsed.number);
    };

    return (
      <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-main">
            {label}
          </label>
        )}
        <PhoneNumberInput
          {...props}
          id={id}
          value={value}
          onChange={onChange ?? (() => undefined)}
          country={selectedCountry}
          international={false}
          countryCallingCodeEditable={false}
          className={cn(
            'lpd-phone-input flex min-h-11 w-full items-center overflow-hidden rounded-lg border bg-surface-light text-sm text-text-main transition-colors dark:bg-surface-dark [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2.5 [&_.PhoneInputInput]:text-text-main [&_.PhoneInputInput]:outline-none',
            error
              ? 'border-danger focus-within:ring-2 focus-within:ring-danger/20'
              : 'border-border-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          )}
          countrySelectComponent={(countrySelectProps) => (
            <CountryCodeSelect {...countrySelectProps} onCountryChange={setSelectedCountry} />
          )}
          numberInputProps={{
            'aria-invalid': Boolean(error),
            'aria-describedby': helperText || error ? messageId : undefined,
            onPaste: handlePaste,
          }}
        />
        {(error || helperText) && (
          <span id={messageId} className={cn('text-xs', error ? 'text-danger' : 'text-text-muted')}>
            {error ?? helperText}
          </span>
        )}
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
