# App Seed Kit

A battle-tested template repository for building demo apps with Next.js, TypeScript, Tailwind CSS, and Zustand.

Extracted from a production-quality demo app. Every convention, rule, pattern, and token value has been validated in a real build.

## Quick Start

1. **Fork** this repository (or use it as a template) to create your new project
2. Open the project in **Claude Code** and enter **plan mode**
3. Describe the application you want to build — for example:

   > Create an app called SendMoney. It lets users send money to anyone by email.

4. Claude will bootstrap the project automatically:
   - Moves the seed kit contents to the repository root
   - Replaces all template placeholders with your app's name and description
   - Cleans up the template directory
   - Installs dependencies and verifies everything works

5. Once bootstrapped, continue using **plan mode** to design features. Claude acts as a product collaborator — helping you clarify intent, define behavior, and produce structured product briefs before implementation.

## Template Placeholders

These are replaced automatically during bootstrap:

| Placeholder | What it becomes | Example |
|---|---|---|
| `[APP_NAME]` | Your app's display name | `SendMoney` |
| `[app]` | Lowercase slug for storage keys and cookies | `sendmoney` |
| `[one-line description]` | Short product description | `Send money to anyone by email` |

## What's Included

### Foundation
- Next.js App Router with TypeScript strict mode
- Complete design token system (tokens.css + Tailwind config)
- Four base UI components: Button, Card, Input, Badge
- Layout components: Sidebar (desktop) + BottomNav (mobile)
- Zustand store with auth + UI slices and localStorage persistence
- Mock engine with seeded PRNG for deterministic behavior
- Currency formatting utilities
- Route-guarding middleware

### Documentation
- `docs/ARCHITECTURE.md` — component layers and dependency rules
- `docs/ENGINEERING_STANDARDS.md` — code quality standards
- `docs/DESIGN_TOKENS.md` — the visual token system
- `docs/STYLE_GUIDE.md` — visual identity
- `docs/MOTION_SPEC.md` — animation system
- `docs/UX_GUIDELINES.md` — user experience principles
- `docs/UX_ENFORCEMENT_RULES.md` — machine-enforceable UX rules
- `docs/TESTING_STRATEGY.md` — test requirements
- `docs/DOMAIN_MODEL.md` — template for your app's data model

### Claude Code Integration
- `CLAUDE.md` — main instructions file (includes plan mode guidance and development rules)
- `.claude/agents/planner.md` — produces implementation plans
- `.claude/agents/code-reviewer.md` — audits engineering quality
- `.claude/agents/ux-reviewer.md` — audits UX compliance
- `.claude/agents/test-writer.md` — writes comprehensive tests

### Testing
- Jest configured with TypeScript and path aliases
- Playwright configured for E2E tests
- Currency formatting tests included as examples
- Token lint script (no raw hex values in components)

## Workflow After Bootstrap

1. **Plan mode** — describe a feature, Claude helps clarify and produces a product brief
2. **Implementation** — Claude uses the planner agent, builds the feature, writes tests
3. **Review** — code-reviewer and ux-reviewer agents audit the work
4. **Iterate** — return to plan mode to refine or add more features

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check
npm test             # Jest unit tests
npm run e2e          # Playwright E2E tests
npm run lint         # ESLint
npm run lint:tokens  # Check for raw hex values
npm run quality      # Run all checks
```

## Architecture

```
pages → domain components → UI components
pages → domain components → store → lib
```

Dependencies flow one direction only. See `docs/ARCHITECTURE.md` for details.
