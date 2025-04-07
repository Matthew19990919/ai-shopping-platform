/**
 * 模拟数据生成工具
 * 用于生成产品数据和价格历史数据
 */

// 真实产品的价格历史数据
const realProductPriceData = {
  // 手机类产品
  "iPhone XS": {
    releasePrice: 8699, // 首发价
    currentPrice: 3799, // 当前价格
    lowestPrice: 3699,  // 历史最低价
    pricePoints: [ // 特定价格节点
      { date: "2018-09-21", price: 8699, event: "首次发布" },
      { date: "2019-03-15", price: 7999, event: "春季调价" },
      { date: "2019-06-18", price: 7499, event: "618大促" },
      { date: "2019-11-11", price: 6799, event: "双11大促" },
      { date: "2020-03-10", price: 5999, event: "新品替代" },
      { date: "2020-06-18", price: 5499, event: "618大促" },
      { date: "2020-11-11", price: 4999, event: "双11大促" },
      { date: "2021-06-18", price: 4599, event: "618大促" },
      { date: "2021-11-11", price: 4299, event: "双11大促" },
      { date: "2022-06-01", price: 3999, event: "618大促" },
      { date: "2022-11-11", price: 3799, event: "双11大促" },
      { date: "2023-03-15", price: 3699, event: "清仓特价" }
    ]
  },
  "华为P40": {
    releasePrice: 4188, // 首发价
    currentPrice: 2499, // 当前价格
    lowestPrice: 2399,  // 历史最低价
    pricePoints: [ // 特定价格节点
      { date: "2020-04-08", price: 4188, event: "首次发布" },
      { date: "2020-06-18", price: 3999, event: "618大促" },
      { date: "2020-11-11", price: 3699, event: "双11大促" },
      { date: "2021-04-01", price: 3499, event: "周年促销" },
      { date: "2021-06-18", price: 3199, event: "618大促" },
      { date: "2021-11-11", price: 2999, event: "双11大促" },
      { date: "2022-03-01", price: 2799, event: "春季促销" },
      { date: "2022-06-18", price: 2599, event: "618大促" },
      { date: "2022-11-11", price: 2499, event: "双11大促" },
      { date: "2023-06-10", price: 2399, event: "618促销" }
    ]
  },
  "Redmi Note 系列": {
    averageStartPrice: 1999,
    averageDiscountRate: 0.15,
    seasonalEffects: {
      "06": 0.9,  // 6月(618)
      "11": 0.85  // 11月(双11)
    }
  },
  "realme数字系列": {
    averageStartPrice: 1899,
    averageDiscountRate: 0.12,
    seasonalEffects: {
      "06": 0.88, // 6月(618)
      "11": 0.86  // 11月(双11)
    }
  },
  
  // 电脑类产品
  "MacBook Pro": {
    releasePrice: 12999, 
    currentPrice: 8999,
    lowestPrice: 8799,
    pricePoints: [
      { date: "2021-10-18", price: 12999, event: "首次发布" },
      { date: "2022-03-15", price: 12499, event: "春季促销" },
      { date: "2022-06-18", price: 11999, event: "618大促" },
      { date: "2022-11-11", price: 10999, event: "双11大促" },
      { date: "2023-06-18", price: 9899, event: "618大促" },
      { date: "2023-10-30", price: 9699, event: "新品替代" },
      { date: "2023-11-11", price: 8999, event: "双11大促" },
      { date: "2024-01-01", price: 8799, event: "元旦特惠" }
    ]
  },
  "华为MateBook系列": {
    averageStartPrice: 6999,
    averageDiscountRate: 0.2,
    seasonalEffects: {
      "06": 0.9,  // 6月(618)
      "08": 0.92, // 8月(开学季)
      "11": 0.88  // 11月(双11)
    }
  },
  
  // 家电类产品
  "小米电视": {
    averageStartPrice: 3999,
    averageDiscountRate: 0.25,
    seasonalEffects: {
      "01": 0.9,  // 1月(春节)
      "06": 0.88, // 6月(618)
      "11": 0.85  // 11月(双11)
    }
  },
  "海尔冰箱": {
    averageStartPrice: 4599,
    averageDiscountRate: 0.15,
    seasonalEffects: {
      "06": 0.9,  // 6月(夏季家电促销)
      "11": 0.92  // 11月(双11)
    }
  },
  
  // 服装类产品
  "Nike运动鞋": {
    averageStartPrice: 999,
    averageDiscountRate: 0.3,
    seasonalEffects: {
      "03": 0.85, // 3月(季末清仓)
      "07": 0.8,  // 7月(夏季清仓)
      "10": 0.85, // 10月(季末清仓)
      "12": 0.8   // 12月(冬季清仓)
    }
  },
  "优衣库羽绒服": {
    averageStartPrice: 799,
    averageDiscountRate: 0.4,
    seasonalEffects: {
      "02": 0.7,  // 2月(冬季末清仓)
      "11": 0.9   // 11月(冬季新品上市)
    }
  },
  
  // 美妆类产品
  "兰蔻小黑瓶": {
    releasePrice: 1199,
    currentPrice: 899,
    lowestPrice: 799,
    pricePoints: [
      { date: "2023-01-01", price: 1199, event: "新年首发" },
      { date: "2023-03-08", price: 999, event: "女神节促销" },
      { date: "2023-05-20", price: 949, event: "520促销" },
      { date: "2023-06-18", price: 899, event: "618大促" },
      { date: "2023-11-11", price: 799, event: "双11大促" },
      { date: "2024-01-01", price: 899, event: "新年调价" }
    ]
  },
  "美妆护肤类": {
    averageStartPrice: 599,
    averageDiscountRate: 0.25,
    seasonalEffects: {
      "03": 0.85, // 3月(女神节)
      "05": 0.9,  // 5月(520活动)
      "06": 0.85, // 6月(618)
      "11": 0.8   // 11月(双11)
    }
  },
  
  // 食品类产品
  "零食礼盒": {
    averageStartPrice: 199,
    averageDiscountRate: 0.2,
    seasonalEffects: {
      "01": 0.85, // 1月(春节)
      "06": 0.9,  // 6月(618)
      "09": 0.85, // 9月(中秋)
      "11": 0.88  // 11月(双11)
    }
  },
  
  // 礼品类产品
  "电子礼品": {
    averageStartPrice: 999,
    averageDiscountRate: 0.2,
    seasonalEffects: {
      "02": 0.9,  // 2月(情人节)
      "05": 0.9,  // 5月(母亲节)
      "06": 0.85, // 6月(父亲节/618)
      "11": 0.8   // 11月(双11/黑五)
    }
  }
};

