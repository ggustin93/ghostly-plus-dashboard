# E2E Tests for Ghostly+

> The complete reference is in the project's Memory Bank.

## MVP Structure

```
tests/
├── e2e/specs/     # Playwright E2E tests
│   └── auth.spec.ts  # Authentication test
└── supabase-auth-test.sh  # Supabase test script
```

## Commands

```bash
# Install dependencies
npm run test:install

# Run tests
npm run test:e2e

# Tests with UI mode
npm run test:e2e:ui

# View test reports
npm run test:e2e:report
```

## Next Steps

1. Dashboard functionality tests
2. Supabase integration tests
3. Patient/therapist interface tests

Approach: Keep tests simple and focused on critical user paths.