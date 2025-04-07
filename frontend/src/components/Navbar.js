import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faSearch, 
  faMapMarkerAlt, 
  faMobile, 
  faChevronDown,
  faSignOutAlt,
  faCog,
  faListAlt,
  faHeart,
  faTag,
  faWallet,
  faRobot,
  faComment,
  faBars,
  faTimes,
  faChevronRight,
  faUsers,
  faChartLine,
  faServer,
  faBolt,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import TopLoginBar from './TopLoginBar';
import SearchBox from './SearchBox';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showCategories, setShowCategories] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topBarExpanded, setTopBarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // 监听 topBarExpanded 状态
  useEffect(() => {
    const storedState = localStorage.getItem('topBarExpanded');
    if (storedState !== null) {
      setTopBarExpanded(storedState === 'true');
    }

    // 添加事件监听器以捕获 topBarExpanded 的变化
    const handleStorageChange = (e) => {
      if (e && e.key === 'topBarExpanded') {
        setTopBarExpanded(e.newValue === 'true');
      } else {
        const currentState = localStorage.getItem('topBarExpanded');
        if (currentState !== null) {
          setTopBarExpanded(currentState === 'true');
        }
      }
    };

    // 自定义事件监听
    const handleCustomEvent = () => {
      const currentState = localStorage.getItem('topBarExpanded');
      if (currentState !== null) {
        setTopBarExpanded(currentState === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('topBarStateChanged', handleCustomEvent);
    
    // 每秒检查一次存储状态，以防事件没有正确触发
    const intervalId = setInterval(handleCustomEvent, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('topBarStateChanged', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

  // 商品分类数据
  const categories = [
    { id: 1, name: '家用电器', subcategories: ['电视', '空调', '洗衣机', '冰箱'] },
    { id: 2, name: '手机/数码', subcategories: ['手机', '平板', '相机', '耳机'] },
    { id: 3, name: '电脑/办公', subcategories: ['笔记本', '台式机', '打印机', '办公用品'] },
    { id: 4, name: '家居/家具', subcategories: ['沙发', '床垫', '餐桌', '衣柜'] },
    { id: 5, name: '服装/鞋帽', subcategories: ['男装', '女装', '童装', '内衣'] },
    { id: 6, name: '美妆/个护', subcategories: ['面部护理', '彩妆', '洗发护发', '香水'] },
    { id: 7, name: '食品/生鲜', subcategories: ['零食', '饮料', '水果', '海鲜'] },
  ];

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };
  
  // 处理商品分类点击
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setShowCategories(false);
    setMobileMenuOpen(false);
  };
  
  // 处理子分类点击
  const handleSubcategoryClick = (categoryId, subcategory) => {
    navigate(`/category/${categoryId}/${encodeURIComponent(subcategory)}`);
    setShowCategories(false);
    setMobileMenuOpen(false);
  };

  // 点击页面其他区域关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // 当路由变化时关闭菜单
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // 获取分类颜色
  const getCategoryColor = (id) => {
    const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33ff', '#33ff33', '#ff3333', '#3333ff'];
    return colors[id % colors.length];
  };

  const navLinks = [
    { to: '/', text: '首页' },
    { to: '/products', text: '全部商品' },
    { to: '/ai-shopping', text: 'AI导购' },
    { to: '/deals', text: '优惠活动' },
    { to: '/after-sales', text: '智能售后' }
  ];

  return (
    <div className="navbar-container">
      {/* 顶部登录栏 */}
      <TopLoginBar />
      
      {/* 快速导航栏 */}
      <div className={`quick-nav ${!topBarExpanded ? 'top-bar-collapsed' : ''}`}>
        <div className="quick-nav-content">
          {/* 左侧城市选择 */}
          <div className="location">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
            <span>上海</span>
          </div>
          
          {/* 右侧快捷链接 */}
          <div className="quick-links">
            {isAuthenticated && (
              <div className="user-menu-container">
                <div 
                  className="user-menu-trigger"
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <span className="user-name">我的账户</span>
                  <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                  
                  {/* 用户下拉菜单 */}
                  {showUserDropdown && (
                    <div className="user-dropdown">
                      <Link to="/user/info" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        个人信息
                      </Link>
                      <Link to="/user/orders" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faListAlt} />
                        </div>
                        我的订单
                      </Link>
                      <Link to="/user/favorites" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faHeart} />
                        </div>
                        我的收藏
                      </Link>
                      <Link to="/user/coupons" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faTag} />
                        </div>
                        优惠券
                      </Link>
                      <Link to="/user/wallet" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                        我的钱包
                      </Link>
                      <Link to="/user/settings" className="dropdown-link">
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faCog} />
                        </div>
                        账户设置
                      </Link>
                      {/* 管理员专用链接 */}
                      {user && user.role === 'admin' && (
                        <Link to="/admin/ecosystem" className="dropdown-link admin-link">
                          <div className="dropdown-icon-container">
                            <FontAwesomeIcon icon={faServer} />
                          </div>
                          系统仪表盘
                        </Link>
                      )}
                      <div 
                        onClick={handleLogout}
                        className="logout-button"
                      >
                        <div className="dropdown-icon-container">
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </div>
                        退出登录
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <Link to="/customer-service" className="quick-link">客户服务</Link>
            <span className="vertical-separator">|</span>
            <Link to="/help-center" className="quick-link">帮助中心</Link>
            <span className="vertical-separator">|</span>
            <Link to="/app-download" className="quick-link">
              <FontAwesomeIcon icon={faMobile} style={{ marginRight: '4px' }} />
              手机APP
            </Link>
          </div>
        </div>
      </div>

      {/* 主导航栏 */}
      <div className="main-navbar">
        <div className="main-navbar-content">
          {/* 移动端菜单按钮 */}
          <button 
            className="mobile-menu-button" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <div className="mobile-menu-line"></div>
            <div className="mobile-menu-line"></div>
            <div className="mobile-menu-line"></div>
          </button>

          {/* 网站 Logo */}
          <Link to="/" className="logo-container">
            <img 
              src="/images/logo.png"
              alt="AI Shopping Mall" 
              className="logo"
              onError={(e) => {
                // 如果图片加载失败，显示文字作为Logo
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <h1 className="logo-text">
              AI购物商城
            </h1>
          </Link>

          {/* 搜索框 */}
          <div className="search-container">
            <SearchBox placeholder="搜索商品、品牌、活动" />
            
            {/* 搜索热词 */}
            <div className="search-hotwords">
              <Link to="/search?q=热门搜索" className="hotword">
                热门搜索
              </Link>
              <Link to="/ai-assistant" className="hotword featured">
                <i className="fas fa-robot" style={{ marginRight: '3px' }}></i>
                AI导购
              </Link>
              <Link to="/price-comparison" className="hotword featured">
                <FontAwesomeIcon icon={faExchangeAlt} style={{ marginRight: '3px' }} />
                跨平台比价
              </Link>
              <Link to="/community" className="hotword">
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '3px' }} />
                社区
              </Link>
              <Link to="/search?q=智能家电" className="hotword">
                智能家电
              </Link>
              <Link to="/search?q=手机数码" className="hotword">
                手机数码
              </Link>
              <Link to="/promotions" className="hotword">
                优惠活动
              </Link>
            </div>
          </div>

          {/* 购物车按钮 */}
          <Link to="/cart" className="cart-button">
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
            <span>购物车</span>
            <span className="cart-count">0</span>
          </Link>
          
          {/* AI助手按钮 - 修改为新样式 */}
          <Link to="/ai-assistant" className="outer-cont flex">
            <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none">
                <path
                  d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                ></path>
                <path
                  d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
            AI导购助手
          </Link>
        </div>
      </div>

      {/* 分类导航栏 */}
      <div className="category-navbar">
        <div className="category-navbar-content">
          {/* 全部分类按钮 */}
          <div 
            className={`all-categories-button ${showCategories ? 'active' : ''}`}
            onClick={() => setShowCategories(!showCategories)}
            onMouseEnter={() => setShowCategories(true)}
          >
            <span>全部商品分类</span>
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '8px', fontSize: '12px', transition: 'transform 0.3s ease' }} 
              className={showCategories ? 'rotate-icon' : ''} />
            
            {/* 分类菜单弹出框 */}
            {showCategories && (
              <div 
                className="categories-dropdown"
                onMouseLeave={() => setShowCategories(false)}
              >
                <div className="categories-dropdown-header">
                  <div className="ds-card-title">全部分类</div>
                </div>
                <div className="categories-grid">
                  {categories.map(category => (
                    <div 
                      key={category.id} 
                      className="category-grid-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.id);
                      }}
                    >
                      <div className="category-grid-icon" style={{ backgroundColor: getCategoryColor(category.id) }}>
                        <FontAwesomeIcon icon={faBolt} />
                      </div>
                      <div className="category-grid-name">{category.name}</div>
                    </div>
                  ))}
                  <div 
                    className="category-grid-item category-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/categories');
                    }}
                  >
                    <div className="category-grid-icon" style={{ backgroundColor: '#f1f1f1' }}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                    <div className="category-grid-name">更多分类</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 主要导航链接 */}
          <nav className="main-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}>
                {link.text}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to="/analytics" className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '5px' }} />
                数据分析
              </Link>
            )}
            <Link to="/price-comparison" className={`nav-link ${location.pathname === '/price-comparison' ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faExchangeAlt} style={{ marginRight: '5px' }} />
              跨平台比价
            </Link>
            <Link to="/ai-assistant" className="nav-link featured">
              <i className="fas fa-robot" style={{ marginRight: '5px' }}></i>
              AI智能导购
            </Link>
          </nav>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
      >
        <div className="mobile-menu-header">
          <h2>菜单</h2>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {isAuthenticated ? (
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <div>欢迎回来</div>
              <div style={{ fontWeight: 'bold' }}>{user?.username || user?.email || '用户'}</div>
            </div>
          </div>
        ) : (
          <div className="mobile-menu-nav">
            <Link to="/login" className="mobile-nav-link">
              <FontAwesomeIcon icon={faUser} className="mobile-nav-icon" />
              登录/注册
            </Link>
          </div>
        )}

        <div className="mobile-menu-categories">
          <button 
            className="mobile-menu-category-button"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>全部商品分类</span>
            <FontAwesomeIcon icon={showCategories ? faChevronDown : faChevronRight} />
          </button>
          
          <div className={`mobile-submenu ${showCategories ? 'active' : ''}`}>
            <div className="mobile-category-grid">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="mobile-category-item"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="mobile-category-icon" style={{ backgroundColor: getCategoryColor(category.id) }}>
                    <FontAwesomeIcon icon={faBolt} />
                  </div>
                  <div className="mobile-category-name">{category.name}</div>
                </div>
              ))}
              <div 
                className="mobile-category-item"
                onClick={() => navigate('/categories')}
              >
                <div className="mobile-category-icon" style={{ backgroundColor: '#f1f1f1', color: '#666' }}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div className="mobile-category-name">更多分类</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-menu-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="mobile-nav-link">
              {link.text}
            </Link>
          ))}
          {isAuthenticated && (
            <Link to="/analytics" className="mobile-nav-link">
              <FontAwesomeIcon icon={faChartLine} className="mobile-nav-icon" />
              数据分析
            </Link>
          )}
          <Link to="/price-comparison" className="mobile-nav-link">
            <FontAwesomeIcon icon={faExchangeAlt} className="mobile-nav-icon" />
            跨平台比价
          </Link>
          <Link to="/ai-assistant" className="mobile-nav-link featured outer-cont-mobile">
            <svg viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg" className="mobile-nav-icon">
              <g fill="none">
                <path
                  d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
                ></path>
                <path
                  d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
            AI智能导购
          </Link>
        </div>

        {isAuthenticated && (
          <div className="mobile-menu-nav">
            <div style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
              我的账户
            </div>
            <Link to="/user/info" className="mobile-nav-link">
              <FontAwesomeIcon icon={faUser} className="mobile-nav-icon" />
              个人信息
            </Link>
            <Link to="/user/orders" className="mobile-nav-link">
              <FontAwesomeIcon icon={faListAlt} className="mobile-nav-icon" />
              我的订单
            </Link>
            <Link to="/user/favorites" className="mobile-nav-link">
              <FontAwesomeIcon icon={faHeart} className="mobile-nav-icon" />
              我的收藏
            </Link>
            <Link to="/user/coupons" className="mobile-nav-link">
              <FontAwesomeIcon icon={faTag} className="mobile-nav-icon" />
              优惠券
            </Link>
            <Link to="/user/wallet" className="mobile-nav-link">
              <FontAwesomeIcon icon={faWallet} className="mobile-nav-icon" />
              我的钱包
            </Link>
            <Link to="/user/settings" className="mobile-nav-link">
              <FontAwesomeIcon icon={faCog} className="mobile-nav-icon" />
              账户设置
            </Link>
            {/* 管理员专用链接 */}
            {user && user.role === 'admin' && (
              <Link to="/admin/ecosystem" className="mobile-nav-link admin-link">
                <FontAwesomeIcon icon={faServer} className="mobile-nav-icon" />
                系统仪表盘
              </Link>
            )}
            <div 
              onClick={handleLogout}
              className="mobile-nav-link"
              style={{ color: '#e1251b' }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mobile-nav-icon" />
              退出登录
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar; 