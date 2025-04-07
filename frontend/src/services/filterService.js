/**
 * 筛选服务 - 提供与产品筛选相关的功能
 */

// 定义购物决策的阶段
export const FILTER_STAGES = {
  INITIAL: 'initial', // 初始探索阶段
  NEEDS: 'needs',     // 需求表达阶段
  PARAMETERS: 'parameters', // 参数筛选阶段
  COMPARISON: 'comparison', // 产品对比阶段
  PRICE_ANALYSIS: 'price_analysis', // 价格分析阶段
  DECISION: 'decision' // 决策辅助阶段
};

// 为了兼容性，创建STAGES别名
export const STAGES = FILTER_STAGES;

// 不同阶段的关键词
const STAGE_KEYWORDS = {
  [FILTER_STAGES.NEEDS]: [
    '想买', '需要', '购买', '寻找', '推荐', '好的', '哪种', '什么', '有没有', 
    '建议', '类型', '种类', '品牌', '款式', '促销', '活动', '优惠', '打折', 
    '特价', '折扣', '降价', '满减', '券', '新品', '上新', 'diy', '个人', 
    '质量', '成品', '看重', '更看重', '关注', '重视', '主要用于', '主要是',
    '使用场景', '适合', '喜欢', '偏好', '风格'
  ],
  [FILTER_STAGES.PARAMETERS]: [
    '价格', '预算', '范围', '多少钱', '便宜', '贵', '高端', '低端', '性价比',
    '功能', '特点', '规格', '尺寸', '重量', '颜色', '材质', '配置', '参数',
    '筛选', '过滤', '最好的', '性能', '质量', '耐用', '品牌', '型号'
  ],
  [FILTER_STAGES.COMPARISON]: [
    '对比', '比较', '区别', '相比', '不同', '优缺点', '哪个好', '差异',
    'vs', '和', '与', '相较', '哪款', '选择', '优劣', '特性', '值得'
  ],
  [FILTER_STAGES.DECISION]: [
    '决定', '购买', '下单', '选定', '最终', '确定', '推荐', '购物车',
    '立即购买', '值得', '合适', '适合我', '最佳选择', '最终选择'
  ]
};

/**
 * 查找消息数组中最后一条用户消息的索引
 * @param {Array} messages 消息数组
 * @returns {number} 最后一条用户消息的索引，如果没有找到则返回-1
 */
const findLatestUserMessageIndex = (messages) => {
  if (!messages || messages.length === 0) {
    return -1;
  }

  // 从后往前查找
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].isUser) {
      return i;
    }
  }

  return -1;
};

/**
 * 根据对话历史分析当前的筛选阶段
 * @param {Array} conversationHistory 对话历史
 * @returns {string} 当前阶段
 */