// 生成随机价格波动
const generatePriceFluctuation = (basePrice, months = 12, volatility = 0.05) => {
  const prices = [];
  let currentPrice = basePrice;
  
  // 获取当前日期
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // 生成过去几个月的价格
  for (let i = months - 1; i >= 0; i--) {
    // 计算日期
    const month = (currentMonth - i + 12) % 12;
    const year = currentYear - Math.floor((currentMonth - i + 12) / 12) + 1;
    const date = new Date(year, month, 15);
    
    // 添加季节性因素（如618、双11等）
    let seasonalFactor = 1;
    if (month === 5) seasonalFactor = 0.9; // 6月(618)
    if (month === 10) seasonalFactor = 0.85; // 11月(双11)
    
    // 生成随机波动
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    currentPrice = Math.round(basePrice * randomFactor * seasonalFactor);
    
    // 确保价格在合理范围内
    if (currentPrice < basePrice * 0.7) currentPrice = Math.round(basePrice * 0.7);
    if (currentPrice > basePrice * 1.2) currentPrice = Math.round(basePrice * 1.2);
    
    prices.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice
    });
    
    // 添加重要价格事件
    if (month === 5 || month === 10) {
      const eventName = month === 5 ? '618大促' : '双11大促';
      prices[prices.length - 1].event = {
        name: eventName,
        description: `${eventName}期间价格明显下降`,
        impact: '降价'
      };
    }
  }
  
  return prices;
};

