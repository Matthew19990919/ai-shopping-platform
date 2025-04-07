// AI聊天服务
import { getProductsMock } from './mockData';
import deepseekService from './deepseekService';
import geminiService from './geminiService';

// 配置变量
let useAIAPI = false;  // 是否使用AI API（默认为仿真模式）
let activeAIModel = 'deepseek'; // 默认使用DeepSeek模型

// AI服务配置
export const configureAIService = (config = {}) => {
  useAIAPI = config.useAIAPI || false;
  
  // 设置活跃的AI模型
  if (config.aiModel) {
    activeAIModel = config.aiModel;
  }
  
  // 如果需要配置DeepSeek API
  if (activeAIModel === 'deepseek' && config.deepseekApiKey) {
    deepseekService.setApiKey(config.deepseekApiKey);
  }
  
  // Gemini API已在geminiService.js中硬编码
};

// 获取当前活跃的AI模型
export const getActiveAIModel = () => activeAIModel;

// 设置活跃的AI模型
export const setActiveAIModel = (model) => {
  if (model === 'deepseek' || model === 'gemini') {
    activeAIModel = model;
    return true;
  }
  return false;
};

// 模拟AI响应延迟
const simulateResponseDelay = async () => {
  return new Promise(resolve => {
    setTimeout(resolve, 500 + Math.random() * 1500);
  });
};

// 商品数据
let cachedProducts = null;

// 获取所有商品数据
const getAllProducts = async () => {
  if (cachedProducts) {
    return cachedProducts;
  }
  
  // 从模拟API获取商品数据
  try {
    const products = await getProductsMock();
    cachedProducts = products;
    return products;
  } catch (error) {
    console.error('获取商品数据失败:', error);
    return [];
  }
};

// 根据查询筛选商品
const filterProducts = (products, query) => {
  if (!query || !products || products.length === 0) {
    return [];
  }
  
  query = query.toLowerCase();
  
  return products.filter(product => {
    // 查找名称、描述、分类中包含查询字符串的商品
    return (
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category && product.category.toLowerCase().includes(query))
    );
  });
};

// 将商品数据格式化为AI消息中的产品卡片格式
const formatProductForChat = (product) => {
  return `[[product:${product.id}:${product.name}:${product.price}:${product.image}]]`;
};

// 记录对话历史
let conversationHistory = [];

// 清除对话历史
export const clearConversationHistory = () => {
  conversationHistory = [];
};

// 生成AI响应
const generateAIResponse = async (userMessage) => {
  if (useAIAPI) {
    // 使用AI API
    try {
      // 添加用户消息到对话历史
      conversationHistory.push({ role: "user", content: userMessage });
      
      let aiResponse;
      
      // 根据选择的模型调用相应的API
      if (activeAIModel === 'deepseek') {
        // 调用 DeepSeek API
        aiResponse = await deepseekService.chatWithDeepSeek(conversationHistory);
      } else if (activeAIModel === 'gemini') {
        // 调用 Gemini API
        aiResponse = await geminiService.chatWithGemini(conversationHistory);
      } else {
        throw new Error(`未知的AI模型: ${activeAIModel}`);
      }
      
      // 添加 AI 响应到对话历史
      conversationHistory.push({ role: "assistant", content: aiResponse });
      
      return processAIResponse(aiResponse);
    } catch (error) {
      console.error('AI API 调用失败:', error);
      // 如果 API 调用失败，回退到模拟响应
      return generateSimulatedResponse(userMessage);
    }
  } else {
    // 使用模拟 AI 响应
    return generateSimulatedResponse(userMessage);
  }
};

// 处理AI API的响应，可能会添加产品卡片等增强功能
const processAIResponse = async (response) => {
  // 检查响应是否已经包含商品卡片标记
  if (response.includes("[[product:")) {
    return response;
  }
  
  // 查找 response 中是否有商品关键词
  const productKeywords = extractProductKeywords(response);
  
  if (productKeywords.length > 0) {
    // 获取所有商品
    const allProducts = await getAllProducts();
    
    // 根据关键词匹配商品
    const matchedProducts = matchProductsByKeywords(allProducts, { '关键词': productKeywords });
    
    // 如果找到匹配的商品，在回复中添加商品卡片
    if (matchedProducts.length > 0) {
      // 限制为最多3个最相关的商品
      const limitedProducts = matchedProducts.slice(0, 3);
      const productCards = limitedProducts.map(formatProductForChat).join('\n\n');
      return `${response}\n\n这里是一些您可能感兴趣的商品：\n\n${productCards}`;
    }
  }
  
  return response;
};

