import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/topLoginBar.css';

const TopLoginBar = () => {
  const { user, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  // 从本地存储中获取折叠状态
  useEffect(() => {
    const storedState = localStorage.getItem('topBarExpanded');
    if (storedState !== null) {
      setIsExpanded(storedState === 'true');
    } else {
      localStorage.setItem('topBarExpanded', 'true');
    }
  }, []);

  // 切换展开/收起状态
  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const newState = !prev;
      localStorage.setItem('topBarExpanded', newState.toString());
      
      // 发送自定义事件通知其他组件状态已更改
      const event = new Event('topBarStateChanged');
      window.dispatchEvent(event);
      
      return newState;
    });
  };
  
  if (!isExpanded) {
    // 当收起时只显示一个按钮
    return (
      <div className="topbar-collapsed-state">
        <button className="topbar-expand-button" onClick={toggleExpanded}>
          <span>显示顶栏</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
    );
  }
  
  // 展开状态显示完整顶栏
  return (
    <div className="topbar-expanded-state">
      <div className="top-login-bar">
        {isAuthenticated ? (
          <div className="welcome-message">
            Hi～{user.nickname || 'AI购物用户'}
          </div>
        ) : (
          <div className="login-register-buttons">
            <div className="greeting-text">Hi～欢迎来到AI购物</div>
            <Link to="/login" className="login-btn">登录</Link>
            <Link to="/register" className="register-btn">注册</Link>
          </div>
        )}
        <button className="topbar-collapse-button" onClick={toggleExpanded}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
    </div>
  );
};

export default TopLoginBar; 