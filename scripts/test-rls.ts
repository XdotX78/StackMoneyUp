/**
 * RLS Testing Script
 * 
 * This script tests Row Level Security policies in Supabase
 * Run with: npx tsx scripts/test-rls.ts
 * 
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * - Have test accounts ready (admin, editor, regular user)
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
try {
  const envPath = join(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  // .env.local might not exist, that's okay if vars are set in environment
  console.warn('⚠️  Could not load .env.local, using environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

async function test(name: string, testFn: () => Promise<boolean>, expectedToPass: boolean = true): Promise<void> {
  try {
    const passed = await testFn();
    const success = passed === expectedToPass;
    results.push({
      name,
      passed: success,
      message: success ? '✅ Passed' : `❌ Failed (expected ${expectedToPass ? 'pass' : 'fail'})`,
    });
  } catch (error: unknown) {
    results.push({
      name,
      passed: !expectedToPass, // If we expect failure, error is success
      message: `❌ Error: ${error.message}`,
    });
  }
}

async function runTests() {
  console.log('🔒 Starting RLS Policy Tests\n');
  console.log('=' .repeat(50));

  // Test 1: Unauthenticated - Can read published posts
  await test(
    'Unauthenticated: Can read published posts',
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .limit(1);
      
      return !error && data !== null;
    },
    true
  );

  // Test 2: Unauthenticated - Cannot read draft posts
  await test(
    'Unauthenticated: Cannot read draft posts',
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', false)
        .limit(1);
      
      // Should fail or return empty
      return error !== null || (data !== null && data.length === 0);
    },
    true
  );

  // Test 3: Unauthenticated - Cannot create posts
  await test(
    'Unauthenticated: Cannot create posts',
    async () => {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          slug: 'test-rls-post',
          title_en: 'Test',
          title_it: 'Test',
          excerpt_en: 'Test',
          excerpt_it: 'Test',
          content_en: 'Test',
          content_it: 'Test',
          category: 'general',
        });
      
      // Should fail
      return error !== null;
    },
    true
  );

  // Test 4: Unauthenticated - Can read tags
  await test(
    'Unauthenticated: Can read tags',
    async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .limit(1);
      
      return !error && data !== null;
    },
    true
  );

  // Test 5: Unauthenticated - Cannot create tags
  await test(
    'Unauthenticated: Cannot create tags',
    async () => {
      const { error } = await supabase
        .from('tags')
        .insert({
          name: 'test-rls-tag',
          slug: 'test-rls-tag',
        });
      
      // Should fail
      return error !== null;
    },
    true
  );

  // Test 6: Unauthenticated - Cannot access profiles
  await test(
    'Unauthenticated: Cannot read profiles',
    async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      // Should fail or return empty
      return error !== null || (data !== null && data.length === 0);
    },
    true
  );

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:\n');

  let passedCount = 0;
  let failedCount = 0;

  results.forEach((result) => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
    if (!result.passed) {
      console.log(`   ${result.message}`);
      failedCount++;
    } else {
      passedCount++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📊 Total: ${results.length}`);

  if (failedCount > 0) {
    console.log('\n⚠️  Some tests failed. Please review RLS policies.');
    process.exit(1);
  } else {
    console.log('\n🎉 All RLS tests passed!');
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});

