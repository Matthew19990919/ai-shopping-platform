import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/coupon-popup.css';

// 关闭开发模式下强制显示弹窗
const FORCE_SHOW_POPUP = false; // 设置为false关闭强制显示模式

const CouponPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1小时 = 3600秒

  useEffect(() => {
    // 检查是否是新的会话，使用sessionStorage判断
    const isNewSession = !sessionStorage.getItem('couponPopupShown');
    
    if (isNewSession || FORCE_SHOW_POPUP) {
      // 10秒后显示弹窗
      const timer = setTimeout(() => {
        setIsVisible(true);
        // 标记本次会话已显示过弹窗
        sessionStorage.setItem('couponPopupShown', 'true');
        console.log('显示优惠券弹窗');
      }, 10000); // 10秒延迟
      
      return () => clearTimeout(timer);
    }
  }, []);

  // 倒计时效果
  useEffect(() => {
    if (!isVisible) return;

    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isVisible]);

  // 格式化时间为 HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const handleClose = () => {
    setIsVisible(false);
    // 记录当前会话已关闭状态，不再在本次会话中显示
    sessionStorage.setItem('couponPopupShown', 'true');
    console.log('优惠券弹窗已关闭，将在下次打开项目时重新显示');
  };

  if (!isVisible) return null;

  return (
    <div className="coupon-popup-overlay">
      <div className="coupon-popup-container">
        <div className="coupon-popup">
          <div className="coupon-popup-header">
            <h3>限时优惠券</h3>
            <button className="coupon-popup-close" onClick={handleClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="coupon-popup-content">
            <div className="coupon-popup-image">
              <img 
                src={process.env.PUBLIC_URL + '/images/promotions/limited-time-coupon.png'} 
                alt="限时优惠券" 
                onError={(e) => {
                  console.error('优惠券图片加载失败，使用备用图片');
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + '/images/placeholders/promotion-placeholder.png';
                }}
              />
            </div>
            <div className="coupon-popup-text">
              新人专享，注册即可获得100元优惠券
            </div>
            <div className="coupon-countdown">
              <span className="countdown-label">剩余时间：</span>
              <span className="countdown-timer">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="coupon-popup-actions">
            <Link to="/coupon/new-user" className="coupon-action-primary" onClick={handleClose}>
              立即领取
            </Link>
            <button onClick={handleClose} className="coupon-action-secondary">
              稍后再说
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup; 