/**
 * AI导购助手服务
 * 提供增强型购物体验，包括产品推荐、多模态搜索和智能导购功能
 */
import { streamEnhancedMessageToAI } from './enhancedAiService';
import { getAllProducts, searchProducts } from './searchService';
import { getUserPreferences, getViewHistory } from './userService';
import { getProductById } from './productService';

// 推荐类型
export const RECOMMENDATION_TYPES = {
  PERSONALIZED: 'personalized',  // 个性化推荐
  SIMILAR: 'similar',            // 相似商品推荐
  FREQUENTLY_BOUGHT: 'frequently_bought',  // 经常一起购买 
  TRENDING: 'trending',          // 热门趋势
  PRICE_DROP: 'price_drop',      // 降价商品
  SEASONAL: 'seasonal'           // 季节性推荐
};

// 导购阶段
export const SHOPPING_STAGES = {
  DISCOVERY: 'discovery',       // 发现阶段
  CONSIDERATION: 'consideration', // 考虑阶段
  DECISION: 'decision',         // 决策阶段
  CHECKOUT: 'checkout',         // 结算阶段
  AFTER_SALES: 'aftersales'     // 售后阶段
};

/**
 * 发送消息到AI并获取响应
 * @param {string} message 用户消息
 * @param {Array} history 对话历史
 * @param {Function} onStreamingMessage 流式消息回调
 * @returns {Promise<Object>} AI响应
 */
export const sendMessageToAI = async (message, history = [], onStreamingMessage = null) => {
  try {
    return await streamEnhancedMessageToAI(message, history, onStreamingMessage);
  } catch (error) {
    console.error('发送消息到AI失败:', error);
    throw error;
  }
};

/**
 * 获取个性化推荐产品
 * @param {number} limit 返回的最大商品数量
 * @returns {Promise<Array>} 推荐商品数组
 */
export const getPersonalizedRecommendations = async (limit = 4) => {
  try {
    // 获取用户偏好和浏览历史
    const preferences = await getUserPreferences();
    const viewHistory = await getViewHistory(10);
    
    // 所有产品
    const allProducts = await getAllProducts();
    
    // 推荐算法
    // 1. 根据用户偏好筛选
    let recommendedProducts = allProducts.filter(product => {
      // 匹配类别偏好
      if (preferences.categories && 
          preferences.categories.length > 0 && 
          product.category) {
        if (preferences.categories.includes(product.category)) {
          return true;
        }
      }
      
      // 匹配品牌偏好
      if (preferences.brands && 
          preferences.brands.length > 0 && 
          product.brand) {
        if (preferences.brands.includes(product.brand)) {
          return true;
        }
      }
      
      return false;
    });
    
    // 2. 根据浏览历史推荐相似产品
    if (recommendedProducts.length < limit && viewHistory.length > 0) {
      const viewedCategories = viewHistory
        .map(item => item.category)
        .filter(Boolean);
      
      const viewedBrands = viewHistory
        .map(item => item.brand)
        .filter(Boolean);
      
      const similarProducts = allProducts.filter(product => {
        if (recommendedProducts.includes(product)) {
          return false;
        }
        
        if (viewedCategories.includes(product.category)) {
          return true;
        }
        
        if (viewedBrands.includes(product.brand)) {
          return true;
        }
        
        return false;
      });
      
      recommendedProducts = [
        ...recommendedProducts,
        ...similarProducts
      ];
    }
    
    // 3. 如果推荐数量仍不足，添加热门商品
    if (recommendedProducts.length < limit) {
      const trendingProducts = allProducts
        .filter(product => !recommendedProducts.includes(product))
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      
      recommendedProducts = [
        ...recommendedProducts,
        ...trendingProducts
      ];
    }
    
    // 裁剪到要求数量并返回
    return recommendedProducts.slice(0, limit);
  } catch (error) {
    console.error('获取个性化推荐失败:', error);
    throw error;
  }
};

