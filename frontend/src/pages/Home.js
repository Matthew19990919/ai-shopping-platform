import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faHeart, 
  faShoppingCart, 
  faTag, 
  faComments, 
  faPercent, 
  faQuestion, 
  faGift, 
  faHeadset,
  faArrowRight,
  faFire,
  faBolt,
  faChevronRight,
  faClock,
  faStar,
  faShoppingBag,
  faTags,
  faBoxOpen,
  faCalendarAlt,
  faRobot,
  faThumbsUp,
  faChevronLeft,
  faChartLine,
  faAward
} from '@fortawesome/free-solid-svg-icons';

// 导入导航栏组件
import Navbar from '../components/Navbar';
import ProductRecommendations from '../components/ProductRecommendations';
// 导入公告横幅组件
import PromotionBanner from '../components/PromotionBanner';
import Footer from '../components/Footer';
// 导入AI助手组件
import ChatInterface from '../components/ai/ChatInterface';
// 导入全部服务方法
import * as RecommendationService from '../services/recommendationService';
// 导入AI服务
import { streamEnhancedMessageToAI } from '../services/enhancedAiService';
// 导入图片服务，移除轮播图相关的导入
import { getPromotionImageUrl, handleImageError } from '../services/imageService';
// 导入AI导购助手服务
import * as AiShoppingAssistant from '../services/aiShoppingAssistant';
import CouponPopup from '../components/CouponPopup'; // 引入优惠券弹窗组件
// 添加新的导入
import NewProductRecommendations from '../components/NewProductRecommendations';

// 导入CSS样式
import '../styles/home.css';
import '../styles/real-time-updates.css';
import '../styles/user-personalization.css';
import '../styles/promotion-notification.css';
import '../styles/ai-assistant.css';
import '../styles/promotions-home.css';
// 导入布局修复CSS
import '../styles/home-layout-fix.css';
// 导入宽度修复CSS
import '../styles/home-width-fix.css';

