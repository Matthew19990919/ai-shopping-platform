import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faArrowLeft,
  faTags,
  faShoppingCart,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { getCampaignById } from '../services/promotionService';
import { getProductById } from '../services/productService';
import '../styles/campaign-detail.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载专题详情
  useEffect(() => {
    const fetchCampaignDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const campaignData = await getCampaignById(id);
        
        if (!campaignData) {
          setError('未找到该专题');
          return;
        }
        
        setCampaign(campaignData);
        
        // 获取相关产品
        if (campaignData.relatedProducts && campaignData.relatedProducts.length > 0) {
          const productsPromises = campaignData.relatedProducts.map(pid => getProductById(pid));
          const products = await Promise.all(productsPromises);
          setRelatedProducts(products.filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        setError('获取专题详情失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 渲染专题标签
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="campaign-tags">
        {tags.map((tag, index) => (
          <span key={index} className="campaign-tag">
            <FontAwesomeIcon icon={faTags} />
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // 渲染专题内容区块
  const renderSections = (sections) => {
    if (!sections || sections.length === 0) return null;
    
    return (
      <div className="campaign-sections">
        {sections.map((section, index) => (
          <div key={index} className="campaign-section">
            <div className="section-content">
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
            
            {section.image && (
              <div className="section-image">
                <img src={section.image} alt={section.title} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染相关产品
  const renderRelatedProducts = () => {
    if (relatedProducts.length === 0) {
      return null;
    }
    
    return (
      <div className="related-products">
        <h2>相关商品推荐</h2>
        <div className="related-products-grid">
          {relatedProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-image">
                <img src={product.image} alt={product.name} />
                {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                  <div className="discount-badge">
                    {Math.round((1 - parseFloat(product.price) / parseFloat(product.oldPrice)) * 100)}% OFF
                  </div>
                )}
              </Link>
              
              <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                
                <div className="product-price">
                  <span className="current-price">¥{parseFloat(product.price).toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="old-price">¥{parseFloat(product.oldPrice).toFixed(2)}</span>
                  )}
                </div>
                
                <div className="product-actions">
                  <Link to={`/product/${product.id}`} className="view-product-btn">
                    <FontAwesomeIcon icon={faShoppingCart} />
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

  if (loading) {
    return (
      <div className="campaign-detail-page">
        <div className="campaign-detail-container">
          <div className="campaign-loading">
            <div className="spinner"></div>
            <p>加载专题详情中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaign-detail-page">
        <div className="campaign-detail-container">
          <div className="campaign-error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <p>{error}</p>
            <Link to="/campaigns" className="back-to-campaigns">
              <FontAwesomeIcon icon={faArrowLeft} />
              返回专题列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-detail-page">
      <div className="campaign-detail-container">
        {/* 返回链接 */}
        <Link to="/campaigns" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} />
          返回专题列表
        </Link>
        
        {/* 专题封面 */}
        <div className="campaign-cover">
          <img src={campaign.coverImage || campaign.image} alt={campaign.title} />
          <div className="campaign-overlay">
            <h1>{campaign.title}</h1>
            <p className="campaign-subtitle">{campaign.subtitle}</p>
            
            <div className="campaign-meta">
              <span className="campaign-date">
                <FontAwesomeIcon icon={faCalendarAlt} />
                {formatDate(campaign.date)}
              </span>
              {renderTags(campaign.tags)}
            </div>
          </div>
        </div>
        
        {/* 专题内容 */}
        <div className="campaign-content">
          <div className="campaign-description">
            <p>{campaign.description}</p>
          </div>
          
          {/* 专题内容区块 */}
          {renderSections(campaign.sections)}
          
          {/* 相关商品 */}
          {renderRelatedProducts()}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail; 