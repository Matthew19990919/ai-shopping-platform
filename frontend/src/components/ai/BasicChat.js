import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faImage, faSpinner, faRobot } from '@fortawesome/free-solid-svg-icons';
import { chatWithAI, streamChatWithAI } from '../../services/aiService';

/**
 * 极简化的聊天组件，适用于任何页面嵌入
 */
const BasicChat = ({ 
  initialMessages = [], 
  onSendMessage = null,
  onAIResponse = null,
  onImageUpload = null,
  onVoiceInput = null,
  containerStyle = {},
  headerText = "AI 助手"
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentModel, setCurrentModel] = useState('deepseek'); // 默认使用deepseek模型
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // 滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = {
      isUser: true,
      content: inputText,
      timestamp: new Date().toISOString()
    };
    
    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    
    // 调用自定义发送消息处理函数
    if (onSendMessage) {
      onSendMessage(inputText);
    }
    
    // 发送到AI并获取响应
    await getAIResponse(inputText);
    
    // 清空输入
    setInputText('');
  };
  
  // 获取AI响应
  const getAIResponse = async (userInput) => {
    setIsLoading(true);
    setStreamingText('');
    
    try {
      // 流式处理
      let fullResponse = '';
      
      await streamChatWithAI(
        userInput,
        (chunk) => {
          setStreamingText(prev => prev + chunk);
          fullResponse += chunk;
        },
        currentModel
      );
      
      // 流式完成后添加完整消息
      const aiMessage = {
        isUser: false,
        content: fullResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 调用自定义AI响应处理函数
      if (onAIResponse) {
        onAIResponse(fullResponse);
      }
    } catch (error) {
      console.error('AI响应生成失败:', error);
      setMessages(prev => [
        ...prev,
        {
          isUser: false,
          content: '抱歉，我遇到了一点问题，请稍后再试。',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };
  
  // 处理文件上传
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // 如果提供了自定义图片上传处理函数，则调用它
    if (onImageUpload) {
      onImageUpload(file);
    } else {
      // 默认处理：将图片显示在聊天中
      const reader = new FileReader();
      reader.onload = (e) => {
        const userMessage = {
          isUser: true,
          content: `![上传的图片](${e.target.result})`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 处理语音输入
  const handleVoiceInput = () => {
    if (onVoiceInput) {
      onVoiceInput();
    } else {
      alert('语音输入功能尚未实现');
    }
  };
  
  // 切换模型
  const toggleModel = () => {
    const newModel = currentModel === 'deepseek' ? 'gemini' : 'deepseek';
    setCurrentModel(newModel);
    
    // 添加系统消息通知模型切换
    setMessages(prev => [
      ...prev,
      {
        isUser: false,
        content: `已切换到 ${newModel === 'deepseek' ? 'DeepSeek' : 'Gemini'} 模型`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      }
    ]);
  };
  
  // 处理键盘按键
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid #e1e1e1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9',
      ...containerStyle
    }}>
      {/* 聊天头部 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e1e1e1',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faRobot} style={{ marginRight: '8px', color: '#4a6cf7' }} />
          {headerText}
        </div>
        <div 
          onClick={toggleModel} 
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: currentModel === 'deepseek' ? '#e6f7ff' : '#f0f5ff',
            color: currentModel === 'deepseek' ? '#1890ff' : '#597ef7',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {currentModel === 'deepseek' ? 'DeepSeek' : 'Gemini'}
        </div>
      </div>
      
      {/* 聊天消息区域 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#ffffff'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: message.isUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
              backgroundColor: message.isUser 
                ? '#4a6cf7' 
                : (message.isSystemMessage ? '#f5f5f5' : '#f0f2f5'),
              color: message.isUser ? '#ffffff' : (message.isSystemMessage ? '#888888' : '#333333'),
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              wordBreak: 'break-word',
              lineHeight: '1.5',
              fontSize: message.isSystemMessage ? '12px' : '14px'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        
        {/* 流式响应显示 */}
        {streamingText && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 0',
              backgroundColor: '#f0f2f5',
              color: '#333333',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              wordBreak: 'break-word',
              lineHeight: '1.5'
            }}>
              {streamingText}
            </div>
          </div>
        )}
        
        {/* 加载指示器 */}
        {isLoading && !streamingText && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <FontAwesomeIcon icon={faSpinner} spin style={{ color: '#888888' }} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #e1e1e1',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* 图片上传按钮 */}
        <div 
          onClick={() => fileInputRef.current.click()} 
          style={{
            cursor: 'pointer',
            marginRight: '12px',
            color: '#888888'
          }}
        >
          <FontAwesomeIcon icon={faImage} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        
        {/* 语音输入按钮 */}
        <div 
          onClick={handleVoiceInput} 
          style={{
            cursor: 'pointer',
            marginRight: '12px',
            color: '#888888'
          }}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </div>
        
        {/* 文本输入框 */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '8px 12px',
            borderRadius: '18px',
            backgroundColor: '#f0f2f5',
            resize: 'none',
            minHeight: '40px',
            maxHeight: '120px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        />
        
        {/* 发送按钮 */}
        <div 
          onClick={handleSendMessage} 
          style={{
            cursor: 'pointer',
            marginLeft: '12px',
            color: inputText.trim() ? '#4a6cf7' : '#cccccc'
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
      </div>
    </div>
  );
};

export default BasicChat;