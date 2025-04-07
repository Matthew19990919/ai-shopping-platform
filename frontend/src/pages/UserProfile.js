import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faListAlt,
  faHeart,
  faTag,
  faWallet,
  faCog,
  faMapMarkerAlt,
  faQuestionCircle,
  faShoppingBag,
  faHistory,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import UserInfo from './user/UserInfo';
import UserOrders from './user/UserOrders';
import UserFavorites from './user/UserFavorites';
import UserCoupons from './user/UserCoupons';
import UserWallet from './user/UserWallet';
import UserSettings from './user/UserSettings';
import UserAddresses from './user/UserAddresses';
import UserAiHistory from './user/UserAiHistory';
import '../styles/user-profile.css';

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // 根据当前路径设置活动标签
  useEffect(() => {
    const path = location.pathname;
    const tab = path.split('/').pop();
    if (tab && tab !== 'user') {
      setActiveTab(tab);
    } else {
      setActiveTab('info');
    }
  }, [location]);

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 如果用户未登录，不渲染任何内容
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <div className="container">
          <h1>个人中心</h1>
          <div className="profile-breadcrumb">
            <Link to="/">首页</Link> / <span>个人中心</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="user-profile-content">
          {/* 移动端菜单切换按钮 */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            菜单 {isMobileMenuOpen ? '▲' : '▼'}
          </button>

          {/* 侧边栏导航 */}
          <div className={`user-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="user-info-card">
              <div className="user-avatar">
                <img src={user.avatar || "https://via.placeholder.com/80"} alt="用户头像" />
              </div>
              <h3>{user.nickname || user.email.split('@')[0]}</h3>
              <p>{user.email}</p>
            </div>

            <ul className="user-menu">
              <li className={activeTab === 'info' ? 'active' : ''}>
                <Link to="/user/info" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>个人信息</span>
                </Link>
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <Link to="/user/orders" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faListAlt} />
                  <span>我的订单</span>
                </Link>
              </li>
              <li className={activeTab === 'favorites' ? 'active' : ''}>
                <Link to="/user/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faHeart} />
                  <span>我的收藏</span>
                </Link>
              </li>
              <li className={activeTab === 'coupons' ? 'active' : ''}>
                <Link to="/user/coupons" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faTag} />
                  <span>优惠券</span>
                </Link>
              </li>
              <li className={activeTab === 'wallet' ? 'active' : ''}>
                <Link to="/user/wallet" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faWallet} />
                  <span>我的钱包</span>
                </Link>
              </li>
              <li className={activeTab === 'addresses' ? 'active' : ''}>
                <Link to="/user/addresses" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>收货地址</span>
                </Link>
              </li>
              <li className={activeTab === 'ai-history' ? 'active' : ''}>
                <Link to="/user/ai-history" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faHistory} />
                  <span>AI购物记录</span>
                </Link>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <Link to="/user/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <FontAwesomeIcon icon={faCog} />
                  <span>账户设置</span>
                </Link>
              </li>
              <li className="logout-item">
                <a href="#" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>退出登录</span>
                </a>
              </li>
            </ul>

            <div className="user-support">
              <h4>帮助 & 客服</h4>
              <Link to="/help" className="support-link">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>帮助中心</span>
              </Link>
              <Link to="/service" className="support-link">
                <FontAwesomeIcon icon={faShoppingBag} />
                <span>联系客服</span>
              </Link>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="user-content">
            <Routes>
              <Route path="/" element={<Navigate to="/user/info" replace />} />
              <Route path="/info" element={<UserInfo />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/favorites" element={<UserFavorites />} />
              <Route path="/coupons" element={<UserCoupons />} />
              <Route path="/wallet" element={<UserWallet />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/addresses" element={<UserAddresses />} />
              <Route path="/ai-history" element={<UserAiHistory />} />
              <Route path="*" element={<Navigate to="/user/info" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 