const Home = () => {
  const [activeRecommendationType, setActiveRecommendationType] = useState('personalized');
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const recommendationsGridRef = useRef(null);
  
  // 自定义促销公告数据
  const homeAnnouncements = [
    {
      id: 1,
      icon: faGift,
      text: "新用户专享：注册即送50元优惠券礼包",
      link: "/promotions/new-user",
      type: "primary"
    },
    {
      id: 2,
      icon: faTags,
      text: "618大促：全场商品低至5折，还有满300减50活动",
      link: "/campaigns/618",
      type: "secondary"
    },
    {
      id: 3,
      icon: faBolt,
      text: "限时闪购：每日10点、22点准时开抢",
      link: "/flash-sales",
      type: "warning"
    },
    {
      id: 4,
      icon: faBoxOpen,
      text: "AI导购功能全新上线：智能推荐，精准满足您的需求",
      link: "/ai-assistant",
      type: "success"
    }
  ];

  // 添加AI助手状态
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const [recommendationLoading, setRecommendationLoading] = useState(true);
  const [recommendationTab, setRecommendationTab] = useState('popular');

  useEffect(() => {
    // 强制刷新CSS，使用更安全的方法
    const refreshCSS = () => {
      try {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const timestamp = new Date().getTime();
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.includes('refresh=')) {
            // 直接修改现有link的href，而不是创建新的
            const newHref = href.includes('?') 
              ? `${href}&refresh=${timestamp}` 
              : `${href}?refresh=${timestamp}`;
            link.setAttribute('href', newHref);
          }
        });
        
        console.log('CSS样式已刷新，时间戳:', timestamp);
      } catch (error) {
        console.error('刷新CSS时出错:', error);
      }
    };
    
    // 调用强制刷新CSS函数
    refreshCSS();

    // 初始化页面时运行的代码
    // 加载脚本
    const loadScript = (src, callback) => {
      // 检查脚本是否已存在
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript && callback) {
        callback();
        return;
      }

      // 创建新脚本
      try {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        // 添加回调
        if (callback) {
          script.onload = () => callback();
        }
        
        document.body.appendChild(script);
      } catch (error) {
        console.error(`Error loading script: ${src}`, error);
      }
    };

    // 清除浏览器缓存的CSS文件
    const clearCSSCache = () => {
      try {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href) {
            const newHref = href.includes('?') 
              ? `${href}&_cache=${new Date().getTime()}` 
              : `${href}?_cache=${new Date().getTime()}`;
            link.setAttribute('href', newHref);
          }
        });
        console.log('CSS缓存已刷新');
      } catch (error) {
        console.error('刷新CSS缓存时出错:', error);
      }
    };

    // 刷新CSS缓存
    clearCSSCache();

    // 尝试加载脚本
    try {
      // 由于我们可能还没有这些JS文件，所以会在控制台显示加载错误，这没关系
      // 在实际项目中，应确保这些文件存在或进行错误处理
      loadScript('/js/real-time-updates.js');
      loadScript('/js/user-personalization.js');
      loadScript('/js/promotion-notification.js');
      loadScript('/js/ai-assistant.js');
    } catch (error) {
      console.error('Error during script loading:', error);
    }

    // 记录首页访问，用于推荐系统
    RecommendationService.recordSearch('首页访问');

    // 添加秒杀倒计时功能
    const setupCountdowns = () => {
      // 获取当前时间
      const now = new Date();
      // 设置今天结束时间
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      // 计算剩余时间（毫秒）
      const timeRemaining = endOfDay - now;
      
      // 转换为时、分、秒
      const updateCountdown = () => {
        const now = new Date();
        const diff = endOfDay - now;
        
        if (diff <= 0) {
          // 如果时间到了，重新设置为明天
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(23, 59, 59, 999);
          endOfDay.setTime(tomorrow.getTime());
        }
        
        // 计算剩余小时、分钟和秒数
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 格式化输出
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新大的倒计时显示
        const flashCountdown = document.getElementById('flash-countdown');
        if (flashCountdown) {
          flashCountdown.textContent = formattedTime;
        }
        
        // 更新小的倒计时显示
        const miniFlashCountdown = document.getElementById('mini-flash-countdown');
        if (miniFlashCountdown) {
          miniFlashCountdown.textContent = formattedTime;
        }
      };
      
      // 初始更新
      updateCountdown();
      
      // 每秒更新一次
      return setInterval(updateCountdown, 1000);
    };
    
    // 设置倒计时
    const countdownInterval = setupCountdowns();
    
    // 清理函数
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  // 处理推荐类型的变化
  const handleRecommendationTypeChange = (type) => {
    setActiveRecommendationType(type);
    setCurrentScrollIndex(0); // 重置滚动位置
  };

  // 滚动到指定索引
  const scrollToIndex = (index) => {
    const gridElement = recommendationsGridRef.current;
    if (!gridElement) return;
    
    const items = gridElement.querySelectorAll('.recommendation-item');
    if (items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth;
    const gap = 18; // 与CSS中的gap保持一致
    const scrollPosition = index * (itemWidth + gap);
    
    gridElement.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentScrollIndex(index);
  };
  
  // 下一组
  const scrollNext = () => {
    const gridElement = recommendationsGridRef.current;
    if (!gridElement) return;
    
    const items = gridElement.querySelectorAll('.recommendation-item');
    if (items.length === 0) return;
    
    const containerWidth = gridElement.offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const gap = 18; // 与CSS中的gap保持一致
    const itemsPerView = Math.floor(containerWidth / (itemWidth + gap));
    const maxIndex = Math.max(0, items.length - itemsPerView);
    
    const newIndex = Math.min(currentScrollIndex + itemsPerView, maxIndex);
    scrollToIndex(newIndex);
  };
  
  // 上一组
  const scrollPrev = () => {
    const gridElement = recommendationsGridRef.current;
    if (!gridElement) return;
    
    const items = gridElement.querySelectorAll('.recommendation-item');
    if (items.length === 0) return;
    
    const containerWidth = gridElement.offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const gap = 18; // 与CSS中的gap保持一致
    const itemsPerView = Math.floor(containerWidth / (itemWidth + gap));
    
    const newIndex = Math.max(0, currentScrollIndex - itemsPerView);
    scrollToIndex(newIndex);
  };
  
  // 监听窗口大小变化，调整滚动点
  useEffect(() => {
    const handleResize = () => {
      const gridElement = recommendationsGridRef.current;
      if (!gridElement) return;
      
      const items = gridElement.querySelectorAll('.recommendation-item');
      if (items.length === 0) return;
      
      // 重新计算可见项目数并调整当前索引
      const containerWidth = gridElement.offsetWidth;
      const itemWidth = items[0].offsetWidth;
      const gap = 18;
      const itemsPerView = Math.floor(containerWidth / (itemWidth + gap));
      const maxIndex = Math.max(0, items.length - itemsPerView);
      
      // 如果当前索引超出范围，重新调整
      if (currentScrollIndex > maxIndex) {
        setCurrentScrollIndex(maxIndex);
        scrollToIndex(maxIndex);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentScrollIndex]);

  // 处理发送消息给AI
  const handleSendMessageToAI = async (message) => {
    if (!message.trim() || isAiLoading) return;
    
    // 添加用户消息到消息列表
    const userMessage = { 
      isUser: true, 
      content: message, 
      timestamp: new Date().toISOString() 
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setIsAiLoading(true);
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
              setAiMessages(prev => [
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
              setAiMessages(prev => {
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
      setAiMessages(prev => {
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
      setAiMessages(prev => [
        ...prev,
        {
          isUser: false,
          content: "抱歉，我暂时无法回答您的问题。请稍后再试。",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRecommendationTabChange = (tabId) => {
    setRecommendationTab(tabId);
    setRecommendationLoading(true);
    
    // 延迟取消加载状态，模拟API调用
    setTimeout(() => {
      setRecommendationLoading(false);
    }, 600);
  };

  return (
    <div className="home-page">
      {/* 导航栏（包含顶部登录栏） */}
      <Navbar />

      {/* 促销公告横幅 */}
      <PromotionBanner announcements={homeAnnouncements} />

      {/* 主内容区 */}
      <div className="main-content-wrapper">
        <div className="main-content">
          
          {/* 分类侧边栏和用户区域的Grid容器 */}
          <div className="top-section-container ds-fade-in">
            {/* 右侧卡片区域 */}
            <div className="right-cards-container full-width">
              {/* 会员专享卡片 */}
              <div className="ds-card ds-card-compact member-card">
                <div className="ds-card-header">
                  <div className="ds-card-title">会员特权</div>
                  <Link to="/member" className="ds-link">查看特权 <FontAwesomeIcon icon={faChevronRight} size="xs" /></Link>
                </div>
                <div className="member-icons">
                  <div className="member-icon-item">
                    <div className="icon-circle">
                      <FontAwesomeIcon icon={faTag} />
                    </div>
                    <span>优惠券</span>
                  </div>
                  <div className="member-icon-item">
                    <div className="icon-circle">
                      <FontAwesomeIcon icon={faGift} />
                    </div>
                    <span>礼品卡</span>
                  </div>
                  <div className="member-icon-item">
                    <div className="icon-circle">
                      <FontAwesomeIcon icon={faPercent} />
                    </div>
                    <span>折扣</span>
                  </div>
                  <div className="member-icon-item">
                    <div className="icon-circle">
                      <FontAwesomeIcon icon={faHeadset} />
                    </div>
                    <span>专属客服</span>
                  </div>
                </div>
              </div>
              
              {/* 快讯卡片 */}
              <div className="ds-card ds-card-compact news-card">
                <div className="ds-card-header">
                  <div className="ds-card-title">商城快讯</div>
                  <Link to="/news" className="ds-link">更多 <FontAwesomeIcon icon={faChevronRight} size="xs" /></Link>
                </div>
                <ul className="news-list">
                  <li className="news-item">
                    <span className="news-badge news-badge-activity">活动</span>
                    <Link to="/news/1" className="news-link">5.1劳动节大促 全场满300减50</Link>
                  </li>
                  <li className="news-item">
                    <span className="news-badge news-badge-notice">公告</span>
                    <Link to="/news/2" className="news-link">防诈骗提醒：请勿泄露个人信息</Link>
                  </li>
                  <li className="news-item">
                    <span className="news-badge news-badge-new">上新</span>
                    <Link to="/news/3" className="news-link">全新电子产品类目已上线</Link>
                  </li>
                </ul>
              </div>
              
              {/* AI助手卡片 */}
              <div className="ds-card ds-card-compact ai-assistant-card">
                <div className="ai-assistant-content">
                  <div className="ai-assistant-icon">
                    <img src="/images/ai-assistant-icon.svg" alt="AI助手" onError={(e) => e.target.src = '/images/ai-assistant-fallback.png'} />
                  </div>
                  <div className="ai-assistant-text">
                    <h3>智能购物助手</h3>
                    <p>个性化推荐，精准满足需求</p>
                  </div>
                </div>
                <div className="ai-assistant-actions">
                  <button className="ds-btn ds-btn-primary" onClick={() => setShowAIAssistant(true)}>
                    <FontAwesomeIcon icon={faComments} className="ds-btn-icon" />
                    快速咨询
                  </button>
                  <Link to="/ai-shopping" className="ds-btn ds-btn-outline">
                    <FontAwesomeIcon icon={faShoppingBag} className="ds-btn-icon" />
                    AI导购体验
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 为您推荐部分移动到右侧 */}
            <div className="right-recommendations full-width-container">
              {/* 主推荐区域 */}
              <div className="recommendation-main">
                {/* 个性化推荐区域 */}
                <section className="personalized-recommendations ds-slide-in-up">
                  <div className="section-header">
                    <h2 className="section-title">为您推荐</h2>
                    <Link to="/products" className="ds-link ds-link-more">
                      更多推荐 <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                  
                  <div className="recommendation-tags">
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'personalized' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('personalized')}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> 猜你喜欢
                    </span>
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'similar' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('similar')}
                    >
                      <FontAwesomeIcon icon={faStar} /> 相似推荐
                    </span>
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'popular' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('popular')}
                    >
                      <FontAwesomeIcon icon={faFire} /> 热门商品
                    </span>
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'new' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('new')}
                    >
                      <FontAwesomeIcon icon={faBolt} /> 新品上架
                    </span>
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'trending' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('trending')}
                    >
                      <FontAwesomeIcon icon={faChartLine} /> 趋势好物
                    </span>
                    <span 
                      className={`ds-tag ${activeRecommendationType === 'premium' ? 'ds-tag-primary' : ''}`}
                      onClick={() => handleRecommendationTypeChange('premium')}
                    >
                      <FontAwesomeIcon icon={faAward} /> 品质之选
                    </span>
                  </div>
                  
                  <div className="recommendation-products">
                    {/* 添加滚动箭头，适配右侧区域布局 */}
                    <div className="scroll-arrows side-arrows">
                      <button className="scroll-arrow scroll-up" onClick={() => {
                        const container = document.querySelector('.right-recommendations .recommended-products-list');
                        if (container) {
                          container.scrollTop -= 200; // 上滚200px
                        }
                      }}>
                        <FontAwesomeIcon icon={faChevronLeft} style={{ transform: 'rotate(90deg)' }} />
                      </button>
                      <button className="scroll-arrow scroll-down" onClick={() => {
                        const container = document.querySelector('.right-recommendations .recommended-products-list');
                        if (container) {
                          container.scrollTop += 200; // 下滚200px
                        }
                      }}>
                        <FontAwesomeIcon icon={faChevronRight} style={{ transform: 'rotate(90deg)' }} />
                      </button>
                    </div>
                    
                    <NewProductRecommendations 
                      activeTab={recommendationTab}
                      onTabChange={handleRecommendationTabChange}
                      loading={recommendationLoading}
                      onLoadComplete={() => setRecommendationLoading(false)}
                    />
                  </div>
                </section>
              </div>
              
              {/* 右侧新增区域 */}
              <div className="recommendation-aside">
                {/* 热门活动卡片 */}
                <div className="hot-activity-card">
                  <div className="hot-activity-title">限时秒杀</div>
                  <div className="hot-activity-desc">每日爆品限时限量抢购</div>
                  <div className="hot-activity-countdown">
                    <FontAwesomeIcon icon={faClock} /> 
                    <span id="mini-flash-countdown">23:59:59</span>
                  </div>
                  <Link to="/flash-sale" className="hot-activity-button">
                    立即抢购
                  </Link>
                </div>
                
                {/* AI推荐卡片 */}
                <div className="ai-recommend-card">
                  <div className="ai-recommend-title">
                    <FontAwesomeIcon icon={faRobot} /> AI智能推荐
                  </div>
                  <div className="ai-recommend-desc">基于您的浏览历史，我们推荐...</div>
                  <div className="ai-recommend-label">
                    <div className="ai-recommend-tag">高性价比</div>
                    <div className="ai-recommend-tag">品质好物</div>
                    <div className="ai-recommend-tag">人气爆款</div>
                  </div>
                  <Link to="/ai-recommendations" className="ai-recommend-button">
                    查看AI推荐
                  </Link>
                </div>
                
                {/* 新品专区卡片 */}
                <div className="hot-activity-card" style={{background: 'linear-gradient(135deg, #42b983, #2f9c6f)'}}>
                  <div className="hot-activity-title">新品专区</div>
                  <div className="hot-activity-desc">每周上新，品质保证</div>
                  <div className="hot-activity-countdown" style={{background: 'rgba(255, 255, 255, 0.25)'}}>
                    <FontAwesomeIcon icon={faBoxOpen} /> 
                    <span>本周已更新</span>
                  </div>
                  <Link to="/new-products" className="hot-activity-button" style={{color: '#42b983'}}>
                    查看新品
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 活动推荐区域 */}
          <section className="featured-activities ds-slide-in-up">
            <div className="ds-flex ds-justify-between ds-items-center ds-mb-4">
              <h2 className="section-title">活动专区</h2>
              <Link to="/activities" className="ds-link ds-link-more">
                更多活动 <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            
            <div className="activities-grid">
              {/* 活动卡片1：限时秒杀 */}
              <div className="ds-card activity-card flash-sale-card">
                <div className="price-tag price-tag-premium">
                  <span>¥199.00</span>
                </div>
                <div className="activity-card-header">
                  <h3><FontAwesomeIcon icon={faBolt} className="icon-flash" /> 限时秒杀</h3>
                  <div className="countdown-timer">
                    <FontAwesomeIcon icon={faClock} /> 
                    <span id="flash-countdown">23:59:59</span>
                  </div>
                </div>
                <div className="activity-products">
                  {[1, 2].map(item => (
                    <div key={item} className="activity-product">
                      <img 
                        src={`/images/products/flash-sale:item${item}.jpg`} 
                        alt={`秒杀商品${item}`} 
                        onError={(e) => handleImageError(e, 'product', `秒杀商品${item}`)}
                      />
                      <div className="product-price">
                        <span className="current-price">¥99</span>
                        <span className="original-price">¥199</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/flash-sale" className="ds-btn ds-btn-outline ds-btn-block">
                  立即抢购
                </Link>
              </div>
              
              {/* 活动卡片2：新品首发 */}
              <div className="ds-card activity-card new-arrival-card">
                <div className="price-tag price-tag-premium">
                  <span>¥129.00</span>
                </div>
                <div className="activity-card-header">
                  <h3><FontAwesomeIcon icon={faStar} className="icon-new" /> 新品首发</h3>
                </div>
                <div className="activity-products">
                  {[1, 2].map(item => (
                    <div key={item} className="activity-product">
                      <img 
                        src={`/images/products/new-arrival:item${item}.jpg`} 
                        alt={`新品${item}`} 
                        onError={(e) => handleImageError(e, 'product', `新品${item}`)}
                      />
                      <div className="product-name">全新上市商品{item}</div>
                    </div>
                  ))}
                </div>
                <Link to="/new-arrivals" className="ds-btn ds-btn-outline ds-btn-block">
                  查看新品
                </Link>
              </div>
              
              {/* 活动卡片3：特惠专区 */}
              <div className="ds-card activity-card special-offer-card">
                <div className="price-tag price-tag-premium">
                  <span>¥149.00</span>
                </div>
                <div className="activity-card-header">
                  <h3><FontAwesomeIcon icon={faPercent} className="icon-offer" /> 特惠专区</h3>
                </div>
                <div className="activity-products">
                  {[1, 2].map(item => (
                    <div key={item} className="activity-product">
                      <img 
                        src={`/images/products/special-offer:item${item}.jpg`} 
                        alt={`特惠商品${item}`} 
                        onError={(e) => handleImageError(e, 'product', `特惠商品${item}`)}
                      />
                      <div className="offer-tag">满200减30</div>
                    </div>
                  ))}
                </div>
                <Link to="/special-offers" className="ds-btn ds-btn-outline ds-btn-block">
                  浏览特惠
                </Link>
              </div>
              
              {/* 活动卡片4：人气爆款 */}
              <div className="ds-card activity-card popular-card">
                <div className="price-tag price-tag-premium">
                  <span>¥179.00</span>
                </div>
                <div className="activity-card-header">
                  <h3><FontAwesomeIcon icon={faFire} className="icon-popular" /> 人气爆款</h3>
                </div>
                <div className="activity-products">
                  {[1, 2].map(item => (
                    <div key={item} className="activity-product">
                      <img 
                        src={`/images/products/popular:item${item}.jpg`} 
                        alt={`人气商品${item}`} 
                        onError={(e) => handleImageError(e, 'product', `人气商品${item}`)}
                      />
                      <div className="popularity-tag"><FontAwesomeIcon icon={faFire} /> 热销2000+</div>
                    </div>
                  ))}
                </div>
                <Link to="/popular" className="ds-btn ds-btn-outline ds-btn-block">
                  查看爆款
                </Link>
              </div>
            </div>
          </section>

          {/* 促销活动区域 */}
          <section className="promotion-section ds-slide-in-up">
            <div className="section-header">
              <h2 className="section-title">热门促销</h2>
              <Link to="/promotions" className="ds-link ds-link-more">
                查看全部 <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            
            <div className="promotions-grid">
              {/* 促销卡片1 */}
              <div className="ds-card promotion-card">
                <div className="promotion-image">
                  <img 
                    src={getPromotionImageUrl('/images/promotions/flash_sale.jpg', "限时折扣")} 
                    alt="限时折扣" 
                    onError={(e) => {
                      console.error('促销图片加载失败:', e.target.src);
                      const publicUrl = process.env.PUBLIC_URL || '';
                      // 尝试加载备用图片
                      const backupImage = `${publicUrl}/images/promotions/default-promotion.jpg`;
                      if (e.target.src !== backupImage) {
                        e.target.src = backupImage;
                        return;
                      }
                      // 如果备用图片也失败，尝试占位图
                      const placeholderImage = `${publicUrl}/images/placeholders/promotion-placeholder.png`;
                      if (e.target.src !== placeholderImage) {
                        e.target.src = placeholderImage;
                        return;
                      }
                      // 如果占位图也失败，使用内联SVG
                      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
                        <rect width="100%" height="100%" fill="#f5f5f5"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">限时折扣</text>
                      </svg>`;
                      e.target.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
                    }}
                    loading="lazy"
                  />
                  <div className="ds-badge ds-badge-primary promotion-badge">限时</div>
                </div>
                <div className="promotion-content">
                  <h3 className="promotion-title">春季特惠</h3>
                  <p className="promotion-desc">全场服装5折起，限时3天</p>
                  <div className="promotion-timer">
                    <FontAwesomeIcon icon={faClock} />
                    <span className="timer">23:59:59</span>
                  </div>
                  <Link to="/promotion/1" className="ds-btn ds-btn-primary ds-btn-sm">立即查看</Link>
                </div>
              </div>
              
              {/* 促销卡片2 */}
              <div className="ds-card promotion-card">
                <div className="promotion-image">
                  <img 
                    src={getPromotionImageUrl('/images/promotions/member_day.jpg', "满减优惠")} 
                    alt="满减优惠" 
                    onError={(e) => {
                      console.error('促销图片加载失败:', e.target.src);
                      const publicUrl = process.env.PUBLIC_URL || '';
                      // 尝试加载备用图片
                      const backupImage = `${publicUrl}/images/promotions/default-promotion.jpg`;
                      if (e.target.src !== backupImage) {
                        e.target.src = backupImage;
                        return;
                      }
                      // 如果备用图片也失败，尝试占位图
                      const placeholderImage = `${publicUrl}/images/placeholders/promotion-placeholder.png`;
                      if (e.target.src !== placeholderImage) {
                        e.target.src = placeholderImage;
                        return;
                      }
                      // 如果占位图也失败，使用内联SVG
                      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
                        <rect width="100%" height="100%" fill="#f5f5f5"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">满减优惠</text>
                      </svg>`;
                      e.target.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
                    }}
                    loading="lazy"
                  />
                  <div className="ds-badge ds-badge-secondary promotion-badge">满减</div>
                </div>
                <div className="promotion-content">
                  <h3 className="promotion-title">数码盛宴</h3>
                  <p className="promotion-desc">数码产品满1000减100</p>
                  <div className="promotion-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>截止日期: 2025-05-30</span>
                  </div>
                  <Link to="/promotion/2" className="ds-btn ds-btn-primary ds-btn-sm">立即查看</Link>
                </div>
              </div>
              
              {/* 促销卡片3 */}
              <div className="ds-card promotion-card">
                <div className="promotion-image">
                  <img 
                    src={getPromotionImageUrl('/images/promotions/new_user.jpg', "新品促销")} 
                    alt="新品促销" 
                    onError={(e) => {
                      console.error('促销图片加载失败:', e.target.src);
                      const publicUrl = process.env.PUBLIC_URL || '';
                      // 尝试加载备用图片
                      const backupImage = `${publicUrl}/images/promotions/default-promotion.jpg`;
                      if (e.target.src !== backupImage) {
                        e.target.src = backupImage;
                        return;
                      }
                      // 如果备用图片也失败，尝试占位图
                      const placeholderImage = `${publicUrl}/images/placeholders/promotion-placeholder.png`;
                      if (e.target.src !== placeholderImage) {
                        e.target.src = placeholderImage;
                        return;
                      }
                      // 如果占位图也失败，使用内联SVG
                      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160" viewBox="0 0 280 160">
                        <rect width="100%" height="100%" fill="#f5f5f5"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">新品促销</text>
                      </svg>`;
                      e.target.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
                    }}
                    loading="lazy"
                  />
                  <div className="ds-badge ds-badge-success promotion-badge">新品</div>
                </div>
                <div className="promotion-content">
                  <h3 className="promotion-title">新品尝鲜</h3>
                  <p className="promotion-desc">新品上架，首发特惠</p>
                  <div className="promotion-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>截止日期: 2025-06-15</span>
                  </div>
                  <Link to="/promotion/3" className="ds-btn ds-btn-primary ds-btn-sm">立即查看</Link>
                </div>
              </div>
            </div>
          </section>

          {/* 底部服务保障区域 */}
          <section className="service-guarantee ds-slide-in-up">
            <div className="service-items">
              <div className="service-item">
                <FontAwesomeIcon icon={faShoppingBag} className="service-icon" />
                <span>正品保障</span>
                <p>正品保障，假一赔十</p>
              </div>
              <div className="service-item">
                <FontAwesomeIcon icon={faBolt} className="service-icon" />
                <span>急速配送</span>
                <p>多仓直发，极速配送</p>
              </div>
              <div className="service-item">
                <FontAwesomeIcon icon={faShoppingCart} className="service-icon" />
                <span>无忧退换</span>
                <p>7天无理由退换</p>
              </div>
              <div className="service-item">
                <FontAwesomeIcon icon={faHeadset} className="service-icon" />
                <span>优质服务</span>
                <p>全程服务支持</p>
              </div>
              <div className="service-item">
                <FontAwesomeIcon icon={faTag} className="service-icon" />
                <span>特色服务</span>
                <p>私人定制家电服务</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* 底部区域 */}
      <Footer />
      
      {/* AI购物助手浮动按钮 */}
      <div className="ai-floating-button" onClick={() => setShowAIAssistant(!showAIAssistant)}>
        <img src="/images/icons/ai-assistant-icon.png" alt="AI助手" className="ai-assistant-img" />
      </div>
      
      {/* AI购物助手聊天界面 */}
      {showAIAssistant && (
        <div className="ai-floating-chat">
          <div className="ai-floating-chat-container">
            <ChatInterface 
              messages={aiMessages}
              isLoading={isAiLoading}
              streamingMessage={streamingMessage}
              onSendMessage={handleSendMessageToAI}
            />
          </div>
          <div className="ai-floating-chat-overlay" onClick={() => setShowAIAssistant(false)}></div>
        </div>
      )}
      
      {/* 优惠券弹窗 - 直接在这里添加，确保在首页能够显示 */}
      <CouponPopup />
    </div>
  );
};

export default Home;
