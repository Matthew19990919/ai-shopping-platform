import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faChevronLeft, 
  faChevronRight,
  faTag,
  faGift,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/promotion-banner.css';

/**
 * 促销横幅组件
 * 用于展示最新促销、优惠和公告信息
 */
const PromotionBanner = ({ announcements = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // 内联样式定义
  const styles = {
    banner: {
      width: '100%',
      backgroundColor: '#f8f3e8',
      position: 'relative',
      overflow: 'hidden',
      height: '40px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid #eee',
      transition: 'all 0.3s ease',
      zIndex: 10
    },
    bannerFadeOut: {
      opacity: 0,
      height: 0,
      marginTop: '-40px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '0 15px',
      position: 'relative'
    },
    content: (type) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '0 20px',
      height: '100%',
      cursor: 'pointer',
      textDecoration: 'none',
      color: getTypeColor(type),
      transition: 'background-color 0.2s ease'
    }),
    icon: {
      marginRight: '12px',
      fontSize: '14px',
      width: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: '13px',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    navButton: {
      background: 'transparent',
      border: 'none',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      opacity: 0.5,
      transition: 'opacity 0.2s ease',
      color: '#666',
      padding: 0,
      margin: 0
    },
    prevButton: {
      marginRight: '5px'
    },
    nextButton: {
      marginLeft: '5px'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      opacity: 0.5,
      transition: 'opacity 0.2s ease',
      color: '#666',
      position: 'absolute',
      right: '10px',
      padding: 0,
      margin: 0
    },
    indicators: {
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      height: '10px'
    },
    indicator: (active) => ({
      width: active ? '12px' : '4px',
      height: '4px',
      borderRadius: active ? '2px' : '50%',
      backgroundColor: active ? 'currentColor' : 'rgba(0, 0, 0, 0.2)',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      transition: 'all 0.2s ease'
    })
  };

  // 根据类型获取颜色
  function getTypeColor(type) {
    switch(type) {
      case 'primary': return '#1677ff';
      case 'secondary': return '#722ed1';
      case 'warning': return '#fa8c16';
      case 'success': return '#52c41a';
      default: return '#1677ff';
    }
  }

  // 检查localStorage，如果用户之前关闭了横幅
  useEffect(() => {
    const isClosed = localStorage.getItem('promoBannerClosed') === 'true';
    if (isClosed) {
      setIsVisible(false);
    }
  }, []);

  // 如果没有提供公告，使用默认公告
  const defaultAnnouncements = [
    {
      id: 1,
      icon: faGift,
      text: "新用户专享：注册即送50元优惠券礼包",
      link: "/promotions/new-user",
      type: "primary"
    },
    {
      id: 2,
      icon: faTag,
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
    }
  ];

  const items = announcements.length > 0 ? announcements : defaultAnnouncements;

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // 每5秒切换一次
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, items]);

  // 显示下一条公告
  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  // 显示上一条公告
  const prevAnnouncement = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // 关闭横幅
  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
    // 存储到 localStorage，避免用户刷新后再次显示
    localStorage.setItem('promoBannerClosed', 'true');
  };

  // 处理鼠标进入事件，暂停自动轮播
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  // 处理鼠标离开事件，恢复自动轮播
  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  if (!isVisible || items.length === 0) return null;

  const currentAnnouncement = items[currentIndex];

  return (
    <div 
      style={{
        ...styles.banner,
        ...(isFadingOut ? styles.bannerFadeOut : {})
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="promotion-banner"
    >
      <div style={styles.container} className="promotion-banner-container">
        <button 
          style={{...styles.navButton, ...styles.prevButton}}
          onClick={prevAnnouncement}
          aria-label="上一条公告"
          className="promotion-banner-nav promotion-banner-prev"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <Link 
          to={currentAnnouncement.link}
          style={styles.content(currentAnnouncement.type)}
          className={`promotion-banner-content promotion-banner-${currentAnnouncement.type}`}
        >
          <div style={styles.icon} className="promotion-banner-icon">
            <FontAwesomeIcon icon={currentAnnouncement.icon || faTag} />
          </div>
          <div style={styles.text} className="promotion-banner-text">
            {currentAnnouncement.text}
          </div>
        </Link>
        
        <button 
          style={{...styles.navButton, ...styles.nextButton}}
          onClick={nextAnnouncement}
          aria-label="下一条公告"
          className="promotion-banner-nav promotion-banner-next"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        
        <button 
          style={styles.closeButton}
          onClick={handleClose}
          aria-label="关闭公告"
          className="promotion-banner-close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      {items.length > 1 && (
        <div style={styles.indicators} className="promotion-banner-indicators">
          {items.map((_, index) => (
            <button
              key={index}
              style={styles.indicator(index === currentIndex)}
              onClick={() => setCurrentIndex(index)}
              aria-label={`切换到第${index + 1}条公告`}
              className={`promotion-banner-indicator ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionBanner; 