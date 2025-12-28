import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input, TextArea, Switch } from '@/components/atoms/forms';
import { Stack, Box } from '@/components/layout';
import { Button } from '@/components/atoms/button';

const meta: Meta<typeof Field> = {
  title: 'Forms/Field Molecule',
  component: Field,
  decorators: [
    (Story) => (
      <Box padding={12} className="max-w-md mx-auto">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const TextInput: Story = {
  render: () => (
    <Field 
      label="Campaign Name" 
      helperText="Enter a unique name for your marketing initiative."
      id="campaign-name"
      required
    >
      <Input id="campaign-name" placeholder="Summer 2025 Launch" />
    </Field>
  ),
};

export const InputWithError: Story = {
  render: () => (
    <Field 
      label="Email Address" 
      error="Please enter a valid email address."
      id="email"
      required
    >
      <Input id="email" type="email" defaultValue="invalid-email" error />
    </Field>
  ),
};

export const TextAreaField: Story = {
  render: () => (
    <Field 
      label="Description" 
      helperText="Briefly explain the purpose of this campaign."
      id="desc"
    >
      <TextArea id="desc" placeholder="Describe your initiative..." />
    </Field>
  ),
};

export const SwitchField: Story = {
  render: () => (
    <Box padding={6} background="subtle" radius="2xl" border>
      <Field 
        label="Enable Notifications" 
        helperText="Receive alerts when brand assets are updated."
        className="flex-row items-center justify-between gap-8"
      >
        <Switch />
      </Field>
    </Box>
  ),
};

export const FullForm: Story = {
  render: () => (
    <Stack gap={8}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Workspace Setup</h2>
        <p className="text-sm text-[var(--lpd-color-text-muted)]">Configure your brand environment.</p>
      </div>
      
      <Stack gap={6}>
        <Field label="Organization" required id="org">
          <Input id="org" placeholder="e.g. Acme Corp" />
        </Field>

        <Field label="Brand Voice" id="voice">
          <TextArea id="voice" placeholder="Describe the personality of your brand..." />
        </Field>

        <Box padding={6} background="base" radius="2xl" border>
          <Stack gap={4}>
            <Field label="Dark Mode" className="flex-row items-center justify-between gap-4">
              <Switch />
            </Field>
            <Field label="Public Workspace" className="flex-row items-center justify-between gap-4">
              <Switch defaultChecked />
            </Field>
          </Stack>
        </Box>

        <Stack gap={3} className="pt-4">
          <Button variant="primary">Create Workspace</Button>
          <Button variant="ghost">Cancel</Button>
        </Stack>
      </Stack>
    </Stack>
  ),
};
