import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PriceComparisonPage from '../components/ai/PriceComparisonPage';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faChartLine } from '@fortawesome/free-solid-svg-icons';

// 引入样式
import '../styles/page.css';

/**
 * 价格比较页面
 * 整合导航栏、价格比较组件和页脚
 */
const PriceComparison = () => {
  return (
    <div className="price-comparison-page-container">
      <Navbar />
      
      <div className="page-breadcrumb">
        <div className="container">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> 首页
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/ai-assistant">AI导购</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faChartLine} /> 跨平台价格比较
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      
      <div className="container">
        <h1 className="page-title">
          <FontAwesomeIcon icon={faShoppingCart} /> 跨平台价格比较
          <div className="title-description">
            比较多个电商平台的价格，让您轻松找到最佳购买选择
          </div>
        </h1>
      </div>
      
      <div className="comparison-container">
        <PriceComparisonPage />
      </div>
      
      <div className="page-feature-info container">
        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <div className="feature-content">
              <h3>多平台比价</h3>
              <p>同时查询京东、天猫、拼多多、苏宁、亚马逊等多个电商平台的价格</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h3>历史价格走势</h3>
              <p>查看商品历史价格变化，判断当前是否是购买的好时机</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-content">
              <h3>价格分析</h3>
              <p>智能分析商品价格，推荐最划算的购买选择</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔔</div>
            <div className="feature-content">
              <h3>价格提醒</h3>
              <p>设置价格提醒，当商品降价时第一时间通知您</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PriceComparison; 