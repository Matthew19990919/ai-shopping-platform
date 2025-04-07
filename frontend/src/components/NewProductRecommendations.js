import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as RecommendationService from '../services/recommendationService';
import '../styles/productRecommendations.css';

const NewProductRecommendations = ({ productId, limit = 10, activeTab: initialTab = 'popular', onTabChange, loading: externalLoading, onLoadComplete }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const navigate = useNavigate();
  const gridRef = useRef(null);
  
  // 推荐商品的分类选项
  const recommendationCategories = [
    { id: 'popular', name: '热门推荐', icon: '🔥' },
    { id: 'new', name: '新品上市', icon: '✨' },
    { id: 'similar', name: '相似商品', icon: '👍' },
    { id: 'trending', name: '流行趋势', icon: '📈' },
    { id: 'premium', name: '高端精选', icon: '🎖️' },
    { id: 'personalized', name: '为您推荐', icon: '🤖', isAi: true },
  ];
  
  // 添加切换Active状态的函数
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
    
    // 在切换分类时重置滚动位置
    const container = document.querySelector('.recommended-products-list');
    if (container) {
      container.scrollLeft = 0;
      container.scrollTop = 0; // 添加垂直滚动重置，适应新布局
    }
    
    // 重置图片加载状态，这样切换分类后图片会重新加载
    setImageLoadStatus({});
  };

  // 获取推荐商品
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      
      try {
        // 根据活动标签获取商品
        let results = [];
        
        switch (activeTab) {
          case 'similar':
            if (productId) {
              results = RecommendationService.getSimilarProducts(productId, limit);
            } else {
              results = RecommendationService.getPopularProducts(limit);
            }
            break;
          case 'popular':
            results = RecommendationService.getPopularProducts(limit);
            break;
          case 'new':
            results = RecommendationService.getNewProducts(limit);
            break;
          case 'trending':
            results = RecommendationService.getTrendingProducts(limit);
            break;
          case 'premium':
            results = RecommendationService.getPremiumProducts(limit);
            break;
          case 'personalized':
          default:
            results = RecommendationService.getPersonalizedRecommendations(limit);
            break;
        }
        
        // 为每个商品添加合理的评价数量
        results = results.map(product => {
          // 使用商品ID作为种子，确保同一商品的评价数不会随机变化
          const seed = product.id * 13;
          const random = ((seed % 100) / 100) + ((product.rating || 4) / 10);
          
          // 根据不同类别生成合理范围的评价数
          let reviewCount;
          switch(activeTab) {
            case 'popular':
              reviewCount = Math.floor(random * 1500) + 500; // 500-2000
              break;
            case 'new':
              reviewCount = Math.floor(random * 450) + 50; // 50-500
              break; 
            case 'premium':
              reviewCount = Math.floor(random * 900) + 100; // 100-1000
              break;
            case 'trending':
              reviewCount = Math.floor(random * 1200) + 300; // 300-1500
              break;
            default:
              reviewCount = Math.floor(random * 800) + 200; // 200-1000
          }
          
          return {
            ...product,
            reviewCount: reviewCount
          };
        });

        setProducts(results);
      } catch (error) {
        console.error('获取推荐失败:', error);
        setProducts([]);
      } finally {
        setLoading(false);
        if (onLoadComplete) onLoadComplete();
      }
    };
  
    fetchRecommendations();
  }, [activeTab, productId, limit, onLoadComplete]);
  
  // 图片加载成功处理
  const handleImageLoad = (e, product) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [product.id]: 'loaded'
    }));
  };
  
  // 图片加载错误处理
  const handleImageError = (e, product) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [product.id]: 'error'
    }));
    
    // 设置默认图片 - 根据产品类别选择对应的默认图片
    const category = activeTab || 'popular';
    
    // 先尝试使用类别特定的默认图片
    e.target.src = `/images/products/${category}_default.jpg`;
    
    // 如果类别特定的默认图片也加载失败，使用通用默认图片
    e.target.onerror = () => {
      // 使用通用默认图片
      e.target.src = '/images/products/default-product.jpg';
      
      e.target.classList.add('loaded');
      e.target.style.opacity = '1';
      // 减小内边距，适应更小的容器
      e.target.style.padding = '15px';
      e.target.onerror = null; // 防止无限循环
    };
  };
  
  // 格式化价格
  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  // 获取产品标签
  const getProductTag = (product, category) => {
    if (product.isNew) return { class: 'new', text: '新品' };
    if (category === 'popular') return { class: 'hot', text: '热门' };
    if (category === 'premium') return { class: 'premium', text: '精品' };
    if (category === 'trending') return { class: 'trending', text: '趋势' };
    return null;
  };

  return (
    <div className="product-recommendations">
      <div className="recommendation-header">
        <div className="recommendation-tabs">
          {recommendationCategories.map(category => (
            <button
              key={category.id}
              className={`recommendation-tab ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => handleTabClick(category.id)}
              data-ai={category.isAi ? 'true' : 'false'}
              aria-label={`查看${category.name}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="recommended-products-container">
        {loading || externalLoading ? (
          <div className="recommendation-loading">
            <div className="spinner"></div>
            <p>正在为您加载推荐...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="recommended-products-list" ref={gridRef}>
            {products.map((product) => (
              <div key={product.id} className="recommended-product-item product-card">
                <div className="product-image-container">
                  {imageLoadStatus[product.id] !== 'loaded' && (
                    <div className="product-image-skeleton"></div>
                  )}
                  <img
                    src={product.image}
                    alt={product.title}
                    className={`product-image ${
                      imageLoadStatus[product.id] === 'loaded' ? 'loaded' : ''
                    }`}
                    onLoad={(e) => handleImageLoad(e, product)}
                    onError={(e) => handleImageError(e, product)}
                    loading="lazy"
                  />
                  {product.originalPrice > product.price && (
                    <span className="discount-badge-corner">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                  )}
                  {getProductTag(product, activeTab) && (
                    <span className={`product-tag ${getProductTag(product, activeTab).class}`}>
                      {getProductTag(product, activeTab).text}
                    </span>
                  )}
                </div>
                <Link to={`/product/${product.id}`} className="recommended-product-info">
                  <h3 className="recommended-product-title">{product.title}</h3>
                  <div className="recommended-product-price-rating">
                    <p className="recommended-product-price">¥{formatPrice(product.price)}</p>
                    <div className="recommended-product-rating">
                      <span className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < Math.round(product.rating) ? 'filled' : ''}`}>
                            ★
                          </span>
                        ))}
                      </span>
                      <span className="rating-count">({product.reviewCount ? product.reviewCount.toLocaleString() : 0})</span>
                    </div>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="recommended-product-discount">
                      <span className="original-price">¥{formatPrice(product.originalPrice)}</span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <p>暂无推荐商品</p>
            <button 
              className="view-all-products-btn"
              onClick={() => navigate('/products')}
            >
              浏览所有商品
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProductRecommendations; 