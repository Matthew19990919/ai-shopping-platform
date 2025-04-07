/**
 * 增强版AI购物推荐服务
 * 提供更高级的智能推荐功能，包括个性化推荐、上下文理解和多模态推荐
 */
import deepseekService from './deepseekService';
import { getAllProducts } from './searchService';
import { getUserPreferences, getViewHistory } from './userService';
import { FILTER_STAGES, analyzeFilterStage } from './filterService';

// 默认配置
let config = {
  useDeepSeekAPI: true,
  apiKey: "",
  enablePersonalization: true,
  enableContextualRecommendations: true,
  enableMultimodalRecommendations: false,
  maxRecommendations: 5
};

// 对话历史
let conversationHistory = [];

/**
 * 配置AI服务
 * @param {Object} newConfig 新配置
 */
export const configureEnhancedAIService = (newConfig = {}) => {
  config = { ...config, ...newConfig };
  
  if (config.useDeepSeekAPI && config.apiKey) {
    deepseekService.setApiKey(config.apiKey);
  }
};

/**
 * 清除对话历史
 */
export const clearConversationHistory = () => {
  conversationHistory = [];
};

/**
 * 生成系统提示
 * @param {Object} userData 用户数据
 * @returns {string} 系统提示
 */
const generateSystemPrompt = (userData = null) => {
  let basePrompt = `你是一个专业的电商导购助手，你的任务是帮助用户找到他们想要的商品。
你应该：
1. 根据用户描述的需求，推荐合适的商品
2. 耐心解答用户关于商品的规格、功能、价格等问题
3. 提供专业的购买建议，但不要过度推销
4. 使用友好、专业的语气，简明扼要地回答问题
5. 只回答与电商和商品相关的问题
6. 对比不同商品的优缺点，帮助用户做出购买决策
7. 考虑用户的预算、需求和场景，给出个性化建议

重要：你要遵循"沙漏模型"帮助用户筛选商品，从大量选择逐步缩小到最终的精准推荐：
1. 初始阶段：了解用户的大致需求和场景
2. 需求阶段：明确产品类别和关键功能要求
3. 筛选阶段：根据价格、品牌、规格等具体参数缩小范围
4. 对比阶段：对少数几个产品进行详细对比
5. 决策阶段：针对1-2个最符合需求的产品做最终推荐

在对话过程中，主动引导用户逐步明确需求，不要一次提供过多选择。`;

  // 添加用户个性化信息
  if (userData && config.enablePersonalization) {
    let personalizedPrompt = "\n\n用户偏好信息：";
    
    if (userData.preferences && Object.keys(userData.preferences).length > 0) {
      const { categories, brands, priceRange } = userData.preferences;
      
      if (categories && Object.keys(categories).length > 0) {
        const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
          .map(([category]) => category);
        
        personalizedPrompt += `\n- 常浏览类别: ${topCategories.join('、')}`;
      }
      
      if (brands && Object.keys(brands).length > 0) {
        const topBrands = Object.entries(brands)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([brand]) => brand);
        
        personalizedPrompt += `\n- 常浏览品牌: ${topBrands.join('、')}`;
      }
      
      if (priceRange) {
        personalizedPrompt += `\n- 价格偏好: ${priceRange.min}元-${priceRange.max}元`;
      }
    }
    
    if (userData.viewHistory && userData.viewHistory.length > 0) {
      const recentViews = userData.viewHistory
        .slice(0, 3)
        .map(item => item.title || item.name);
      
      if (recentViews.length > 0) {
        personalizedPrompt += `\n- 最近浏览: ${recentViews.join('、')}`;
      }
    }
    
    if (personalizedPrompt !== "\n\n用户偏好信息：") {
      basePrompt += personalizedPrompt;
    }
  }
  
  // 防止重复回答问题 - 增强此部分指令，使其更明确
  basePrompt += `\n\n非常重要：请严格避免在回复中出现任何形式的重复文本。具体来说：
1. 不要重复词语或短语，如"手机手机"、"很高兴很高兴"
2. 不要重复句子结构
3. 确保你的表达简洁、清晰，没有冗余
4. 回答前请检查你的回复是否有任何不必要的重复内容
5. 使用多样化的表达方式，避免重复使用相同的词语或句式

请保持简洁和准确，每个概念只表达一次。`;

  return basePrompt;
};