// 生成基于真实产品数据的价格历史
const generateRealProductPriceHistory = (productName) => {
  if (!productName) return null;
  
  const normalizedName = productName.toLowerCase();
  let productData = null;
  
  // 步骤1: 尝试精确匹配产品
  if (normalizedName.includes('iphone') && normalizedName.includes('xs')) {
    productData = realProductPriceData["iPhone XS"];
  } else if (normalizedName.includes('华为') && normalizedName.includes('p40')) {
    productData = realProductPriceData["华为P40"];
  } else if (normalizedName.includes('redmi') || normalizedName.includes('红米')) {
    productData = realProductPriceData["Redmi Note 系列"];
  } else if (normalizedName.includes('realme')) {
    productData = realProductPriceData["realme数字系列"];
  } else if (normalizedName.includes('macbook') && normalizedName.includes('pro')) {
    productData = realProductPriceData["MacBook Pro"];
  } else if (normalizedName.includes('华为') && normalizedName.includes('matebook')) {
    productData = realProductPriceData["华为MateBook系列"];
  } else if (normalizedName.includes('兰蔻') && (normalizedName.includes('小黑瓶') || normalizedName.includes('精华'))) {
    productData = realProductPriceData["兰蔻小黑瓶"];
  }
  
  // 步骤2: 如果没有精确匹配，尝试根据产品类别匹配
  if (!productData) {
    // 检查产品属于哪个类别
    if (isProductCategory(normalizedName, ['手机', 'iphone', '华为', '小米', 'oppo', 'vivo', '荣耀', '一加'])) {
      if (normalizedName.includes('iphone')) {
        productData = realProductPriceData["iPhone XS"];
      } else if (normalizedName.includes('华为')) {
        productData = realProductPriceData["华为P40"];
      } else {
        productData = Math.random() > 0.5 ? 
          realProductPriceData["Redmi Note 系列"] : 
          realProductPriceData["realme数字系列"];
      }
    } else if (isProductCategory(normalizedName, ['电脑', '笔记本', 'laptop', 'macbook', 'matebook', '联想', '戴尔', '惠普'])) {
      productData = Math.random() > 0.5 ? 
        realProductPriceData["MacBook Pro"] : 
        realProductPriceData["华为MateBook系列"];
    } else if (isProductCategory(normalizedName, ['电视', '家电', '冰箱', '洗衣机', '空调', '小米', '海尔', '格力'])) {
      productData = Math.random() > 0.5 ? 
        realProductPriceData["小米电视"] : 
        realProductPriceData["海尔冰箱"];
    } else if (isProductCategory(normalizedName, ['服装', '衣服', '鞋', 'nike', '优衣库', '服饰', '羽绒服'])) {
      productData = Math.random() > 0.5 ? 
        realProductPriceData["Nike运动鞋"] : 
        realProductPriceData["优衣库羽绒服"];
    } else if (isProductCategory(normalizedName, ['化妆品', '美妆', '护肤', '面膜', '精华', '粉底液', '兰蔻', '雅诗兰黛', '资生堂'])) {
      productData = Math.random() > 0.5 ? 
        realProductPriceData["兰蔻小黑瓶"] : 
        realProductPriceData["美妆护肤类"];
    } else if (isProductCategory(normalizedName, ['食品', '零食', '坚果', '礼盒', '巧克力', '松鼠'])) {
      productData = realProductPriceData["零食礼盒"];
    } else if (isProductCategory(normalizedName, ['礼品', '礼物', '送礼', '剃须刀', '电子'])) {
      productData = realProductPriceData["电子礼品"];
    }
  }
  
  if (!productData) {
    return null; // 未找到匹配的产品
  }
  
  // 如果有特定价格点，直接使用
  if (productData.pricePoints) {
    return productData.pricePoints.map(point => ({
      date: point.date,
      price: point.price,
      event: point.event ? {
        name: point.event,
        description: point.event,
        impact: point.price < (point.previousPrice || Infinity) ? '降价' : '涨价'
      } : undefined
    }));
  }
  
  // 否则，基于平均数据生成
  const prices = [];
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 12);
  
  let currentPrice = productData.averageStartPrice;
  
  for (let d = new Date(startDate); d <= currentDate; d.setMonth(d.getMonth() + 1)) {
    const month = d.getMonth().toString().padStart(2, '0');
    const seasonalEffect = productData.seasonalEffects[month] || 1;
    
    // 添加一些随机波动
    const randomFactor = 1 + (Math.random() * 0.06 - 0.03);
    currentPrice = Math.round(currentPrice * randomFactor * seasonalEffect);
    
    // 随时间推移，逐渐降价
    currentPrice = Math.round(currentPrice * (1 - productData.averageDiscountRate / 12));
    
    const dateStr = d.toISOString().split('T')[0];
    const pricePoint = {
      date: dateStr,
      price: currentPrice
    };
    
    // 添加事件
    if (month === "06" || month === "11" || productData.seasonalEffects[month] < 0.95) {
      let eventName = '';
      if (month === "06") eventName = '618大促';
      else if (month === "11") eventName = '双11大促';
      else if (month === "01") eventName = '元旦促销';
      else if (month === "02") eventName = '情人节促销';
      else if (month === "03") eventName = '女神节促销';
      else if (month === "05") eventName = '520促销';
      else if (month === "09") eventName = '中秋促销';
      else if (month === "12") eventName = '年末促销';
      else eventName = '季节性促销';
      
      pricePoint.event = {
        name: eventName,
        description: `${eventName}期间价格下降`,
        impact: '降价'
      };
    }
    
    prices.push(pricePoint);
  }
  
  return prices;
};