/**
 * 分析用户问题并提取关键信息
 * @param {string} question 用户问题
 * @returns {Object} 包含问题类型、提取关键词和建议操作的对象
 */
export const analyzeUserQuestion = async (question) => {
  // 识别问题类型的正则表达式
  const patterns = {
    comparison: /比较|对比|区别|差异|哪个好|哪款好|选择|推荐/i,
    recommendation: /推荐|建议|有什么好|适合我/i,
    productInfo: /多少钱|价格|特点|功能|参数|规格|配置|怎么样/i,
    discount: /优惠|打折|促销|便宜|特价|活动|满减/i,
    availability: /有货|库存|什么时候|上架|发售/i
  };
  
  // 识别问题类型
  let questionType = 'general';
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(question)) {
      questionType = type;
      break;
    }
  }
  
  // 提取产品关键词（简化版，实际应使用NLP技术）
  let keywords = question.split(/\s+/).filter(word => word.length > 1);
  
  // 从问题中提取产品名称或类别
  const productCategories = ['手机', '电脑', '电视', '冰箱', '相机', '耳机', '平板'];
  const extractedCategories = productCategories.filter(category => question.includes(category));
  
  // 从问题中提取品牌名称
  const brands = ['苹果', '华为', '小米', '三星', '索尼', '戴尔', '联想'];
  const extractedBrands = brands.filter(brand => question.includes(brand));
  
  // 获取建议回复和操作
  let suggestedAction = null;
  
  if (questionType === 'comparison' || questionType === 'recommendation') {
    suggestedAction = {
      type: 'RECOMMEND_PRODUCTS',
      description: '根据用户需求推荐相关产品'
    };
  } else if (questionType === 'discount') {
    suggestedAction = {
      type: 'SEARCH_DISCOUNTS',
      description: '查找相关优惠活动和折扣商品'
    };
  } else if (extractedBrands.length >= 2 || extractedCategories.length >= 2) {
    suggestedAction = {
      type: 'COMPARE_PRODUCTS',
      description: '比较用户提到的多个产品'
    };
  }
  
  return {
    questionType,
    keywords,
    extractedCategories,
    extractedBrands,
    suggestedAction
  };
};

/**
 * 根据用户的输入智能推荐相关商品
 * @param {string} userInput 用户输入
 * @param {number} limit 返回的最大商品数量
 * @returns {Promise<Array>} 推荐商品数组
 */
export const getSmartRecommendations = async (userInput, limit = 4) => {
  try {
    // 分析用户输入
    const analysis = await analyzeUserQuestion(userInput);
    let recommendedProducts = [];
    
    // 基于分析结果获取推荐
    if (analysis.suggestedAction) {
      switch (analysis.suggestedAction.type) {
        case 'RECOMMEND_PRODUCTS':
          // 搜索符合条件的商品
          const searchParams = {};
          if (analysis.extractedCategories.length > 0) {
            searchParams.category = analysis.extractedCategories[0];
          }
          if (analysis.extractedBrands.length > 0) {
            searchParams.brand = analysis.extractedBrands[0];
          }
          
          recommendedProducts = await searchProducts(searchParams, limit);
          break;
          
        case 'COMPARE_PRODUCTS':
          // 获取要比较的商品
          const searchTerms = [...analysis.extractedCategories, ...analysis.extractedBrands];
          if (searchTerms.length > 0) {
            recommendedProducts = await searchProducts({
              keywords: searchTerms.join(' ')
            }, limit);
          }
          break;
          
        case 'SEARCH_DISCOUNTS':
          // 搜索优惠商品
          recommendedProducts = await searchProducts({
            hasDiscount: true,
            category: analysis.extractedCategories[0] || '',
            brand: analysis.extractedBrands[0] || ''
          }, limit);
          break;
      }
    }
    
    // 如果没有找到特定推荐，则基于关键词搜索
    if (recommendedProducts.length === 0 && analysis.keywords.length > 0) {
      recommendedProducts = await searchProducts({
        keywords: analysis.keywords.join(' ')
      }, limit);
    }
    
    return recommendedProducts;
  } catch (error) {
    console.error('获取智能推荐失败:', error);
    throw error;
  }
};