/**
 * 向AI发送消息并获取响应
 * @param {string} message 用户消息
 * @returns {Promise<string>} AI响应
 */
export const sendEnhancedMessageToAI = async (message) => {
  try {
    // 获取用户数据以进行个性化推荐
    let userData = null;
    if (config.enablePersonalization) {
      userData = {
        preferences: await getUserPreferences(),
        viewHistory: await getViewHistory(10) // 获取最近10条浏览记录
      };
    }
    
    // 添加用户消息到对话历史
    conversationHistory.push({ role: "user", content: message });
    
    // 获取AI响应
    let aiResponse = "";
    
    if (config.useDeepSeekAPI) {
      // 分析当前筛选阶段
      const currentStage = analyzeFilterStage(conversationHistory);
      
      // 创建系统提示
      const systemPrompt = generateSystemPrompt(userData);
      let stagePrompt = "";
      
      // 根据筛选阶段添加额外的阶段提示
      if (currentStage !== FILTER_STAGES.INITIAL) {
        stagePrompt = getStagePrompt(currentStage);
      }
      
      // 合并系统提示和阶段提示
      const fullSystemPrompt = stagePrompt ? 
        `${systemPrompt}\n\n${stagePrompt}` : 
        systemPrompt;
      
      // 创建包含系统提示的完整消息历史
      const fullMessages = [
        { role: "system", content: fullSystemPrompt },
        ...conversationHistory
      ];
      
      // 调用DeepSeek API
      aiResponse = await deepseekService.chatWithDeepSeek(fullMessages);
    } else {
      // 使用模拟响应（实际部署时应删除）
      aiResponse = await generateSimulatedResponse(message, userData);
    }
    
    // 添加响应到对话历史
    conversationHistory.push({ role: "assistant", content: aiResponse });
    
    // 增强响应（添加产品推荐）
    const enhancedResponse = await enhanceResponseWithRecommendations(message, aiResponse, userData);
    
    // 保存对话记录（可选，实际实现应添加）
    // saveConversationToHistory(message, enhancedResponse);
    
    return enhancedResponse;
  } catch (error) {
    console.error('生成AI响应失败:', error);
    return '抱歉，我暂时无法处理您的请求。请稍后再试。';
  }
};

/**
 * 检测并修复文本中的重叠重复问题
 * @param {string} prevText 之前的文本
 * @param {string} newChunk 新的文本块
 * @param {number} overlapCheckLength 检查重叠的长度
 * @returns {string} 去除重复后的新文本块
 */
const removeChunkOverlap = (prevText, newChunk, overlapCheckLength = 10) => {
  if (!prevText || !newChunk) return newChunk;
  
  // 获取前一个文本的末尾部分和新块的开始部分
  const prevEnd = prevText.substring(Math.max(0, prevText.length - overlapCheckLength * 2));
  const newStart = newChunk.substring(0, Math.min(newChunk.length, overlapCheckLength * 2));
  
  // 检查重叠模式 - 从最长的可能重叠开始检查
  for (let i = overlapCheckLength; i >= 2; i--) {
    // 如果前一个文本太短，直接跳过
    if (prevEnd.length < i) continue;
    
    const prevEndPart = prevEnd.substring(prevEnd.length - i);
    
    // 如果新块以前一块的结尾开始，则为重叠
    if (newStart.startsWith(prevEndPart)) {
      return newChunk.substring(i); // 移除重叠部分
    }
    
    // 检查是否有更复杂的重叠模式，如"笔记本电脑笔记本电脑"
    const combinedText = prevEnd + newStart;
    const pattern = new RegExp(`(\\S{${i}})(\\s*)\\1`, 'g');
    
    if (pattern.test(combinedText)) {
      // 尝试找到重叠的起始位置
      const match = combinedText.match(pattern);
      if (match && match[0]) {
        const overlapStart = combinedText.lastIndexOf(match[0]) + match[0].length / 2;
        const relativePosition = overlapStart - prevEnd.length;
        if (relativePosition >= 0 && relativePosition < newChunk.length) {
          return newChunk.substring(Math.min(newChunk.length, relativePosition));
        }
      }
    }
  }
  
  // 处理中文常见的词语重复，如"很高兴很高兴"
  const chinesePattern = /(\p{Script=Han}{1,5})(\s*)\1$/u;
  const match = prevEnd.match(chinesePattern);
  
  if (match && newStart.startsWith(match[1])) {
    return newChunk.substring(match[1].length);
  }
  
  return newChunk;
};

