/**
 * 推荐系统服务
 * 实现基于用户行为、浏览历史和内容的个性化推荐算法
 */

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    title: "智能扫地机器人",
    category: "智能家居",
    price: 1999,
    sales: 2543,
    tags: ["家电", "清洁", "智能设备"],
    features: ["自动回充", "智能规划", "APP控制"],
    rating: 4.7,
    image: "personalized_1.png"
  },
  {
    id: 2,
    title: "高端智能手机",
    category: "手机数码",
    price: 5999,
    sales: 10243,
    tags: ["手机", "5G", "拍照"],
    features: ["AI摄影", "长续航", "高性能"],
    rating: 4.9,
    image: "personalized_2.png"
  },
  {
    id: 3,
    title: "无线蓝牙耳机",
    category: "手机数码",
    price: 899,
    sales: 8562,
    tags: ["耳机", "音乐", "配件"],
    features: ["降噪", "长续航", "高音质"],
    rating: 4.5,
    image: "personalized_3.png"
  },
  {
    id: 4,
    title: "智能手表",
    category: "穿戴设备",
    price: 1599,
    sales: 3562,
    tags: ["手表", "健康", "运动"],
    features: ["心率监测", "睡眠分析", "多种运动模式"],
    rating: 4.6,
    image: "personalized_4.png"
  },
  {
    id: 5,
    title: "4K高清电视",
    category: "智能家居",
    price: 3999,
    sales: 1562,
    tags: ["电视", "家电", "娱乐"],
    features: ["4K分辨率", "智能系统", "超薄设计"],
    rating: 4.8,
    image: "personalized_5.png"
  },
  {
    id: 6,
    title: "笔记本电脑",
    category: "电脑办公",
    price: 6999,
    sales: 4521,
    tags: ["电脑", "办公", "学习"],
    features: ["高性能", "轻薄", "长续航"],
    rating: 4.7,
    image: "similar_1.png"
  },
  {
    id: 7,
    title: "智能门锁",
    category: "智能家居",
    price: 1299,
    sales: 2135,
    tags: ["安防", "门锁", "家居"],
    features: ["指纹解锁", "密码解锁", "APP远程控制"],
    rating: 4.5,
    image: "similar_2.png"
  },
  {
    id: 8,
    title: "无线充电器",
    category: "手机数码",
    price: 129,
    sales: 12653,
    tags: ["充电", "配件", "手机"],
    features: ["快充", "多设备兼容", "安全保护"],
    rating: 4.3,
    image: "similar_3.png"
  },
  {
    id: 9,
    title: "智能音箱",
    category: "智能家居",
    price: 399,
    sales: 7865,
    tags: ["音箱", "智能设备", "家居"],
    features: ["语音控制", "高音质", "智能家居控制中心"],
    rating: 4.4,
    image: "similar_4.png"
  },
  {
    id: 10,
    title: "游戏手柄",
    category: "游戏设备",
    price: 369,
    sales: 3254,
    tags: ["游戏", "娱乐", "配件"],
    features: ["人体工学", "可编程按键", "震动反馈"],
    rating: 4.6,
    image: "similar_5.png"
  },
  {
    id: 11,
    title: "电动牙刷",
    category: "个人护理",
    price: 299,
    sales: 9874,
    tags: ["护理", "健康", "清洁"],
    features: ["声波震动", "智能提醒", "长续航"],
    rating: 4.7,
    image: "popular_1.png"
  },
  {
    id: 12,
    title: "智能体脂秤",
    category: "健康设备",
    price: 199,
    sales: 7865,
    tags: ["健康", "智能设备", "运动"],
    features: ["精准测量", "APP数据分析", "多用户管理"],
    rating: 4.5,
    image: "popular_2.png"
  },
  {
    id: 13,
    title: "家用咖啡机",
    category: "厨房家电",
    price: 699,
    sales: 4231,
    tags: ["咖啡", "厨房", "家电"],
    features: ["磨豆一体", "多种口味", "简单操作"],
    rating: 4.6,
    image: "popular_3.png"
  },
  {
    id: 14,
    title: "迷你投影仪",
    category: "数码电子",
    price: 1899,
    sales: 1356,
    tags: ["投影", "娱乐", "家庭影院"],
    features: ["高清画质", "便携", "无线连接"],
    rating: 4.4,
    image: "popular_4.png"
  },
  {
    id: 15,
    title: "智能台灯",
    category: "智能家居",
    price: 299,
    sales: 7239,
    tags: ["照明", "书桌", "学习"],
    features: ["可调亮度", "护眼模式", "APP控制"],
    rating: 4.8,
    image: "popular_5.png"
  }
];

