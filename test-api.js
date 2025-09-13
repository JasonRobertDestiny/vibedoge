#!/usr/bin/env node

// 简单的API测试脚本
const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 开始测试 Vibe Coding 抽奖 API...\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await fetch(`${API_BASE}/lottery/health`);
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查:', healthData.message);
    console.log('   数据库状态:', healthData.database?.success ? '正常' : '异常');
    console.log('');

    // 测试生成用户ID
    console.log('2. 测试生成用户ID...');
    const userResponse = await fetch(`${API_BASE}/lottery/generate-user-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const userData = await userResponse.json();
    if (userData.success) {
      console.log('✅ 用户ID生成成功:', userData.data.userId);
      console.log('   用户名:', userData.data.username);
      console.log('   数据库用户ID:', userData.data.databaseUserId);
      
      const userId = userData.data.userId;
      
      // 测试生成抽奖ID
      console.log('\n3. 测试生成抽奖ID...');
      const lotteryResponse = await fetch(`${API_BASE}/lottery/generate-lottery-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const lotteryData = await lotteryResponse.json();
      if (lotteryData.success) {
        console.log('✅ 抽奖ID生成成功:', lotteryData.data.lotteryId);
        
        const lotteryId = lotteryData.data.lotteryId;
        
        // 测试获取用户抽奖记录
        console.log('\n4. 测试获取用户抽奖记录...');
        const recordsResponse = await fetch(`${API_BASE}/lottery/user-lotteries/${userId}`);
        const recordsData = await recordsResponse.json();
        if (recordsData.success) {
          console.log('✅ 用户抽奖记录获取成功');
          console.log('   记录数量:', recordsData.data.total);
          recordsData.data.lotteries.forEach((record, index) => {
            console.log(`   ${index + 1}. ${record.lotteryId} - ${record.status}`);
          });
        } else {
          console.log('❌ 获取用户抽奖记录失败:', recordsData.message);
        }
        
        // 测试获取抽奖详情
        console.log('\n5. 测试获取抽奖详情...');
        const infoResponse = await fetch(`${API_BASE}/lottery/info/${lotteryId}`);
        const infoData = await infoResponse.json();
        if (infoData.success) {
          console.log('✅ 抽奖详情获取成功');
          console.log('   抽奖ID:', infoData.data.lotteryId);
          console.log('   用户名:', infoData.data.username);
          console.log('   状态:', infoData.data.status);
        } else {
          console.log('❌ 获取抽奖详情失败:', infoData.message);
        }
        
        // 测试执行抽奖
        console.log('\n6. 测试执行抽奖...');
        const drawResponse = await fetch(`${API_BASE}/lottery/draw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lotteryId, userId }),
        });
        const drawData = await drawResponse.json();
        if (drawData.success) {
          console.log('✅ 抽奖执行成功!');
          console.log('   奖品:', drawData.data.prize.name);
          console.log('   价值:', drawData.data.prize.value);
          console.log('   稀有度:', drawData.data.prize.rarity);
        } else {
          console.log('❌ 抽奖执行失败:', drawData.message);
        }
        
        // 测试用户统计
        console.log('\n7. 测试用户统计...');
        const userStatsResponse = await fetch(`${API_BASE}/lottery/user-stats/${userId}`);
        const userStatsData = await userStatsResponse.json();
        if (userStatsData.success) {
          console.log('✅ 用户统计获取成功');
          const stats = userStatsData.data.stats;
          console.log('   总抽奖次数:', stats.total);
          console.log('   活跃抽奖:', stats.active);
          console.log('   完成抽奖:', stats.completed);
        } else {
          console.log('❌ 获取用户统计失败:', userStatsData.message);
        }
        
      } else {
        console.log('❌ 抽奖ID生成失败:', lotteryData.message);
      }
    } else {
      console.log('❌ 用户ID生成失败:', userData.message);
    }
    
    // 测试全局统计
    console.log('\n8. 测试全局统计...');
    const globalStatsResponse = await fetch(`${API_BASE}/lottery/global-stats`);
    const globalStatsData = await globalStatsResponse.json();
    if (globalStatsData.success) {
      console.log('✅ 全局统计获取成功');
      const stats = globalStatsData.data;
      console.log('   总用户数:', stats.totalUsers);
      console.log('   总抽奖数:', stats.totalLotteries);
      console.log('   活跃抽奖:', stats.activeLotteries);
      console.log('   完成抽奖:', stats.completedLotteries);
    } else {
      console.log('❌ 获取全局统计失败:', globalStatsData.message);
    }
    
    console.log('\n🎉 API 测试完成！');
    
  } catch (error) {
    console.error('❌ API 测试失败:', error.message);
    console.log('   请确保服务器正在运行在 http://localhost:3001');
  }
}

testAPI();