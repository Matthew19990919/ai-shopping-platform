import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faShoppingCart, 
  faPercent, 
  faArrowUp, 
  faArrowDown, 
  faCalendarAlt, 
  faDownload, 
  faSync, 
  faChartBar, 
  faChartPie,
  faBox,
  faTags,
  faRobot
} from '@fortawesome/free-solid-svg-icons';

import Navbar from '../components/Navbar';
import '../styles/dataAnalytics.css';

// 导入数据分析服务
import * as DataAnalysisService from '../services/dataAnalysisService';

const DataAnalytics = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('overview');
  const [salesPeriod, setSalesPeriod] = useState('day');
  const [loading, setLoading] = useState(true);
  
  // 数据状态
  const [salesOverview, setSalesOverview] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [userDistribution, setUserDistribution] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [couponUsage, setCouponUsage] = useState([]);
  const [recommendationAnalytics, setRecommendationAnalytics] = useState(null);
  const [aiAssistantAnalytics, setAiAssistantAnalytics] = useState(null);
  
  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // 获取销售概览数据
        const overviewData = DataAnalysisService.getSalesOverview();
        setSalesOverview(overviewData);
        
        // 获取销售趋势数据
        const trendData = DataAnalysisService.getSalesTrend(salesPeriod);
        setSalesTrend(trendData);
        
        // 获取分类销售数据
        const categoryData = DataAnalysisService.getCategorySales();
        setCategorySales(categoryData);
        
        // 获取用户增长数据
        const growthData = DataAnalysisService.getUserGrowth();
        setUserGrowth(growthData);
        
        // 获取用户分布数据
        const distributionData = DataAnalysisService.getUserDistribution();
        setUserDistribution(distributionData);
        
        // 获取畅销商品排行
        const topSellingData = DataAnalysisService.getTopSellingProducts();
        setTopSellingProducts(topSellingData);
        
        // 获取高评分商品排行
        const topRatedData = DataAnalysisService.getTopRatedProducts();
        setTopRatedProducts(topRatedData);
        
        // 获取库存状态
        const inventoryData = DataAnalysisService.getInventoryStatus();
        setInventoryStatus(inventoryData);
        
        // 获取营销活动效果
        const campaignData = DataAnalysisService.getCampaignPerformance();
        setCampaignPerformance(campaignData);
        
        // 获取优惠券使用情况
        const couponData = DataAnalysisService.getCouponUsage();
        setCouponUsage(couponData);
        
        // 获取推荐系统分析数据
        const recommendationData = DataAnalysisService.getRecommendationAnalytics();
        setRecommendationAnalytics(recommendationData);
        
        // 获取AI助手分析数据
        const aiAssistantData = DataAnalysisService.getAIAssistantAnalytics();
        setAiAssistantAnalytics(aiAssistantData);
      } catch (error) {
        console.error('加载数据分析数据出错:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [salesPeriod]);
  
  // 处理销售周期变化
  const handlePeriodChange = (period) => {
    setSalesPeriod(period);
  };
  
  // 处理标签切换
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 格式化货币
  const formatCurrency = (value) => {
    return `¥${value.toLocaleString('zh-CN')}`;
  };
  
  // 格式化数字
  const formatNumber = (value) => {
    return value.toLocaleString('zh-CN');
  };
  
  if (loading && !salesOverview) {
    return (
      <div className="analytics-page">
        <Navbar />
        <div className="analytics-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="analytics-page">
      <Navbar />
      
      <div className="analytics-container">
        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title">数据分析中心</h1>
          <p className="page-subtitle">查看店铺运营数据，分析业务表现，优化经营策略</p>
        </div>
        
        {/* 分析模块选项卡 */}
        <div className="analytics-tabs">
          <div 
            className={`analytics-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            总览
          </div>
          <div 
            className={`analytics-tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => handleTabChange('sales')}
          >
            销售分析
          </div>
          <div 
            className={`analytics-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            用户分析
          </div>
          <div 
            className={`analytics-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => handleTabChange('products')}
          >
            商品分析
          </div>
          <div 
            className={`analytics-tab ${activeTab === 'marketing' ? 'active' : ''}`}
            onClick={() => handleTabChange('marketing')}
          >
            营销分析
          </div>
          <div 
            className={`analytics-tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => handleTabChange('ai')}
          >
            AI功能分析
          </div>
        </div>
        
        {/* 总览模块 */}
        {activeTab === 'overview' && (
          <div className="overview-tab-content">
            {/* 关键指标概览 */}
            <div className="overview-grid">
              <div className="card overview-card">
                <div className="overview-title">总销售额</div>
                <div className="overview-value">{formatCurrency(salesOverview.totalSales)}</div>
                <div className={`overview-trend ${salesOverview.salesGrowth >= 0 ? 'trend-up' : 'trend-down'}`}>
                  <FontAwesomeIcon 
                    icon={salesOverview.salesGrowth >= 0 ? faArrowUp : faArrowDown}
                    className="trend-icon"
                  />
                  <span>{Math.abs(salesOverview.salesGrowth)}% 较上周期</span>
                </div>
              </div>
              
              <div className="card overview-card">
                <div className="overview-title">订单数</div>
                <div className="overview-value">{formatNumber(salesOverview.totalOrders)}</div>
                <div className={`overview-trend ${salesOverview.ordersGrowth >= 0 ? 'trend-up' : 'trend-down'}`}>
                  <FontAwesomeIcon 
                    icon={salesOverview.ordersGrowth >= 0 ? faArrowUp : faArrowDown}
                    className="trend-icon"
                  />
                  <span>{Math.abs(salesOverview.ordersGrowth)}% 较上周期</span>
                </div>
              </div>
              
              <div className="card overview-card">
                <div className="overview-title">访客数</div>
                <div className="overview-value">{formatNumber(salesOverview.totalVisitors)}</div>
                <div className="overview-trend">
                  <span>近30天累计</span>
                </div>
              </div>
              
              <div className="card overview-card">
                <div className="overview-title">转化率</div>
                <div className="overview-value">{salesOverview.conversionRate}%</div>
                <div className="overview-trend">
                  <span>平均值</span>
                </div>
              </div>
            </div>
            
            {/* 销售趋势图表 */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">销售趋势</h2>
                <div className="card-actions">
                  <div className="chart-filters">
                    <button 
                      className={`filter-btn ${salesPeriod === 'day' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('day')}
                    >
                      日
                    </button>
                    <button 
                      className={`filter-btn ${salesPeriod === 'week' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('week')}
                    >
                      周
                    </button>
                    <button 
                      className={`filter-btn ${salesPeriod === 'month' ? 'active' : ''}`}
                      onClick={() => handlePeriodChange('month')}
                    >
                      月
                    </button>
                  </div>
                  <span className="card-action">
                    <FontAwesomeIcon icon={faDownload} /> 下载
                  </span>
                  <span className="card-action">
                    <FontAwesomeIcon icon={faSync} /> 刷新
                  </span>
                </div>
              </div>
              
              <div className="chart-container">
                {/* 这里应该渲染销售趋势图表，实际项目中应使用图表库如Echarts或Recharts */}
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  销售趋势图表（在实际项目中使用图表库渲染）
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 销售分析模块 */}
        {activeTab === 'sales' && (
          <div className="sales-tab-content">
            <div className="dashboard-section">
              <h2 className="section-title">销售概览</h2>
              
              {/* 销售指标概览 */}
              <div className="overview-grid">
                <div className="card overview-card">
                  <div className="overview-title">总销售额</div>
                  <div className="overview-value">{formatCurrency(salesOverview.totalSales)}</div>
                  <div className={`overview-trend ${salesOverview.salesGrowth >= 0 ? 'trend-up' : 'trend-down'}`}>
                    <FontAwesomeIcon 
                      icon={salesOverview.salesGrowth >= 0 ? faArrowUp : faArrowDown}
                      className="trend-icon"
                    />
                    <span>{Math.abs(salesOverview.salesGrowth)}% 较上周期</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">订单数</div>
                  <div className="overview-value">{formatNumber(salesOverview.totalOrders)}</div>
                  <div className={`overview-trend ${salesOverview.ordersGrowth >= 0 ? 'trend-up' : 'trend-down'}`}>
                    <FontAwesomeIcon 
                      icon={salesOverview.ordersGrowth >= 0 ? faArrowUp : faArrowDown}
                      className="trend-icon"
                    />
                    <span>{Math.abs(salesOverview.ordersGrowth)}% 较上周期</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">平均客单价</div>
                  <div className="overview-value">{formatCurrency(salesOverview.avgOrderValue)}</div>
                  <div className="overview-trend">
                    <span>近30天</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">转化率</div>
                  <div className="overview-value">{salesOverview.conversionRate}%</div>
                  <div className="overview-trend">
                    <span>访客-订单转化率</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">销售趋势</h2>
              
              {/* 销售趋势图表 */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">销售和订单趋势</h2>
                  <div className="card-actions">
                    <div className="chart-filters">
                      <button 
                        className={`filter-btn ${salesPeriod === 'day' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('day')}
                      >
                        日
                      </button>
                      <button 
                        className={`filter-btn ${salesPeriod === 'week' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('week')}
                      >
                        周
                      </button>
                      <button 
                        className={`filter-btn ${salesPeriod === 'month' ? 'active' : ''}`}
                        onClick={() => handlePeriodChange('month')}
                      >
                        月
                      </button>
                    </div>
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <div className="chart-container">
                  {/* 这里应该渲染销售趋势图表 */}
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    销售趋势图表（在实际项目中使用图表库渲染）
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">销售明细</h2>
              
              <div className="stats-grid-1-2">
                {/* 分类销售统计 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">分类销售占比</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  <div className="chart-container">
                    {/* 这里应该渲染分类销售饼图 */}
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      分类销售饼图（在实际项目中使用图表库渲染）
                    </div>
                  </div>
                </div>
                
                {/* 分类销售明细 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">分类销售明细</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>商品分类</th>
                        <th className="numeric">销售额</th>
                        <th className="numeric">订单数</th>
                        <th className="numeric">客单价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorySales.map((category) => (
                        <tr key={category.category}>
                          <td>{category.category}</td>
                          <td className="numeric">{formatCurrency(category.sales)}</td>
                          <td className="numeric">{formatNumber(category.orders)}</td>
                          <td className="numeric">{formatCurrency(category.avgOrderValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">支付方式分析</h2>
              
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">支付方式销售占比</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>支付方式</th>
                      <th className="numeric">销售额</th>
                      <th className="numeric">订单数</th>
                      <th className="numeric">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesOverview && mockPaymentData.map((payment) => (
                      <tr key={payment.method}>
                        <td>{payment.method}</td>
                        <td className="numeric">{formatCurrency(payment.sales)}</td>
                        <td className="numeric">{formatNumber(payment.orders)}</td>
                        <td className="numeric">{payment.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* 用户分析模块 */}
        {activeTab === 'users' && (
          <div className="users-tab-content">
            <div className="dashboard-section">
              <h2 className="section-title">用户概览</h2>
              
              {/* 用户指标概览 */}
              <div className="overview-grid">
                <div className="card overview-card">
                  <div className="overview-title">总用户数</div>
                  <div className="overview-value">
                    {userGrowth.length > 0 ? 
                      formatNumber(userGrowth[userGrowth.length - 1].totalUsers) : '0'}
                  </div>
                  <div className="overview-trend">
                    <span>累计注册用户</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">新增用户</div>
                  <div className="overview-value">
                    {formatNumber(userGrowth.reduce((sum, day) => sum + day.newUsers, 0))}
                  </div>
                  <div className="overview-trend">
                    <span>近30天新增</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">活跃用户</div>
                  <div className="overview-value">
                    {userGrowth.length > 0 ? 
                      formatNumber(userGrowth[userGrowth.length - 1].activeUsers) : '0'}
                  </div>
                  <div className="overview-trend">
                    <span>昨日活跃</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">人均订单</div>
                  <div className="overview-value">
                    {salesOverview ? 
                      (salesOverview.totalOrders / (userGrowth.length > 0 ? 
                        userGrowth[userGrowth.length - 1].activeUsers : 1)).toFixed(2) : '0'}
                  </div>
                  <div className="overview-trend">
                    <span>近30天平均</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">用户增长</h2>
              
              {/* 用户增长趋势图表 */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">用户增长趋势</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <div className="chart-container">
                  {/* 这里应该渲染用户增长趋势图表 */}
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    用户增长趋势图表（在实际项目中使用图表库渲染）
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">用户分布</h2>
              
              <div className="stats-grid">
                {/* 用户来源分布 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">用户来源分布</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  {userDistribution && (
                    <div className="distribution-chart">
                      {userDistribution.sources.map(item => (
                        <div key={item.source} className="distribution-item">
                          <div className="distribution-label">{item.source}</div>
                          <div className="distribution-bar">
                            <div 
                              className="distribution-fill" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="distribution-value">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 用户地区分布 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">用户地区分布</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  {userDistribution && (
                    <div className="distribution-chart">
                      {userDistribution.regions.map(item => (
                        <div key={item.region} className="distribution-item">
                          <div className="distribution-label">{item.region}</div>
                          <div className="distribution-bar">
                            <div 
                              className="distribution-fill" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="distribution-value">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 商品分析模块 */}
        {activeTab === 'products' && (
          <div className="products-tab-content">
            <div className="dashboard-section">
              <h2 className="section-title">商品概览</h2>
              
              {/* 商品指标概览 */}
              <div className="stats-grid">
                {/* 畅销商品排行 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">畅销商品排行</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="rank">排名</th>
                        <th>商品名称</th>
                        <th className="numeric">销量</th>
                        <th className="numeric">销售额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td className={`rank ${index < 3 ? 'top-rank' : ''}`}>{index + 1}</td>
                          <td>{product.title}</td>
                          <td className="numeric">{formatNumber(product.sales)}</td>
                          <td className="numeric">{formatCurrency(product.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 高评分商品排行 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">高评分商品排行</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="rank">排名</th>
                        <th>商品名称</th>
                        <th className="numeric">评分</th>
                        <th className="numeric">评价数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRatedProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td className={`rank ${index < 3 ? 'top-rank' : ''}`}>{index + 1}</td>
                          <td>{product.title}</td>
                          <td className="numeric">{product.rating.toFixed(1)}</td>
                          <td className="numeric">{formatNumber(product.reviewCount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">库存分析</h2>
              
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">库存状态</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <div className="stats-grid-1-2">
                  <div className="chart-container">
                    {/* 这里应该渲染库存状态饼图 */}
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      库存状态饼图（在实际项目中使用图表库渲染）
                    </div>
                  </div>
                  
                  <div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>库存状态</th>
                          <th className="numeric">商品数量</th>
                          <th className="numeric">百分比</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryStatus.map((status) => (
                          <tr key={status.status}>
                            <td>
                              <span className={`tag ${
                                status.status === '充足' ? 'tag-green' : 
                                status.status === '适中' ? 'tag-blue' : 
                                status.status === '不足' ? 'tag-yellow' : 'tag-red'
                              }`}>
                                {status.status}
                              </span>
                            </td>
                            <td className="numeric">{status.count}</td>
                            <td className="numeric">{status.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 营销分析模块 */}
        {activeTab === 'marketing' && (
          <div className="marketing-tab-content">
            <div className="dashboard-section">
              <h2 className="section-title">营销活动分析</h2>
              
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">营销活动效果</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>活动名称</th>
                      <th className="numeric">销售额</th>
                      <th className="numeric">订单数</th>
                      <th className="numeric">转化率</th>
                      <th className="numeric">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignPerformance.map((campaign) => (
                      <tr key={campaign.name}>
                        <td>{campaign.name}</td>
                        <td className="numeric">{formatCurrency(campaign.sales)}</td>
                        <td className="numeric">{formatNumber(campaign.orders)}</td>
                        <td className="numeric">{(campaign.conversion * 100).toFixed(2)}%</td>
                        <td className="numeric">{campaign.roi.toFixed(1)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">优惠券分析</h2>
              
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">优惠券使用情况</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                <div className="stats-grid-1-2">
                  <div className="chart-container">
                    {/* 这里应该渲染优惠券使用情况图表 */}
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      优惠券使用情况图表（在实际项目中使用图表库渲染）
                    </div>
                  </div>
                  
                  <div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>优惠券类型</th>
                          <th className="numeric">发放数量</th>
                          <th className="numeric">使用数量</th>
                          <th className="numeric">使用率</th>
                          <th className="numeric">优惠金额</th>
                        </tr>
                      </thead>
                      <tbody>
                        {couponUsage.map((coupon) => (
                          <tr key={coupon.type}>
                            <td>{coupon.type}</td>
                            <td className="numeric">{formatNumber(coupon.issued)}</td>
                            <td className="numeric">{formatNumber(coupon.used)}</td>
                            <td className="numeric">{(coupon.conversion * 100).toFixed(2)}%</td>
                            <td className="numeric">{formatCurrency(coupon.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI功能分析模块 */}
        {activeTab === 'ai' && (
          <div className="ai-tab-content">
            <div className="dashboard-section">
              <h2 className="section-title">推荐系统分析</h2>
              
              {/* 推荐系统指标概览 */}
              <div className="overview-grid">
                <div className="card overview-card">
                  <div className="overview-title">推荐点击率</div>
                  <div className="overview-value">
                    {recommendationAnalytics ? recommendationAnalytics.ctr : 0}%
                  </div>
                  <div className="overview-trend">
                    <span>近30天平均</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">推荐转化率</div>
                  <div className="overview-value">
                    {recommendationAnalytics ? recommendationAnalytics.conversionRate : 0}%
                  </div>
                  <div className="overview-trend">
                    <span>近30天平均</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">商品浏览次数</div>
                  <div className="overview-value">
                    {recommendationAnalytics ? formatNumber(recommendationAnalytics.viewCount) : 0}
                  </div>
                  <div className="overview-trend">
                    <span>累计浏览量</span>
                  </div>
                </div>
                
                <div className="card overview-card">
                  <div className="overview-title">推荐来源购买</div>
                  <div className="overview-value">28.5%</div>
                  <div className="overview-trend">
                    <span>来自推荐的购买比例</span>
                  </div>
                </div>
              </div>
              
              {/* 推荐算法对比 */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">推荐算法效果对比</h2>
                  <div className="card-actions">
                    <span className="card-action">
                      <FontAwesomeIcon icon={faDownload} /> 下载
                    </span>
                  </div>
                </div>
                
                {recommendationAnalytics && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>算法类型</th>
                        <th className="numeric">点击率 (CTR)</th>
                        <th className="numeric">转化率</th>
                        <th className="numeric">贡献收入</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendationAnalytics.algorithmComparison.map((algorithm) => (
                        <tr key={algorithm.algorithm}>
                          <td>{algorithm.algorithm}</td>
                          <td className="numeric">{algorithm.ctr}%</td>
                          <td className="numeric">{algorithm.conversionRate}%</td>
                          <td className="numeric">{formatCurrency(algorithm.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2 className="section-title">AI助手分析</h2>
              
              {/* AI助手指标概览 */}
              <div className="stats-grid">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">AI助手使用情况</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  {aiAssistantAnalytics && (
                    <div>
                      <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <div className="overview-card">
                          <div className="overview-title">总交互次数</div>
                          <div className="overview-value">{formatNumber(aiAssistantAnalytics.totalInteractions)}</div>
                        </div>
                        
                        <div className="overview-card">
                          <div className="overview-title">使用用户数</div>
                          <div className="overview-value">{formatNumber(aiAssistantAnalytics.uniqueUsers)}</div>
                        </div>
                        
                        <div className="overview-card">
                          <div className="overview-title">人均交互次数</div>
                          <div className="overview-value">{aiAssistantAnalytics.averageInteractionsPerUser}</div>
                        </div>
                        
                        <div className="overview-card">
                          <div className="overview-title">助手转化率</div>
                          <div className="overview-value">{aiAssistantAnalytics.conversionFromAssistant}%</div>
                        </div>
                      </div>
                      
                      <div className="chart-container">
                        {/* 这里应该渲染AI助手使用情况图表 */}
                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                          AI助手使用趋势图表（在实际项目中使用图表库渲染）
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 热门问题 */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">热门问题</h2>
                    <div className="card-actions">
                      <span className="card-action">
                        <FontAwesomeIcon icon={faDownload} /> 下载
                      </span>
                    </div>
                  </div>
                  
                  {aiAssistantAnalytics && (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="rank">排名</th>
                          <th>问题</th>
                          <th className="numeric">次数</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiAssistantAnalytics.topQuestions.map((question, index) => (
                          <tr key={index}>
                            <td className={`rank ${index < 3 ? 'top-rank' : ''}`}>{index + 1}</td>
                            <td>{question.question}</td>
                            <td className="numeric">{question.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 模拟支付方式数据
const mockPaymentData = [
  { method: '支付宝', sales: 28500, orders: 1450, percentage: 43.2 },
  { method: '微信支付', sales: 24700, orders: 1280, percentage: 37.5 },
  { method: '银行卡', sales: 9800, orders: 480, percentage: 14.8 },
  { method: '其他', sales: 3000, orders: 150, percentage: 4.5 }
];

export default DataAnalytics; 