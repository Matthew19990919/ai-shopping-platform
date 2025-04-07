import React, { useState } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { 
              role: "system", 
              content: "你是一个专业的购物助手，可以帮助用户选择商品、比较价格、提供购物建议。请用简洁友好的语气回答用户问题。" 
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: input }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('响应内容:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`请求失败 (${response.status}): ${errorText.slice(0, 100)}...`);
        }
        
        throw new Error(errorData.error || errorData.details || `请求失败，状态码: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('响应文本:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON解析错误:', jsonError, '原始响应:', responseText);
        throw new Error('服务器返回的数据格式不正确，请联系管理员');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('不正确的响应格式:', data);
        throw new Error('AI响应格式不正确');
      }

      const aiMessage = { 
        type: 'ai', 
        content: data.choices[0].message.content 
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = { 
        type: 'ai', 
        content: `抱歉，发生了错误：${error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-assistant ${isOpen ? 'open' : ''}`}>
      <div className="ai-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>AI购物助手</h3>
        {isLoading && <span className="loading-indicator">...</span>}
      </div>
      
      {isOpen && (
        <div className="ai-content">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                您好！我是您的AI购物助手，有什么可以帮您的吗？
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.content}
                </div>
              ))
            )}
            {isLoading && (
              <div className="message ai loading">
                正在思考...
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请输入您的问题..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              style={{ opacity: isLoading || !input.trim() ? 0.6 : 1 }}
            >
              发送
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant; 