'use client';

import React from 'react';
import {
  CrmFieldGroupKey,
  CRM_FIELD_GROUPS,
  CRM_FIELD_CATALOG,
  CrmFieldDefinition,
} from '@loopdev/contracts';
import { Input, Select, PhoneInput } from '@loopdev/ui';
import {
  User,
  Mail,
  MapPin,
  Building2,
  Target,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  User,
  Mail,
  MapPin,
  Building2,
  Target,
  ShieldCheck,
  Tags,
};

interface FieldGroupSectionProps {
  groupKey: CrmFieldGroupKey;
  values: Record<string, any>;
  onChange: (fieldKey: string, value: any) => void;
  visibleFields?: string[];
  requiredFields?: string[];
  className?: string;
  isCompact?: boolean;
}

export function FieldGroupSection({
  groupKey,
  values,
  onChange,
  visibleFields,
  requiredFields = [],
  className = '',
  isCompact = false,
}: FieldGroupSectionProps) {
  const meta = CRM_FIELD_GROUPS[groupKey];
  if (!meta) return null;

  const Icon = ICON_MAP[meta.icon] || User;

  // Filter fields belonging to this group and visible
  const groupFields = Object.values(CRM_FIELD_CATALOG).filter(
    (field) =>
      field.group === groupKey &&
      (!visibleFields || visibleFields.includes(field.key))
  );

  if (groupFields.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border border-border-subtle bg-slate-50/50 dark:bg-white/[0.02] p-4 sm:p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-border-subtle pb-2.5">
        <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-main">
            {meta.label}
          </h3>
          {!isCompact && (
            <p className="text-[11px] text-text-muted mt-0.5">{meta.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {groupFields.map((field) => {
          const isRequired = requiredFields.includes(field.key);
          const currentValue = values[field.key] ?? '';

          if (field.inputType === 'select') {
            return (
              <div key={field.key} className="space-y-1">
                <Select
                  label={field.label}
                  required={isRequired}
                  size="sm"
                  value={currentValue}
                  onValueChange={(val) => onChange(field.key, val)}
                  placeholder={field.placeholder || `Seleccionar ${field.label}`}
                  options={field.options || []}
                />
              </div>
            );
          }

          if (field.inputType === 'tel') {
            return (
              <div key={field.key} className="space-y-1">
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-xs font-medium text-text-main block"
                >
                  {field.label} {isRequired && <span className="text-status-error">*</span>}
                </label>
                <Input
                  id={`field-${field.key}`}
                  type="tel"
                  size="sm"
                  value={currentValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder || '+34 600 000 000'}
                  className="h-9 text-xs"
                />
              </div>
            );
          }

          if (field.inputType === 'date') {
            return (
              <div key={field.key} className="space-y-1">
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-xs font-medium text-text-main block"
                >
                  {field.label} {isRequired && <span className="text-status-error">*</span>}
                </label>
                <Input
                  id={`field-${field.key}`}
                  type="date"
                  size="sm"
                  value={currentValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            );
          }

          if (field.inputType === 'number') {
            return (
              <div key={field.key} className="space-y-1">
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-xs font-medium text-text-main block"
                >
                  {field.label} {isRequired && <span className="text-status-error">*</span>}
                </label>
                <Input
                  id={`field-${field.key}`}
                  type="number"
                  size="sm"
                  value={currentValue}
                  onChange={(e) => onChange(field.key, e.target.value ? Number(e.target.value) : '')}
                  placeholder={field.placeholder}
                  className="h-9 text-xs"
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="space-y-1">
              <label
                htmlFor={`field-${field.key}`}
                className="text-xs font-medium text-text-main block"
              >
                {field.label} {isRequired && <span className="text-status-error">*</span>}
              </label>
              <Input
                id={`field-${field.key}`}
                type={field.inputType}
                size="sm"
                value={currentValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="h-9 text-xs"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
