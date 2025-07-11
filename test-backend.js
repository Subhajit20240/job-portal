// Test script to verify backend integration
// Run this in your browser console after starting the dev server

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test functions
async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
}

async function testCompanies() {
  console.log('🏢 Testing companies table...');
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Companies test failed:', error);
      return false;
    }
    
    console.log(`✅ Found ${data.length} companies:`, data);
    return true;
  } catch (err) {
    console.error('❌ Companies error:', err);
    return false;
  }
}

async function testJobs() {
  console.log('💼 Testing jobs table...');
  
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, company:companies(name)')
      .limit(5);
    
    if (error) {
      console.error('❌ Jobs test failed:', error);
      return false;
    }
    
    console.log(`✅ Found ${data.length} jobs:`, data);
    return true;
  } catch (err) {
    console.error('❌ Jobs error:', err);
    return false;
  }
}

async function testStorage() {
  console.log('📁 Testing storage buckets...');
  
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Storage test failed:', error);
      return false;
    }
    
    const bucketNames = data.map(bucket => bucket.name);
    console.log('✅ Available buckets:', bucketNames);
    
    const requiredBuckets = ['company-logo', 'resumes'];
    const missingBuckets = requiredBuckets.filter(name => !bucketNames.includes(name));
    
    if (missingBuckets.length > 0) {
      console.warn('⚠️ Missing buckets:', missingBuckets);
      return false;
    }
    
    console.log('✅ All required buckets exist!');
    return true;
  } catch (err) {
    console.error('❌ Storage error:', err);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting backend integration tests...\n');
  
  const tests = [
    { name: 'Connection', fn: testConnection },
    { name: 'Companies', fn: testCompanies },
    { name: 'Jobs', fn: testJobs },
    { name: 'Storage', fn: testStorage }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
    console.log(''); // Add spacing
  }
  
  console.log('📊 Test Results:');
  console.log('================');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.name}`);
  });
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 Overall: ${passedCount}/${totalCount} tests passed`);
  
  if (passedCount === totalCount) {
    console.log('🎉 All tests passed! Your backend is ready to use.');
  } else {
    console.log('⚠️ Some tests failed. Check the setup instructions.');
  }
}

// Export for use in browser console
window.testBackend = runAllTests;
window.testConnection = testConnection;
window.testCompanies = testCompanies;
window.testJobs = testJobs;
window.testStorage = testStorage;

console.log('🔧 Backend test functions loaded!');
console.log('Run testBackend() to test everything, or individual test functions.');