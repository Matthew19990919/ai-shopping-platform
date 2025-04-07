import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faArrowRight, 
  faTags,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { getAllCampaigns } from '../services/promotionService';
import '../styles/campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // 可选类别过滤
  const categories = [
    { id: '', name: '全部' },
    { id: 'fashion', name: '时尚' },
    { id: 'technology', name: '科技' },
    { id: 'home', name: '家居' },
    { id: 'food', name: '美食' },
    { id: 'health', name: '健康' },
    { id: 'lifestyle', name: '生活方式' }
  ];
  
  // 加载所有专题
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const options = {};
        
        if (selectedCategory) {
          options.category = selectedCategory;
        }
        
        const data = await getAllCampaigns(options);
        setCampaigns(data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('获取专题活动失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [selectedCategory]);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // 处理分类选择
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // 渲染专题卡片
  const renderCampaignCard = (campaign) => {
    return (
      <div className="campaign-card" key={campaign.id}>
        <div className="campaign-image">
          <img src={campaign.image} alt={campaign.title} />
          <div className="campaign-date">
            <FontAwesomeIcon icon={faCalendarAlt} />
            {formatDate(campaign.date)}
          </div>
        </div>
        
        <div className="campaign-content">
          <div className="campaign-tags">
            {campaign.tags.map((tag, index) => (
              <span key={index} className="campaign-tag">
                <FontAwesomeIcon icon={faTags} />
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="campaign-title">{campaign.title}</h3>
          <p className="campaign-subtitle">{campaign.subtitle}</p>
          <p className="campaign-description">{campaign.description}</p>
          
          <Link to={`/campaign/${campaign.id}`} className="view-campaign-btn">
            查看详情
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    );
  };
  
  // 渲染特色专题
  const renderFeaturedCampaigns = () => {
    const featured = campaigns.filter(c => c.featured);
    
    if (featured.length === 0) {
      return null;
    }
    
    return (
      <div className="featured-campaigns">
        <h2>精选专题</h2>
        
        <div className="featured-campaigns-grid">
          {featured.map(campaign => (
            <div className="featured-campaign-card" key={campaign.id}>
              <div className="campaign-image">
                <img src={campaign.coverImage || campaign.image} alt={campaign.title} />
              </div>
              
              <div className="campaign-overlay">
                <div className="campaign-content">
                  <h3>{campaign.title}</h3>
                  <p>{campaign.subtitle}</p>
                  <Link to={`/campaign/${campaign.id}`} className="view-btn">
                    查看详情
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="campaigns-page">
      <div className="campaigns-banner">
        <h1>专题活动</h1>
        <p>探索我们精心准备的主题活动和导购指南</p>
      </div>
      
      <div className="campaigns-container">
        {/* 特色专题 */}
        {!selectedCategory && !loading && !error && renderFeaturedCampaigns()}
        
        {/* 分类筛选 */}
        <div className="categories-filter">
          <h2>浏览专题</h2>
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* 错误信息 */}
        {error && (
          <div className="campaigns-error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <p>{error}</p>
          </div>
        )}
        
        {/* 加载中状态 */}
        {loading ? (
          <div className="campaigns-loading">
            <div className="spinner"></div>
            <p>加载专题活动...</p>
          </div>
        ) : (
          <>
            {/* 专题列表 */}
            {campaigns.length === 0 ? (
              <div className="no-campaigns">
                <p>暂无专题活动</p>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="reset-filter-btn"
                  >
                    查看全部专题
                  </button>
                )}
              </div>
            ) : (
              <div className="campaigns-list">
                {campaigns.map(campaign => renderCampaignCard(campaign))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns; 