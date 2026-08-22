'use client';

import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Search } from 'lucide-react';
import React, {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  countryPlaceholder?: string;
  countrySelectLabel?: string;
  countrySearchLabel?: string;
  countrySearchPlaceholder?: string;
  countryNoResultsLabel?: string;
}

type CountryOption = { value?: Country; label: string; divider?: boolean };

type CountryCodeSelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  iconComponent?: React.ComponentType<{ country?: Country; label?: string; aspectRatio?: number }>;
  countryPlaceholder?: string;
  countrySelectLabel?: string;
  countrySearchLabel?: string;
  countrySearchPlaceholder?: string;
  countryNoResultsLabel?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  'aria-label'?: string;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
};

const normalizeCountrySearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, '');

const CountryCodeSelect = forwardRef<HTMLButtonElement, CountryCodeSelectProps>(
  ({
    value,
    onChange,
    options,
    iconComponent: Icon,
    countryPlaceholder,
    countrySelectLabel,
    countrySearchLabel,
    countrySearchPlaceholder,
    countryNoResultsLabel,
    disabled,
    readOnly,
    name,
    tabIndex,
    'aria-label': libraryCountryLabel,
    onFocus,
    onBlur,
  }, ref) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeCountry, setActiveCountry] = useState<Country>();
    const triggerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
    const generatedId = useId().replace(/:/g, '');
    const listboxId = `phone-country-list-${generatedId}`;
    const selectedOption = options.find((option) => option.value === value);
    const accessibleLabel = countrySelectLabel ?? libraryCountryLabel ?? countryPlaceholder;
    const searchableOptions = useMemo(
      () =>
        options
          .filter((option): option is CountryOption & { value: Country } =>
            Boolean(option.value && !option.divider),
          )
          .sort((first, second) => first.label.localeCompare(second.label)),
      [options],
    );
    const normalizedQuery = normalizeCountrySearch(query);
    const filteredOptions = useMemo(
      () =>
        searchableOptions.filter((option) => {
          if (!normalizedQuery) return true;
          const callingCode = getCountryCallingCode(option.value);
          return normalizeCountrySearch(
            `${option.label} +${callingCode} ${callingCode}`,
          ).includes(normalizedQuery);
        }),
      [normalizedQuery, searchableOptions],
    );

    useEffect(() => {
      if (!open) return;
      setActiveCountry((current) => {
        if (current && filteredOptions.some((option) => option.value === current)) {
          return current;
        }
        if (value && filteredOptions.some((option) => option.value === value)) {
          return value;
        }
        return filteredOptions[0]?.value;
      });
    }, [filteredOptions, open, value]);

    const selectCountry = (country: Country) => {
      onChange(country);
      setOpen(false);
    };

    const moveActive = (direction: 1 | -1) => {
      if (filteredOptions.length === 0) return;
      const currentIndex = filteredOptions.findIndex(
        (option) => option.value === activeCountry,
      );
      const nextIndex =
        currentIndex < 0
          ? 0
          : (currentIndex + direction + filteredOptions.length) % filteredOptions.length;
      const nextCountry = filteredOptions[nextIndex]?.value;
      setActiveCountry(nextCountry);
      if (nextCountry) {
        requestAnimationFrame(() => {
          document
            .getElementById(`${listboxId}-${nextCountry}`)
            ?.scrollIntoView?.({ block: 'nearest' });
        });
      }
    };

    return (
      <Popover.Root
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setQuery('');
            setActiveCountry(undefined);
          }
        }}
      >
        <Popover.Trigger asChild>
          <button
            ref={triggerRef}
            type="button"
            name={name}
            disabled={disabled || readOnly}
            aria-disabled={disabled || readOnly || undefined}
            aria-label={accessibleLabel}
            tabIndex={tabIndex}
            onFocus={onFocus}
            onBlur={onBlur}
            className="flex min-h-11 min-w-[6.25rem] shrink-0 items-center gap-2 border-r border-border-subtle bg-transparent px-2.5 text-lpd-text-base outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {Icon && value ? (
              <span aria-hidden="true" className="shrink-0">
                <Icon country={value} label={selectedOption?.label} aspectRatio={1} />
              </span>
            ) : null}
            <span className="whitespace-nowrap text-sm font-medium">
              {value
                ? `+${getCountryCallingCode(value)}`
                : countryPlaceholder ?? libraryCountryLabel}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="ml-auto size-4 shrink-0 text-lpd-text-muted"
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={6}
            collisionPadding={8}
            role="dialog"
            aria-label={accessibleLabel}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
            className="lpd-phone-country-popover w-[min(22rem,calc(100vw-1rem))] overflow-hidden rounded-lg border border-border-subtle bg-lpd-bg-base text-lpd-text-base shadow-lpd-lg outline-none"
          >
            <div className="flex items-center gap-2 border-b border-border-subtle px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary/20">
              <Search aria-hidden="true" className="size-4 shrink-0 text-lpd-text-muted" />
              <input
                autoFocus
                type="search"
                role="combobox"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    moveActive(1);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveActive(-1);
                  } else if (event.key === 'Enter' && activeCountry) {
                    event.preventDefault();
                    selectCountry(activeCountry);
                  }
                }}
                placeholder={countrySearchPlaceholder ?? countryPlaceholder}
                aria-label={countrySearchLabel ?? accessibleLabel}
                aria-autocomplete="list"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-activedescendant={
                  activeCountry ? `${listboxId}-${activeCountry}` : undefined
                }
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-lpd-text-base caret-primary outline-none placeholder:text-lpd-text-muted"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              aria-label={accessibleLabel}
              onWheel={(event) => {
                if (event.currentTarget.scrollHeight > event.currentTarget.clientHeight) {
                  event.currentTarget.scrollTop += event.deltaY;
                }
              }}
              className="lpd-phone-country-list max-h-[min(24rem,calc(100dvh-12rem))] overscroll-contain overflow-y-scroll p-1.5 [scrollbar-gutter:stable] [touch-action:pan-y]"
            >
              {filteredOptions.length === 0 && countryNoResultsLabel ? (
                <p role="status" className="px-3 py-8 text-center text-sm text-lpd-text-muted">
                  {countryNoResultsLabel}
                </p>
              ) : null}
              {filteredOptions.map((option) => {
                const callingCode = getCountryCallingCode(option.value);
                const isActive = option.value === activeCountry;
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    id={`${listboxId}-${option.value}`}
                    type="button"
                    role="option"
                    aria-label={`${option.label} +${callingCode}`}
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveCountry(option.value)}
                    onClick={() => selectCountry(option.value)}
                    className={cn(
                      'flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-lpd-text-base outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30',
                      isActive && 'bg-primary/10',
                    )}
                  >
                    {Icon ? (
                      <span aria-hidden="true" className="shrink-0">
                        <Icon country={option.value} label={option.label} aspectRatio={1} />
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    <span className="shrink-0 text-lpd-text-muted">+{callingCode}</span>
                    {isSelected ? (
                      <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
    countryPlaceholder,
    countrySelectLabel,
    countrySearchLabel,
    countrySearchPlaceholder,
    countryNoResultsLabel,
    numberInputProps,
    ...props
  }, ref) => {
    const messageId = `${id ?? 'phone-input'}-${error ? 'error' : 'help'}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const inputAttributes = numberInputProps as React.InputHTMLAttributes<HTMLInputElement> | undefined;
    useImperativeHandle(
      ref,
      () => containerRef.current?.querySelector<HTMLInputElement>('.PhoneInputInput') as HTMLInputElement,
    );

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedValue = event.clipboardData.getData('text').trim();
      if (!pastedValue.startsWith('+')) return;

      const parsed = parsePhoneNumberFromString(pastedValue);
      if (!parsed?.country) return;

      event.preventDefault();
      (onChange ?? (() => undefined))(parsed.number);
    };

    return (
      <div ref={containerRef} className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-lpd-text-base">
            {label}
          </label>
        )}
        <PhoneNumberInput
          {...props}
          id={id}
          value={value}
          onChange={onChange ?? (() => undefined)}
          defaultCountry={defaultCountry}
          international={false}
          countryCallingCodeEditable={false}
          className={cn(
            'lpd-phone-input flex min-h-11 w-full items-center overflow-hidden rounded-lg border bg-lpd-bg-base text-sm text-lpd-text-base transition-colors [&_.PhoneInputCountryIcon]:border-0 [&_.PhoneInputCountryIcon]:shadow-none [&_.PhoneInputCountryIconImg]:border-0 [&_.PhoneInputCountryIconImg]:shadow-none [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2.5 [&_.PhoneInputInput]:text-lpd-text-base [&_.PhoneInputInput]:caret-primary [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:placeholder:text-lpd-text-muted',
            error
              ? 'border-danger focus-within:ring-2 focus-within:ring-danger/20'
              : 'border-border-subtle focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          )}
          countrySelectComponent={(countrySelectProps) => (
            <CountryCodeSelect
              {...countrySelectProps}
              countryPlaceholder={countryPlaceholder}
              countrySelectLabel={countrySelectLabel}
              countrySearchLabel={countrySearchLabel}
              countrySearchPlaceholder={countrySearchPlaceholder}
              countryNoResultsLabel={countryNoResultsLabel}
            />
          )}
          numberInputProps={{
            ...inputAttributes,
            'aria-invalid': inputAttributes?.['aria-invalid'] ?? Boolean(error),
            'aria-describedby': inputAttributes?.['aria-describedby']
              ?? (helperText || error ? messageId : undefined),
            onPaste: handlePaste,
          }}
        />
        {(error || helperText) && (
          <span id={messageId} className={cn('text-xs', error ? 'text-danger' : 'text-lpd-text-muted')}>
            {error ?? helperText}
          </span>
        )}
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