/**
 * 流式向AI发送消息并获取响应
 * @param {string} message 用户消息
 * @param {Function} onChunk 处理响应块的回调
 */
export const streamEnhancedMessageToAI = async (message, onChunk) => {
  try {
    // 获取用户数据
    let userData = null;
    if (config.enablePersonalization) {
      userData = {
        preferences: await getUserPreferences(),
        viewHistory: await getViewHistory(10)
      };
    }
    
    // 添加用户消息到对话历史
    conversationHistory.push({ role: "user", content: message });
    
    // 分析当前筛选阶段
    const currentStage = analyzeFilterStage(conversationHistory);
    
    // 创建完整消息历史，只添加一个系统提示
    const systemPrompt = generateSystemPrompt(userData);
    let stagePrompt = "";
    
    // 根据筛选阶段添加额外的阶段提示
    if (currentStage !== FILTER_STAGES.INITIAL) {
      stagePrompt = getStagePrompt(currentStage);
    }
    
    // 合并系统提示和阶段提示
    const fullSystemPrompt = stagePrompt ? 
      `${systemPrompt}\n\n${stagePrompt}` : 
      systemPrompt;
    
    const fullMessages = [
      { role: "system", content: fullSystemPrompt },
      ...conversationHistory
    ];
    
    // 收集完整响应
    let fullResponse = "";
    let lastChunk = ""; // 用于跟踪最后一个处理过的文本块
    
    // 流式调用DeepSeek API
    await deepseekService.streamChatWithDeepSeek(
      fullMessages,
      (chunk) => {
        // 处理chunk重叠
        const processedChunk = removeChunkOverlap(lastChunk, chunk);
        fullResponse += processedChunk;
        lastChunk = fullResponse.substring(Math.max(0, fullResponse.length - 20)); // 保留最后20个字符用于后续比较
        
        // 将处理后的chunk传给回调
        if (processedChunk) {
          onChunk(processedChunk);
        }
      }
    );
    
    // 添加AI响应到对话历史
    conversationHistory.push({ role: "assistant", content: fullResponse });
    
    // 可能在流式响应完成后添加产品推荐
    setTimeout(async () => {
      try {
        // 提取关键词
        const keywords = extractProductKeywords(fullResponse);
        
        if (keywords.length > 0) {
          // 获取产品，考虑当前筛选阶段
          const products = await getRecommendedProducts(keywords, userData, currentStage);
          
          if (products.length > 0) {
            // 如果找到产品，通过回调函数发送产品推荐
            const productRecommendation = formatProductsMessage(products, currentStage);
            onChunk("\n\n" + productRecommendation, true);
            
            // 在对比和决策阶段，可能添加价格分析
            if (
              (currentStage === FILTER_STAGES.COMPARE || currentStage === FILTER_STAGES.DECISION) && 
              products.length === 1 && 
              message.toLowerCase().includes('价格') 
            ) {
              onChunk("\n\n以下是该产品的价格分析：\n\n[[price-analysis]]", true);
            }
          }
        }
      } catch (err) {
        console.error('生成产品推荐出错:', err);
      }
    }, 500);
  } catch (error) {
    console.error('流式AI响应生成失败:', error);
    onChunk('抱歉，我暂时无法处理您的请求。请稍后再试。');
  }
};

