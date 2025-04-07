/**
 * 价格比较服务路由
 * 处理跨平台电商价格比较相关的API请求
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

// 模拟的电商平台API密钥
const API_KEYS = {
  JD: 'jd_mock_api_key_123456',
  TMALL: 'tmall_mock_api_key_123456',
  PINDUODUO: 'pdd_mock_api_key_123456',
  SUNING: 'suning_mock_api_key_123456',
  AMAZON: 'amazon_mock_api_key_123456',
};

// 模拟电商平台的请求基础URL
const API_BASE_URLS = {
  JD: 'https://api.jd.com/mock',
  TMALL: 'https://api.tmall.com/mock',
  PINDUODUO: 'https://api.pinduoduo.com/mock',
  SUNING: 'https://api.suning.com/mock',
  AMAZON: 'https://api.amazon.cn/mock',
};

// 平台名称映射
const PLATFORM_NAMES = {
  JD: '京东',
  TMALL: '天猫',
  PINDUODUO: '拼多多',
  SUNING: '苏宁',
  AMAZON: '亚马逊',
};

/**
 * 通过关键词搜索商品
 * @param {string} platform 平台代码
 * @param {string} keyword 搜索关键词
 * @returns {Promise<Array>} 商品列表
 */
async function searchProductByKeyword(platform, keyword) {
  // 实际项目中，这里应该调用各电商平台的实际API
  // 本示例使用模拟数据
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // 为不同平台生成不同的价格范围，模拟价格差异
  let priceBase;
  let priceVariation;
  
  switch(platform) {
    case 'JD':
      priceBase = 100;
      priceVariation = 0.1; // 价格波动10%
      break;
    case 'TMALL':
      priceBase = 105;
      priceVariation = 0.15; // 价格波动15%
      break;
    case 'PINDUODUO':
      priceBase = 85;
      priceVariation = 0.05; // 价格波动5%
      break;
    case 'SUNING':
      priceBase = 95;
      priceVariation = 0.12; // 价格波动12%
      break;
    case 'AMAZON':
      priceBase = 110;
      priceVariation = 0.08; // 价格波动8%
      break;
    default:
      priceBase = 100;
      priceVariation = 0.1;
  }
  
  // 根据关键词生成一个稳定的价格基数倍数，以便同一商品在不同平台有合理的价格差异
  const keywordSum = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const priceMultiplier = 1 + (keywordSum % 100) / 10; // 1.0到10.0之间的倍数
  
  // 生成模拟的商品数据
  const products = [];
  const count = 3 + Math.floor(Math.random() * 3); // 3-5个商品
  
  for (let i = 0; i < count; i++) {
    // 计算此商品的基础价格
    const itemPriceBase = priceBase * priceMultiplier * (1 + i * 0.2); // 同类商品价格递增
    // 添加随机波动
    const variance = (Math.random() * 2 - 1) * priceVariation; // -priceVariation到+priceVariation之间的波动
    const price = Math.round(itemPriceBase * (1 + variance) * 100) / 100;
    
    // 评分也根据平台有所不同
    let ratingBase;
    switch(platform) {
      case 'JD': ratingBase = 4.7; break;
      case 'TMALL': ratingBase = 4.8; break;
      case 'PINDUODUO': ratingBase = 4.5; break;
      case 'SUNING': ratingBase = 4.6; break;
      case 'AMAZON': ratingBase = 4.4; break;
      default: ratingBase = 4.5;
    }
    // 添加评分随机波动
    const rating = Math.min(5, Math.max(3.5, ratingBase + (Math.random() * 0.4 - 0.2)));
    
    // 销量也根据平台有所不同
    let salesBase;
    switch(platform) {
      case 'JD': salesBase = 500; break;
      case 'TMALL': salesBase = 600; break;
      case 'PINDUODUO': salesBase = 800; break;
      case 'SUNING': salesBase = 400; break;
      case 'AMAZON': salesBase = 300; break;
      default: salesBase = 500;
    }
    // 添加销量随机波动
    const sales = Math.floor(salesBase * (0.7 + Math.random() * 0.6));
    
    // 模拟商品标题：使用关键词并添加平台特定后缀
    let title = `${keyword} `;
    if (i === 0) title += "高端版";
    else if (i === 1) title += "标准版";
    else if (i === 2) title += "入门版";
    else title += `${i}代`;
    
    // 为不同平台添加特色后缀
    switch(platform) {
      case 'JD': title += " 京东自营"; break;
      case 'TMALL': title += " 官方旗舰店"; break;
      case 'PINDUODUO': title += " 超值款"; break;
      case 'SUNING': title += " 苏宁易购"; break;
      case 'AMAZON': title += " 亚马逊海外购"; break;
    }
    
    products.push({
      id: `${platform}_${Date.now()}_${i}`,
      title,
      price,
      originalPrice: Math.round(price * 1.2 * 100) / 100, // 模拟原价比当前价高20%
      platform,
      platformName: PLATFORM_NAMES[platform],
      platformUrl: API_BASE_URLS[platform].replace('/mock', ''),
      rating: parseFloat(rating.toFixed(1)),
      sales,
      imageUrl: `https://via.placeholder.com/200x200/f5f5f5/333333?text=${platform}_${keyword.replace(/\s+/g, '_')}`,
      url: `${API_BASE_URLS[platform].replace('/mock', '')}/item/${platform}_${Date.now()}_${i}`,
      inStock: Math.random() > 0.1, // 90%的概率有货
      deliveryFee: Math.random() > 0.3 ? 0 : Math.round(Math.random() * 10), // 70%概率免运费
      couponInfo: Math.random() > 0.5 ? `满${Math.floor(price*2)}减${Math.floor(price*0.1)}` : null // 50%概率有优惠券
    });
  }
  
  return products;
}