// 模拟用户行为数据
let userBehaviorData = {
  viewHistory: [], // 浏览历史
  purchaseHistory: [], // 购买历史
  searchHistory: [], // 搜索历史
  favoriteItems: [], // 收藏商品
  ratings: {}, // 商品评分
  categoryPreferences: {}, // 分类偏好
  tagPreferences: {} // 标签偏好
};

// 本地存储键
const USER_BEHAVIOR_KEY = 'user_behavior_data';

/**
 * 初始化推荐系统，从localStorage加载用户行为数据
 */
const initRecommendationSystem = () => {
  try {
    const savedData = localStorage.getItem(USER_BEHAVIOR_KEY);
    if (savedData) {
      userBehaviorData = JSON.parse(savedData);
    }
  } catch (error) {
    console.error('初始化推荐系统出错:', error);
    // 如果出错，使用默认空数据
  }
};

/**
 * 保存用户行为数据到本地存储
 */
const saveUserBehaviorData = () => {
  try {
    localStorage.setItem(USER_BEHAVIOR_KEY, JSON.stringify(userBehaviorData));
  } catch (error) {
    console.error('保存用户行为数据出错:', error);
  }
};

/**
 * 记录用户浏览商品
 * @param {number} productId 商品ID
 */
const recordProductView = (productId) => {
  // 添加到浏览历史前端
  userBehaviorData.viewHistory.unshift({
    productId,
    timestamp: Date.now()
  });
  
  // 限制历史记录数量，保留最近的100条
  if (userBehaviorData.viewHistory.length > 100) {
    userBehaviorData.viewHistory = userBehaviorData.viewHistory.slice(0, 100);
  }
  
  // 更新分类和标签偏好
  const product = mockProducts.find(p => p.id === productId);
  if (product) {
    // 更新分类偏好
    userBehaviorData.categoryPreferences[product.category] = 
      (userBehaviorData.categoryPreferences[product.category] || 0) + 1;
    
    // 更新标签偏好
    product.tags.forEach(tag => {
      userBehaviorData.tagPreferences[tag] = 
        (userBehaviorData.tagPreferences[tag] || 0) + 1;
    });
  }
  
  saveUserBehaviorData();
};

/**
 * 记录用户购买商品
 * @param {number} productId 商品ID
 */
const recordProductPurchase = (productId) => {
  userBehaviorData.purchaseHistory.unshift({
    productId,
    timestamp: Date.now()
  });
  
  // 限制历史记录数量
  if (userBehaviorData.purchaseHistory.length > 50) {
    userBehaviorData.purchaseHistory = userBehaviorData.purchaseHistory.slice(0, 50);
  }
  
  // 购买行为权重更高，更新偏好
  const product = mockProducts.find(p => p.id === productId);
  if (product) {
    // 更新分类偏好，购买的权重是浏览的3倍
    userBehaviorData.categoryPreferences[product.category] = 
      (userBehaviorData.categoryPreferences[product.category] || 0) + 3;
    
    // 更新标签偏好
    product.tags.forEach(tag => {
      userBehaviorData.tagPreferences[tag] = 
        (userBehaviorData.tagPreferences[tag] || 0) + 3;
    });
  }
  
  saveUserBehaviorData();
};

/**
 * 记录用户搜索关键词
 * @param {string} keyword 搜索关键词
 */
