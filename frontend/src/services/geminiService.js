/**
 * Gemini API 服务
 * 负责与 Google Gemini 大模型 API 进行通信，处理 AI 导购对话
 */

// 配置常量
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"; // Gemini API 端点
const GEMINI_API_KEY = "AIzaSyDnEwrFw9leA_jJOuTDOYVOX4VpflJpG_E"; // Gemini API KEY

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
 * 将聊天消息格式转换为Gemini API接受的格式
 * @param {Array} messages 消息记录数组，包含role和content
 * @returns {Object} Gemini API所需的请求体格式
 */
const formatMessagesForGemini = (messages) => {
  // 确保第一条消息是系统提示
  const formattedMessages = [];
  let hasSystemMessage = false;
  
  // 检查是否已经包含系统消息
  for (const msg of messages) {
    if (msg.role === "system") {
      hasSystemMessage = true;
      break;
    }
  }
  
  // 如果没有系统消息，添加一个
  if (!hasSystemMessage) {
    formattedMessages.push({
      role: "system",
      parts: [{ text: getSystemPrompt() }]
    });
  }
  
  // 添加其他消息
  for (const msg of messages) {
    if (msg.role !== "system") {
      formattedMessages.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    }
  }
  
  return {
    contents: formattedMessages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  };
};

/**
 * 与 Gemini API 通信，获取 AI 回复
 * @param {Array} messages 对话历史记录数组，包含 role 和 content
 * @param {Object} options 请求选项
 * @returns {Promise} 返回 AI 回复的 Promise
 */
export const chatWithGemini = async (messages, options = {}) => {
  try {
    const requestBody = formatMessagesForGemini(messages);
    
    // 设置请求参数
    const params = new URLSearchParams({
      key: GEMINI_API_KEY
    });
    
    // 发送请求
    const response = await fetch(`${GEMINI_API_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API 错误: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("与 Gemini API 通信出错:", error);
    throw error;
  }
};

/**
 * 流式与 Gemini API 通信，获取实时 AI 回复
 * @param {Array} messages 对话历史记录数组
 * @param {Function} onChunk 处理每个响应块的回调函数
 * @param {Object} options 请求选项
 * @returns {Promise} 返回完成的 Promise
 */
export const streamChatWithGemini = async (messages, onChunk, options = {}) => {
  try {
    const requestBody = formatMessagesForGemini(messages);
    
    // 添加流式参数
    requestBody.generationConfig.streamingOptions = {
      streamMode: "STREAMING"
    };
    
    // 设置请求参数
    const params = new URLSearchParams({
      key: GEMINI_API_KEY,
      alt: "sse"
    });
    
    // 发送请求
    const response = await fetch(`${GEMINI_API_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API 错误: ${error || response.statusText}`);
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
          try {
            const jsonData = JSON.parse(line.substring(6));
            if (jsonData.candidates && jsonData.candidates[0]?.content?.parts) {
              const content = jsonData.candidates[0].content.parts[0]?.text || "";
              if (content) {
                onChunk(content);
              }
            }
          } catch (e) {
            console.error("解析Gemini流式响应出错:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("与 Gemini API 流式通信出错:", error);
    throw error;
  }
};

export default {
  chatWithGemini,
  streamChatWithGemini
};