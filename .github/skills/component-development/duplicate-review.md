# Duplicate review

Use this record structure in the active track whenever a new component is
proposed after duplicate detection.

```md
## Component duplicate review

- Requested name:
- Reference components reviewed:
- Normalized responsibility:
- Intended consumers:
- Owning layer:
- Registry entries searched:
- Implementations and exports searched:
- Similar candidates:
  -
- Reuse or composition attempted:
- Decision: reuse | variant | compose | create
- Rejected alternatives and reason:
- Why the public contract is materially different:
- Promotion target: suite | shared
- Evidence:
```

Creation is blocked when the candidate list is incomplete or the reason for
rejecting reuse is only a different domain noun, label, icon, color, or copy.

Common collision groups to review together:

- `*Preview`, `*DetailPanel`, and record panels;
- `*QuickActions`;
- `*AssignmentField` and `*Assignment`;
- `*ActivityItem` and `*ActivityTimeline`;
- loading, empty, error, and forbidden states;
- tables, filters, pagination, and selection controls.