const recordSearch = (keyword) => {
  userBehaviorData.searchHistory.unshift({
    keyword,
    timestamp: Date.now()
  });
  
  // 限制历史记录数量
  if (userBehaviorData.searchHistory.length > 30) {
    userBehaviorData.searchHistory = userBehaviorData.searchHistory.slice(0, 30);
  }
  
  saveUserBehaviorData();
};

/**
 * 添加或移除收藏商品
 * @param {number} productId 商品ID
 * @param {boolean} isFavorite 是否收藏
 */
const toggleFavorite = (productId, isFavorite) => {
  if (isFavorite) {
    // 添加到收藏
    if (!userBehaviorData.favoriteItems.includes(productId)) {
      userBehaviorData.favoriteItems.push(productId);
    }
  } else {
    // 从收藏中移除
    userBehaviorData.favoriteItems = userBehaviorData.favoriteItems.filter(id => id !== productId);
  }
  
  saveUserBehaviorData();
};

/**
 * 记录用户对商品的评分
 * @param {number} productId 商品ID
 * @param {number} rating 评分(1-5)
 */
const recordRating = (productId, rating) => {
  userBehaviorData.ratings[productId] = rating;
  saveUserBehaviorData();
};

/**
 * 基于用户最近浏览历史推荐商品
 * @param {number} limit 返回结果数量限制
 * @returns {Array} 推荐商品数组
 */
