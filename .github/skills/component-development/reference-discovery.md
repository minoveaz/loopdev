# Reference component discovery

Use this checklist before creating or substantially changing a component.

```md
## Reference component review

- Requested component:
- Ownership layer:
- Route/category:
- Same-layer reference:
- Closest-responsibility reference:
- Implementations inspected:
- Types and hooks inspected:
- Exports inspected:
- Tests inspected:
- Registry entries inspected:
- Conventions retained:
- Contract differences:
- Evidence gap, if no suitable reference exists:
```

The review is incomplete until the implementation, public types, exports, and
tests of each selected reference have been inspected. A reference may inform
composition, but it does not authorize copying domain logic or bypassing
duplicate detection.