/**
 * 用产品推荐增强AI响应
 * @param {string} userMessage 用户消息
 * @param {string} aiResponse AI响应
 * @param {Object} userData 用户数据
 * @returns {Promise<string>} 增强后的响应
 */
const enhanceResponseWithRecommendations = async (userMessage, aiResponse, userData = null) => {
  // 检查响应是否已经包含商品卡片标记
  if (aiResponse.includes("[[product:") || aiResponse.includes("这里是一些您可能感兴趣的商品")) {
    return aiResponse;
  }
  
  // 提取产品关键词
  const keywords = extractProductKeywords(userMessage + " " + aiResponse);
  
  if (keywords.length > 0) {
    // 获取推荐商品
    const products = await getRecommendedProducts(keywords, userData);
    
    // 如果找到匹配商品，在回复中添加商品卡片
    if (products.length > 0) {
      // 根据不同情况使用不同的引导文本
      const introTexts = [
        "这里是一些您可能感兴趣的商品：",
        "根据您的需求，我为您推荐以下商品：",
        "您可能会对这些商品感兴趣：",
        "为您精选的相关商品："
      ];
      
      const introText = introTexts[Math.floor(Math.random() * introTexts.length)];
      const productCards = products.map(formatProductForRecommendation).join('\n\n');
      
      return `${aiResponse}\n\n${introText}\n\n${productCards}`;
    }
  }
  
  return aiResponse;
};

/**
 * 从文本中提取产品关键词
 * @param {string} text 文本
 * @returns {Array} 关键词数组
 */
const extractProductKeywords = (text) => {
  // 产品类别关键词
  const categoryKeywords = [
    '手机', '电脑', '笔记本', '平板', '耳机', '相机', '电视', '冰箱', '洗衣机', '空调', 
    '吸尘器', '电饭煲', '衣服', '鞋子', '包包', '化妆品', '面膜', '香水', '洗发水',
    '零食', '饮料', '食品', '家具', '床上用品', '厨房用品'
  ];
  
  // 品牌关键词
  const brandKeywords = [
    '苹果', '华为', '小米', '三星', '索尼', '惠普', '联想', '戴尔', '耐克', '阿迪达斯',
    'iphone', 'apple', 'huawei', 'xiaomi', 'samsung', 'sony', 'hp', 'lenovo', 'dell',
    'nike', 'adidas'
  ];
  
  // 提取类别关键词
  const foundCategories = categoryKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // 提取品牌关键词
  const foundBrands = brandKeywords.filter(brand => 
    text.toLowerCase().includes(brand.toLowerCase())
  );
  
  // 提取价格关键词
  const priceMatches = text.match(/(\d+)元|(\d+)块钱|价格(\d+)|(\d+)00左右/g);
  const foundPrices = priceMatches ? 
    priceMatches.map(match => match.replace(/[^0-9]/g, '')) : 
    [];
  
  // 合并所有关键词并去重
  return [...new Set([...foundCategories, ...foundBrands, ...foundPrices])];
};

/**
 * 获取推荐产品列表 - 更优化的版本，支持更智能的产品匹配
 */
