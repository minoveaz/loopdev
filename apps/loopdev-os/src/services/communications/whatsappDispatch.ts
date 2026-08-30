import type { MessagingProvider } from '@loopdev/contracts';

type DispatchAccount = {
  id: string;
  organizationId: string;
  status: 'pending' | 'connected' | 'disconnected' | 'error';
  outboundEnabled: boolean;
};

type DispatchTemplate = {
  id: string;
  organizationId: string;
  accountId: string;
  externalTemplateId: string;
  status: 'draft' | 'approved' | 'rejected' | 'archived';
  parameterNames: string[];
};

type DispatchInput = {
  organizationId: string;
  account: DispatchAccount;
  recipient: string;
  body?: string | null;
  template?: DispatchTemplate | null;
  templateParameters?: Record<string, string>;
  windowExpiresAt: string | null;
  idempotencyKey: string;
  now?: Date;
};

export type WhatsAppDispatchResult = {
  providerMessageId: string;
  mode: 'text' | 'template';
};

export class WhatsAppDispatchError extends Error {
  constructor(
    readonly code: 'ACCOUNT_UNAVAILABLE' | 'OUTBOUND_PAUSED' | 'MESSAGE_WINDOW_EXPIRED' | 'TEMPLATE_REQUIRED' | 'TEMPLATE_FORBIDDEN' | 'VALIDATION_ERROR',
    message: string,
  ) {
    super(message);
  }
}

export function canSendWhatsAppFreeText(windowExpiresAt: string | null, now = new Date()): boolean {
  return Boolean(windowExpiresAt && Date.parse(windowExpiresAt) > now.getTime());
}

export async function dispatchWhatsAppMessage(
  provider: MessagingProvider,
  input: DispatchInput,
): Promise<WhatsAppDispatchResult> {
  assertAccountCanSend(input.organizationId, input.account);
  const parameters = input.templateParameters ?? {};

  if (input.body?.trim() && canSendWhatsAppFreeText(input.windowExpiresAt, input.now)) {
    const result = await provider.sendText({
      accountId: input.account.id,
      recipient: input.recipient,
      body: input.body.trim(),
      idempotencyKey: input.idempotencyKey,
    });
    return { providerMessageId: result.providerMessageId, mode: 'text' };
  }

  if (!input.template) {
    throw new WhatsAppDispatchError(
      input.body?.trim() ? 'MESSAGE_WINDOW_EXPIRED' : 'TEMPLATE_REQUIRED',
      input.body?.trim()
        ? 'WhatsApp conversation window has expired; an approved template is required'
        : 'An approved WhatsApp template is required',
    );
  }

  assertTemplateCanSend(input.organizationId, input.account.id, input.template, parameters);
  const result = await provider.sendTemplate({
    accountId: input.account.id,
    recipient: input.recipient,
    templateId: input.template.externalTemplateId,
    parameterNames: input.template.parameterNames,
    parameters,
    idempotencyKey: input.idempotencyKey,
  });
  return { providerMessageId: result.providerMessageId, mode: 'template' };
}

function assertAccountCanSend(organizationId: string, account: DispatchAccount) {
  if (account.organizationId !== organizationId) {
    throw new WhatsAppDispatchError('ACCOUNT_UNAVAILABLE', 'WhatsApp account does not belong to the organization');
  }
  if (account.status !== 'connected') {
    throw new WhatsAppDispatchError('ACCOUNT_UNAVAILABLE', 'WhatsApp account is not connected');
  }
  if (!account.outboundEnabled) {
    throw new WhatsAppDispatchError('OUTBOUND_PAUSED', 'WhatsApp outbound is paused for this account');
  }
}

function assertTemplateCanSend(
  organizationId: string,
  accountId: string,
  template: DispatchTemplate,
  parameters: Record<string, string>,
) {
  if (template.organizationId !== organizationId || template.accountId !== accountId || template.status !== 'approved') {
    throw new WhatsAppDispatchError('TEMPLATE_FORBIDDEN', 'WhatsApp template is not approved for this account');
  }
  const parameterNames = new Set(template.parameterNames);
  if (parameterNames.size !== template.parameterNames.length || Object.keys(parameters).length !== parameterNames.size || Object.keys(parameters).some((name) => !parameterNames.has(name))) {
    throw new WhatsAppDispatchError('VALIDATION_ERROR', 'WhatsApp template parameters do not match the approved template');
  }
}