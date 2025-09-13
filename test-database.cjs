const supabase = require('./config/supabase.cjs');

async function testDatabase() {
  console.log('Testing database connection and schema...');
  
  try {
    // Test 1: Check if users table exists and has mcp_user_id column
    console.log('1. Testing users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('Users table error:', usersError);
      return;
    }
    
    console.log('✓ Users table accessible');
    
    // Test 2: Check if lottery_records table exists
    console.log('2. Testing lottery_records table...');
    const { data: lotteriesData, error: lotteriesError } = await supabase
      .from('lottery_records')
      .select('*')
      .limit(1);
    
    if (lotteriesError) {
      console.error('Lottery records table error:', lotteriesError);
      return;
    }
    
    console.log('✓ Lottery records table accessible');
    
    // Test 3: Try to create a test user
    console.log('3. Testing user creation...');
    const testUserId = 'mcp_test_' + Date.now();
    const { data: newUserData, error: createError } = await supabase
      .from('users')
      .insert([{
        mcp_user_id: testUserId,
        username: 'TestUser',
        email: `${testUserId}@test.com`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUserId}`
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('User creation error:', createError);
      return;
    }
    
    console.log('✓ User creation successful:', newUserData.mcp_user_id);
    
    // Test 4: Try to create a lottery record
    console.log('4. Testing lottery record creation...');
    const { data: newLotteryData, error: lotteryError } = await supabase
      .from('lottery_records')
      .insert([{
        user_id: newUserData.id,
        lottery_id: 'test_lottery_' + Date.now(),
        status: 'active'
      }])
      .select()
      .single();
    
    if (lotteryError) {
      console.error('Lottery creation error:', lotteryError);
      return;
    }
    
    console.log('✓ Lottery record creation successful:', newLotteryData.lottery_id);
    
    // Test 5: Test querying with joins
    console.log('5. Testing join query...');
    const { data: joinData, error: joinError } = await supabase
      .from('lottery_records')
      .select(`
        *,
        users (
          mcp_user_id,
          username
        )
      `)
      .eq('lottery_id', newLotteryData.lottery_id)
      .single();
    
    if (joinError) {
      console.error('Join query error:', joinError);
      return;
    }
    
    console.log('✓ Join query successful');
    
    console.log('\n🎉 All database tests passed!');
    console.log('Database schema is properly configured.');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();