const getRecommendedProducts = async (keywords, userData = null, currentStage = FILTER_STAGES.INITIAL) => {
  // 根据筛选阶段调整返回的产品数量
  let maxProducts = 10;
  switch (currentStage) {
    case FILTER_STAGES.NEEDS:
      maxProducts = 8;
      break;
    case FILTER_STAGES.PARAMETERS:
      maxProducts = 5;
      break;
    case FILTER_STAGES.COMPARISON:
      maxProducts = 3;
      break;
    case FILTER_STAGES.DECISION:
      maxProducts = 2;
      break;
    default:
      maxProducts = 10;
  }
  
  // 查询产品
  const products = await getAllProducts();
  
  // 关键词分析与特征提取
  const categories = extractCategories(keywords);
  const brands = extractBrands(keywords);
  const features = extractFeatures(keywords);
  const priceRange = extractPriceRange(keywords);
  
  console.log('AI推荐系统分析关键词:', { 
    keywords, 
    categories, 
    brands, 
    features, 
    priceRange, 
    currentStage 
  });
  
  // 根据关键词过滤和排序产品
  let matchedProducts = products.map(product => {
    // 初始匹配分数
    let matchScore = 0;
    const productName = product.name.toLowerCase();
    const productDesc = product.description ? product.description.toLowerCase() : '';
    const productCategory = product.category ? product.category.toLowerCase() : '';
    const productBrand = product.brand ? product.brand.toLowerCase() : '';
    
    // 1. 关键词匹配 (基础匹配)
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      if (productName.includes(lowerKeyword)) matchScore += 3;
      if (productDesc.includes(lowerKeyword)) matchScore += 2;
      if (productCategory.includes(lowerKeyword)) matchScore += 2;
      if (productBrand.includes(lowerKeyword)) matchScore += 3;
    });
    
    // 2. 类别匹配 (提升权重)
    if (categories.length > 0) {
      const categoryMatch = categories.some(cat => 
        productCategory.includes(cat.toLowerCase()) || 
        productName.includes(cat.toLowerCase())
      );
      if (categoryMatch) matchScore += 6;
    }
    
    // 3. 品牌匹配 (提升权重)
    if (brands.length > 0) {
      const brandMatch = brands.some(brand => 
        productBrand.includes(brand.toLowerCase()) || 
        productName.includes(brand.toLowerCase())
      );
      if (brandMatch) matchScore += 5;
    }
    
    // 4. 特性匹配
    if (features.length > 0) {
      let featureMatchCount = 0;
      
      features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if (productName.includes(lowerFeature) || 
            productDesc.includes(lowerFeature) ||
            (product.features && product.features.some(f => f.toLowerCase().includes(lowerFeature)))) {
          featureMatchCount++;
        }
      });
      
      // 根据匹配的特性数量加分
      matchScore += featureMatchCount * 3;
    }
    
    // 5. 价格范围匹配
    if (priceRange.min !== null || priceRange.max !== null) {
      const price = parseFloat(product.price);
      
      if (priceRange.min !== null && priceRange.max !== null) {
        // 完全在价格范围内得高分
        if (price >= priceRange.min && price <= priceRange.max) {
          matchScore += 5;
        } 
        // 接近价格范围也得一定分数
        else if (price >= priceRange.min * 0.8 && price <= priceRange.max * 1.2) {
          matchScore += 2;
        }
      } else if (priceRange.min !== null) {
        if (price >= priceRange.min) matchScore += 3;
      } else if (priceRange.max !== null) {
        if (price <= priceRange.max) matchScore += 3;
      }
    }
    
    // 6. 考虑用户偏好 (如果有)
    if (userData && userData.preferences) {
      const { categories: userCategories, brands: userBrands } = userData.preferences;
      
      // 加权用户喜欢的品牌
      if (userBrands && Object.keys(userBrands).length > 0) {
        const userBrandsList = Object.keys(userBrands);
        if (userBrandsList.some(brand => 
          productBrand.includes(brand.toLowerCase()) || 
          productName.includes(brand.toLowerCase())
        )) {
          matchScore += 4;
        }
      }
      
      // 加权用户喜欢的类别
      if (userCategories && Object.keys(userCategories).length > 0) {
        const userCategoriesList = Object.keys(userCategories);
        if (userCategoriesList.some(cat => 
          productCategory.includes(cat.toLowerCase())
        )) {
          matchScore += 3;
        }
      }
    }
    
    // 为搜索结果添加匹配分数
    return { ...product, matchScore };
  });
  
  // 过滤掉匹配度为0的产品
  matchedProducts = matchedProducts.filter(product => product.matchScore > 0);
  
  // 根据匹配分数排序
  matchedProducts.sort((a, b) => b.matchScore - a.matchScore);
  
  // 如果没有找到产品，放宽条件再搜索一次
  if (matchedProducts.length === 0) {
    // 首先尝试只用类别进行匹配
    if (categories.length > 0) {
      matchedProducts = products
        .map(product => {
          const productCategory = product.category ? product.category.toLowerCase() : '';
          const productName = product.name.toLowerCase();
          
          let score = 0;
          categories.forEach(category => {
            if (productCategory.includes(category.toLowerCase()) || 
                productName.includes(category.toLowerCase())) {
              score += 3;
            }
          });
          
          return { ...product, matchScore: score };
        })
        .filter(product => product.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }
    
    // 如果仍然没找到，放宽到关键词的部分匹配
    if (matchedProducts.length === 0) {
      matchedProducts = products
        .map(product => {
          const allText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();
          
          let score = 0;
          keywords.forEach(keyword => {
            if (allText.includes(keyword.toLowerCase())) {
              score += 2;
            }
          });
          
          return { ...product, matchScore: score };
        })
        .filter(product => product.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }
  }
  
  // 如果仍然没有找到产品，返回一些热门产品
  if (matchedProducts.length === 0) {
    matchedProducts = products
      .sort((a, b) => {
        const aPopularity = a.sales || a.rating || 0;
        const bPopularity = b.sales || b.rating || 0;
        return bPopularity - aPopularity;
      })
      .slice(0, maxProducts)
      .map(product => ({ ...product, matchScore: 1 }));
  }
  
  // 根据筛选阶段限制返回数量
  return matchedProducts.slice(0, maxProducts);
};

// 辅助函数：从关键词中提取产品类别
const extractCategories = (keywords) => {
  const categoryKeywords = [
    '手机', '电脑', '笔记本', '平板', '电视', '冰箱', '洗衣机', '空调', 
    '相机', '耳机', '音箱', '手表', '服装', '鞋子', '包包', '化妆品', 
    '护肤', '食品', '零食', '饮料', '酒水', '家具', '厨具', '玩具', '礼品'
  ];
  
  return keywords.filter(keyword => 
    categoryKeywords.some(category => 
      keyword.toLowerCase().includes(category.toLowerCase())
    )
  );
};

// 辅助函数：从关键词中提取品牌
const extractBrands = (keywords) => {
  const brandKeywords = [
    '华为', '小米', 'OPPO', 'vivo', '荣耀', '苹果', 'iPhone', '三星', '联想',
    '戴尔', '惠普', '华硕', '宏碁', '微软', '雷蛇', '海尔', '美的', '格力',
    '西门子', '索尼', '松下', '飞利浦', '耐克', '阿迪达斯', '优衣库', '兰蔻',
    '雅诗兰黛', '欧莱雅', '三只松鼠', '良品铺子', '百草味', '茅台', '五粮液'
  ];
  
  return keywords.filter(keyword => 
    brandKeywords.some(brand => 
      keyword.toLowerCase().includes(brand.toLowerCase())
    )
  );
};

// 辅助函数：从关键词中提取产品特性
const extractFeatures = (keywords) => {
  const featureKeywords = [
    '高端', '入门', '性价比', '轻薄', '续航', '快充', '防水', '高清', '智能',
    '无线', '有线', '蓝牙', '5G', '4K', 'HDR', '游戏', '办公', '学生', '专业',
    '运动', '休闲', '保湿', '补水', '控油', '清洁', '美白', '营养', '健康', '礼盒'
  ];
  
  return keywords.filter(keyword => 
    featureKeywords.some(feature => 
      keyword.toLowerCase().includes(feature.toLowerCase())
    )
  );
};

// 辅助函数：从关键词中提取价格范围
const extractPriceRange = (keywords) => {
  const result = { min: null, max: null };
  
  // 查找价格范围模式：如"1000-2000元"，"1000以上"，"2000以下"，"1000元左右"
  for (const keyword of keywords) {
    // 模式1: 1000-2000元
    const rangeMatch = keyword.match(/(\d+)[-至到](\d+)元?/);
    if (rangeMatch) {
      result.min = parseInt(rangeMatch[1]);
      result.max = parseInt(rangeMatch[2]);
      break;
    }
    
    // 模式2: 1000元以上/以下/左右
    const thresholdMatch = keyword.match(/(\d+)元?(以上|以下|左右)/);
    if (thresholdMatch) {
      const price = parseInt(thresholdMatch[1]);
      const modifier = thresholdMatch[2];
      
      if (modifier === '以上') {
        result.min = price;
      } else if (modifier === '以下') {
        result.max = price;
      } else if (modifier === '左右') {
        result.min = price * 0.8;
        result.max = price * 1.2;
      }
      break;
    }
    
    // 模式3: 纯数字可能是价格
    const numberMatch = keyword.match(/^(\d+)元?$/);
    if (numberMatch) {
      const price = parseInt(numberMatch[1]);
      result.min = price * 0.8;
      result.max = price * 1.2;
      break;
    }
  }
  
  return result;
};

/**
 * 格式化产品用于推荐展示
 * @param {Object} product 产品对象
 * @returns {string} 格式化后的产品字符串
 */
const formatProductForRecommendation = (product) => {
  return `[[product:${product.id}]]
**${product.name}**
价格: ¥${parseFloat(product.price).toFixed(2)}
${product.description ? `简介: ${product.description}\n` : ''}
${product.rating ? `评分: ${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))} (${product.rating})` : ''}`;
};

