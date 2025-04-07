import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import '../styles/notFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Navbar />
      
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">页面未找到</h1>
          <p className="error-message">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          
          <div className="action-buttons">
            <Link to="/" className="action-button primary">
              <FontAwesomeIcon icon={faHome} />
              返回首页
            </Link>
            <Link to="/search" className="action-button secondary">
              <FontAwesomeIcon icon={faSearch} />
              搜索商品
            </Link>
          </div>
          
          <div className="suggestions">
            <h3>您可能想要找：</h3>
            <ul>
              <li><Link to="/products">热门商品</Link></li>
              <li><Link to="/promotions">最新促销</Link></li>
              <li><Link to="/community">社区讨论</Link></li>
              <li><Link to="/ai-assistant">AI智能导购</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 