// 辅助函数：判断产品所属类别
const isProductCategory = (productName, categoryKeywords) => {
  if (!productName) return false;
  const normalizedName = productName.toLowerCase();
  return categoryKeywords.some(keyword => normalizedName.includes(keyword.toLowerCase()));
};

// 生成预测价格
const generatePricePrediction = (currentPrice, months = 3, volatility = 0.03) => {
  const predictions = [];
  let predictedPrice = currentPrice;
  
  // 获取当前日期
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // 生成未来几个月的价格预测
  for (let i = 1; i <= months; i++) {
    // 计算日期
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    const date = new Date(year, month, 15);
    
    // 添加季节性因素
    let seasonalFactor = 1;
    let eventInfo = null;
    
    if (month === 5) {
      seasonalFactor = 0.92;
      eventInfo = {
        name: '预测618大促',
        description: '618期间预计会有明显降价',
        impact: '预计降价',
        confidence: 0.85
      };
    }
    if (month === 10) {
      seasonalFactor = 0.88;
      eventInfo = {
        name: '预测双11大促',
        description: '双11期间预计会有明显降价',
        impact: '预计降价',
        confidence: 0.9
      };
    }
    
    // 添加一点随机性
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    predictedPrice = Math.round(currentPrice * randomFactor * seasonalFactor);
    
    const prediction = {
      date: date.toISOString().split('T')[0],
      price: predictedPrice,
      isPrediction: true,
      confidence: Math.round((1 - i * 0.15) * 100) / 100 // 预测置信度随时间降低
    };
    
    if (eventInfo) {
      prediction.event = eventInfo;
    }
    
    predictions.push(prediction);
  }
  
  return predictions;
};

// 生成竞品价格数据
const generateCompetitorPrices = (basePrice, competitors = 3) => {
  const competitorPrices = [];
  const competitorNames = ['京东', '天猫', '苏宁', '拼多多', '国美'];
  
  // 随机选择几个竞争对手
  const selectedCompetitors = [];
  while (selectedCompetitors.length < competitors && selectedCompetitors.length < competitorNames.length) {
    const randomIndex = Math.floor(Math.random() * competitorNames.length);
    if (!selectedCompetitors.includes(competitorNames[randomIndex])) {
      selectedCompetitors.push(competitorNames[randomIndex]);
    }
  }
  
  // 为每个竞争对手生成价格
  selectedCompetitors.forEach(name => {
    // 价格浮动范围在基准价格的±10%
    const priceFactor = 0.9 + Math.random() * 0.2;
    competitorPrices.push({
      name,
      price: Math.round(basePrice * priceFactor)
    });
  });
  
  return competitorPrices;
};