/**
 * 格式化产品消息，根据阶段调整格式
 * @param {Array} products 产品列表
 * @param {string} currentStage 当前筛选阶段
 * @returns {string} 格式化后的消息
 */
const formatProductsMessage = (products, currentStage = FILTER_STAGES.INITIAL) => {
  if (!products || products.length === 0) {
    return "";
  }
  
  // 根据不同阶段使用不同的引导文本
  let introText = "";
  switch (currentStage) {
    case FILTER_STAGES.NEEDS:
      introText = "根据您的需求，这些类型的产品可能符合您的要求：";
      break;
    case FILTER_STAGES.FILTER:
      introText = "根据您提供的条件，已为您筛选出以下产品：";
      break;
    case FILTER_STAGES.COMPARE:
      introText = "这些产品最符合您的筛选条件，以下是详细对比：";
      break;
    case FILTER_STAGES.DECISION:
      introText = "经过分析，以下产品是最适合您需求的选择：";
      break;
    default:
      introText = "这里是一些您可能感兴趣的商品：";
  }
  
  // 将产品信息格式化为包含商品卡片的字符串
  const productsText = products.map(product => {
    return `[[product:${product.id}]]${getProductDescription(product, currentStage)}`;
  }).join("\n\n");
  
  return `${introText}\n\n${productsText}`;
};