/**
 * 模拟从多个平台获取同一商品的价格数据
 * @param {string} keyword 商品关键词
 * @returns {Promise<Array>} 多平台价格数据
 */
async function fetchMultiPlatformPrices(keyword) {
  try {
    // 并行从多个平台获取数据
    const platforms = ['JD', 'TMALL', 'PINDUODUO', 'SUNING', 'AMAZON'];
    const promises = platforms.map(platform => searchProductByKeyword(platform, keyword));
    
    const results = await Promise.all(promises);
    
    // 整合结果
    const platformResults = {};
    platforms.forEach((platform, index) => {
      platformResults[platform] = results[index];
    });
    
    return platformResults;
  } catch (error) {
    console.error('获取多平台价格失败:', error);
    throw error;
  }
}

/**
 * 获取特定商品的历史价格
 * @param {string} platform 平台代码
 * @param {string} productId 商品ID
 * @returns {Promise<Array>} 价格历史记录
 */
async function getProductPriceHistory(platform, productId) {
  // 实际项目中，应该从数据库或第三方API获取历史数据
  // 这里我们使用模拟数据
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  // 生成过去12个月的价格数据
  const priceHistory = [];
  const today = new Date();
  const basePrice = 100 + Math.random() * 900;
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // 618和双11有较大折扣
    let priceModifier = 1;
    if (date.getMonth() === 5) { // 6月，618
      priceModifier = 0.7 + Math.random() * 0.2;
    } else if (date.getMonth() === 10) { // 11月，双11
      priceModifier = 0.65 + Math.random() * 0.2;
    } else {
      // 普通月份的价格浮动
      priceModifier = 0.85 + Math.random() * 0.3;
    }
    
    // 添加一些平台特定的价格政策
    switch(platform) {
      case 'JD':
        // 京东年中特价
        if (date.getMonth() === 6) priceModifier *= 0.9;
        break;
      case 'TMALL':
        // 天猫38节活动
        if (date.getMonth() === 2) priceModifier *= 0.9;
        break;
      case 'PINDUODUO':
        // 拼多多春节活动
        if (date.getMonth() === 0 || date.getMonth() === 1) priceModifier *= 0.85;
        break;
      case 'SUNING':
        // 苏宁818活动
        if (date.getMonth() === 7) priceModifier *= 0.88;
        break;
      case 'AMAZON':
        // 亚马逊黑五
        if (date.getMonth() === 10) priceModifier *= 0.9;
        break;
    }
    
    // 计算价格并添加记录
    const price = Math.round(basePrice * priceModifier * 100) / 100;
    
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      price,
      platform,
      platformName: PLATFORM_NAMES[platform]
    });
  }
  
  // 按日期升序排序
  priceHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return priceHistory;
}

// API端点: 跨平台商品搜索
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ success: false, error: '搜索关键词不能为空' });
    }
    
    const results = await fetchMultiPlatformPrices(keyword);
    
    res.json({
      success: true,
      keyword,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('跨平台搜索失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '跨平台搜索失败', 
      message: error.message 
    });
  }
});

// API端点: 获取商品的历史价格
router.get('/history', async (req, res) => {
  try {
    const { platform, productId } = req.query;
    
    if (!platform || !productId) {
      return res.status(400).json({ 
        success: false, 
        error: '平台和商品ID都是必需的' 
      });
    }
    
    const history = await getProductPriceHistory(platform, productId);
    
    res.json({
      success: true,
      platform,
      platformName: PLATFORM_NAMES[platform],
      productId,
      history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取价格历史失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取价格历史失败', 
      message: error.message 
    });
  }
});

// API端点: 获取价格比较结果
router.get('/compare', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ success: false, error: '比较关键词不能为空' });
    }
    
    const platformResults = await fetchMultiPlatformPrices(keyword);
    
    // 找出每个平台的最佳商品(价格最低的)
    const bestOffers = {};
    for (const platform in platformResults) {
      const products = platformResults[platform];
      if (products && products.length > 0) {
        // 按价格排序
        products.sort((a, b) => a.price - b.price);
        bestOffers[platform] = products[0];
      }
    }
    
    // 计算统计数据
    let lowestPrice = Number.MAX_VALUE;
    let highestPrice = 0;
    let lowestPlatform = '';
    let highestPlatform = '';
    let totalPrice = 0;
    let count = 0;
    
    for (const platform in bestOffers) {
      const offer = bestOffers[platform];
      if (offer) {
        if (offer.price < lowestPrice) {
          lowestPrice = offer.price;
          lowestPlatform = platform;
        }
        if (offer.price > highestPrice) {
          highestPrice = offer.price;
          highestPlatform = platform;
        }
        totalPrice += offer.price;
        count++;
      }
    }
    
    const averagePrice = count > 0 ? totalPrice / count : 0;
    const priceDifference = highestPrice - lowestPrice;
    const priceDifferencePercentage = lowestPrice > 0 ? (priceDifference / lowestPrice) * 100 : 0;
    
    res.json({
      success: true,
      keyword,
      bestOffers,
      statistics: {
        lowestPrice,
        lowestPlatform,
        lowestPlatformName: PLATFORM_NAMES[lowestPlatform],
        highestPrice,
        highestPlatform,
        highestPlatformName: PLATFORM_NAMES[highestPlatform],
        averagePrice,
        priceDifference,
        priceDifferencePercentage
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('价格比较失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '价格比较失败', 
      message: error.message 
    });
  }
});

module.exports = router; 