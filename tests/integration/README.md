# Integration Tests

Integration tests verify that multiple parts of the system work together correctly.

## Setup

1. **Environment Variables**

Create a `.env.test.local` file (or use your `.env.local`):

```env
# Supabase (use test/dev environment)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
```

2. **Test Database**

⚠️ **Important:** Use a separate test database or Supabase project, not production!

## Running Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration auth.test.ts

# Watch mode
npm run test:integration -- --watch
```

## Test Files

- **`auth.test.ts`** - Authentication flow (signup, login, logout, session)
- **`blog-crud.test.ts`** - Blog post CRUD operations
- **`comments.test.ts`** - Comments system (create, reply, edit, delete)
- **`permissions.test.ts`** - RLS policies and role-based access

## Test Data

Integration tests create and clean up their own test data:
- Test users are created with timestamps in email
- Test posts/comments are deleted after each test
- Cleanup happens in `afterAll()` hooks

## Troubleshooting

### Tests Fail with "Unauthorized"
- Check that TEST_USER_EMAIL/PASSWORD are correct
- Verify user exists in your test database
- Check RLS policies allow test operations

### Tests Timeout
- Increase timeout in test: `test('...', async () => {}, 20000)`
- Check network connection to Supabase
- Verify Supabase project is running

### Database Conflicts
- Tests run sequentially to avoid conflicts
- Each test uses unique slugs/emails with timestamps
- Cleanup should remove all test data

## Best Practices

1. **Always cleanup test data** in `afterAll()`
2. **Use timestamps** in test data (emails, slugs)
3. **Don't test on production** database
4. **Keep tests isolated** - each test should work independently
5. **Mock external services** when possible