/**
 * 根据阶段获取产品描述
 * @param {Object} product 产品
 * @param {string} currentStage 当前筛选阶段
 * @returns {string} 产品描述
 */
const getProductDescription = (product, currentStage) => {
  let description = `${product.name}`;
  
  // 根据阶段添加不同级别的详情
  switch (currentStage) {
    case FILTER_STAGES.NEEDS:
      // 基础信息
      description += `\n价格：¥${product.price}`;
      description += product.category ? `\n类别：${product.category}` : '';
      break;
      
    case FILTER_STAGES.FILTER:
      // 增加更多规格信息
      description += `\n价格：¥${product.price}`;
      description += product.category ? `\n类别：${product.category}` : '';
      description += product.brand ? `\n品牌：${product.brand}` : '';
      description += product.rating ? `\n评分：${product.rating}分` : '';
      break;
      
    case FILTER_STAGES.COMPARE:
    case FILTER_STAGES.DECISION:
      // 完整的详细信息
      description += `\n价格：¥${product.price}`;
      description += product.oldPrice ? ` (原价：¥${product.oldPrice})` : '';
      description += product.category ? `\n类别：${product.category}` : '';
      description += product.brand ? `\n品牌：${product.brand}` : '';
      description += product.rating ? `\n评分：${product.rating}分` : '';
      description += product.specifications ? `\n规格：${product.specifications}` : '';
      description += product.description ? `\n描述：${product.description}` : '';
      
      // 添加优缺点分析
      if (currentStage === FILTER_STAGES.DECISION) {
        description += '\n\n优点：';
        description += '\n· 性价比高' + (Math.random() > 0.5 ? '' : '，同类产品中价格较为合理');
        description += '\n· ' + (Math.random() > 0.5 ? '质量可靠，用户评价好' : '做工精良，使用寿命长');
        description += '\n· ' + (Math.random() > 0.5 ? '功能齐全，满足日常需求' : '核心功能强大，性能稳定');
        
        description += '\n\n缺点：';
        description += '\n· ' + (Math.random() > 0.5 ? '售后服务一般' : '配件价格较高');
        description += '\n· ' + (Math.random() > 0.5 ? '部分非核心功能缺失' : '外观设计一般');
      }
      break;
      
    default:
      // 默认简单描述
      description += `\n价格：¥${product.price}`;
  }
  
  return description;
};