export const analyzeFilterStage = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      stage: FILTER_STAGES.INITIAL,
      confidence: 0,
      recognizedKeywords: []
    };
  }

  // 取最近的用户消息进行分析
  const latestUserMessageIndex = findLatestUserMessageIndex(messages);
  if (latestUserMessageIndex === -1) {
    return {
      stage: FILTER_STAGES.INITIAL,
      confidence: 0,
      recognizedKeywords: []
    };
  }
  
  // 分析最新的用户消息
  const latestUserMessage = messages[latestUserMessageIndex].content;
  console.log('分析用户消息:', latestUserMessage);
  
  try {
    // 优化关键词匹配逻辑
    const keywordMatches = {
      [FILTER_STAGES.INITIAL]: [
        '我想买', '想购买', '需要', '推荐', '寻找', '帮我选', '有什么好的', 
        '购物', '选购', '买一个', '找一款', '买什么好', '想要一个', '购买建议'
      ],
      [FILTER_STAGES.NEEDS]: [
        '用来', '用于', '目的是', '需要', '希望', '想要', '使用场景', '用途', 
        '主要是', '主要用来', '想用它', '预算', '价位', '功能', '要求', '规格',
        '家用', '办公', '专业', '入门', '初学者', '专业人士', '高端', '中端', 
        '个人', 'diy', '自己', '质量', '成品', '体验', '喜欢', '偏好', '看重'
      ],
      [FILTER_STAGES.PARAMETERS]: [
        '价格', '不超过', '范围内', '低于', '高于', '预算内', '便宜', '贵', '实惠',
        '质量', '品牌', '牌子', '型号', '系列', '材质', '尺寸', '大小', '重量', 
        '性能', '配置', '参数', '规格', '功能', '特点', '特性', '版本', '新款', 
        '旗舰', '老款', '入门', '中端', '高端', '专业版', '增强版', '至少', '最少',
        '最多', '颜色', '外观', '设计', '风格', '样式'
      ],
      [FILTER_STAGES.COMPARISON]: [
        '比较', '对比', '区别', '不同', '优缺点', '优势', '劣势', '特点', '推荐哪个',
        '哪个好', '哪款', '更好', '性价比', '值不值', '值得', '怎么样', '评价', 
        '评测', '测评', '建议', '选择', '怎么选', '如何选择', '选哪个', '选哪款'
      ],
      [FILTER_STAGES.DECISION]: [
        '决定', '购买', '下单', '入手', '买', '选择', '决定购买', '就这个', 
        '就它了', '购买链接', '在哪买', '哪里买', '怎么买', '怎么下单', '确定要',
        '立即购买', '现在买', '马上买', '直接买', '就买', '要买', '去买', '想要这个'
      ]
    };

    // 初始化所有阶段的匹配度
    const stageScores = {};
    Object.keys(FILTER_STAGES).forEach(stageKey => {
      stageScores[FILTER_STAGES[stageKey]] = 0;
    });
    
    // 记录识别到的关键词
    const recognizedKeywords = [];
    
    // 为每个阶段计算匹配得分
    Object.entries(keywordMatches).forEach(([stage, keywords]) => {
      keywords.forEach(keyword => {
        // 使用正则表达式检查关键词，确保是单词边界或中文上下文
        const regex = new RegExp(`(^|[\\s,.，。？！?!：:;；])${keyword}([\\s,.，。？！?!：:;；]|$)`);
        if (regex.test(latestUserMessage)) {
          stageScores[stage] += 1;
          recognizedKeywords.push(keyword);
        }
      });
    });

    // 额外规则：特殊短语和模式检测
    
    // 1. 初始阶段：简短的购买意向表达
    if (/^(我想|我要|帮我|给我|推荐).{0,10}(买|购买|找|选).{0,15}$/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.INITIAL] += 3;
    }
    
    // 2. 需求阶段：用途描述
    if (/用[于来做]|使用[场景环境]|主要[是用]|适合|适用|场景/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.NEEDS] += 2;
    }
    
    // 3. 参数阶段：具体的数字或范围表达
    if (/\d+[到至-]\d+[元块千万]|\d+[元块千万]以[内下]|少于\d+[元块千万]|大约\d+[元块千万]/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.PARAMETERS] += 3;
    }
    
    // 4. 比较阶段：多个产品名称
    const productNameRegex = /([a-zA-Z]+\s?\d+|[\u4e00-\u9fa5]+[a-zA-Z0-9]+)/g;
    const potentialProductNames = latestUserMessage.match(productNameRegex) || [];
    if (potentialProductNames.length >= 2) {
      stageScores[FILTER_STAGES.COMPARISON] += 2;
    }
    
    // 5. 价格分析：查询历史价格或预测
    if (/什么时候(买|购买|入手|降价)|等(不等|等)|[历過过]史[价價]格|未来[价價]格|[价價]格(走势|趋势|预测)/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.DECISION] += 3;
    }
    
    // 6. 决策阶段：明确的购买意向
    if (/就(买|选|要|购买)这[个款台部]|决定(买|选|要|购买)|[直立马]接(买|购买)|在哪(买|购买|下单)/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.DECISION] += 3;
    }
    
    // 7. 对DIY和个人使用场景的特殊处理
    if (/DIY|diy|组装|自己组|自己搭|个人|自己用|质量|成品/.test(latestUserMessage)) {
      stageScores[FILTER_STAGES.NEEDS] += 2;
    }

    // 找出得分最高的阶段
    let maxScore = 0;
    let maxStage = FILTER_STAGES.INITIAL;
    let totalScore = 0;
    
    Object.entries(stageScores).forEach(([stage, score]) => {
      totalScore += score;
      if (score > maxScore) {
        maxScore = score;
        maxStage = stage;
      }
    });
    
    // 计算置信度，范围0-1
    const confidence = totalScore > 0 ? maxScore / totalScore : 0;
    
    // 上下文修正：考虑对话历史
    if (messages.length > 1) {
      // 检查之前的AI回复，查找暗示当前阶段的内容
      const previousAIMessages = messages
        .slice(0, latestUserMessageIndex)
        .filter(msg => !msg.isUser)
        .slice(-2); // 只看最近的2条AI消息
      
      for (const aiMsg of previousAIMessages) {
        if (aiMsg.content.includes('您想用这个产品做什么') || 
            aiMsg.content.includes('使用场景') || 
            aiMsg.content.includes('用途是什么')) {
          // AI之前询问了用途，增加NEEDS阶段的可能性
          stageScores[FILTER_STAGES.NEEDS] += 1;
        } else if (aiMsg.content.includes('您有什么具体要求') || 
                  aiMsg.content.includes('价格范围') || 
                  aiMsg.content.includes('品牌偏好')) {
          // AI之前询问了具体参数，增加PARAMETERS阶段的可能性
          stageScores[FILTER_STAGES.PARAMETERS] += 1;
        } else if (aiMsg.content.includes('对比') || 
                  aiMsg.content.includes('比较') || 
                  aiMsg.content.includes('这几款产品')) {
          // AI之前提供了比较，增加COMPARISON阶段的可能性
          stageScores[FILTER_STAGES.COMPARISON] += 1;
        }
      }
      
      // 再次查找最高分阶段（考虑上下文后）
      Object.entries(stageScores).forEach(([stage, score]) => {
        if (score > maxScore) {
          maxScore = score;
          maxStage = stage;
        }
      });
    }
    
    // 调试信息
    console.log('阶段分析结果:', { maxStage, confidence, scores: stageScores, recognizedKeywords });
    
    return {
      stage: maxStage,
      confidence: confidence,
      recognizedKeywords: recognizedKeywords
    };
  } catch (error) {
    console.error('阶段分析出错:', error);
    return {
      stage: FILTER_STAGES.INITIAL,
      confidence: 0,
      recognizedKeywords: []
    };
  }
};

