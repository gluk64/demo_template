# App Seed Kit

A template repository for scaffolding demo apps with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Zustand** — designed to be bootstrapped through **Claude Code** in plan mode.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI

## Getting Started

1. **Fork or clone** this repository to create your new project.

2. **Open the project** in Claude Code and enter **plan mode** (`/plan`).

3. **Describe the app** you want to build. For example:

   > Create an app called SendMoney. It lets users send money to anyone by email.

4. Claude will **bootstrap the project** automatically:
   - Copies the seed kit scaffold to the repository root
   - Replaces template placeholders (`[APP_NAME]`, `[app]`, `[one-line description]`) with your app's details
   - Removes the `app-seed-kit/` template directory
   - Installs dependencies and runs quality checks

5. Once bootstrapped, stay in **plan mode** to design your first feature. Claude acts as a product collaborator — helping you clarify intent, define behavior, and produce structured briefs before implementation.

## What You Get After Bootstrap

- **Full-stack foundation** — Next.js App Router, TypeScript strict mode, Tailwind with a design token system, Zustand state management with persistence
- **Pre-built components** — Button, Card, Input, Badge, Sidebar, BottomNav
- **Auth flow** — login screen, session cookies, route-guarding middleware
- **Testing setup** — Jest (unit) and Playwright (E2E) pre-configured with example tests
- **9 documentation guides** — architecture, engineering standards, design tokens, UX guidelines, testing strategy, and more (in `docs/`)
- **Claude Code agents** — planner, code reviewer, UX reviewer, and test writer (in `.claude/agents/`)

## Workflow

1. **Plan** — describe a feature in plan mode; Claude helps refine it into a product brief
2. **Build** — Claude implements the feature, following the project's architecture and standards
3. **Review** — code-reviewer and ux-reviewer agents audit the work
4. **Iterate** — return to plan mode for the next feature

## Learn More

See [`app-seed-kit/README.md`](app-seed-kit/README.md) for the full breakdown of what's included in the template.