const getRecommendationsBasedOnHistory = (limit = 5) => {
  // 如果没有浏览历史，返回热门商品
  if (userBehaviorData.viewHistory.length === 0) {
    return getPopularProducts(limit);
  }
  
  // 获取最近浏览的商品的分类和标签
  const recentProducts = userBehaviorData.viewHistory.slice(0, 10)
    .map(item => mockProducts.find(p => p.id === item.productId))
    .filter(Boolean);
  
  if (recentProducts.length === 0) {
    return getPopularProducts(limit);
  }
  
  const recentCategories = {};
  const recentTags = {};
  
  recentProducts.forEach(product => {
    // 收集最近浏览的分类
    recentCategories[product.category] = (recentCategories[product.category] || 0) + 1;
    
    // 收集最近浏览的标签
    product.tags.forEach(tag => {
      recentTags[tag] = (recentTags[tag] || 0) + 1;
    });
  });
  
  // 过滤掉已浏览过的商品
  const viewedProductIds = new Set(userBehaviorData.viewHistory.map(item => item.productId));
  const candidateProducts = mockProducts.filter(product => !viewedProductIds.has(product.id));
  
  // 计算每个候选商品的匹配得分
  const scoredProducts = candidateProducts.map(product => {
    let score = 0;
    
    // 分类匹配得分
    if (recentCategories[product.category]) {
      score += recentCategories[product.category] * 2;
    }
    
    // 标签匹配得分
    product.tags.forEach(tag => {
      if (recentTags[tag]) {
        score += recentTags[tag];
      }
    });
    
    // 考虑商品评分
    score += product.rating;
    
    return { ...product, score };
  });
  
  // 按得分排序并返回指定数量的结果
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * 基于用户长期偏好推荐商品
 * @param {number} limit 返回结果数量限制
 * @returns {Array} 推荐商品数组
 */
const getRecommendationsBasedOnPreferences = (limit = 5) => {
  // 如果没有足够的偏好数据，返回热门商品
  if (Object.keys(userBehaviorData.categoryPreferences).length === 0 && 
      Object.keys(userBehaviorData.tagPreferences).length === 0) {
    return getPopularProducts(limit);
  }
  
  // 获取用户已经购买的商品ID
  const purchasedProductIds = new Set(userBehaviorData.purchaseHistory.map(item => item.productId));
  
  // 过滤掉已购买的商品
  const candidateProducts = mockProducts.filter(product => !purchasedProductIds.has(product.id));
  
  // 计算每个候选商品的匹配得分
  const scoredProducts = candidateProducts.map(product => {
    let score = 0;
    
    // 分类偏好得分
    const categoryScore = userBehaviorData.categoryPreferences[product.category] || 0;
    score += categoryScore * 2;
    
    // 标签偏好得分
    product.tags.forEach(tag => {
      const tagScore = userBehaviorData.tagPreferences[tag] || 0;
      score += tagScore;
    });
    
    // 考虑商品评分和销量
    score += product.rating + (Math.log10(product.sales) / 2);
    
    // 如果是收藏商品，增加得分
    if (userBehaviorData.favoriteItems.includes(product.id)) {
      score += 5;
    }
    
    // 用户对该商品的评分影响
    if (userBehaviorData.ratings[product.id]) {
      score += userBehaviorData.ratings[product.id];
    }
    
    return { ...product, score };
  });
  
  // 按得分排序并返回指定数量的结果
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * 基于协同过滤的推荐（模拟）
 * 在实际应用中，这将使用更复杂的算法和后端服务
 * @param {number} limit 返回结果数量限制
 * @returns {Array} 推荐商品数组
 */
const getCollaborativeFilteringRecommendations = (limit = 5) => {
  // 这里简单模拟协同过滤的结果
  // 实际应用中应该由后端服务提供基于所有用户行为的协同过滤推荐
  
  // 1. 如果用户有购买历史，基于购买商品的相似物品
  if (userBehaviorData.purchaseHistory.length > 0) {
    const purchasedProductIds = userBehaviorData.purchaseHistory.map(item => item.productId);
    const purchasedProducts = mockProducts.filter(p => purchasedProductIds.includes(p.id));
    
    // 提取这些商品的分类和标签
    const categories = new Set();
    const tags = new Set();
    
    purchasedProducts.forEach(product => {
      categories.add(product.category);
      product.tags.forEach(tag => tags.add(tag));
    });
    
    // 找到相似的商品
    const similarProducts = mockProducts
      .filter(p => !purchasedProductIds.includes(p.id)) // 过滤掉已购买的
      .map(product => {
        let similarity = 0;
        
        // 分类匹配
        if (categories.has(product.category)) {
          similarity += 2;
        }
        
        // 标签匹配
        product.tags.forEach(tag => {
          if (tags.has(tag)) {
            similarity += 1;
          }
        });
        
        return { ...product, similarity };
      })
      .filter(p => p.similarity > 0) // 只保留有一定相似度的商品
      .sort((a, b) => b.similarity - a.similarity) // 按相似度排序
      .slice(0, limit);
    
    if (similarProducts.length > 0) {
      return similarProducts;
    }
  }
  
  // 2. 退化为热门商品推荐
  return getPopularProducts(limit);
};

// 为推荐产品分配正确的图片路径
const assignProductImage = (product, type, index) => {
  // 确保索引在1-5之间循环
  const imageIndex = (index % 5) + 1;
  const imageName = `${type}_${imageIndex}.png`;
  
  console.log(`为产品分配${type}类型图片: ID=${product.id}, 图片=${imageName}`);
  
  return {
    ...product,
    image: imageName
  };
};

/**
 * 获取热门商品
 * @param {number} limit 返回数量限制
 * @returns {Array} 热门商品列表
 */
const getPopularProducts = (limit = 5) => {
  // 初始化推荐系统
  initRecommendationSystem();
  
  // 特定为热门分类准备的商品，按ID分配，确保与已生成的图片匹配
  const hotSpecificProducts = mockProducts
    .filter(product => [11, 3, 8, 4, 15].includes(product.id)) // 电动牙刷、无线耳机、无线充电器、智能手表、智能台灯
    .sort((a, b) => b.sales - a.sales);
  
  // 确保结果不超过限制数量
  const results = hotSpecificProducts.slice(0, limit);
  
  // 为每个结果分配图片，确保ID和图片匹配
  return results.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 3) imageIndex = 2;      // 无线耳机 - popular_2.jpg
    else if (product.id === 4) imageIndex = 3; // 智能手表 - popular_3.jpg
    else if (product.id === 8) imageIndex = 4; // 无线充电器 - popular_4.jpg
    else if (product.id === 15) imageIndex = 5; // 智能台灯 - popular_5.jpg
    
    return {
      ...product,
      image: `/images/products/popular_${imageIndex}.jpg`
    };
  });
};

