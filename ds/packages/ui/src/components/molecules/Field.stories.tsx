import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input, TextArea, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, RadioGroup, RadioGroupItem, Label } from '@/components/atoms/forms';
import { Stack, Box, Inline } from '@/components/layout';
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

export const SelectField: Story = {
  render: () => (
    <Field 
      label="Workspace Region" 
      helperText="Select the physical location for your brand data."
      id="region"
    >
      <Select>
        <SelectTrigger id="region">
          <SelectValue placeholder="Select a region..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="eu-west">Europe (Frankfurt)</SelectItem>
          <SelectItem value="us-east">US East (N. Virginia)</SelectItem>
          <SelectItem value="ap-south">Asia Pacific (Mumbai)</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const CheckboxField: Story = {
  render: () => (
    <Box padding={6} background="subtle" radius="2xl" border>
      <Stack gap={4}>
        <Inline gap={3} align="start">
          <Checkbox id="terms" />
          <div className="space-y-1">
            <Label htmlFor="terms">Accept Brand Guidelines</Label>
            <p className="text-[11px] text-[var(--lpd-color-text-muted)]">I agree to follow all branding and tone of voice rules defined by the tenant.</p>
          </div>
        </Inline>
      </Stack>
    </Box>
  ),
};

export const RadioGroupField: Story = {
  render: () => (
    <Field label="Communication Preference" id="comm">
      <RadioGroup defaultValue="email">
        <Stack gap={3}>
          <Inline gap={3} align="center">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="normal-case font-medium text-sm">Email Notifications</Label>
          </Inline>
          <Inline gap={3} align="center">
            <RadioGroupItem value="slack" id="slack" />
            <Label htmlFor="slack" className="normal-case font-medium text-sm">Slack Workflows</Label>
          </Inline>
          <Inline gap={3} align="center">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="normal-case font-medium text-sm">Do not disturb</Label>
          </Inline>
        </Stack>
      </RadioGroup>
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

        <Field label="Default Region">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="us">United States</SelectItem>
            </SelectContent>
          </Select>
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