// 生成完整的价格历史数据
export const generatePriceHistoryData = (basePrice, productId, productName = '') => {
  // 尝试使用真实产品数据
  let historicalPrices = [];
  if (productName) {
    const realPriceData = generateRealProductPriceHistory(productName);
    if (realPriceData) {
      historicalPrices = realPriceData;
    }
  }
  
  // 如果没有找到真实数据，则使用模拟数据
  if (historicalPrices.length === 0) {
    historicalPrices = generatePriceFluctuation(basePrice);
  }
  
  const currentPrice = historicalPrices[historicalPrices.length - 1].price;
  
  // 获取价格预测
  const predictionsRaw = generatePricePrediction(currentPrice);
  
  // 获取竞争对手价格
  const competitorPrices = generateCompetitorPrices(currentPrice);
  
  // 处理价格事件
  const events = [];
  
  // 提取历史价格中的事件
  historicalPrices.forEach(item => {
    if (item.event) {
      events.push({
        date: item.date,
        description: item.event.description || item.event.name,
        type: item.event.impact === '降价' ? 'promotion' : 'seasonal'
      });
    }
  });
  
  // 处理特殊节日事件
  const holidays = [
    {month: 0, day: 1, description: '元旦促销', type: 'holiday'},
    {month: 4, day: 1, description: '五一促销', type: 'holiday'},
    {month: 9, day: 1, description: '国庆促销', type: 'holiday'},
    {month: 11, day: 25, description: '圣诞促销', type: 'holiday'}
  ];
  
  // 获取当前年份
  const currentYear = new Date().getFullYear();
  
  // 添加节日事件（如果没有重复）
  holidays.forEach(holiday => {
    const holidayDate = new Date(currentYear, holiday.month, holiday.day);
    const dateStr = holidayDate.toISOString().split('T')[0];
    
    // 检查是否已有此日期的事件
    if (!events.some(e => e.date === dateStr)) {
      const historyItem = historicalPrices.find(p => p.date === dateStr);
      if (historyItem) {
        events.push({
          date: dateStr,
          description: holiday.description,
          type: holiday.type
        });
      }
    }
  });
  
  // 如果不是真实产品数据，添加新品发布事件
  if (!productName) {
    const releaseIndex = Math.floor(Math.random() * (historicalPrices.length - 2)) + 1;
    events.push({
      date: historicalPrices[releaseIndex].date,
      description: '新品发布',
      type: 'release'
    });
  }
  
  // 提取预测中的事件
  predictionsRaw.forEach(item => {
    if (item.event) {
      events.push({
        date: item.date,
        description: item.event.description,
        type: 'promotion'
      });
    }
  });
  
  // 按新格式构建数据
  const formattedData = {
    productId,
    history: historicalPrices.map(item => ({
      date: item.date,
      price: item.price
    })),
    prediction: predictionsRaw.map(item => ({
      date: item.date,
      price: item.price,
      confidence: item.confidence || 0.7
    })),
    events: events,
    competitors: competitorPrices
  };
  
  return formattedData;
};

// 生成产品对象
export const generateProductMock = (id, name, options = {}) => {
  const basePrice = options.basePrice || 2000 + Math.floor(Math.random() * 6000);
  const discountPercent = Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0;
  const discountedPrice = Math.round(basePrice * (1 - discountPercent / 100));
  
  return {
    id,
    name,
    brand: options.brand || '品牌' + Math.floor(Math.random() * 5 + 1),
    category: options.category || '智能手机',
    price: discountPercent > 0 ? discountedPrice : basePrice,
    originalPrice: discountPercent > 0 ? basePrice : null,
    discountPercent: discountPercent > 0 ? discountPercent : null,
    rating: options.rating || (3 + Math.random() * 2).toFixed(1),
    reviewCount: options.reviewCount || Math.floor(Math.random() * 1000) + 50,
    image: options.image || `/images/products/product-${id % 10 + 1}.jpg`,
    inStock: options.inStock !== undefined ? options.inStock : Math.random() > 0.1,
    specs: options.specs || {
      '处理器': options.processor || `骁龙${800 + Math.floor(Math.random() * 200)}`,
      '内存': options.memory || `${Math.pow(2, Math.floor(Math.random() * 4) + 3)}GB`,
      '存储': options.storage || `${Math.pow(2, Math.floor(Math.random() * 4) + 6)}GB`,
      '屏幕': options.screen || `${Math.floor(Math.random() * 2) + 6}.${Math.floor(Math.random() * 9) + 1}英寸 AMOLED`,
      '电池': options.battery || `${4000 + Math.floor(Math.random() * 10) * 100}mAh`,
      '摄像头': options.camera || `${Math.floor(Math.random() * 30) + 50}MP`,
      '重量': options.weight || `${150 + Math.floor(Math.random() * 50)}g`,
      '系统': options.os || 'Android ' + (10 + Math.floor(Math.random() * 3))
    },
    features: options.features || [
      '高性能处理器',
      '长效续航',
      '高清摄像头',
      '快速充电'
    ]
  };
};