// 从文本中提取可能的商品关键词
const extractProductKeywords = (text) => {
  // 定义产品类别关键词
  const productKeywords = [
    '手机', '电脑', '笔记本', '平板', '耳机', '相机', '电视', '冰箱', '洗衣机', '空调', 
    '吸尘器', '电饭煲', '衣服', '鞋子', '包包', '化妆品', '面膜', '香水', '洗发水',
    '零食', '饮料', '食品', '家具', '床上用品', '厨房用品'
  ];
  
  // 查找文本中包含的产品关键词
  const foundKeywords = productKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // 添加一些品牌关键词的提取
  const brandKeywords = [
    '苹果', '华为', '小米', '三星', '索尼', '惠普', '联想', '戴尔', '耐克', '阿迪达斯',
    'iphone', 'apple', 'huawei', 'xiaomi', 'samsung', 'sony', 'hp', 'lenovo', 'dell',
    'nike', 'adidas'
  ];
  
  const foundBrands = brandKeywords.filter(brand => 
    text.toLowerCase().includes(brand.toLowerCase())
  );
  
  // 合并产品和品牌关键词
  return [...new Set([...foundKeywords, ...foundBrands])];
};

// 生成模拟 AI 响应（保留原有逻辑）
const generateSimulatedResponse = async (userMessage) => {
  await simulateResponseDelay();
  
  // 获取所有商品
  const allProducts = await getAllProducts();
  
  // 提取关键词进行匹配
  const keywords = extractKeywords(userMessage);
  
  // 根据关键词匹配商品
  const matchedProducts = matchProductsByKeywords(allProducts, keywords);
  
  // 如果找到匹配的商品，生成带商品卡片的回复
  if (matchedProducts.length > 0) {
    return generateProductRecommendation(matchedProducts, userMessage);
  }
  
  // 如果没有找到匹配的商品，生成一般回复
  return generateGenericResponse(userMessage);
};

// 提取关键词（保留原有逻辑）
const extractKeywords = (message) => {
  // 定义商品类别关键词
  const categoryKeywords = {
    '手机': ['手机', '智能机', '苹果', 'iphone', '华为', '小米', 'oppo', 'vivo', '三星', '安卓'],
    '电脑': ['电脑', '笔记本', '台式机', '平板', 'pad', 'macbook', '联想', '戴尔', '惠普'],
    '家电': ['电视', '冰箱', '洗衣机', '空调', '微波炉', '电饭煲', '电磁炉', '热水器'],
    '服装': ['衣服', '裤子', '外套', '鞋子', '夹克', '羽绒服', 'T恤', '帽子', '围巾'],
    '美妆': ['化妆品', '护肤品', '面膜', '洗面奶', '眼霜', '口红', '粉底', '香水'],
    '食品': ['零食', '饮料', '水果', '坚果', '巧克力', '饼干', '糖果'],
    '礼品': ['礼物', '送礼', '礼品', '生日', '纪念日', '长辈', '朋友', '父母', '情侣']
  };
  
  // 提取消息中的关键词
  const foundKeywords = {};
  
  // 检查每个类别关键词
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword)) {
        if (!foundKeywords[category]) {
          foundKeywords[category] = [];
        }
        foundKeywords[category].push(keyword);
      }
    }
  }
  
  // 提取价格范围
  const priceRanges = {
    '低价': message.match(/低价|便宜|实惠|经济|省钱|划算|性价比/g),
    '中价': message.match(/适中|中等|一般|普通/g),
    '高价': message.match(/高端|奢侈|豪华|贵的|高价|优质|名牌/g)
  };
  
  // 过滤掉未匹配的价格范围
  for (const [range, matched] of Object.entries(priceRanges)) {
    if (matched && matched.length > 0) {
      foundKeywords['价格'] = range;
    }
  }
  
  return foundKeywords;
};

// 根据关键词匹配商品（保留原有逻辑）
const matchProductsByKeywords = (products, keywords) => {
  if (Object.keys(keywords).length === 0) {
    // 如果没有找到关键词，返回空数组
    return [];
  }
  
  // 根据关键词筛选商品
  let matchedProducts = [...products];
  
  // 筛选类别
  for (const category in keywords) {
    if (category !== '价格') {
      matchedProducts = matchedProducts.filter(product => 
        product.category?.toLowerCase().includes(category.toLowerCase()) ||
        product.name.toLowerCase().includes(category.toLowerCase()) ||
        (product.description && keywords[category].some(keyword => 
          product.description.toLowerCase().includes(keyword.toLowerCase())))
      );
    }
  }
  
  // 按价格筛选
  if (keywords['价格']) {
    const priceRange = keywords['价格'];
    if (priceRange === '低价') {
      matchedProducts = matchedProducts.filter(product => parseFloat(product.price) < 500);
    } else if (priceRange === '中价') {
      matchedProducts = matchedProducts.filter(product => 
        parseFloat(product.price) >= 500 && parseFloat(product.price) < 2000
      );
    } else if (priceRange === '高价') {
      matchedProducts = matchedProducts.filter(product => parseFloat(product.price) >= 2000);
    }
  }
  
  return matchedProducts;
};