/**
 * 根据筛选阶段获取系统提示
 * @param {string} stage 筛选阶段
 * @returns {string} 系统提示
 */
const getStagePrompt = (stage) => {
  switch (stage) {
    case FILTER_STAGES.NEEDS:
      return `用户正处于需求表达阶段。请帮助用户明确具体的产品类别和基本功能需求。提出引导性问题，如"您是需要什么用途的产品？"、"您对产品有哪些功能要求？"`;
      
    case FILTER_STAGES.FILTER:
      return `用户正处于参数筛选阶段。请引导用户提供更具体的筛选条件，如价格范围、品牌偏好、规格要求等。尝试缩小可选范围，逐步筛选出最合适的产品。`;
      
    case FILTER_STAGES.COMPARE:
      return `用户正处于产品对比阶段。请提供2-3个最符合用户需求的产品，详细对比它们的优缺点、价格、规格等。帮助用户理解各产品之间的差异和适用场景。`;
      
    case FILTER_STAGES.DECISION:
      return `用户正处于决策辅助阶段。此时应该聚焦于1-2个最佳选择，提供深入分析和购买建议。可以讨论价格趋势、性价比分析、购买时机等，帮助用户做出最终决策。`;
      
    default:
      return "";
  }
};

/**
 * 模拟响应延迟
 * @returns {Promise} 延迟的Promise
 */
const simulateResponseDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
};

// 模拟响应生成（仅在非API模式下使用）
const generateSimulatedResponse = async (message, userData) => {
  await simulateResponseDelay();
  
  const lowercaseMessage = message.toLowerCase();
  
  // 简单的问候回复
  if (lowercaseMessage.includes('你好') || lowercaseMessage.includes('嗨') || lowercaseMessage.includes('hello')) {
    return '您好！我是您的智能购物助手。请问您想了解什么商品，或者需要什么购物建议呢？';
  }
  
  // 商品推荐回复
  if (lowercaseMessage.includes('推荐') || lowercaseMessage.includes('建议') || lowercaseMessage.includes('有什么好')) {
    // 从用户数据中提取一些偏好
    let preferredCategory = '电子产品';
    
    if (userData && userData.preferences && userData.preferences.categories) {
      const categories = Object.keys(userData.preferences.categories);
      if (categories.length > 0) {
        preferredCategory = categories[0];
      }
    }
    
    return `根据您的偏好，我为您推荐以下${preferredCategory}：\n\n1. 最新款高性能智能手机，支持5G网络，配备高清摄像头和大容量电池。\n\n2. 轻薄便携的笔记本电脑，适合办公和日常使用，性能强劲且价格合理。\n\n3. 智能手表，可监测健康数据，并支持多种运动模式。\n\n您对哪一类更感兴趣呢？我可以提供更详细的信息。`;
  }
  
  // 默认回复
  return '感谢您的咨询。我了解您想了解更多信息，您能告诉我更具体的需求吗？例如，您在寻找什么类型的商品，有什么特定的功能需求或预算限制吗？';
};

export default {
  configureEnhancedAIService,
  clearConversationHistory,
  sendEnhancedMessageToAI,
  streamEnhancedMessageToAI
}; 