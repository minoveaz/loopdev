import { describe, expect, it, vi } from 'vitest';
import {
  canSendWhatsAppFreeText,
  dispatchWhatsAppMessage,
  WhatsAppDispatchError,
} from './whatsappDispatch';

const organizationId = '00000000-0000-4000-9000-000000000001';
const account = {
  id: 'account-1',
  organizationId,
  status: 'connected' as const,
  outboundEnabled: true,
};
const provider = { sendText: vi.fn(), sendTemplate: vi.fn() };
const now = new Date('2026-08-30T12:00:00.000Z');

describe('WhatsApp dispatch policy', () => {
  it('allows free text only inside the customer window', () => {
    expect(canSendWhatsAppFreeText('2026-08-30T12:00:01.000Z', now)).toBe(true);
    expect(canSendWhatsAppFreeText('2026-08-30T12:00:00.000Z', now)).toBe(false);
    expect(canSendWhatsAppFreeText(null, now)).toBe(false);
  });

  it('dispatches text through the provider while the window is valid', async () => {
    provider.sendText.mockResolvedValue({ providerMessageId: 'wamid.text' });
    await expect(
      dispatchWhatsAppMessage(provider, {
        organizationId,
        account,
        recipient: '+34600123456',
        body: 'Hola',
        windowExpiresAt: '2026-08-30T12:00:01.000Z',
        idempotencyKey: 'text-1',
        now,
      }),
    ).resolves.toEqual({ providerMessageId: 'wamid.text', mode: 'text' });
  });

  it('requires an approved same-account template when the window expired', async () => {
    provider.sendTemplate.mockResolvedValue({ providerMessageId: 'wamid.template' });
    const template = {
      id: 'template-1',
      organizationId,
      accountId: account.id,
      externalTemplateId: 'welcome',
      status: 'approved' as const,
      parameterNames: ['firstName'],
    };
    await expect(
      dispatchWhatsAppMessage(provider, {
        organizationId,
        account,
        recipient: '+34600123456',
        body: 'Hola',
        template,
        templateParameters: { firstName: 'Ana' },
        windowExpiresAt: '2026-08-30T11:59:59.000Z',
        idempotencyKey: 'template-1',
        now,
      }),
    ).resolves.toEqual({ providerMessageId: 'wamid.template', mode: 'template' });
    expect(provider.sendTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ templateId: 'welcome', parameterNames: ['firstName'] }),
    );
  });

  it('rejects outbound when the account is disconnected, paused, or cross-organization', async () => {
    const input = {
      organizationId,
      account,
      recipient: '+34600123456',
      body: 'Hola',
      windowExpiresAt: '2026-08-30T12:00:01.000Z',
      idempotencyKey: 'blocked-1',
      now,
    };
    await expect(
      dispatchWhatsAppMessage(provider, { ...input, account: { ...account, status: 'error' } }),
    ).rejects.toMatchObject({
      code: 'ACCOUNT_UNAVAILABLE',
    } satisfies Partial<WhatsAppDispatchError>);
    await expect(
      dispatchWhatsAppMessage(provider, {
        ...input,
        account: { ...account, outboundEnabled: false },
      }),
    ).rejects.toMatchObject({ code: 'OUTBOUND_PAUSED' } satisfies Partial<WhatsAppDispatchError>);
    await expect(
      dispatchWhatsAppMessage(provider, {
        ...input,
        account: { ...account, organizationId: '00000000-0000-4000-9000-000000000099' },
      }),
    ).rejects.toMatchObject({
      code: 'ACCOUNT_UNAVAILABLE',
    } satisfies Partial<WhatsAppDispatchError>);
  });

  it('rejects missing, rejected, or cross-account templates outside the window', async () => {
    const input = {
      organizationId,
      account,
      recipient: '+34600123456',
      body: 'Hola',
      windowExpiresAt: '2026-08-30T11:59:59.000Z',
      idempotencyKey: 'template-2',
      now,
    };
    await expect(dispatchWhatsAppMessage(provider, input)).rejects.toMatchObject({
      code: 'MESSAGE_WINDOW_EXPIRED',
    } satisfies Partial<WhatsAppDispatchError>);
    await expect(
      dispatchWhatsAppMessage(provider, {
        ...input,
        template: {
          id: 'template-2',
          organizationId,
          accountId: 'other-account',
          externalTemplateId: 'blocked',
          status: 'rejected' as const,
          parameterNames: [],
        },
      }),
    ).rejects.toMatchObject({
      code: 'TEMPLATE_FORBIDDEN',
    } satisfies Partial<WhatsAppDispatchError>);
  });
});
