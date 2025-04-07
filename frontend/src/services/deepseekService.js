/**
 * DeepSeek API 服务
 * 负责与 DeepSeek 大模型 API 进行通信，处理 AI 导购对话
 */

// 配置常量
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // DeepSeek API 端点
let DEEPSEEK_API_KEY = "sk-993f0285181e47ba8e27417da0a329f3"; // 默认 API KEY

// 设置 API 密钥
export const setApiKey = (apiKey) => {
  DEEPSEEK_API_KEY = apiKey;
};

/**
 * 获取商品知识库中的系统提示
 * @returns {string} 系统提示文本
 */
const getSystemPrompt = () => {
  return `你是一个专业的电商导购助手，你的任务是帮助用户找到他们想要的商品。
你应该：
1. 根据用户描述的需求，推荐合适的商品
2. 耐心解答用户关于商品的规格、功能、价格等问题
3. 提供专业的购买建议，但不要过度推销
4. 使用友好、专业的语气，简明扼要地回答问题
5. 只回答与电商和商品相关的问题
6. 对比不同商品的优缺点，帮助用户做出购买决策
7. 考虑用户的预算、需求和场景，给出个性化建议

商品目录信息：
- 手机数码：智能手机、平板电脑、笔记本电脑、智能手表、耳机、相机
- 家用电器：电视机、冰箱、洗衣机、空调、吸尘器、电饭煲
- 服装鞋包：男装、女装、运动服、休闲鞋、皮鞋、手提包、双肩包
- 美妆个护：面部护理、彩妆、香水、洗发护发、身体护理
- 食品生鲜：零食、饮料、米面粮油、水果、蔬菜、肉类海鲜
- 家居家装：床上用品、家具、厨房用品、卫浴用品、装饰品

当用户询问具体商品时，提供以下信息：
1. 商品名称和简介
2. 价格区间
3. 关键特点和规格
4. 适用人群
5. 简短的购买建议
6. 可能的替代选择

回答时要简洁、专业、友好，避免过长的回复。当用户问题不明确时，主动询问更多细节以提供更准确的推荐。`;
};

/**
 * 与 DeepSeek API 通信，获取 AI 回复
 * @param {Array} messages 对话历史记录数组，包含 role 和 content
 * @param {Object} options 请求选项
 * @returns {Promise} 返回 AI 回复的 Promise
 */
export const chatWithDeepSeek = async (messages, options = {}) => {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API 密钥未设置");
  }

  try {
    // 不再自动添加系统提示，直接使用传入的消息
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || "deepseek-chat",
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        stream: options.stream || false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepSeek API 错误: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("与 DeepSeek API 通信出错:", error);
    throw error;
  }
};

/**
 * 流式与 DeepSeek API 通信，获取实时 AI 回复
 * @param {Array} messages 对话历史记录数组
 * @param {Function} onChunk 处理每个响应块的回调函数
 * @param {Object} options 请求选项
 * @returns {Promise} 返回完成的 Promise
 */
export const streamChatWithDeepSeek = async (messages, onChunk, options = {}) => {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API 密钥未设置");
  }

  try {
    // 不再自动添加系统提示，直接使用传入的消息
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || "deepseek-chat",
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API 错误: ${error || response.statusText}`);
    }

    if (!response.body) {
      throw new Error("浏览器不支持流式响应");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          const jsonData = JSON.parse(line.substring(6));
          const content = jsonData.choices[0]?.delta?.content || "";
          if (content) {
            onChunk(content);
          }
        }
      }
    }
  } catch (error) {
    console.error("与 DeepSeek API 流式通信出错:", error);
    throw error;
  }
};

export default {
  setApiKey,
  chatWithDeepSeek,
  streamChatWithDeepSeek
};