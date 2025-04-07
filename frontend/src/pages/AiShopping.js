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
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatInterface from '../components/ai/ChatInterface';
import * as AiShoppingAssistant from '../services/aiShoppingAssistant';
import { streamEnhancedMessageToAI } from '../services/enhancedAiService';
import { getViewHistory } from '../services/userService';
import { useCart } from '../contexts/CartContext';
import { oneClickAddToCart } from '../services/aiShoppingAssistant';
import '../styles/ai-shopping.css';

const AiShopping = () => {
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
  const handleSendMessageToAI = async (message) => {
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
        }
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
    } finally {
      setIsImageSearch(false);
      // 重置文件输入
      e.target.value = '';
    }
  };
  
  // 处理快速提示点击
  const handleSuggestionClick = (suggestion) => {
    if (!isLoading) {
      handleSendMessageToAI(suggestion);
    }
  };
  
  // 一键添加到购物车功能
  const handleDirectAddToCart = async (product) => {
    try {
      const result = await oneClickAddToCart(product, 1, addToCart);
      
      if (result.success) {
        setDirectAddSuccess(true);
        setAddedProduct(product);
        
        // 5秒后隐藏成功提示
        setTimeout(() => {
          setDirectAddSuccess(false);
          setAddedProduct(null);
        }, 5000);
        
        // 添加一条系统消息说明添加成功
        setMessages(prev => [...prev, {
          isUser: false,
          content: `我已将 ${product.name} 添加到您的购物车中，您可以继续购物或前往购物车完成结账。`,
          timestamp: new Date().toISOString(),
          isSystemMessage: true
        }]);
      } else {
        // 处理添加失败的情况
        alert(result.message || '添加到购物车失败');
      }
    } catch (error) {
      console.error('一键下单出错:', error);
      alert('添加到购物车失败，请稍后再试');
    }
  };
  
  // 渲染侧边栏内容
  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="ai-sidebar-history">
            <h3>最近浏览</h3>
            {recentProducts.length > 0 ? (
              <div className="sidebar-products">
                {recentProducts.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="sidebar-product">
                    <div className="sidebar-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="sidebar-product-info">
                      <div className="sidebar-product-name">{product.name}</div>
                      <div className="sidebar-product-price">¥{parseFloat(product.price).toFixed(2)}</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="sidebar-product-arrow" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-history">
                <p>暂无浏览历史</p>
              </div>
            )}
          </div>
        );
        
      case 'tools':
        return (
          <div className="ai-sidebar-tools">
            <h3>AI导购工具</h3>
            <div className="ai-tools-list">
              <div className="ai-tool-item" onClick={() => handleSendMessageToAI("给我推荐一些热门商品")}>
                <div className="ai-tool-icon">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div className="ai-tool-info">
                  <h4>智能推荐</h4>
                  <p>基于您的偏好获取个性化推荐</p>
                </div>
              </div>
              
              <div className="ai-tool-item" onClick={handleImageUpload}>
                <div className="ai-tool-icon">
                  <FontAwesomeIcon icon={faCamera} />
                </div>
                <div className="ai-tool-info">
                  <h4>图像识别</h4>
                  <p>上传图片寻找类似商品</p>
                </div>
              </div>
              
              <div className="ai-tool-item" onClick={() => handleSendMessageToAI("帮我对比最热门的两款手机")}>
                <div className="ai-tool-icon">
                  <FontAwesomeIcon icon={faBalanceScale} />
                </div>
                <div className="ai-tool-info">
                  <h4>商品对比</h4>
                  <p>详细比较多款商品的优缺点</p>
                </div>
              </div>
              
              <div className="ai-tool-item" onClick={() => handleSendMessageToAI("有什么优惠活动吗？")}>
                <div className="ai-tool-icon">
                  <FontAwesomeIcon icon={faTag} />
                </div>
                <div className="ai-tool-info">
                  <h4>优惠查询</h4>
                  <p>查找当前促销和特价商品</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'chat':
      default:
        return (
          <div className="ai-sidebar-suggestions">
            <h3>您可能感兴趣的</h3>
            <div className="suggestions-list">
              {personalizedSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="ai-suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FontAwesomeIcon icon={faSearch} className="suggestion-icon" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
            
            <div className="ai-guide">
              <div className="ai-guide-header">
                <FontAwesomeIcon icon={faInfoCircle} />
                <h4>使用指南</h4>
              </div>
              <ul className="ai-guide-list">
                <li>描述您想要的商品，我会推荐最合适的</li>
                <li>询问特定商品的详细信息和评价</li>
                <li>点击"图像识别"上传商品图片进行搜索</li>
                <li>输入"对比A和B"获取商品的详细比较</li>
              </ul>
            </div>
          </div>
        );
    }
  };
  
  // 在产品展示部分添加一键下单按钮
  const renderProductCard = (product) => {
    return (
      <div className="product-card" key={product.id}>
        <div className="product-image">
          <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            <span className="current-price">¥{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">¥{product.originalPrice}</span>
            )}
          </div>
          <div className="product-actions">
            <button 
              className="view-details-btn"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              查看详情
            </button>
            <button 
              className="add-to-cart-btn"
              onClick={() => handleDirectAddToCart(product)}
            >
              一键加购
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="ai-shopping-page">
      <Navbar />
      
      <div className="ai-shopping-header">
        <div className="container">
          <div className="back-link">
            <Link to="/">
              <FontAwesomeIcon icon={faArrowLeft} /> 返回首页
            </Link>
          </div>
          <h1>AI智能导购助手</h1>
          <p>让购物决策更轻松 - 智能推荐、商品比较、解答疑问</p>
        </div>
      </div>
      
      <div className="ai-shopping-container">
        <div className="ai-shopping-sidebar">
          <div className="ai-sidebar-tabs">
            <button 
              className={`ai-tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <FontAwesomeIcon icon={faRobot} />
              <span>助手</span>
            </button>
            <button 
              className={`ai-tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FontAwesomeIcon icon={faHistory} />
              <span>历史</span>
            </button>
            <button 
              className={`ai-tab-button ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>工具</span>
            </button>
          </div>
          
          <div className="ai-sidebar-content">
            {renderSidebarContent()}
          </div>
        </div>
        
        <div className="ai-shopping-chat">
          <ChatInterface 
            messages={messages}
            isLoading={isLoading || isImageSearch}
            streamingMessage={streamingMessage}
            onSendMessage={handleSendMessageToAI}
          />
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
      
      <Footer />
      
      {/* 一键下单成功提示 */}
      {directAddSuccess && addedProduct && (
        <div className="direct-add-success">
          <div className="success-icon">✓</div>
          <div className="success-content">
            <div className="success-title">已成功加入购物车</div>
            <div className="success-product">{addedProduct.name}</div>
          </div>
          <div className="success-actions">
            <button 
              className="continue-shopping"
              onClick={() => setDirectAddSuccess(false)}
            >
              继续购物
            </button>
            <button 
              className="go-to-cart"
              onClick={() => navigate('/cart')}
            >
              去购物车
            </button>
          </div>
          <button 
            className="close-success"
            onClick={() => setDirectAddSuccess(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AiShopping; 