/**
 * 获取个性化购物建议
 * @returns {Promise<Array>} 购物建议数组
 */
export const getPersonalizedSuggestions = async () => {
  try {
    // 这里应该调用实际API，暂时返回模拟数据
    return [
      '有什么新款手机推荐？',
      '预算2000元以内的耳机',
      '性价比高的笔记本电脑',
      '适合送礼的电子产品'
    ];
  } catch (error) {
    console.error('获取个性化购物建议失败:', error);
    throw error;
  }
};

/**
 * 根据商品ID获取详细信息和推荐
 * @param {string|number} productId 商品ID
 * @returns {Promise<Object>} 详细的商品信息
 */
export const getProductDetails = async (productId) => {
  try {
    const product = await getProductById(productId);
    
    // 获取相似商品
    const similarProducts = await searchProducts({
      category: product.category,
      brand: product.brand
    }, 3);
    
    // 过滤掉当前商品
    const filteredSimilarProducts = similarProducts.filter(p => 
      p.id.toString() !== productId.toString()
    );
    
    return {
      ...product,
      similarProducts: filteredSimilarProducts
    };
  } catch (error) {
    console.error('获取商品详情失败:', error);
    throw error;
  }
};

/**
 * 一键下单功能 - 直接将AI推荐商品添加到购物车
 * @param {Object} product 产品对象
 * @param {number} quantity 数量
 * @param {Function} addToCartFunction 添加到购物车的函数
 * @returns {Promise<Object>} 操作结果
 */
export const oneClickAddToCart = async (product, quantity = 1, addToCartFunction) => {
  try {
    // 检查商品库存
    if (!product || product.stock < quantity) {
      return {
        success: false,
        message: '商品库存不足'
      };
    }
    
    // 使用提供的addToCart函数添加到购物车
    if (addToCartFunction) {
      const result = addToCartFunction(product, quantity);
      
      if (result) {
        return {
          success: true,
          message: `已将 ${product.name} 添加到购物车`,
          product
        };
      }
    }
    
    return {
      success: false,
      message: '添加到购物车失败'
    };
  } catch (error) {
    console.error('一键下单失败:', error);
    return {
      success: false,
      message: '发生错误，请稍后再试'
    };
  }
};

/**
 * 获取购物表单智能预填功能
 * @param {Object} user 用户信息
 * @param {Array} cartItems 购物车商品
 * @returns {Promise<Object>} 预填表单数据
 */
export const getSmartFormFill = async (user, cartItems) => {
  try {
    if (!user) {
      return null;
    }
    
    // 智能分析购物车中的商品类型
    let hasDigitalProducts = false;
    let hasPhysicalProducts = false;
    
    cartItems.forEach(item => {
      // 简单判断数字产品和实体产品
      if (item.category === '软件' || item.category === '电子书' || item.category === '视频课程') {
        hasDigitalProducts = true;
      } else {
        hasPhysicalProducts = true;
      }
    });
    
    // 根据用户历史数据和当前购物车预测最佳配送方式
    let suggestedShippingMethod = 'standard';
    
    // 如果购物车金额较大，建议使用更安全的配送方式
    if (cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) > 1000) {
      suggestedShippingMethod = 'insured';
    }
    
    // 如果只有数字产品，不需要配送
    if (hasDigitalProducts && !hasPhysicalProducts) {
      suggestedShippingMethod = 'digital';
    }
    
    return {
      // 地址信息(来自用户档案)
      addressInfo: {
        name: user.name,
        phone: user.phone,
        address: user.defaultAddress || ''
      },
      
      // 支付偏好
      paymentPreference: user.preferredPayment || 'alipay',
      
      // 送货偏好
      shippingPreference: suggestedShippingMethod,
      
      // 是否纯数字产品
      isDigitalOnly: hasDigitalProducts && !hasPhysicalProducts,
      
      // 其他智能建议
      suggestions: {
        // 如果购物车中有电子产品，建议添加延保服务
        addWarranty: cartItems.some(item => 
          ['手机', '电脑', '电视', '相机'].includes(item.category) && item.price > 1000
        ),
        
        // 如果是礼物，建议添加礼品包装
        giftWrapping: false,
        
        // 优惠券建议
        suggestedCoupon: null
      }
    };
  } catch (error) {
    console.error('获取智能表单预填失败:', error);
    return null;
  }
};

