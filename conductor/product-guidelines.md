# Product Guidelines: loop.dev

## Brand Voice & Communication
- **Technical Authority:** The platform speaks with the precision of an engineer. Use direct, professional language ("Deploying", "Syncing", "Inert") to convey reliability and control.
- **AI-Enhanced Clarity:** Highlight intelligent capabilities subtly. Suggestions should feel like a natural extension of the user's workflow, not an interruption.
- **Minimalist & Functional:** Avoid fluff. Every piece of text must serve a clear purpose, reducing cognitive load for the user.

## Visual Identity & Interface Principles
- **Industrial Luxury:** A clean, precision-engineered aesthetic characterized by deep dark modes, technical typography (JetBrains Mono for data), and subtle, high-performance animations.
- **Zero Hardcoding:** Strict adherence to the semantic token system (v3.9+). Colors and values must never be hardcoded; they must derive from the theme-aware design tokens (e.g., `bg-shell-canvas`).
- **Cognitive Security:** Utilize visual patterns like "Inert Mode" (desaturation/opacity reduction) and high-contrast surfaces to guide user focus and prevent errors during complex operations.
- **Industrial Density:** Design for data-rich environments using precision typography (10px technical labels) and 0.5px technical borders to maximize information density without clutter.

## Development & Promotion Workflow
- **Lab-First Innovation:** All new UI/UX concepts must be prototyped and iterated in the `mockv2` ("Lab") environment first.
- **Evidence-Based Promotion:** Only components that demonstrate usability and visual excellence in the Lab are eligible for promotion to the production design system (`@loopdev/ui`).
- **Contract-First Engineering:** Promotion requires a finalized `userHistories.md` (DoR) and `types.ts` contract. No coding begins without a clear definition of what is being built.
- **Quality Shield:** Production deployment is gated by dual certification (Frontend + Infrastructure) and automated checks (Vitest, Axe-core, Chromatic).

## Documentation & Maintenance Strategy
- **Code-as-Docs:** Documentation lives with the code. JSDoc, `README.md`, and `userHistories.md` are integral parts of the component source, ensuring they never drift from reality.
- **Traceable Evolution:** Maintain a rigorous `ENGINEERING_LOG.md` to track every major architectural decision and milestone. The "Why" is as important as the "What".
- **Automated Registry:** The `COMPONENT_REGISTRY.json` is the machine-readable Single Source of Truth (SSOT) for component health, versioning, and capabilities.
- **Architecture Decision Records (ADRs):** *Proposed Adoption:* Formalize major architectural choices into a dedicated `docs/adr/` directory to create an immutable history of the system's design evolution.