/**
 * 从对话中提取筛选条件
 * @param {Array} conversationHistory 对话历史
 * @returns {Object} 筛选条件
 */
export const extractFilterCriteria = (messages) => {
  if (!messages || messages.length === 0) {
    return {};
  }

  // 取最近几条消息进行分析
  const recentMessages = messages.slice(-Math.min(5, messages.length));
  const userMessages = recentMessages.filter(msg => msg.isUser).map(msg => msg.content);
  
  // 合并用户消息以便分析
  const combinedUserText = userMessages.join(' ');
  console.log('提取过滤条件，分析文本:', combinedUserText);
  
  try {
    const criteria = {
      price: null,
      brands: [],
      features: [],
      usage: [],
      performance: [],
      quality: [],
      design: []
    };
    
    // 1. 提取价格范围
    const priceRanges = [
      // "3000-5000元" 格式
      /(\d+)\s*[到至-]\s*(\d+)\s*[元块¥￥]/,
      // "5000元以下/以内" 格式
      /(\d+)\s*[元块¥￥][以之]?[下内]/,
      // "超过3000元" 格式
      /[超过高于大于多于]+\s*(\d+)\s*[元块¥￥]/,
      // "不到/低于5000元" 格式
      /[不没][到超][过于]|[低少于]+\s*(\d+)\s*[元块¥￥]/,
      // "大约/左右5000元" 格式
      /[大约]{1,2}|左右\s*(\d+)\s*[元块¥￥]/
    ];
    
    for (const regex of priceRanges) {
      const match = combinedUserText.match(regex);
      if (match) {
        if (match.length === 3) {
          // 范围格式
          criteria.price = {
            min: parseInt(match[1], 10),
            max: parseInt(match[2], 10)
          };
        } else if (match.length === 2) {
          // 单值格式，根据前缀决定是上限还是下限
          const amount = parseInt(match[1], 10);
          if (combinedUserText.includes('以下') || 
              combinedUserText.includes('以内') || 
              combinedUserText.includes('不超过') || 
              combinedUserText.includes('低于') || 
              combinedUserText.includes('不到')) {
            criteria.price = { max: amount };
          } else if (combinedUserText.includes('超过') || 
                    combinedUserText.includes('高于') || 
                    combinedUserText.includes('大于') || 
                    combinedUserText.includes('至少') || 
                    combinedUserText.includes('以上')) {
            criteria.price = { min: amount };
          } else {
            // 无明确指示，假设是一个具体价格点
            criteria.price = { target: amount };
          }
        }
        break; // 找到第一个匹配就停止
      }
    }
    
    // 2. 提取品牌偏好
    const commonBrands = [
      '苹果', 'Apple', '华为', 'Huawei', '小米', 'Xiaomi', '三星', 'Samsung', 
      '联想', 'Lenovo', '戴尔', 'Dell', '惠普', 'HP', '华硕', 'Asus', 
      '宏碁', 'Acer', '索尼', 'Sony', '微软', 'Microsoft', 'LG', '飞利浦', 
      'Philips', '松下', 'Panasonic', '海尔', 'Haier', '美的', 'Midea', 
      '格力', 'Gree', '西门子', 'Siemens', '博世', 'Bosch', '佳能', 'Canon', 
      '尼康', 'Nikon', '富士', 'Fuji', '奥林巴斯', 'Olympus', '雷蛇', 'Razer', 
      '罗技', 'Logitech', '英特尔', 'Intel', 'AMD', '英伟达', 'Nvidia', 
      '高通', 'Qualcomm', '索尼', 'Sony', 'TCL', '海信', 'Hisense', 
      '荣耀', 'Honor', 'OPPO', 'vivo', '魅族', 'Meizu', '一加', 'OnePlus'
    ];
    
    commonBrands.forEach(brand => {
      // 检查品牌名称，确保匹配整个词
      const brandRegex = new RegExp(`(^|[\\s,，.。:：；])${brand}([\\s,，.。:：；]|$)`, 'i');
      if (brandRegex.test(combinedUserText)) {
        // 检查是否有排除该品牌的表达
        const excludeRegex = new RegExp(`(不要|不喜欢|排除|讨厌)[^,，.。:：；]{0,10}${brand}`, 'i');
        if (!excludeRegex.test(combinedUserText)) {
          criteria.brands.push(brand);
        }
      }
    });
    
    // 3. 提取功能特性偏好
    const featureKeywords = {
      // 电子产品常见功能特性
      features: [
        '防水', '快充', '无线充电', '人脸识别', '指纹识别', '双卡', '双摄', '三摄', 
        '广角', '超广角', '长焦', '微距', '夜景', '续航', '电池', '处理器', 'CPU', 
        'GPU', '显卡', '内存', 'RAM', '存储', '硬盘', 'SSD', 'HDD', '屏幕', '显示器', 
        '分辨率', '刷新率', '触控', '触摸', 'OLED', 'LCD', 'LED', '蓝牙', 'WiFi', 
        '5G', '4G', 'NFC', '扬声器', '音箱', '降噪', '防抖', '散热', '接口', 'USB', 
        'Type-C', '耳机孔', '耳机', '充电', '电源', '钢化膜', '保护套', '手机壳', 
        '转接头', '存储卡', '扩展', '拍照', '摄影', '视频', '游戏', '办公', '娱乐',
        '性能', '流畅', '发热', '功耗', '节能', '省电', '温度', '噪音', '静音'
      ],
      
      // 使用场景
      usage: [
        '家用', '办公', '游戏', '摄影', '视频', '剪辑', '直播', '设计', '学习', 
        '教育', '娱乐', '影音', '音乐', '运动', '户外', '旅行', '商务', '会议', 
        '便携', '移动', '固定', '工作站', 'DIY', '组装', '升级', '兼容', '扩展',
        '个人', '团队', '家庭', '商用', '专业', '初学者', '高端用户', '中端用户',
        '入门级', '发烧友', '玩家', '创作者', '程序员', '工程师', '美工', '摄影师', 
        '博主', '学生', '老人', '儿童', '年轻人', '女性', '男性'
      ],
      
      // 性能要求
      performance: [
        '高性能', '低功耗', '快速', '高速', '稳定', '可靠', '耐用', '节能', 
        '智能', '自动', '手动', '定制', '可调', '可编程', '多功能', '通用',
        '专用', '特殊', '标准', '兼容', '流畅', '卡顿', '延迟', '响应快', 
        '灵敏', '精准', '高精度', '低延迟'
      ],
      
      // 质量偏好
      quality: [
        '高品质', '优质', '精工', '精致', '耐用', '坚固', '耐磨', '防摔', 
        '优良', '一流', '高端', '中端', '入门', '旗舰', '专业', '高档', 
        '豪华', '简约', '基础', '实用', '实惠', '性价比', '划算', '经济', 
        '质量', '品质', '做工', '材质', '手感', '质感'
      ],
      
      // 设计偏好
      design: [
        '时尚', '现代', '经典', '复古', '简约', '轻薄', '小巧', '便携', 
        '紧凑', '大尺寸', '小尺寸', '重量轻', '厚重', '外观', '设计', '颜色', 
        '黑色', '白色', '银色', '金色', '灰色', '蓝色', '红色', '绿色', '紫色',
        '粉色', '金属', '塑料', '玻璃', '皮革', '木质', '哑光', '亮面', '配色', 
        '纹理', '图案', '科技感', '未来感', '商务风', '运动风', '潮流', '艺术', 
        '优雅', '大气', '沉稳', '活泼', '年轻', '成熟'
      ]
    };
    
    // 为每个类别提取关键词
    Object.entries(featureKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        // 使用词边界或中文上下文检查，避免部分匹配
        const keywordRegex = new RegExp(`(^|[\\s,，.。:：；])${keyword}([\\s,，.。:：；]|$)`);
        if (keywordRegex.test(combinedUserText)) {
          // 检查是否有否定表达
          const negativeRegex = new RegExp(`(不要|不需要|不喜欢|没有|无需)[^,，.。:：；]{0,10}${keyword}`);
          if (!negativeRegex.test(combinedUserText)) {
            criteria[category].push(keyword);
          }
        }
      });
    });
    
    // 4. 提取高级需求表达（使用正则表达式匹配更复杂的句型）
    
    // 例如：我更看重成品质量
    if (/[看重注重关注在意考虑偏好喜欢倾向]+.{0,5}(质量|做工|品质|成品|效果)/.test(combinedUserText)) {
      criteria.quality.push('质量优先');
    }
    
    // 例如：我想要个人DIY
    if (/个人.{0,5}DIY|DIY.{0,5}个人|自己组装|自己搭配|动手能力/.test(combinedUserText)) {
      criteria.usage.push('个人DIY');
    }
    
    // 例如：我注重性价比
    if (/[注重看重关注在意考虑]+.{0,5}性价比|[性|划算|实惠|便宜]/.test(combinedUserText)) {
      criteria.quality.push('性价比优先');
    }
    
    // 例如：我喜欢高端产品
    if (/[喜欢偏好倾向]+.{0,5}[高端旗舰顶级高级豪华]/.test(combinedUserText)) {
      criteria.quality.push('高端产品');
    }
    
    // 去除空数组，优化返回结果
    Object.entries(criteria).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length === 0) {
        delete criteria[key];
      }
    });
    
    console.log('提取到的过滤条件:', criteria);
    return criteria;
  } catch (error) {
    console.error('提取过滤条件出错:', error);
    return {};
  }
};