/**
 * 获取个性化推荐
 * @param {number} limit 返回数量限制
 * @returns {Array} 个性化推荐商品列表
 */
const getPersonalizedRecommendations = (limit = 10) => {
  // 初始化推荐系统
  initRecommendationSystem();
  
  // 为个性化推荐准备的特定ID，选择更符合图片内容的商品
  const personalizedProductIds = [1, 2, 3, 4, 6]; // 扫地机器人、智能手机、耳机、智能手表、笔记本电脑
  
  // 从特定ID中选择商品
  const personalizedProducts = mockProducts
    .filter(product => personalizedProductIds.includes(product.id))
    .slice(0, limit);
  
  // 为每个结果分配图片，确保ID和图片匹配
  return personalizedProducts.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 2) imageIndex = 2;     // 智能手机 - personalized_2.jpg
    else if (product.id === 3) imageIndex = 3; // 耳机 - personalized_3.jpg
    else if (product.id === 4) imageIndex = 4; // 智能手表 - personalized_4.jpg
    else if (product.id === 6) imageIndex = 5; // 笔记本电脑 - personalized_5.jpg
    
    return {
      ...product,
      image: `/images/products/personalized_${imageIndex}.jpg`
    };
  });
};

/**
 * 获取相似商品
 * @param {number} productId 商品ID
 * @param {number} limit 返回数量限制
 * @returns {Array} 相似商品列表
 */
const getSimilarProducts = (productId, limit = 5) => {
  // 如果没有提供商品ID，返回热门商品
  if (!productId) {
    return getPopularProducts(limit);
  }
  
  // 查找原始商品
  const originalProduct = mockProducts.find(p => p.id === Number(productId));
  if (!originalProduct) {
    return getPopularProducts(limit);
  }
  
  // 为相似商品准备的特定ID，选择更符合图片内容的商品
  const similarProductIds = [6, 1, 3, 4, 2]; // 笔记本电脑、扫地机器人、无线耳机、智能手表、智能手机
  
  // 从特定ID中选择商品，排除当前查看的商品
  const specificSimilarProducts = mockProducts
    .filter(product => similarProductIds.includes(product.id) && product.id !== Number(productId))
    .slice(0, limit);
  
  // 为每个结果分配图片，确保ID和图片匹配
  return specificSimilarProducts.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 1) imageIndex = 2;      // 扫地机器人 - similar_2.jpg
    else if (product.id === 3) imageIndex = 3; // 无线耳机 - similar_3.jpg
    else if (product.id === 4) imageIndex = 4; // 智能手表 - similar_4.jpg
    else if (product.id === 2) imageIndex = 5; // 智能手机 - similar_5.jpg
    
    return {
      ...product,
      image: `/images/products/similar_${imageIndex}.jpg`
    };
  });
};

/**
 * 获取新品
 * @param {number} limit 返回数量限制
 * @returns {Array} 新品列表
 */
const getNewProducts = (limit = 5) => {
  // 为新品准备的特定ID，选择更符合图片内容的商品
  const newProductIds = [2, 9, 10, 7, 14]; // 智能手机、智能音箱、游戏手柄、智能门锁、投影仪
  
  // 从特定ID中选择商品
  const newProducts = mockProducts
    .filter(product => newProductIds.includes(product.id))
    .slice(0, limit);
  
  // 为每个结果分配图片并添加"新品"标签，确保ID和图片匹配
  return newProducts.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 9) imageIndex = 2;      // 智能音箱 - new_2.jpg
    else if (product.id === 10) imageIndex = 3; // 游戏手柄 - new_3.jpg
    else if (product.id === 7) imageIndex = 4;  // 智能门锁 - new_4.jpg
    else if (product.id === 14) imageIndex = 5; // 投影仪 - new_5.jpg
    
    return {
      ...product,
      isNew: true,
      image: `/images/products/new_${imageIndex}.jpg`,
      dateAdded: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    };
  });
};

