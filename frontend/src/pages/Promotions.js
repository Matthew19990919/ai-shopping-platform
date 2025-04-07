import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, 
  faTicket, 
  faGift, 
  faFilter,
  faSortAmountDown,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { getAllPromotions } from '../services/promotionService';
import '../styles/promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // 过滤类型选项
  const typeOptions = [
    { value: '', label: '全部类型' },
    { value: 'discount', label: '折扣' },
    { value: 'voucher', label: '满减券' },
    { value: 'bundle', label: '套餐优惠' },
    { value: 'freeShipping', label: '免运费' }
  ];

  // 分类选项
  const categoryOptions = [
    { value: '', label: '全部分类' },
    { value: 'clothing', label: '服装' },
    { value: 'shoes', label: '鞋靴' },
    { value: 'electronics', label: '电子产品' },
    { value: 'home-appliances', label: '家用电器' },
    { value: 'beauty', label: '美妆' },
    { value: 'skincare', label: '护肤' },
    { value: 'sports', label: '运动' },
    { value: 'fitness', label: '健身' },
    { value: 'food', label: '食品' },
    { value: 'imported', label: '进口商品' }
  ];

  // 加载促销活动
  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError(null);

      try {
        // 获取当前有效的促销活动
        const options = {
          currentOnly: true,
          ...filters
        };
        
        const data = await getAllPromotions(options);
        setPromotions(data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('获取促销活动失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [filters]);

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 清除所有筛选
  const clearFilters = () => {
    setFilters({
      type: '',
      category: ''
    });
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 渲染促销活动卡片
  const renderPromotionCard = (promotion) => {
    return (
      <div className="promotion-card" key={promotion.id}>
        <div className="promotion-image">
          <img src={promotion.image} alt={promotion.title} />
          <div className="promotion-dates">
            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
          </div>
        </div>
        
        <div className="promotion-content">
          <h3 className="promotion-title">{promotion.title}</h3>
          <p className="promotion-description">{promotion.description}</p>
          
          <div className="promotion-details">
            {promotion.type === 'discount' && (
              <div className="promotion-tag discount">
                <FontAwesomeIcon icon={faTag} />
                {promotion.discount}% 折扣
              </div>
            )}
            
            {promotion.type === 'voucher' && (
              <div className="promotion-tag voucher">
                <FontAwesomeIcon icon={faTicket} />
                满 {promotion.minPurchase}减 {promotion.discount}
              </div>
            )}
            
            {promotion.type === 'bundle' && (
              <div className="promotion-tag bundle">
                <FontAwesomeIcon icon={faGift} />
                {promotion.bundleOffer === 'buy3get1free' ? '买3免1' : '套餐优惠'}
              </div>
            )}
            
            {promotion.type === 'freeShipping' && (
              <div className="promotion-tag free-shipping">
                <FontAwesomeIcon icon={faGift} />
                满 {promotion.minPurchase} 免运费
              </div>
            )}
          </div>
          
          <Link to={`/promotion/${promotion.id}`} className="view-promotion-btn">
            查看详情
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="promotions-page">
      <div className="promotions-banner">
        <h1>促销活动</h1>
        <p>发现最新优惠与特惠活动</p>
      </div>
      
      <div className="promotions-container">
        <div className="promotions-header">
          <h2>当前活动</h2>
          
          <div className="promotions-actions">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              筛选
            </button>
            
            {(filters.type || filters.category) && (
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                <FontAwesomeIcon icon={faTimes} />
                清除筛选
              </button>
            )}
          </div>
        </div>
        
        {/* 筛选器 */}
        {showFilters && (
          <div className="promotions-filters">
            <div className="filter-group">
              <label>活动类型</label>
              <select 
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>商品分类</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* 错误信息 */}
        {error && (
          <div className="promotions-error">
            {error}
          </div>
        )}
        
        {/* 加载中状态 */}
        {loading ? (
          <div className="promotions-loading">
            <div className="spinner"></div>
            <p>加载促销活动...</p>
          </div>
        ) : (
          <>
            {/* 促销列表 */}
            {promotions.length === 0 ? (
              <div className="no-promotions">
                <p>当前没有符合条件的促销活动</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  清除筛选条件
                </button>
              </div>
            ) : (
              <div className="promotions-list">
                {promotions.map(promotion => renderPromotionCard(promotion))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Promotions; 