/**
 * 分析整个对话历史
 * @param {Array} messages 对话历史
 * @returns {Object} 分析结果
 */
export const analyzeConversation = (messages) => {
  // 默认返回初始阶段和空参数
  const result = {
    stage: FILTER_STAGES.INITIAL,
    params: {}
  };
  
  if (!messages || messages.length === 0) {
    return result;
  }
  
  // 累积过滤条件
  const allCriteria = {};
  let currentStage = FILTER_STAGES.INITIAL;
  
  // 从后往前分析最近5条消息
  const recentMessages = messages.slice(-5);
  
  for (const message of recentMessages) {
    // 只分析用户消息，确保content是字符串
    if (message.isUser && message.content && typeof message.content === 'string') {
      // 分析阶段，保留最高级别的阶段
      const stage = analyzeFilterStage(messages);
      
      // 更新阶段（只有更高级别的阶段才会覆盖之前的阶段）
      const stageOrder = [
        FILTER_STAGES.INITIAL,
        FILTER_STAGES.NEEDS,
        FILTER_STAGES.PARAMETERS,
        FILTER_STAGES.COMPARISON,
        FILTER_STAGES.DECISION
      ];
      
      const currentStageIndex = stageOrder.indexOf(currentStage);
      const newStageIndex = stageOrder.indexOf(stage.stage);
      
      if (newStageIndex > currentStageIndex) {
        currentStage = stage.stage;
      }
      
      // 提取过滤条件并合并
      const criteria = extractFilterCriteria(messages);
      Object.assign(allCriteria, criteria);
    }
  }
  
  // 返回分析结果
  return {
    stage: currentStage,
    params: allCriteria
  };
};