/**
 * 获取趋势商品
 * @param {number} limit 返回数量限制
 * @returns {Array} 趋势商品列表
 */
const getTrendingProducts = (limit = 5) => {
  // 为趋势商品准备的特定ID，选择更符合图片内容的商品
  const trendingProductIds = [2, 5, 11, 12, 14]; // 智能手机、电视、电动牙刷、智能体脂秤、投影仪
  
  // 从特定ID中选择商品
  const trendingProducts = mockProducts
    .filter(product => trendingProductIds.includes(product.id))
    .slice(0, limit);
  
  // 为每个结果分配图片并添加趋势相关属性，确保ID和图片匹配
  return trendingProducts.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 5) imageIndex = 2;      // 电视 - trending_2.jpg
    else if (product.id === 11) imageIndex = 3; // 电动牙刷 - trending_3.jpg
    else if (product.id === 12) imageIndex = 4; // 智能体脂秤 - trending_4.jpg
    else if (product.id === 14) imageIndex = 5; // 投影仪 - trending_5.jpg
    
    return {
      ...product,
      trendingRank: index + 1,
      growthRate: Math.floor(Math.random() * 200) + 50 + '%',
      image: `/images/products/trending_${imageIndex}.jpg`
    };
  });
};

/**
 * 获取高端商品
 * @param {number} limit 返回数量限制
 * @returns {Array} 高端商品列表
 */
const getPremiumProducts = (limit = 5) => {
  // 为高端商品准备的特定ID，选择更符合图片内容的商品
  const premiumProductIds = [6, 2, 13, 1, 4]; // 笔记本电脑、智能手机、咖啡机、扫地机器人、智能手表
  
  // 从特定ID中选择商品
  const premiumProducts = mockProducts
    .filter(product => premiumProductIds.includes(product.id))
    .slice(0, limit);
  
  // 为每个结果分配图片并添加高端相关属性，确保ID和图片匹配
  return premiumProducts.map((product, index) => {
    // 根据产品ID分配特定图片
    let imageIndex = 1;
    if (product.id === 2) imageIndex = 2;      // 智能手机 - premium_2.jpg
    else if (product.id === 13) imageIndex = 3; // 咖啡机 - premium_3.jpg
    else if (product.id === 1) imageIndex = 4;  // 扫地机器人 - premium_4.jpg
    else if (product.id === 4) imageIndex = 5;  // 智能手表 - premium_5.jpg
    
    return {
      ...product,
      isPremium: true,
      originalPrice: Math.round(product.price * 1.2), // 添加原价，显示折扣
      image: `/images/products/premium_${imageIndex}.jpg`
    };
  });
};

/**
 * 清除用户行为数据（用于测试或用户请求）
 */
const clearUserBehaviorData = () => {
  userBehaviorData = {
    viewHistory: [],
    purchaseHistory: [],
    searchHistory: [],
    favoriteItems: [],
    ratings: {},
    categoryPreferences: {},
    tagPreferences: {}
  };
  
  saveUserBehaviorData();
};

// 获取用户行为数据的方法
const getUserBehaviorData = () => ({ ...userBehaviorData });

// 导出获取所有商品的方法
const getAllProducts = () => [...mockProducts];

// 初始化推荐系统
initRecommendationSystem();

// 导出方法
export {
  recordProductView,
  recordProductPurchase,
  recordSearch,
  toggleFavorite,
  recordRating,
  getPersonalizedRecommendations,
  getPopularProducts,
  getSimilarProducts,
  getUserBehaviorData,
  clearUserBehaviorData,
  getAllProducts,
  getNewProducts,
  getTrendingProducts,
  getPremiumProducts
}; 