/**
 * 格式化产品推荐结果，添加附加信息
 * @param {Array} products 产品数组
 * @param {string} recommendationType 推荐类型
 * @returns {Object} 格式化后的推荐结果
 */
export const formatProductRecommendations = (products, recommendationType = RECOMMENDATION_TYPES.PERSONALIZED) => {
  if (!products || products.length === 0) {
    return {
      type: recommendationType,
      products: [],
      count: 0
    };
  }

  // 根据推荐类型添加特定标记
  const enhancedProducts = products.map(product => {
    const enhanced = { ...product };

    switch (recommendationType) {
      case RECOMMENDATION_TYPES.PRICE_DROP:
        enhanced.priceDrop = true;
        enhanced.priceDropPercentage = Math.floor(Math.random() * 30) + 5; // 模拟5%-35%的降价
        break;
      case RECOMMENDATION_TYPES.TRENDING:
        enhanced.trending = true;
        enhanced.trendingRank = Math.floor(Math.random() * 100) + 1; // 模拟热度排名
        break;
      case RECOMMENDATION_TYPES.FREQUENTLY_BOUGHT:
        enhanced.frequentlyBoughtWith = true;
        break;
      case RECOMMENDATION_TYPES.SEASONAL:
        enhanced.seasonal = true;
        enhanced.seasonalTag = '夏季热卖';
        break;
    }

    return enhanced;
  });

  return {
    type: recommendationType,
    products: enhancedProducts,
    count: enhancedProducts.length,
    timestamp: new Date().toISOString()
  };
};

/**
 * 从图片中识别产品
 * @param {File|Blob|string} image 图片文件、Blob或图片URL
 * @returns {Promise<Array>} 识别结果和相似产品
 */
export const recognizeProductFromImage = async (image) => {
  try {
    // 在实际应用中，这里应发送图片到后端API进行处理
    // 模拟延迟以模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟识别结果
    const mockRecognitionResults = {
      success: true,
      recognized: true,
      confidence: 0.87,
      product: {
        id: 1001,
        name: '智能手表 Pro',
        category: '智能穿戴',
        brand: '小米',
        price: 999,
        rating: 4.6,
        image: 'https://via.placeholder.com/150',
        description: '高清彩屏，多功能NFC，续航长达14天',
        features: ['心率监测', '睡眠追踪', 'GPS定位', '防水50米']
      },
      similarProducts: [
        {
          id: 1002,
          name: '智能手环5',
          category: '智能穿戴',
          brand: '小米',
          price: 189,
          rating: 4.5,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: 1003,
          name: '智能手表 SE',
          category: '智能穿戴',
          brand: '华为',
          price: 799,
          rating: 4.7,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: 1004,
          name: '运动智能手表',
          category: '智能穿戴',
          brand: '三星',
          price: 1299,
          rating: 4.4,
          image: 'https://via.placeholder.com/150'
        }
      ]
    };
    
    return mockRecognitionResults;
  } catch (error) {
    console.error('图片识别产品失败:', error);
    return {
      success: false,
      message: '图片识别失败，请重试',
      error: error.message
    };
  }
};

export default {
  sendMessageToAI,
  getPersonalizedRecommendations,
  getSmartRecommendations,
  getPersonalizedSuggestions,
  getProductDetails,
  analyzeUserQuestion,
  oneClickAddToCart,
  getSmartFormFill,
  formatProductRecommendations,
  recognizeProductFromImage,
  RECOMMENDATION_TYPES,
  SHOPPING_STAGES
};