// 生成若干产品的数据
export const generateProductList = (count = 5) => {
  const products = [];
  const productNames = [
    '华为 P50 Pro',
    '小米 13 Ultra',
    'OPPO Find X6',
    'vivo X100 Pro',
    'iPhone 15 Pro',
    '三星 S23 Ultra',
    '一加 12',
    '荣耀 Magic6 Pro',
    'realme GT Neo6',
    'iQOO 12 Pro'
  ];
  
  // 确保产品数量不超过产品名列表长度
  const numProducts = Math.min(count, productNames.length);
  
  // 随机选择产品
  const selectedIndices = [];
  while (selectedIndices.length < numProducts) {
    const randomIndex = Math.floor(Math.random() * productNames.length);
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex);
    }
  }
  
  // 生成产品数据
  selectedIndices.forEach((index, i) => {
    const productName = productNames[index];
    products.push(generateProductMock(i + 1, productName));
  });
  
  return products;
};

// 生成产品比较数据
export const generateComparisonData = (products) => {
  if (!products || products.length < 2) return null;
  
  const comparison = {
    products: products.map(p => ({ id: p.id, name: p.name })),
    bestValues: {},
    summaries: []
  };
  
  // 为每个规格确定最佳值
  if (products[0].specs) {
    Object.keys(products[0].specs).forEach(spec => {
      // 检查是否所有产品都有这个规格
      const allHaveSpec = products.every(p => p.specs && p.specs[spec] !== undefined);
      if (!allHaveSpec) return;
      
      // 检查是否可以转换为数字
      const values = products.map(p => {
        const rawValue = p.specs[spec];
        // 提取数字部分
        const numericPart = rawValue.match(/\d+(\.\d+)?/);
        return numericPart ? parseFloat(numericPart[0]) : null;
      });
      
      // 如果不是所有值都能转换成数字，则跳过
      if (values.some(v => v === null)) return;
      
      // 检查规格是否是"更大更好"
      const biggerIsBetter = !['重量', '厚度'].includes(spec);
      
      // 找到最佳值
      let bestIndex = 0;
      for (let i = 1; i < values.length; i++) {
        if (biggerIsBetter && values[i] > values[bestIndex]) {
          bestIndex = i;
        } else if (!biggerIsBetter && values[i] < values[bestIndex]) {
          bestIndex = i;
        }
      }
      
      comparison.bestValues[spec] = {
        productId: products[bestIndex].id,
        value: products[bestIndex].specs[spec],
        biggerIsBetter
      };
    });
  }
  
  // 生成比较摘要
  products.forEach((product, index) => {
    let strengths = [];
    let weaknesses = [];
    
    // 分析产品优缺点
    Object.keys(comparison.bestValues).forEach(spec => {
      const bestValue = comparison.bestValues[spec];
      if (bestValue.productId === product.id) {
        strengths.push(`${spec}表现最佳`);
      } else {
        // 找到该产品在这个规格上的排名
        const productValue = parseFloat(product.specs[spec].match(/\d+(\.\d+)?/)[0]);
        const bestProductValue = parseFloat(bestValue.value.match(/\d+(\.\d+)?/)[0]);
        const percentage = bestValue.biggerIsBetter 
          ? (productValue / bestProductValue) * 100
          : (bestProductValue / productValue) * 100;
        
        if (percentage < 85) {
          weaknesses.push(`${spec}相对较弱`);
        }
      }
    });
    
    // 价格因素
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (product.price === minPrice) {
      strengths.push('价格最为经济');
    } else if (product.price === maxPrice) {
      strengths.push('高端定位');
      weaknesses.push('价格相对较高');
    }
    
    comparison.summaries.push({
      productId: product.id,
      strengths: strengths.slice(0, 3), // 最多3个优点
      weaknesses: weaknesses.slice(0, 2), // 最多2个缺点
      overallRating: (4 + Math.random()).toFixed(1) // 4-5之间的随机评分
    });
  });
  
  return comparison;
};

// 示例使用
export const mockProductRecommendation = (query = '智能手机') => {
  const products = generateProductList(5);
  return {
    query,
    matchingProducts: products,
    priceHistory: products.map(p => generatePriceHistoryData(p.price, p.id, p.name)),
    comparison: generateComparisonData(products)
  };
};

export default {
  generateProductMock,
  generateProductList,
  generatePriceHistoryData,
  generateComparisonData,
  mockProductRecommendation
}; 