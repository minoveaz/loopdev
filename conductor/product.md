# Product Guide: loop.dev

## Vision
loop.dev is a next-generation web and application development platform powered by generative AI. It serves as an industrial-grade SaaS chassis to automate complex business processes, starting with the Marketing Studio Suite and expanding to CRM and other modular suites for digital agencies and enterprise teams.

## Target Users
- **Digital Agencies:** Teams requiring high-performance design systems and AI automation to scale their delivery.
- **Enterprise Teams:** Large organizations looking to modernize their technical stack with AI-assisted workflows and robust governance.
- **In-house SaaS Projects:** Internal automation efforts that need a modular, scalable foundation.

## Core Goals
- **Lifecycle Automation:** Fully automate the transition from design to code and documentation using proprietary generative AI patterns.
- **Industrial-Grade Foundation:** Provide a standardized "spine" for security, tenancy, and data management that supports multiple industrial suites.
- **Process Acceleration:** Drastically reduce time-to-market for business tools through reusable components and pre-validated architectural patterns.

## Roadmap
1. **Marketing Studio Suite:** The initial focus, automating marketing processes and brand governance.
2. **CRM Suite:** Advanced relationship management and business intelligence for companies.
3. **Modular Expansion:** Successive industrial suites (Financial Ops, HR, etc.) built on the shared loop.dev core.

## Core Features
- **Generative AI Engine:** Deeply integrated engine for content, design tokens, and code synchronization.
- **Unified OS Launchpad:** A central orchestrator for navigating and managing different industrial suites.
- **Multi-Tenant Infrastructure:** Advanced RBAC and tenant isolation protocols for enterprise scalability.
- **Cross-Platform Consistency:** A design system that ensures identical branding and interaction patterns across every suite and process.

## The "Lab" (mockv2)
- **Purpose:** A dedicated staging environment (`mockv2`) for UI/UX experimentation.
- **Workflow:** Designs provided by the UI/UX team are implemented and iterated here first.
- **Promotion:** Only validated components and patterns are promoted from the Lab to the production codebase (`loopdev-os` and `@loopdev/ui`).

## Architectural Guidelines
- **Mirror Architecture:** Maintaining a strict separation between Suite Level (`AppShell`) and Module Level (`ModuleWorkspace`) components.
- **Zero Hardcoding:** All visual properties must use semantic tokens (`bg-shell-canvas`, `surface-elevated`) defined in the Design System.
- **Industrial Governance:** All new components must pass through a rigorous certification process (DoD, DoR, Testing) before adoption.

## Unique Value Proposition
- **Deep AI-Design Integration:** Natively linking design tokens to AI output for automated UI scaling.
- **Live Documentation:** Technical and product docs that live within the code, ensuring they are always current.
- **Cross-Platform Governance:** Ensuring that every automation process feels like part of a single, coherent brand ecosystem.