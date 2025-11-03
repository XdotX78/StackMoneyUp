# 🧪 Testing Documentation

**Last Updated:** January 2025

This directory contains testing setup and documentation for StackMoneyUp.

---

## Test Setup

### Tools Used

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - DOM matchers
- **jsdom** - DOM environment for tests

### Installation

All testing dependencies are already installed. If you need to reinstall:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

---

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Watch mode (default)
```bash
npm test
# Tests run automatically on file changes
```

---

## Test Structure

### Unit Tests

Located alongside source files with `.test.ts` or `.spec.ts` extension:

- `src/lib/utils.test.ts` - Utility function tests
- `src/lib/auth.test.ts` - Auth function tests

### Test Files

- `tests/setup.ts` - Test configuration and mocks
- `vitest.config.ts` - Vitest configuration

---

## Writing Tests

### Example Unit Test

```typescript
import { describe, it, expect } from 'vitest'
import { calculateReadTime } from '@/lib/utils'

describe('calculateReadTime', () => {
  it('should calculate reading time correctly', () => {
    const text = 'word '.repeat(200) // 200 words
    expect(calculateReadTime(text)).toBe(1)
  })
})
```

### Example Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui'

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

---

## Test Coverage

Current coverage:
- ✅ Utility functions (`utils.ts`)
- ✅ Auth utilities (`auth.ts` - pure functions)
- ⏳ Component tests (coming soon)
- ⏳ Integration tests (coming soon)

---

## Mocks

### Supabase Client

The Supabase client is automatically mocked in `tests/setup.ts`. All Supabase operations return mock data.

### Next.js

Next.js specific features are mocked:
- `next/navigation` - Router hooks
- `next/image` - Image component

---

## Best Practices

1. **Test pure functions first** - Easy to test, high confidence
2. **Test edge cases** - Empty strings, null values, invalid inputs
3. **Test user-facing behavior** - What users see, not implementation details
4. **Keep tests simple** - One assertion per test when possible
5. **Use descriptive test names** - "should do X when Y" format

---

## Next Steps

1. Add more unit tests for utility functions
2. Add component tests for UI components
3. Add integration tests for auth flow
4. Add E2E tests with Playwright

---

## Troubleshooting

### Tests fail with "Missing Supabase environment variables"

This is normal - Supabase is mocked. If you see this error, check that mocks are set up correctly in `tests/setup.ts`.

### Tests are slow

- Use `vitest run` instead of watch mode for CI
- Exclude unnecessary files in `vitest.config.ts`

### Can't find module errors

- Check path aliases in `vitest.config.ts`
- Ensure `@/` alias points to `./src`

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

