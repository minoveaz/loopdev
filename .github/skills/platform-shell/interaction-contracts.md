# Interaction Contracts

## Navigation Modes

### Expanded

Labels and group headings are visible. The sidebar is part of the normal layout flow and uses the expanded width.

### Rail

The sidebar is compact and shows icons. Labels are hidden from the visual flow but remain available through accessible names and the rail tooltip. The tooltip must not change the rail width or move center content.

### Expand on Hover

The resting state is rail. Entering the sidebar expands it into a true expanded layout. The expanded surface overlays center content instead of widening the layout host. Leaving the surface returns it to rail after a short tolerance window.

## Footer Dropdown

The footer control opens a Radix dropdown through a Portal. Therefore:

- Pointer movement from the trigger to the menu must not collapse the sidebar.
- Opening the menu locks the expanded visual state.
- Closing the menu may collapse only when the pointer is outside the sidebar and footer.
- A small close delay is intentional to cover the gap between the sidebar DOM and Portal content.
- The trigger must expose `aria-haspopup="menu"` and an accessible label.

Do not infer portal ownership from `mouseenter`/`mouseleave` alone. Track the sidebar/footer/menu relationship explicitly.

## Tooltips

Rail navigation uses the popover-style tooltip variant:

- Show the module label only.
- Use a compact surface, subtle border, and shadow.
- Do not include terminal brackets or internal status metadata.
- Position it to the right of the rail item.
- Keep the tooltip in a Portal so it cannot affect layout.

Technical diagnostic tooltips elsewhere may retain the terminal-style variant.

## Visual Invariants

- Rail width: `w-16`.
- Expanded width: `w-64`.
- Hover expansion is layered above center content with an appropriate stacking context.
- The center content keeps the same x-coordinate before and during hover expansion.
- Active, hover, disabled, and coming-soon states remain distinguishable.
- The footer does not cover `Suite Settings` or the last navigation item.

## Anti-patterns

- Do not use `:has` to synchronize host width.
- Do not use an overlay label when the requested behavior is true expanded layout.
- Do not make a Portal dropdown responsible for layout dimensions.
- Do not collapse immediately on the first leave event.
- Do not add responsive behavior to the desktop interaction contract.