// 生成产品推荐回复（保留原有逻辑）
const generateProductRecommendation = (products, userMessage) => {
  const category = getCategoryFromProducts(products) || '商品';
  const intro = [
    `这里是我为您找到的${category}：`,
    `您好，根据您的需求，我推荐以下${category}：`,
    `我找到了几款可能符合您需求的${category}：`,
    `以下是较为热门的${category}，可供您参考：`
  ];
  
  const randomIntro = intro[Math.floor(Math.random() * intro.length)];
  let response = randomIntro + '\n\n';
  
  // 添加前3个商品的卡片
  const topProducts = products.slice(0, 3);
  response += topProducts.map(formatProductForChat).join('\n\n');
  
  // 添加询问是否需要更多信息
  response += '\n\n您对这些商品有什么具体问题吗？或者您需要更详细的信息？';
  
  return response;
};

// 从产品列表中获取分类（保留原有逻辑）
const getCategoryFromProducts = (products) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  // 获取第一个产品的分类
  const category = products[0].category;
  
  // 中文分类映射
  const categoryMap = {
    'phones': '手机',
    'computers': '电脑',
    'appliances': '家电',
    'clothing': '服装',
    'beauty': '美妆产品',
    'food': '食品',
    'gifts': '礼品'
  };
  
  return categoryMap[category] || category;
};

// 生成通用回复（保留原有逻辑）
const generateGenericResponse = (userMessage) => {
  const responses = [
    "很抱歉，我没有找到相关商品。您能提供更多具体信息吗？",
    "您好，请问您能详细描述一下您想要的商品特点吗？",
    "我需要更多信息来帮您找到合适的商品。您有特定的品牌偏好或价格区间吗？",
    "感谢您的咨询，为了给您提供最准确的推荐，能请您说明一下您的具体需求吗？"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// 发送消息给AI（使用常规请求）
export const sendMessageToAI = async (message, model = null) => {
  // 如果指定了模型，临时切换
  if (model) {
    const originalModel = activeAIModel;
    setActiveAIModel(model);
    const response = await generateAIResponse(message);
    setActiveAIModel(originalModel); // 恢复原来的模型
    return response;
  }
  
  // 使用当前选择的模型
  return generateAIResponse(message);
};

// 发送消息给AI（使用流式请求）
export const streamMessageToAI = async (message, onChunk, model = null) => {
  if (useAIAPI) {
    try {
      // 添加用户消息到对话历史
      conversationHistory.push({ role: "user", content: message });
      
      // 如果指定了模型，使用该模型
      const modelToUse = model || activeAIModel;
      
      if (modelToUse === 'deepseek') {
        // 使用DeepSeek API流式请求
        await deepseekService.streamChatWithDeepSeek(conversationHistory, onChunk);
      } else if (modelToUse === 'gemini') {
        // 使用Gemini API流式请求
        await geminiService.streamChatWithGemini(conversationHistory, onChunk);
      } else {
        throw new Error(`未知的AI模型: ${modelToUse}`);
      }
      
      // 将AI的完整响应添加到对话历史
      // 这里假设onChunk会累积完整响应并在结束时返回
      // 理想情况下应该由调用者提供完整响应
      // 此处为简化，暂不处理
      
    } catch (error) {
      console.error('AI API 流式请求失败:', error);
      // 如果流式请求失败，回退到模拟流式响应
      const simulatedResponse = await generateSimulatedResponse(message);
      await simulateStreamResponse(simulatedResponse, onChunk);
    }
  } else {
    // 使用模拟流式响应
    const simulatedResponse = await generateSimulatedResponse(message);
    await simulateStreamResponse(simulatedResponse, onChunk);
  }
};

// 模拟流式响应（保留原有逻辑）
const simulateStreamResponse = async (fullResponse, onChunk) => {
  const words = fullResponse.split(' ');
  const chunks = [];
  
  // 将单词分组，每组1-3个单词
  for (let i = 0; i < words.length; i += 1 + Math.floor(Math.random() * 3)) {
    const chunk = words.slice(i, i + 1 + Math.floor(Math.random() * 3)).join(' ');
    chunks.push(chunk);
  }
  
  // 逐个发送块
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));
    onChunk(chunk + ' ');
  }
};