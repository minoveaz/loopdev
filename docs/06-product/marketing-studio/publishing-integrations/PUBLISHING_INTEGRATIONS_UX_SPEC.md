---
title: Publishing and Integrations UX Specification
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/149
---

# Publishing and Integrations UX Specification

This deferred module exposes authorized channel connections, delivery status and publication history.
It uses `SuiteCanvas` `data`, `record` and `split` recipes inside the mandatory Platform Shell. It
does not create channel content, own credentials in the browser or provide a second suite navigation.

Admins manage authorized connections; Marketers request delivery of approved content; Viewers inspect
authorized evidence. Views cover `loading`, `empty`, `error`, `forbidden`, `queued`, `delivered` and
`failed`. Mobile prioritizes connection and delivery records over dense configuration panels.

Activation gate: one provider, OAuth/server-side secret ownership, consent/policy, idempotency,
retries, webhook verification and rollback must be approved before implementation.

## Views and journeys

Proposed routes are `/marketing-studio/publishing/connections` (`data`),
`/marketing-studio/publishing/publications` (`data`) and
`/marketing-studio/publishing/publications/:publicationId` (`record`). Admins manage connections;
Marketers request delivery of approved content; Reviewers and Viewers see authorized evidence only.
Required request fields are approved content version, connection and idempotency key. Schedule,
campaign item and locale remain optional until an approved provider contract requires them. Negative
journeys cover consent denial, unavailable connection, duplicate request, failed delivery, unverified
callback and revoked access. Product Owner and Tech Lead approve provider UX before activation.
