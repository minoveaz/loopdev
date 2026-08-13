# Component patterns

Use this catalog to classify a request before creating a new component.

| Pattern | Prefer first | Typical states |
| --- | --- | --- |
| Display | existing card, text, badge, status primitive | loading, empty |
| Input | existing field, select, button, dialog | error, disabled, loading |
| Data | existing responsive table, filters, pagination | loading, empty, error |
| Feedback | existing empty, loading, error, forbidden state | retry, dismiss |
| Detail | compose header, tabs, actions, and content primitives | loading, forbidden, error |
| Quick actions | compose `Button`/`IconButton` from an action contract | permission, disabled, pending |
| Activity | define a stable read-model before visual promotion | empty, pagination, audit |
| Shell/workspace | use shared shell contracts and modes | responsive, keyboard, overlay |

These patterns are decision aids, not permission to create a new abstraction.
The duplicate review and registry evidence remain mandatory.
