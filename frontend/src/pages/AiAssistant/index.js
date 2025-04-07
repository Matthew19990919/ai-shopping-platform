import React, { useState, useEffect } from 'react';
import ChatInterface from '../../components/ai/ChatInterface';
import { 
  configureEnhancedAIService,
  sendEnhancedMessageToAI, 
  streamEnhancedMessageToAI, 
  clearConversationHistory
} from '../../services/enhancedAiService';
import './AiAssistant.css';

// DeepSeek API 设置
const DEEPSEEK_API_KEY = "sk-993f0285181e47ba8e27417da0a329f3"; // 这里设置您的 DeepSeek API 密钥
const USE_DEEPSEEK_API = true; // 设置为 true 启用 DeepSeek API，false 使用模拟响应

/**
 * 检测并移除文本中的重复内容
 * @param {string} text 输入文本
 * @returns {string} 处理后的文本
 */
const removeTextDuplication = (text) => {
  if (!text) return '';
  
  // 处理重复词语
  const patterns = [
    // 连续重复词语如"很高兴很高兴"
    /([\u4e00-\u9fa5]{1,5})\1+/g,
    // 重复短语带间隔如"为您推荐为您推荐" 
    /([\u4e00-\u9fa5]{2,6}[\s\S]{0,4}[\u4e00-\u9fa5]{2,6})\s*\1/g,
    // 简单重复短语
    /([^\s，。？！,.!?]{3,10})\s*\1/g
  ];
  
  let processedText = text;
  patterns.forEach(pattern => {
    processedText = processedText.replace(pattern, '$1');
  });
  
  return processedText;
};

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // 初始化 AI 配置
  useEffect(() => {
    configureEnhancedAIService({
      useDeepSeekAPI: USE_DEEPSEEK_API,
      apiKey: DEEPSEEK_API_KEY,
      enablePersonalization: true,
      enableContextualRecommendations: true
    });
    
    // 清除之前的对话历史
    clearConversationHistory();
    
    // 添加欢迎消息
    setMessages([
      { 
        isUser: false, 
        content: "您好！我是小智，您的智能导购助手。我可以帮您查找心仪商品、比较产品性能、分析价格走势、提供个性化购物建议。有什么我能帮您的吗？", 
        timestamp: new Date().toISOString() 
      }
    ]);
    
    // 在组件卸载时清除流式消息和对话历史
    return () => {
      setStreamingMessage("");
      clearConversationHistory();
    };
  }, []);
  
  // 使用 useEffect 设置页面标题
  useEffect(() => {
    document.title = 'AI购物助手 - 智能导购体验';
    
    // 可选：设置元描述标签
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI智能导购助手，为您提供个性化商品推荐和购物建议');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'AI智能导购助手，为您提供个性化商品推荐和购物建议';
      document.head.appendChild(meta);
    }
    
    // 清理函数
    return () => {
      // 可选：在组件卸载时恢复原始标题
      document.title = 'AI购物商城 - 智能导购体验';
    };
  }, []);
  
  // 处理发送消息
  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;
    
    // 添加用户消息到消息列表
    const userMessage = { 
      isUser: true, 
      content: message, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage("");
    setErrorMessage("");
    
    try {
      // 以流式方式获取 AI 响应
      let isFirst = true;
      let currentAiResponse = ""; // 跟踪当前累积的AI响应
      
      // 调用增强版的流式消息服务
      await streamEnhancedMessageToAI(
        message,
        (chunk, isRecommendation = false) => {
          // 产品推荐部分单独处理
          if (isRecommendation) {
            setShowRecommendations(true);
          } else {
            if (isFirst) {
              setMessages(prev => [
                ...prev, 
                { 
                  isUser: false, 
                  content: chunk, 
                  isStreaming: true,
                  timestamp: new Date().toISOString() 
                }
              ]);
              currentAiResponse = chunk;
              isFirst = false;
            } else {
              // 更新累积的响应，然后检查重复
              currentAiResponse += chunk;
              const deDuplicatedResponse = removeTextDuplication(currentAiResponse);
              
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                // 使用去重后的完整响应，而不是简单地追加
                lastMessage.content = deDuplicatedResponse;
                return newMessages;
              });
            }
            
            // 更新流式消息状态 - 也应用去重
            setStreamingMessage(removeTextDuplication(currentAiResponse));
          }
        }
      );
      
      // 流式传输完成后清除流式状态并执行最终的去重
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.isStreaming = false;
          // 最终确保消息没有重复
          lastMessage.content = removeTextDuplication(lastMessage.content);
        }
        return newMessages;
      });
      
      setStreamingMessage("");
    } catch (error) {
      console.error('AI 响应生成失败:', error);
      setErrorMessage("抱歉，AI 助手暂时无法响应，请稍后再试。");
      
      // 添加错误消息
      setMessages(prev => [
        ...prev, 
        { 
          isUser: false, 
          content: "抱歉，我暂时无法处理您的请求，请稍后再试。", 
          isError: true,
          timestamp: new Date().toISOString() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    // 清除对话历史，只保留欢迎消息
    clearConversationHistory();
    setMessages([
      { 
        isUser: false, 
        content: "聊天已重置。您好！我是小智，随时为您提供专业的购物推荐和建议，请问有什么可以帮到您？", 
        timestamp: new Date().toISOString() 
      }
    ]);
    setStreamingMessage("");
    setErrorMessage("");
    setShowRecommendations(false);
  };
  
  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-wrapper">
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        <div className="ai-assistant-chat">
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            streamingMessage={streamingMessage}
            onClearChat={handleClearChat}
          />
        </div>
      </div>
    </div>
  );
};

export default AiAssistant; 