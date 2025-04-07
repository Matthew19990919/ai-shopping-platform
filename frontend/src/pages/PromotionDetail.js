import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, 
  faTicket, 
  faGift, 
  faCalendarAlt,
  faArrowLeft,
  faShoppingCart,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { getPromotionById } from '../services/promotionService';
import { getProductById } from '../services/productService';
import '../styles/promotion-detail.css';

const PromotionDetail = () => {
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载促销活动详情
  useEffect(() => {
    const fetchPromotionDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const promotionData = await getPromotionById(id);
        
        if (!promotionData) {
          setError('未找到该促销活动');
          return;
        }
        
        setPromotion(promotionData);
        
        // 模拟获取相关产品
        // 实际项目中，可以从API获取与此促销相关的产品
        const mockRelatedProductIds = ['1', '2', '3', '4'];
        const productsPromises = mockRelatedProductIds.map(pid => getProductById(pid));
        const products = await Promise.all(productsPromises);
        setRelatedProducts(products.filter(Boolean));
      } catch (err) {
        console.error('Error fetching promotion details:', err);
        setError('获取促销活动详情失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetail();
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

  // 检查促销活动是否过期
  const isExpired = (promotion) => {
    if (!promotion) return false;
    
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    return now > endDate;
  };

  // 检查促销活动是否尚未开始
  const isNotStarted = (promotion) => {
    if (!promotion) return false;
    
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    return now < startDate;
  };

  // 计算剩余天数
  const getRemainingDays = (promotion) => {
    if (!promotion) return 0;
    
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // 渲染促销详情标签
  const renderPromotionTag = (promotion) => {
    if (!promotion) return null;
    
    switch (promotion.type) {
      case 'discount':
        return (
          <div className="promotion-tag discount">
            <FontAwesomeIcon icon={faTag} />
            {promotion.discount}% 折扣
          </div>
        );
      case 'voucher':
        return (
          <div className="promotion-tag voucher">
            <FontAwesomeIcon icon={faTicket} />
            满 {promotion.minPurchase}减 {promotion.discount}
          </div>
        );
      case 'bundle':
        return (
          <div className="promotion-tag bundle">
            <FontAwesomeIcon icon={faGift} />
            {promotion.bundleOffer === 'buy3get1free' ? '买3免1' : '套餐优惠'}
          </div>
        );
      case 'freeShipping':
        return (
          <div className="promotion-tag free-shipping">
            <FontAwesomeIcon icon={faGift} />
            满 {promotion.minPurchase} 免运费
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染促销状态
  const renderPromotionStatus = (promotion) => {
    if (isExpired(promotion)) {
      return <div className="promotion-status expired">已结束</div>;
    }
    
    if (isNotStarted(promotion)) {
      return <div className="promotion-status not-started">即将开始</div>;
    }
    
    const remainingDays = getRemainingDays(promotion);
    
    if (remainingDays <= 3) {
      return <div className="promotion-status ending-soon">即将结束，仅剩 {remainingDays} 天</div>;
    }
    
    return <div className="promotion-status active">进行中</div>;
  };

  // 渲染相关产品
  const renderRelatedProducts = () => {
    if (relatedProducts.length === 0) {
      return null;
    }
    
    return (
      <div className="related-products-section">
        <h3>相关商品</h3>
        <div className="related-products-grid">
          {relatedProducts.map(product => (
            <div className="related-product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-image">
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                <div className="product-price">¥{parseFloat(product.price).toFixed(2)}</div>
                <Link to={`/product/${product.id}`} className="view-product-btn">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  查看详情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="promotion-detail-page">
        <div className="promotion-detail-container">
          <div className="promotion-loading">
            <div className="spinner"></div>
            <p>加载促销活动详情...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promotion-detail-page">
        <div className="promotion-detail-container">
          <div className="promotion-error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <p>{error}</p>
            <Link to="/promotions" className="back-to-promotions">
              <FontAwesomeIcon icon={faArrowLeft} />
              返回促销活动列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="promotion-detail-page">
      <div className="promotion-detail-container">
        {/* 返回链接 */}
        <Link to="/promotions" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} />
          返回促销活动列表
        </Link>
        
        {/* 促销活动横幅 */}
        <div className="promotion-banner">
          <img src={promotion.bannerImage} alt={promotion.title} />
        </div>
        
        {/* 促销活动详情 */}
        <div className="promotion-info">
          <h1 className="promotion-title">{promotion.title}</h1>
          
          <div className="promotion-meta">
            {renderPromotionTag(promotion)}
            {renderPromotionStatus(promotion)}
            
            <div className="promotion-period">
              <FontAwesomeIcon icon={faCalendarAlt} />
              {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
            </div>
          </div>
          
          <div className="promotion-description">
            <p>{promotion.description}</p>
          </div>
          
          {/* 促销规则 */}
          <div className="promotion-rules">
            <h3>活动规则</h3>
            <ul>
              {promotion.type === 'discount' && (
                <li>全场商品享受 {promotion.discount}% 折扣</li>
              )}
              
              {promotion.type === 'voucher' && (
                <li>订单满 {promotion.minPurchase} 元，立减 {promotion.discount} 元</li>
              )}
              
              {promotion.type === 'bundle' && promotion.bundleOffer === 'buy3get1free' && (
                <li>买3件指定商品，其中最低价商品免费</li>
              )}
              
              {promotion.type === 'freeShipping' && (
                <li>订单满 {promotion.minPurchase} 元，免运费</li>
              )}
              
              <li>活动时间：{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</li>
              <li>活动商品以页面展示为准</li>
              <li>本活动不可与其他促销同时使用</li>
              <li>如有疑问，请联系客服</li>
            </ul>
          </div>
          
          {/* 相关产品 */}
          {renderRelatedProducts()}
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail; 