/**
 * 根据过滤条件估算产品数量
 * @param {Object} criteria 筛选条件
 * @returns {number} 估计的产品数量
 */
export const estimateProductCount = (criteria) => {
  // 这是一个简化的模拟实现
  // 实际应用中应该调用API获取真实的数量
  
  // 基础数量
  let count = 1000;
  
  // 根据条件缩小范围
  if (criteria.价格) {
    count = Math.floor(count * 0.7);
  }
  
  if (criteria.品牌) {
    const brandCount = criteria.品牌.split('、').length;
    count = Math.floor(count * (brandCount / 10));
  }
  
  if (criteria.类别) {
    count = Math.floor(count * 0.5);
  }
  
  if (criteria.场景) {
    count = Math.floor(count * 0.8);
  }
  
  if (criteria.需求) {
    const needCount = criteria.需求.split('、').length;
    count = Math.floor(count * (1 - 0.1 * needCount));
  }
  
  // 确保数量至少为5
  return Math.max(5, count);
};

/**
 * 生成筛选条件变更的响应
 * @param {Object} previousCriteria 旧的筛选条件
 * @param {Object} currentCriteria 新的筛选条件
 * @returns {string} 响应消息
 */
export const generateFilterChangeResponse = (previousCriteria, currentCriteria) => {
  const added = {};
  const modified = {};
  const removed = [];
  
  // 检查新增和修改的条件
  for (const [key, value] of Object.entries(currentCriteria)) {
    if (!previousCriteria.hasOwnProperty(key)) {
      added[key] = value;
    } else if (previousCriteria[key] !== value) {
      modified[key] = {
        from: previousCriteria[key],
        to: value
      };
    }
  }
  
  // 检查移除的条件
  for (const key of Object.keys(previousCriteria)) {
    if (!currentCriteria.hasOwnProperty(key)) {
      removed.push(key);
    }
  }
  
  // 生成响应消息
  let response = '';
  
  if (Object.keys(added).length > 0) {
    response += '📌 我注意到你提供了以下过滤条件:\n';
    for (const [key, value] of Object.entries(added)) {
      response += `• ${key}: ${value}\n`;
    }
    response += '\n';
  }
  
  if (Object.keys(modified).length > 0) {
    response += '🔄 你调整了以下过滤条件:\n';
    for (const [key, change] of Object.entries(modified)) {
      response += `• ${key}: ${change.from} → ${change.to}\n`;
    }
    response += '\n';
  }
  
  if (removed.length > 0) {
    response += '🗑️ 你移除了以下过滤条件:\n';
    for (const key of removed) {
      response += `• ${key}\n`;
    }
    response += '\n';
  }
  
  // 添加产品数量估计
  const productCount = estimateProductCount(currentCriteria);
  response += `🔍 根据当前条件，我找到了约 ${productCount} 个符合的产品。`;
  
  if (productCount > 50) {
    response += ' 要继续缩小范围吗？';
  } else if (productCount < 5) {
    response += ' 要放宽一些条件以获得更多选择吗？';
  }
  
  return response;
};

// 导出所有函数
export default {
  FILTER_STAGES,
  analyzeFilterStage,
  extractFilterCriteria,
  analyzeConversation,
  estimateProductCount,
  generateFilterChangeResponse
};