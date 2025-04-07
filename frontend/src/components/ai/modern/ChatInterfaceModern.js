import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';
import { 
  faPaperPlane, 
  faMicrophone, 
  faCamera, 
  faCircleNotch, 
  faRobot, 
  faTimes, 
  faHistory, 
  faInfoCircle,
  faShoppingBag,
  faBoxOpen,
  faBalanceScale,
  faLightbulb,
  faSearch,
  faTag,
  faCheckCircle,
  faQuestionCircle,
  faArrowUp,
  faShareAlt,
  faFilter,
  faEye,
  faSliders,
  faTrash,
  faEdit,
  faCalendarAlt,
  faArrowLeft,
  faSave,
  faComment,
  faChartLine,
  faSmile,
  faExchangeAlt,
  faSun,
  faMoon,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import ChatMessageModern from './ChatMessageModern';
import HourglassFilter from '../HourglassFilter';
import { AudioInput } from '../MultiModalInput';
import { matchProductsByImage } from '../../../services/multimodal/imageProcessingService';
import { analyzeFilterStage, extractFilterCriteria, estimateProductCount, 
  generateFilterChangeResponse, analyzeConversation, STAGES as FILTER_STAGES } from '../../../services/filterService';
import { getActiveAIModel, setActiveAIModel } from '../../../services/aiService';
import './ChatInterfaceModern.css';

const ChatInterfaceModern = ({ onSendMessage, messages, isLoading, streamingMessage, onClearChat }) => {
  // 保留所有现有状态
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showFeatureGuide, setShowFeatureGuide] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [visualSearch, setVisualSearch] = useState(false);
  const [showHourglassFilter, setShowHourglassFilter] = useState(true);
  const [currentFilterStage, setCurrentFilterStage] = useState(FILTER_STAGES.INITIAL);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [productCount, setProductCount] = useState(0);
  const [currentAIModel, setCurrentAIModel] = useState(getActiveAIModel());
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [historyView, setHistoryView] = useState('list');
  const [currentChatId, setCurrentChatId] = useState(null);
  
  // 新增暗色模式状态
  const [darkMode, setDarkMode] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // 默认建议提问
  const defaultSuggestions = [
    "推荐一款性价比高的手机",
    "最近有什么促销活动？",
    "如何选择适合我的笔记本电脑？",
    "有哪些流行的家居装饰品？",
    "帮我比较两款耳机的优缺点",
    "推荐适合送父母的礼物"
  ];
  
  // 功能指南
  const featureGuides = [
    {
      icon: faSearch,
      title: "智能搜索",
      description: "描述您需要的商品，AI会找到最匹配的选择"
    },
    {
      icon: faBalanceScale,
      title: "商品比较",
      description: "输入\"比较商品A和商品B\"，获取详细对比分析"
    },
    {
      icon: faImage,
      title: "图像识别",
      description: "上传商品图片，AI可以找到类似商品或提供信息"
    },
    {
      icon: faMicrophone,
      title: "语音助手",
      description: "点击麦克风按钮，用语音描述您的需求"
    },
    {
      icon: faTag,
      title: "价格跟踪",
      description: "询问\"跟踪[商品名称]价格\"，获得价格变动提醒"
    },
    {
      icon: faLightbulb,
      title: "个性化推荐",
      description: "基于您的浏览和购买历史提供智能推荐"
    }
  ];
  
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);
  
  // 修改useEffect钩子，用于分析对话并更新过滤阶段
  useEffect(() => {
    if (!messages || messages.length === 0) {
      // 重置过滤状态
      setCurrentFilterStage(FILTER_STAGES.INITIAL);
      setFilterCriteria({});
      setProductCount(0);
      return;
    }
    
    // 调试信息
    console.log('分析对话历史:', messages);
    
    try {
      // 分析整个对话历史
      const formattedMessages = messages.map(msg => ({
        content: msg.content || '',
        isUser: msg.isUser || false
      }));
      
      const analysis = analyzeConversation(formattedMessages);
      console.log('漏斗分析结果:', {
        stage: analysis.stage,
        params: analysis.params
      });
      
      // 更新UI状态
      setCurrentFilterStage(analysis.stage);
      setFilterCriteria(analysis.params);
      
      // 估算产品数量
      const count = estimateProductCount(analysis.params);
      setProductCount(count);
      
      // 设置漏斗模型的可见性
      // 当只有一条消息且在初始阶段时，不显示漏斗
      const shouldHide = messages.length <= 1 && 
                        analysis.stage === FILTER_STAGES.INITIAL;
      
      console.log('漏斗显示状态:', {
        shouldHide,
        messageCount: messages.length,
        currentStage: analysis.stage
      });
      
      setShowHourglassFilter(!shouldHide);
    } catch (error) {
      console.error('分析对话历史出错:', error);
      // 出错时不做状态改变，保持当前状态
    }
  }, [messages]);
  
  // 处理筛选条件变更
  const handleFilterChange = (newFilterCriteria) => {
    if (JSON.stringify(newFilterCriteria) !== JSON.stringify(filterCriteria)) {
      // 生成响应消息
      const responseMessage = generateFilterChangeResponse(filterCriteria, newFilterCriteria);
      
      // 更新筛选条件
      setFilterCriteria(newFilterCriteria);
      
      // 估算新的产品数量
      const count = estimateProductCount(currentFilterStage, newFilterCriteria);
      setProductCount(count);
      
      // 添加AI助手的响应消息，告知用户筛选条件已更新
      // 直接传递消息内容字符串，而不是消息对象
      onSendMessage(responseMessage, true); // 第二个参数标记这是自动生成的响应
    }
  };
  
  // 处理筛选条件重置
  const handleResetFilters = () => {
    setFilterCriteria({});
    setProductCount(0);
    
    // 通知用户筛选条件已重置
    onSendMessage("筛选条件已重置，您可以开始新的筛选。", true);
  };
  
  // 处理AI模型切换
  const handleModelChange = () => {
    // 在DeepSeek和Gemini之间切换
    const newModel = currentAIModel === 'deepseek' ? 'gemini' : 'deepseek';
    setCurrentAIModel(newModel);
    setActiveAIModel(newModel);
    
    // 通知用户模型已切换
    const modelNames = {
      'deepseek': 'DeepSeek',
      'gemini': 'Gemini'
    };
    
    // 添加一个系统消息，通知用户模型已切换
    onSendMessage(`已切换至${modelNames[newModel]}模型。`, true);
    
    // 调试信息
    console.log(`AI模型已切换至: ${modelNames[newModel]}`);
  };
  
  // 处理发送消息
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      // 发送消息时带上当前选择的AI模型
      onSendMessage(input.trim(), false, currentAIModel);
      setInput('');
      setShowSuggestions(false);
      setActiveTool(null);
    }
  };
  
  // 按回车发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // 处理语音输入
  const handleVoiceInput = (text) => {
    if (text && !isLoading) {
      onSendMessage(text, false, currentAIModel);
      setShowSuggestions(false);
      setActiveTool(null);
    }
  };
  
  // 增加处理语音输入结果的函数
  const handleVoiceInputChange = (text) => {
    // 将语音识别结果添加到输入框
    setInput(prevInput => {
      const newInput = prevInput.trim() ? `${prevInput} ${text}` : text;
      return newInput;
    });
    
    // 确保输入框获得焦点，以便用户可以编辑
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // 修改图片上传处理函数
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // 创建文件预览URL
      const imagePreviewUrl = URL.createObjectURL(file);
      const fileName = file.name;
      
      // 调用图像处理服务进行识别
      const { products, keywords } = await matchProductsByImage(file);
      
      // 设置为图像搜索模式
      setVisualSearch(true);
      
      // 清除输入
      setInput('');
      
      // 构建包含图像预览信息的消息
      const visualSearchMessage = `[[image:${imagePreviewUrl}:${fileName}]]\n我上传了这张图片，请帮我找到类似的商品。`;
      
      // 发送图像搜索消息
      onSendMessage(visualSearchMessage, false, currentAIModel);
      
      // 如果API返回了关键词和产品，可以直接在界面上显示匹配的结果
      if (products && products.length > 0) {
        // 创建匹配产品的消息
        let matchedProductsMsg = `我找到了${products.length}个与图片相似的商品：\n\n`;
        matchedProductsMsg += products.slice(0, 3).map(product => 
          `[[product:${product.id}:${product.name}:${product.price}:${product.image}]]`
        ).join('\n\n');
        
        // 发送匹配产品消息
        setTimeout(() => {
          onSendMessage(matchedProductsMsg, true, currentAIModel);
        }, 1500);
      }
    } catch (error) {
      console.error("图像处理出错：", error);
      onSendMessage("抱歉，图像处理出现问题，请稍后再试。", true, currentAIModel);
    } finally {
      setIsUploading(false);
      setActiveTool(null);
    }
  };
  
  // 处理快速建议点击
  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion, false, currentAIModel);
    setShowSuggestions(false);
  };
  
  // 清除聊天
  const clearChat = () => {
    if (typeof onClearChat === 'function') {
      onClearChat();
    }
    setShowSuggestions(true);
    setCurrentFilterStage(FILTER_STAGES.INITIAL);
    setFilterCriteria({});
    setProductCount(0);
    setShowHourglassFilter(false);
  };
  
  // 工具状态切换
  const toggleTool = (toolName) => {
    setActiveTool(activeTool === toolName ? null : toolName);
  };
  
  // 文件上传触发
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // 获取工具按钮类名
  const getToolButtonClass = (toolName) => {
    return `tool-button ${activeTool === toolName ? 'active' : ''}`;
  };
  
  // 加载聊天历史
  const loadChatHistories = () => {
    try {
      const storedHistories = localStorage.getItem('chatHistories');
      if (storedHistories) {
        setChatHistories(JSON.parse(storedHistories));
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  };
  
  // 保存当前聊天
  const saveCurrentChat = () => {
    if (!messages || messages.length === 0) {
      alert('没有可保存的对话');
      return;
    }
    
    try {
      // 生成新的聊天ID
      const chatId = currentChatId || uuid();
      
      // 提取聊天标题 (取第一条用户消息的前20个字符)
      const firstUserMessage = messages.find(msg => msg.isUser);
      const chatTitle = firstUserMessage 
        ? (firstUserMessage.content.substring(0, 20) + (firstUserMessage.content.length > 20 ? '...' : ''))
        : '新对话';
      
      // 创建新的聊天历史记录
      const newChatHistory = {
        id: chatId,
        title: chatTitle,
        date: new Date().toISOString(),
        messages: [...messages]
      };
      
      // 更新当前聊天ID
      setCurrentChatId(chatId);
      
      // 更新历史记录列表
      const updatedHistories = [...chatHistories.filter(h => h.id !== chatId), newChatHistory];
      setChatHistories(updatedHistories);
      
      // 保存到本地存储
      localStorage.setItem('chatHistories', JSON.stringify(updatedHistories));
      
      // 显示成功消息
      alert('对话已保存');
    } catch (error) {
      console.error('保存聊天历史失败:', error);
      alert('保存失败，请重试');
    }
  };
  
  // 删除历史记录
  const deleteHistory = (id) => {
    try {
      const updatedHistories = chatHistories.filter(history => history.id !== id);
      setChatHistories(updatedHistories);
      
      // 更新本地存储
      localStorage.setItem('chatHistories', JSON.stringify(updatedHistories));
      
      // 如果删除的是当前查看的历史，返回列表视图
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null);
        setHistoryView('list');
      }
    } catch (error) {
      console.error('删除聊天历史失败:', error);
    }
  };
  
  // 加载历史对话
  const loadHistory = (history) => {
    if (messages.length > 0 && !window.confirm('加载新对话将清除当前对话，是否继续？')) {
      return;
    }
    
    try {
      // 清除当前对话
      clearChat();
      
      // 创建一个深拷贝避免直接修改原始数据
      const loadedMessages = JSON.parse(JSON.stringify(history.messages));
      
      // 设置当前聊天ID和选中的历史ID
      setCurrentChatId(history.id);
      setSelectedHistoryId(history.id);
      
      // 加载历史消息
      loadedMessages.forEach((msg, index) => {
        // 使用setTimeout使消息按顺序加载，视觉效果更好
        setTimeout(() => {
          onSendMessage(msg.content, !msg.isUser, currentAIModel, true);
        }, index * 300);
      });
      
      // 关闭历史视图
      setHistoryView('list');
      setShowChatHistory(false);
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  };
  
  // 实时处理语音/图像上传状态的变更
  const handleProcessingChange = (isProcessing) => {
    // 根据当前活动工具更新相应的状态
    if (activeTool === 'voice') {
      setIsRecording(isProcessing);
    } else if (activeTool === 'image') {
      setIsUploading(isProcessing);
    }
  };
  
  // 加载聊天历史
  useEffect(() => {
    if (showChatHistory) {
      loadChatHistories();
    }
  }, [showChatHistory]);
  
  // 切换暗黑模式的类应用
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // 渲染现代化的聊天界面
  return (
    <div className={`chat-interface-modern ${darkMode ? 'dark' : ''}`}>
      {/* 侧边栏 - 模仿Vercel模板的设计 */}
      {showChatHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div className="relative flex w-full md:w-[350px] lg:w-[400px] flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium">对话历史</h2>
              <button 
                onClick={() => setShowChatHistory(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {chatHistories.length > 0 ? (
                <div className="space-y-2">
                  {chatHistories.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history) => (
                    <div
                      key={history.id}
                      className="history-item-modern"
                      onClick={() => {
                        setSelectedHistoryId(history.id);
                        loadHistory(history);
                      }}
                    >
                      <div>
                        <div className="font-medium">{history.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                          {new Date(history.date).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('确定要删除这条对话历史吗？')) {
                            deleteHistory(history.id);
                          }
                        }}
                        className="text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  暂无保存的对话历史
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={saveCurrentChat}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md p-2 font-medium"
                disabled={!messages.length}
              >
                <FontAwesomeIcon icon={faSave} />
                保存当前对话
              </button>
            </div>
          </div>
          <div 
            className="flex-1 bg-black/20" 
            onClick={() => setShowChatHistory(false)}
          />
        </div>
      )}
      
      {/* 主界面顶栏 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faRobot} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-lg font-semibold">小智 AI 导购助手</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 模型切换按钮 */}
          <button
            className={`model-toggle ${currentAIModel === 'gemini' ? 'gemini-active' : 'deepseek-active'}`}
            onClick={handleModelChange}
            title={`当前模型: ${currentAIModel === 'deepseek' ? 'DeepSeek' : 'Gemini'} (点击切换)`}
          >
            <FontAwesomeIcon icon={faExchangeAlt} className="w-3.5 h-3.5" />
            <span>{currentAIModel === 'deepseek' ? 'DeepSeek' : 'Gemini'}</span>
          </button>
          
          {/* 功能按钮 */}
          <div className="flex">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
            
            <button
              onClick={() => setShowFeatureGuide(true)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="功能指南"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            
            <button
              onClick={() => setShowChatHistory(true)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="历史记录"
            >
              <FontAwesomeIcon icon={faHistory} />
            </button>
            
            <button
              onClick={clearChat}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="清除对话"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </header>
      
      {/* 聊天主体区域 */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-full max-w-md p-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <FontAwesomeIcon icon={faRobot} className="text-4xl text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">欢迎使用 AI 导购助手</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您可以询问任何关于商品的问题，我会尽力为您提供帮助。您也可以通过语音或图片搜索商品。
              </p>
              
              {showSuggestions && (
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-3">快速提问:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {defaultSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-modern"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* 消息列表 */}
            <div className="max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessageModern
                  key={index}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {streamingMessage && (
                <ChatMessageModern
                  content={streamingMessage}
                  isUser={false}
                  isStreaming={true}
                />
              )}
              
              {/* 漏斗筛选模型 */}
              {showHourglassFilter && (
                <div className="hourglass-filter-container">
                  <HourglassFilter 
                    stage={currentFilterStage}
                    filterParams={filterCriteria}
                    productCount={productCount}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                  />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </main>
      
      {/* 输入区域 */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex space-x-2">
              {/* 语音按钮 */}
              <button
                className={`p-1.5 rounded-md ${activeTool === 'voice' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => toggleTool('voice')}
                title="语音输入"
              >
                <FontAwesomeIcon icon={faMicrophone} className="w-5 h-5" />
              </button>
              
              {/* 图片上传按钮 */}
              <button
                className={`p-1.5 rounded-md ${activeTool === 'image' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => {
                  toggleTool('image');
                  if (activeTool !== 'image') {
                    triggerFileUpload();
                  }
                }}
                title="图片搜索"
              >
                <FontAwesomeIcon icon={faCamera} className="w-5 h-5" />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
              </button>
              
              {/* AI模型切换按钮(在工具栏中) */}
              <button
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 font-medium ${currentAIModel === 'deepseek' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}
                onClick={handleModelChange}
                title={`当前模型: ${currentAIModel === 'deepseek' ? 'DeepSeek' : 'Gemini'} (点击切换)`}
              >
                <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4" />
                <span>{currentAIModel === 'deepseek' ? 'DS' : 'GM'}</span>
              </button>
            </div>
            
            {/* 语音输入组件 */}
            {activeTool === 'voice' && (
              <div className="absolute top-[-220px] left-0 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-10">
                <AudioInput 
                  onRecognized={handleVoiceInput}
                  onRecognizing={handleVoiceInputChange}
                  onProcessingChange={handleProcessingChange}
                />
              </div>
            )}
            
            <textarea
              ref={inputRef}
              className="chat-input-modern"
              placeholder="输入您的问题..."
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            
            <button
              className="send-button-modern"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="w-5 h-5 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </footer>
      
      {/* 功能指南弹窗 */}
      {showFeatureGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">AI 导购助手功能指南</h2>
              <button 
                onClick={() => setShowFeatureGuide(false)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureGuides.map((guide, index) => (
                  <div key={index} className="feature-card-modern">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={guide.icon} />
                    </div>
                    <h3 className="font-medium text-lg mb-2">{guide.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{guide.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterfaceModern;