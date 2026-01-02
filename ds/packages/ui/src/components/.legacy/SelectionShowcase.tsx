import React from 'react';
import { cn } from '../../helpers/cn';
import { Stack, Inline, Box, Container } from '../../components/layout';
import { Button, Checkbox, Label, RadioGroup, RadioGroupItem } from '../../components/atoms';

export const SelectionShowcase = () => {
  return (
    <Stack gap={12}>
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Checkboxes</h3>
        <Stack gap={3}>
          <Label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox defaultChecked />
            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white transition-colors">Selected option</span>
          </Label>
          <Label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox />
            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white transition-colors">Default option</span>
          </Label>
          <Label className="flex items-center gap-3 cursor-not-allowed opacity-60">
            <Checkbox disabled defaultChecked />
            <span className="text-sm text-slate-500 transition-colors">Disabled selected</span>
          </Label>
        </Stack>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Radio Buttons</h3>
        <RadioGroup defaultValue="active">
          <Stack gap={3}>
            <Label className="flex items-center gap-3 cursor-pointer group">
              <RadioGroupItem value="active" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white transition-colors">Active selection</span>
            </Label>
            <Label className="flex items-center gap-3 cursor-pointer group">
              <RadioGroupItem value="inactive" />
              <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#0d121b] dark:group-hover:text-white transition-colors">Inactive selection</span>
            </Label>
          </Stack>
        </RadioGroup>
      </section>
    </Stack>
  );
};
