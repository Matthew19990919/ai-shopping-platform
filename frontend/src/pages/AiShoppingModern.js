import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faSearch,
  faImage,
  faShoppingBag,
  faHistory,
  faCamera,
  faMicrophone,
  faBalanceScale,
  faTag,
  faHome,
  faArrowLeft,
  faInfoCircle,
  faChevronRight,
  faLightbulb,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatInterfaceModern from '../components/ai/modern/ChatInterfaceModern'; // 引入现代化聊天界面
import * as AiShoppingAssistant from '../services/aiShoppingAssistant';
import { streamEnhancedMessageToAI } from '../services/enhancedAiService';
import { getViewHistory } from '../services/userService';
import { useCart } from '../contexts/CartContext';
import { oneClickAddToCart } from '../services/aiShoppingAssistant';
import '../styles/ai-shopping.css';

const AiShoppingModern = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [activeTab, setActiveTab] = useState('chat');
  const [recentProducts, setRecentProducts] = useState([]);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [recognizedProducts, setRecognizedProducts] = useState([]);
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();
  const [directAddSuccess, setDirectAddSuccess] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const navigate = useNavigate();
  
  // 初始化页面
  useEffect(() => {
    // 添加欢迎消息
    setMessages([
      {
        isUser: false,
        content: "您好！我是AI导购助手，可以帮您：\n• 推荐符合您需求的商品\n• 回答产品相关问题\n• 提供选购建议和比较\n• 搜索特价和促销商品\n\n请告诉我您想了解什么类型的商品？",
        timestamp: new Date().toISOString()
      }
    ]);
    
    // 获取最近浏览商品
    const fetchRecentProducts = async () => {
      try {
        const products = await getViewHistory(5);
        setRecentProducts(products);
      } catch (error) {
        console.error('获取最近浏览商品失败:', error);
      }
    };
    
    // 获取个性化提示
    const fetchPersonalizedSuggestions = async () => {
      try {
        const suggestions = await AiShoppingAssistant.getPersonalizedSuggestions();
        setPersonalizedSuggestions(suggestions);
      } catch (error) {
        console.error('获取个性化提示失败:', error);
      }
    };
    
    fetchRecentProducts();
    fetchPersonalizedSuggestions();
  }, []);
  
  // 处理发送消息给AI
  const handleSendMessageToAI = async (message, isSystemMessage = false, model = null, isHistoryLoad = false) => {
    if ((!message.trim() || isLoading) && !isSystemMessage) return;
    
    // 添加用户消息到消息列表
    const userMessage = { 
      isUser: true, 
      content: message, 
      timestamp: new Date().toISOString() 
    };
    
    // 如果不是系统消息和历史加载，则添加用户消息
    if (!isSystemMessage && !isHistoryLoad) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    // 如果是系统消息，直接添加AI消息
    if (isSystemMessage) {
      setMessages(prev => [
        ...prev, 
        { 
          isUser: false, 
          content: message, 
          timestamp: new Date().toISOString() 
        }
      ]);
      return;
    }
    
    // 如果是历史加载，直接添加消息
    if (isHistoryLoad) {
      setMessages(prev => [
        ...prev, 
        { 
          isUser: !isSystemMessage, 
          content: message, 
          timestamp: new Date().toISOString() 
        }
      ]);
      return;
    }
    
    setIsLoading(true);
    setStreamingMessage("");
    
    try {
      // 分析用户问题，获取建议操作
      const analysis = await AiShoppingAssistant.analyzeUserQuestion(message);
      
      // 如果是产品推荐或比较请求，获取智能推荐
      let productRecommendations = [];
      if (analysis.suggestedAction && 
          (analysis.suggestedAction.type === 'RECOMMEND_PRODUCTS' || 
           analysis.suggestedAction.type === 'COMPARE_PRODUCTS')) {
        productRecommendations = await AiShoppingAssistant.getSmartRecommendations(message);
      }
      
      // 以流式方式获取 AI 响应
      let isFirst = true;
      let responseText = '';
      
      await streamEnhancedMessageToAI(
        message,
        (chunk, isRecommendation = false) => {
          if (!isRecommendation) {
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
              isFirst = false;
            } else {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content += chunk;
                return newMessages;
              });
            }
            
            responseText += chunk;
            setStreamingMessage(prev => prev + chunk);
          }
        },
        model // 传递模型参数
      );
      
      // 流式传输完成后清除流式状态
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.isStreaming = false;
          
          // 如果有产品推荐且AI没有已经推荐产品，添加产品推荐到响应中
          if (productRecommendations.length > 0 && 
              !lastMessage.content.includes("[[product:") && 
              !lastMessage.content.includes("为您推荐以下商品")) {
            
            const formattedRecommendations = AiShoppingAssistant.formatProductRecommendations(
              productRecommendations, 
              message
            );
            
            lastMessage.content += "\n\n" + formattedRecommendations;
          }
        }
        return newMessages;
      });
      
      setStreamingMessage("");
    } catch (error) {
      console.error('AI响应生成失败:', error);
      setMessages(prev => [
        ...prev,
        {
          isUser: false,
          content: "抱歉，我暂时无法回答您的问题。请稍后再试。",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理图片上传和识别
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsImageSearch(true);
    setMessages(prev => [
      ...prev,
      {
        isUser: true,
        content: "【图片搜索】我想找和这张图片中类似的产品",
        timestamp: new Date().toISOString()
      }
    ]);
    
    try {
      // 添加装载消息
      setMessages(prev => [
        ...prev,
        {
          isUser: false,
          content: "正在分析您上传的图片...",
          timestamp: new Date().toISOString()
        }
      ]);
      
      // 调用图像识别服务
      const result = await AiShoppingAssistant.recognizeProductFromImage(file);
      
      if (result.success) {
        // 更新识别出的商品
        setRecognizedProducts(result.products);
        
        // 更新消息，添加识别结果
        setMessages(prev => {
          const newMessages = [...prev];
          // 更新最后一条AI消息
          newMessages[newMessages.length - 1] = {
            isUser: false,
            content: `我识别出图片中包含${result.recognizedObjects.join('、')}。\n\n以下是与图片相似的商品：\n\n${
              AiShoppingAssistant.formatProductRecommendations(result.products)
            }`,
            timestamp: new Date().toISOString()
          };
          return newMessages;
        });
      } else {
        // 识别失败
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            isUser: false,
            content: `抱歉，我无法识别这张图片。${result.error || '请尝试上传清晰的商品图片。'}`,
            timestamp: new Date().toISOString()
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('图片处理失败:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          isUser: false,
          content: "抱歉，图片处理过程中出现错误。请稍后再试。",
          timestamp: new Date().toISOString()
        };
        return newMessages;
      });
    }
  };
  
  // 处理建议点击
  const handleSuggestionClick = (suggestion) => {
    handleSendMessageToAI(suggestion);
  };
  
  // 直接添加到购物车
  const handleDirectAddToCart = async (product) => {
    try {
      const result = await oneClickAddToCart(product);
      if (result.success) {
        setDirectAddSuccess(true);
        setAddedProduct(product);
        addToCart(product);
        
        // 5秒后隐藏成功消息
        setTimeout(() => {
          setDirectAddSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('添加到购物车失败:', error);
    }
  };
  
  // 清除聊天
  const handleClearChat = () => {
    setMessages([
      {
        isUser: false,
        content: "您好！我是AI导购助手，可以帮您：\n• 推荐符合您需求的商品\n• 回答产品相关问题\n• 提供选购建议和比较\n• 搜索特价和促销商品\n\n请告诉我您想了解什么类型的商品？",
        timestamp: new Date().toISOString()
      }
    ]);
    setIsImageSearch(false);
    setRecognizedProducts([]);
  };
  
  return (
    <div className="ai-shopping-container">
      <Navbar />
      
      <div className="ai-page-content">
        <div className="breadcrumb">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> 首页
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="separator" />
          <span>AI导购助手</span>
        </div>
        
        <div className="ai-assistant-container">
          <div className="ai-main-content">
            <div className="ai-chat-container">
              {/* 使用现代化聊天界面组件 */}
              <ChatInterfaceModern
                messages={messages}
                onSendMessage={handleSendMessageToAI}
                isLoading={isLoading}
                streamingMessage={streamingMessage}
                onClearChat={handleClearChat}
              />
            </div>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {directAddSuccess && addedProduct && (
        <div className="add-to-cart-success">
          <div className="success-content">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{addedProduct.name} 已添加到购物车</span>
            <button 
              onClick={() => navigate('/cart')}
              className="view-cart-btn"
            >
              查看购物车
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default AiShoppingModern;