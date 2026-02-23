# DOMAIN MODEL
### [APP_NAME] — Version 1.0
### Data Shapes, Store Schema, and Mock Contracts

---

## CORE ENTITIES

> Define your app's entities here. Each entity should include:
> - TypeScript type definition
> - Description of each field
> - Relationships to other entities

### Example Entity Template
```typescript
type EntityName = {
  id: string                    // Unique identifier
  // ... fields
  createdAt: number             // Unix timestamp
}
```

---

## ZUSTAND STORE ROOT

> Define your store slices here. Follow the pattern in ENGINEERING_STANDARDS.md.
> Every app starts with auth and ui slices from the seed kit.

---

## DERIVED SELECTORS

> Define selectors that compute derived data from store state.

---

## MOCK HELPERS

> Define mock data generation for your domain.
> All randomness must use lib/mock/engine.ts — never Math.random().

---

## SEED DATA

> Define the initial state for development and testing.
> This populates the store when a user first opens the app.
