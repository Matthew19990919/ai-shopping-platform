import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const ChatMessageModern = ({ content, isUser, isStreaming, timestamp }) => {
  // 处理特殊内容标记，如[[product:...]]和[[image:...]]
  const renderContent = () => {
    if (!content) return '';
    
    // 处理图片标记 [[image:url:filename]]
    if (content.includes('[[image:')) {
      const imageMatch = content.match(/\[\[image:(.*?):(.*?)\]\]/);
      if (imageMatch) {
        const [fullMatch, imageUrl, fileName] = imageMatch;
        const textContent = content.replace(fullMatch, '').trim();
        
        return (
          <>
            <div className="mb-2">
              <img 
                src={imageUrl} 
                alt={fileName}
                className="max-w-full rounded-lg max-h-64 object-contain" 
              />
              <div className="text-xs mt-1 opacity-70">{fileName}</div>
            </div>
            {textContent && <div>{textContent}</div>}
          </>
        );
      }
    }
    
    // 处理产品标记 [[product:id:name:price:image]]
    if (content.includes('[[product:')) {
      const parts = [];
      let remainingContent = content;
      
      // 提取所有产品标记
      const productRegex = /\[\[product:(.*?):(.*?):(.*?):(.*?)\]\]/g;
      let match;
      let index = 0;
      
      while ((match = productRegex.exec(content)) !== null) {
        const [fullMatch, id, name, price, image] = match;
        
        // 添加产品标记前的文本
        const textBefore = remainingContent.slice(0, remainingContent.indexOf(fullMatch));
        if (textBefore) {
          parts.push(<span key={`text-${index}`}>{textBefore}</span>);
        }
        
        // 添加产品卡片
        parts.push(
          <div key={`product-${id}-${index}`} className="mt-2 mb-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-start gap-3">
              {image && (
                <img src={image} alt={name} className="w-16 h-16 object-cover rounded-md" />
              )}
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-red-500 dark:text-red-400 font-medium mt-1">¥{price}</div>
              </div>
            </div>
          </div>
        );
        
        // 更新剩余内容
        remainingContent = remainingContent.slice(remainingContent.indexOf(fullMatch) + fullMatch.length);
        index++;
      }
      
      // 添加剩余文本
      if (remainingContent) {
        parts.push(<span key={`text-final`}>{remainingContent}</span>);
      }
      
      return <>{parts}</>;
    }
    
    // 普通文本内容
    return content;
  };

  return (
    <div className={`flex items-start gap-3 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <FontAwesomeIcon icon={faRobot} className="text-blue-600 dark:text-blue-400" />
        </div>
      )}
      
      <div 
        className={`rounded-lg p-3 max-w-[85%] ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        {renderContent()}
        {isStreaming && <span className="ml-1 animate-pulse">▋</span>}
        
        {timestamp && (
          <div className={`text-xs mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm">您</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessageModern;