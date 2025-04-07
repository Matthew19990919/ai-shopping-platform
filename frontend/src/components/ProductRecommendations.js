import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEye, faStar, faShoppingCart, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
// 导入全部服务方法
import * as RecommendationService from '../services/recommendationService';
import { getProductImageUrl, handleImageError } from '../services/imageService';
import '../styles/productRecommendations.css';

/**
 * 产品推荐组件
 * @param {Object} props
 * @param {string} props.type 推荐类型 - 'personalized' | 'similar' | 'popular' | 'new' | 'trending' | 'premium'
 * @param {number} props.productId 当前产品ID（用于相似商品推荐）
 * @param {string} props.title 推荐区块标题
 * @param {number} props.limit 显示商品数量
 * @param {boolean} props.showViewMore 是否显示"查看更多"链接
 * @param {React.Ref} ref 转发的ref
 */
const ProductRecommendations = forwardRef(({ 
  type = 'personalized', 
  productId = null,
  title = '为您推荐', 
  limit = 5,  // 固定为5个商品
  showViewMore = true
}, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const [activeTab, setActiveTab] = useState(type);
  const [retryCount, setRetryCount] = useState(0);
  const [fetchError, setFetchError] = useState(null);
  
  // 内部ref，如果没有提供外部ref
  const internalGridRef = useRef(null);
  // 合并ref
  const gridRef = ref || internalGridRef;
  const navigate = useNavigate();
  
  // 标签定义
  const tabs = [
    { id: 'personalized', label: '猜你喜欢' },
    { id: 'similar', label: '相似推荐' },
    { id: 'popular', label: '热门商品' },
    { id: 'new', label: '新品上架' },
    { id: 'trending', label: '趋势好物' },
    { id: 'premium', label: '品质之选' }
  ];

  // 推荐商品容器的引用
  const tabsRef = useRef(null);

  // 推荐商品的分类选项
  const recommendationCategories = [
    { id: 'similar', name: '相似商品' },
    { id: 'popular', name: '热门推荐' },
    { id: 'new', name: '新品上市' },
    { id: 'trending', name: '流行趋势' },
    { id: 'premium', name: '高端精选' },
    { id: 'personalized', name: '为您推荐' },
  ];

  useEffect(() => {
    // 当外部type变化时，更新内部activeTab
    setActiveTab(type);
  }, [type]);

  useEffect(() => {
    const fetchRecommendations = () => {
      setLoading(true);
      setFetchError(null);
      
      try {
        console.log(`尝试获取${activeTab}类型的推荐商品，数量限制: ${limit}`);
        let productResults = [];
        
        // 检查是否存在AI导购会话和推荐
        const aiSession = localStorage.getItem('aiShoppingSession');
        
        if (activeTab === 'personalized' && aiSession) {
          try {
            const aiSessionData = JSON.parse(aiSession);
            
            if (aiSessionData.recommendations && aiSessionData.recommendations.length > 0) {
              console.log("从AI导购会话获取推荐", aiSessionData.recommendations);
              
              // 从AI导购获取推荐ID列表
              const recommendationIds = aiSessionData.recommendations.map(rec => rec.productId);
              
              // 对于非异步环境，我们可以使用模拟数据
              const aiProducts = recommendationIds.map(id => {
                // 尝试从本地服务获取数据
                try {
                  return RecommendationService.getAllProducts().find(product => product.id === id) || null;
                } catch (error) {
                  console.error("获取AI推荐产品详情失败", error);
                  return null;
                }
              });
              
              // 过滤掉获取失败的产品
              productResults = aiProducts.filter(p => p !== null);
              
              // 为每个产品添加AI推荐理由
              productResults = productResults.map(product => {
                const aiRec = aiSessionData.recommendations.find(rec => rec.productId === product.id);
                return {
                  ...product,
                  aiRecommendReason: aiRec ? aiRec.reason : null
                };
              });
            }
          } catch (error) {
            console.error("解析AI导购会话失败", error);
          }
        }
        
        // 如果没有AI推荐或者不是个性化标签，使用正常的推荐API
        if (productResults.length === 0) {
          switch (activeTab) {
            case 'similar':
              if (productId) {
                productResults = RecommendationService.getSimilarProducts(productId, limit);
              } else {
                productResults = RecommendationService.getPopularProducts(limit);
              }
              break;
            case 'popular':
              productResults = RecommendationService.getPopularProducts(limit);
              break;
            case 'new':
              // 直接调用新方法，无需检查
              productResults = RecommendationService.getNewProducts(limit);
              break;
            case 'trending':
              // 直接调用新方法，无需检查
              productResults = RecommendationService.getTrendingProducts(limit);
              break;
            case 'premium':
              // 直接调用新方法，无需检查
              productResults = RecommendationService.getPremiumProducts(limit);
              break;
            case 'personalized':
            default:
              productResults = RecommendationService.getPersonalizedRecommendations(limit);
              break;
          }
        }
        
        // 确保图片路径正确
        productResults = productResults.map(product => {
          // 如果图片路径不包含完整URL或/images路径，添加正确前缀
          if (product.image && !product.image.startsWith('http') && !product.image.startsWith('/images')) {
            return {
              ...product,
              image: `/images/products/recommendations/${product.image}`
            };
          }
          return product;
        });
        
        // 如果获取的商品少于5个，填充到5个
        if (productResults.length < Math.min(5, limit)) {
          const additionalCount = Math.min(5, limit) - productResults.length;
          if (additionalCount > 0) {
            const additionalProducts = RecommendationService.getPopularProducts(additionalCount);
            productResults = [...productResults, ...additionalProducts];
          }
        }
        
        // 添加日志以检查推荐产品数据
        console.log(`[${activeTab}推荐] 获取到的推荐产品:`, productResults);
        
        // 初始化每个产品的图片加载状态
        const initialLoadStatus = {};
        productResults.forEach(product => {
          initialLoadStatus[product.id] = 'loading';
        });
        setImageLoadStatus(initialLoadStatus);

        setProducts(productResults);

        // 组件挂载后，延迟加载图片，让页面有时间渲染
        setTimeout(() => {
          if (gridRef.current) {
            const images = gridRef.current.querySelectorAll('.product-image');
            images.forEach(img => {
              const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    // 确保图片显示
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                  }
                });
              });
              observer.observe(img);
            });
          }
        }, 100);
      } catch (error) {
        console.error('获取推荐商品时出错:', error);
        setFetchError(error.message || '获取推荐失败，请稍后再试');
        
        // 自动重试，最多重试3次
        if (retryCount < 3) {
          console.log(`推荐获取失败，${2000}ms后尝试第${retryCount + 1}次重试...`);
          setTimeout(() => {
            setRetryCount(count => count + 1);
          }, 2000);
          return;
        }
        
        setProducts([]); // 如果全部重试失败，显示空列表
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activeTab, productId, limit, retryCount]);

  // 处理收藏商品
  const handleToggleFavorite = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    RecommendationService.toggleFavorite(productId);
    // 这里可以添加收藏成功的提示
    console.log(`商品${productId}收藏状态已更改`);
  };
  
  // 处理添加到购物车
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // 这里应该调用购物车服务添加商品
    console.log(`商品${product.id}已添加到购物车`);
    // 显示成功提示
    alert(`商品"${product.title}"已成功添加到购物车`);
  };
  
  // 处理快速预览
  const handleQuickView = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // 这里应该显示产品快速预览弹窗
    console.log(`预览商品${product.id}`);
    // 由于这个功能可能需要额外的组件，这里只做记录
  };

  // 滚动到下一组商品
  const scrollNext = () => {
    if (gridRef.current) {
      const scrollAmount = gridRef.current.clientWidth / 2;
      gridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 滚动到上一组商品
  const scrollPrev = () => {
    if (gridRef.current) {
      const scrollAmount = gridRef.current.clientWidth / 2;
      gridRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  // 处理标签点击
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // 在切换分类时重置滚动位置
    const container = document.querySelector('.recommended-products-list');
    if (container) {
      container.scrollLeft = 0;
    }
    
    // 重置图片加载状态，这样切换分类后图片会重新加载
    setImageLoadStatus({});
  };

  // 商品价格格式化
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // 计算折扣
  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    const discount = Math.round((1 - currentPrice / originalPrice) * 100);
    return discount > 0 ? discount : null;
  };
  
  // 图片加载成功处理
  const handleImageLoad = (productId, event) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [productId]: 'loaded'
    }));
    
    if (event && event.target) {
      event.target.setAttribute('data-loaded', 'true');
      // 确保图片显示
      event.target.style.opacity = '1';
    }
  };
  
  // 图片加载错误处理
  const handleImageError = (e, product) => {
    console.log(`图片加载失败: ${product.title}, 尝试备用方案`);
    
    setImageLoadStatus(prev => ({
      ...prev,
      [product.id]: 'error'
    }));
    
    if (!e.target.dataset.errorHandled) {
      e.target.dataset.errorHandled = 'true';
      
      try {
        const publicUrl = process.env.PUBLIC_URL || '';
        let newImagePath = '';
        
        // 尝试方案1: 根据产品类别选择通用图片
        const categoryImages = {
          "智能家居": "/images/categories/smart_home.jpg",
          "手机数码": "/images/categories/electronics.jpg",
          "穿戴设备": "/images/categories/wearables.jpg",
          "电脑办公": "/images/categories/computers.jpg",
          "游戏设备": "/images/categories/gaming.jpg",
          "个人护理": "/images/categories/personal_care.jpg",
          "健康设备": "/images/categories/health.jpg",
          "厨房家电": "/images/categories/kitchen.jpg",
          "数码电子": "/images/categories/digital.jpg"
        };
        
        if (product.category && categoryImages[product.category]) {
          e.target.src = categoryImages[product.category];
          return;
        }
        
        // 尝试方案2: 修改图片路径添加时间戳
        if (product.image) {
          if (product.image.startsWith('/images')) {
            newImagePath = `${product.image}?cache=${Date.now()}`;
          } else if (product.image.includes('personalized_') || 
            product.image.includes('similar_') || 
            product.image.includes('popular_')) {
            newImagePath = `${publicUrl}/images/products/recommendations/${product.image}?cache=${Date.now()}`;
          } else {
            newImagePath = `${publicUrl}/images/products/${product.image}?cache=${Date.now()}`;
          }
          
          e.target.src = newImagePath;
          return;
        }
        
        // 尝试方案3: 使用占位图
        e.target.src = generateSVGPlaceholder(200, 200, product.title || '商品图片');
      } catch (error) {
        console.error('处理图片错误异常:', error);
        e.target.src = generateSVGPlaceholder(200, 200, product.title || '商品图片');
      }
    }
  };
  
  // 简单的SVG占位图生成器
  const generateSVGPlaceholder = (width, height, text) => {
    // 提取前两个字符作为缩写
    const shortText = text.slice(0, 2);
    
    // 根据文本生成稳定的颜色
    const hash = shortText.charCodeAt(0) * 31 + (shortText.charCodeAt(1) || 13);
    const hue = hash % 360;
    const bgColor = `hsl(${hue}, 70%, 90%)`;
    const textColor = `hsl(${hue}, 70%, 30%)`;
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="32px" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${shortText}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  // 处理重试
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return (
    <div className="product-recommendations">
      <div className="recommendation-header">
        <h2>为您推荐</h2>
        <div className="recommendation-categories">
          {recommendationCategories.map(category => (
            <button
              key={category.id}
              className={`recommendation-category ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => handleTabClick(category.id)}
              data-ai={category.id === 'personalized' ? 'true' : 'false'}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="recommended-products-container">
        {loading ? (
          <div className="recommendation-loading">
            <div className="spinner"></div>
            <p>正在为您加载推荐{retryCount > 0 ? `(重试第${retryCount}次)` : ''}...</p>
          </div>
        ) : fetchError ? (
          <div className="recommendation-error">
            <div className="error-icon">!</div>
            <p>{fetchError}</p>
            <button onClick={handleRetry} className="retry-button">
              重新加载
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="recommended-products-list" ref={gridRef}>
            {products.map((product) => (
              <div key={product.id} className="recommended-product-item">
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
                    onLoad={(e) => handleImageLoad(product.id, e)}
                    onError={(e) => handleImageError(e, product)}
                    loading="lazy"
                  />
                  {product.aiRecommendReason && (
                    <div className="ai-recommend-badge">
                      <span className="ai-icon">AI</span>
                    </div>
                  )}
                </div>
                <Link to={`/product/${product.id}`} className="recommended-product-info">
                  <h3 className="recommended-product-title">{product.title}</h3>
                  {product.aiRecommendReason && (
                    <p className="ai-recommend-reason">{product.aiRecommendReason}</p>
                  )}
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
                      <span className="rating-count">({product.salesCount || '1.2k'})</span>
                    </div>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="recommended-product-discount">
                      <span className="discount-badge">-{calculateDiscount(product.originalPrice, product.price)}%</span>
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
});

export default ProductRecommendations; 