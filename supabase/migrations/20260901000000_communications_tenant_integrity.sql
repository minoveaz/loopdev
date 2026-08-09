-- Enforce organization ownership across CRM and Communications relationships.
-- Additive: existing single-column foreign keys remain valid.

alter table public.crm_contacts
  add constraint crm_contacts_id_organization_key unique (id, organization_id);

alter table public.communication_accounts
  add constraint communication_accounts_id_organization_key unique (id, organization_id);

alter table public.communication_channels
  add constraint communication_channels_id_organization_key unique (id, organization_id);

alter table public.communication_conversations
  add constraint communication_conversations_id_organization_key unique (id, organization_id);

alter table public.communication_messages
  add constraint communication_messages_id_organization_key unique (id, organization_id);

alter table public.communication_channels
  add constraint communication_channels_account_org_fkey
    foreign key (account_id, organization_id)
    references public.communication_accounts(id, organization_id),
  add constraint communication_channels_contact_org_fkey
    foreign key (contact_id, organization_id)
    references public.crm_contacts(id, organization_id);

alter table public.communication_conversations
  add constraint communication_conversations_contact_org_fkey
    foreign key (contact_id, organization_id)
    references public.crm_contacts(id, organization_id),
  add constraint communication_conversations_channel_org_fkey
    foreign key (channel_id, organization_id)
    references public.communication_channels(id, organization_id),
  add constraint communication_conversations_brand_org_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id),
  add constraint communication_conversations_workspace_org_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id);

alter table public.communication_messages
  add constraint communication_messages_conversation_org_fkey
    foreign key (conversation_id, organization_id)
    references public.communication_conversations(id, organization_id);

alter table public.communication_message_statuses
  add constraint communication_message_statuses_message_org_fkey
    foreign key (message_id, organization_id)
    references public.communication_messages(id, organization_id);

alter table public.communication_internal_notes
  add constraint communication_internal_notes_conversation_org_fkey
    foreign key (conversation_id, organization_id)
    references public.communication_conversations(id, organization_id);

alter table public.communication_webhook_events
  add constraint communication_webhook_events_account_org_fkey
    foreign key (account_id, organization_id)
    references public.communication_accounts(id, organization_id);
