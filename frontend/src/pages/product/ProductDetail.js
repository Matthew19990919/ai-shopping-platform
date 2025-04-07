import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faShoppingCart, 
  faStar, 
  faStarHalfAlt, 
  faChevronRight, 
  faShare, 
  faCommentDots,
  faStore,
  faTruck,
  faShield,
  faQuestion,
  faCheckCircle,
  faTimes,
  faPaperPlane,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import { useCart } from '../../contexts/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState({});
  const [activeTab, setActiveTab] = useState('detail');
  const [reviews, setReviews] = useState([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  
  // AI导购相关状态
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: '你好！我是AI导购助手，有什么可以帮助你的？', time: new Date() }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // 模拟从API获取商品数据
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // 实际项目中应该从后端API获取数据
        // 这里使用模拟数据
        setTimeout(() => {
          const mockProduct = {
            id: productId,
            title: 'Apple iPhone 15 Pro (A2650) 256GB 原色钛金属 支持移动联通电信5G 双卡双待手机',
            price: 8999.00,
            originalPrice: 9999.00,
            discount: '9折',
            sales: 10245,
            rating: 4.8,
            reviewCount: 2456,
            brand: 'Apple',
            category: '手机/数码',
            stock: 999,
            images: [
              'https://via.placeholder.com/500x500?text=iPhone15Pro-1',
              'https://via.placeholder.com/500x500?text=iPhone15Pro-2',
              'https://via.placeholder.com/500x500?text=iPhone15Pro-3',
              'https://via.placeholder.com/500x500?text=iPhone15Pro-4',
              'https://via.placeholder.com/500x500?text=iPhone15Pro-5'
            ],
            description: '超瓷晶面板，超瓷晶盾，更持久耐用。钛金属设计，比以往更轻巧，A17 Pro芯片，带来突破性的游戏体验。',
            features: [
              '6.1英寸超视网膜XDR显示屏',
              'A17 Pro芯片，突破性的游戏体验',
              '4800万像素主摄，支持4K/60fps视频拍摄',
              '钛金属边框，更轻盈坚固',
              'iOS 17操作系统'
            ],
            skus: [
              { id: 1, color: '原色钛金属', storage: '128GB', price: 7999.00, stock: 200 },
              { id: 2, color: '原色钛金属', storage: '256GB', price: 8999.00, stock: 500 },
              { id: 3, color: '原色钛金属', storage: '512GB', price: 10999.00, stock: 100 },
              { id: 4, color: '蓝色钛金属', storage: '128GB', price: 7999.00, stock: 150 },
              { id: 5, color: '蓝色钛金属', storage: '256GB', price: 8999.00, stock: 300 },
              { id: 6, color: '蓝色钛金属', storage: '512GB', price: 10999.00, stock: 80 },
              { id: 7, color: '黑色钛金属', storage: '128GB', price: 7999.00, stock: 180 },
              { id: 8, color: '黑色钛金属', storage: '256GB', price: 8999.00, stock: 450 },
              { id: 9, color: '黑色钛金属', storage: '512GB', price: 10999.00, stock: 90 }
            ],
            seller: {
              name: 'Apple官方旗舰店',
              rating: 4.9,
              followers: 5000000
            },
            specifications: [
              { name: '品牌', value: 'Apple' },
              { name: '型号', value: 'iPhone 15 Pro' },
              { name: '颜色', value: '原色钛金属/蓝色钛金属/黑色钛金属' },
              { name: '上市年份', value: '2023年' },
              { name: '操作系统', value: 'iOS 17' },
              { name: 'CPU型号', value: 'A17 Pro' },
              { name: '电池容量', value: '3274mAh' }
            ]
          };
          
          setProduct(mockProduct);
          setMainImage(mockProduct.images[0]);
          // 默认选择第一个SKU
          setSelectedSku(mockProduct.skus[1]); // 256GB版本
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setLoading(false);
      }
    };
    
    const fetchReviews = async () => {
      // 模拟获取评价数据
      setTimeout(() => {
        const mockReviews = [
          {
            id: 1,
            author: '用户15937****',
            rating: 5,
            date: '2023-11-15',
            content: '手机非常棒，外观设计简洁大方，钛金属机身轻盈又坚固。系统流畅，电池续航也很好。相机功能强大，拍照效果出色。',
            likes: 56,
            sku: { color: '原色钛金属', storage: '256GB' },
            images: ['https://via.placeholder.com/120x120?text=Review1']
          },
          {
            id: 2,
            author: '用户28461****',
            rating: 4,
            date: '2023-11-10',
            content: '总体满意，性能强劲，日常使用非常流畅。电池续航一般，重度使用需要一天充一次电。相机确实有进步，夜拍效果提升明显。',
            likes: 23,
            sku: { color: '蓝色钛金属', storage: '128GB' },
            images: []
          },
          {
            id: 3,
            author: '用户39275****',
            rating: 5,
            date: '2023-11-05',
            content: '终于换了新手机，操作非常流畅，续航也不错。相机功能很强大，拍出来的照片清晰度高。整体比我之前的手机轻了不少，拿在手上很舒适。',
            likes: 41,
            sku: { color: '黑色钛金属', storage: '512GB' },
            images: ['https://via.placeholder.com/120x120?text=Review3-1', 'https://via.placeholder.com/120x120?text=Review3-2']
          }
        ];
        setReviews(mockReviews);
      }, 1000);
    };
    
    fetchProductData();
    fetchReviews();
  }, [productId]);
  
  // 滚动到消息底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= selectedSku.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const handleSkuSelection = (type, value) => {
    const currentColor = selectedSku.color || product.skus[0].color;
    const currentStorage = selectedSku.storage || product.skus[0].storage;
    
    let targetSku;
    if (type === 'color') {
      targetSku = product.skus.find(sku => sku.color === value && sku.storage === currentStorage);
    } else if (type === 'storage') {
      targetSku = product.skus.find(sku => sku.color === currentColor && sku.storage === value);
    }
    
    if (targetSku) {
      setSelectedSku(targetSku);
    }
  };
  
  const addToCart = () => {
    if (!product || !selectedSku) return;
    
    // 准备产品信息
    const productToAdd = {
      id: product.id,
      name: product.title,
      price: selectedSku.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      stock: selectedSku.stock,
      selectedAttributes: {
        颜色: selectedSku.color,
        存储容量: selectedSku.storage
      }
    };
    
    // 将产品添加到购物车
    const success = addToCartContext(productToAdd, quantity);
    
    if (success) {
      // 显示添加成功的消息
      setAddToCartSuccess(true);
      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
    }
  };
  
  const buyNow = () => {
    if (!product || !selectedSku) return;
    
    // 准备产品信息
    const productToAdd = {
      id: product.id,
      name: product.title,
      price: selectedSku.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      stock: selectedSku.stock,
      selectedAttributes: {
        颜色: selectedSku.color,
        存储容量: selectedSku.storage
      }
    };
    
    // 将产品添加到购物车
    const success = addToCartContext(productToAdd, quantity);
    
    if (success) {
      // 直接跳转到结算页面
      navigate('/checkout');
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} style={{ color: '#e1251b' }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalfAlt} style={{ color: '#e1251b' }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-star-${i}`} icon={faStar} style={{ color: '#ddd' }} />);
    }
    
    return stars;
  };
  
  // 处理AI聊天相关的函数
  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };
  
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const sendMessage = () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息
    const newUserMessage = {
      sender: 'user',
      text: userInput,
      time: new Date()
    };
    
    setAiMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    
    // 模拟AI回复
    setTimeout(() => {
      let aiResponse;
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes('价格') || lowerInput.includes('多少钱')) {
        aiResponse = `${product.title}的${selectedSku.storage}版本售价为¥${selectedSku.price}，目前有优惠活动哦！`;
      } else if (lowerInput.includes('配置') || lowerInput.includes('参数')) {
        aiResponse = `这款${product.title}配备了${product.features.join('，')}。您想了解更具体的哪方面参数呢？`;
      } else if (lowerInput.includes('优惠') || lowerInput.includes('活动')) {
        aiResponse = '目前有以下活动：限时特惠、满2000减200、分期免息。现在下单还有额外赠品！';
      } else if (lowerInput.includes('颜色') || lowerInput.includes('款式')) {
        const colors = [...new Set(product.skus.map(sku => sku.color))];
        aiResponse = `这款产品有${colors.join('、')}等颜色可选，个人推荐${colors[0]}，非常符合时下潮流！`;
      } else if (lowerInput.includes('发货') || lowerInput.includes('配送')) {
        aiResponse = '支持当日发货，预计1-3天送达。现在下单还可以享受免运费服务！';
      } else if (lowerInput.includes('保修') || lowerInput.includes('售后')) {
        aiResponse = '产品支持7天无理由退货、30天保价、1年官方保修服务。有任何问题可以随时联系客服。';
      } else if (lowerInput.includes('推荐') || lowerInput.includes('建议')) {
        aiResponse = `根据您的需求，我推荐选择${selectedSku.storage}存储版本，满足日常使用完全足够，性价比较高。`;
      } else {
        aiResponse = '感谢您的咨询！关于这个问题，我可以为您查询更多信息。您还有其他关于产品的疑问吗？';
      }
      
      const newAiMessage = {
        sender: 'ai',
        text: aiResponse,
        time: new Date()
      };
      
      setAiMessages(prevMessages => [...prevMessages, newAiMessage]);
    }, 1000);
  };
  
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="product-detail-container loading">
          <div className="loading-skeleton product-image-skeleton"></div>
          <div className="product-info-skeleton">
            <div className="loading-skeleton title-skeleton"></div>
            <div className="loading-skeleton price-skeleton"></div>
            <div className="loading-skeleton options-skeleton"></div>
            <div className="loading-skeleton button-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="product-not-found">
          <h2>商品不存在或已下架</h2>
          <Link to="/">返回首页</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <Navbar />
      
      {/* 添加到购物车成功提示 */}
      {addToCartSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(82, 196, 26, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} />
          商品已成功添加到购物车
        </div>
      )}
      
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">首页</Link>
          <FontAwesomeIcon icon={faChevronRight} className="separator" />
          <Link to={`/category/${product.category}`}>{product.category}</Link>
          <FontAwesomeIcon icon={faChevronRight} className="separator" />
          <Link to={`/brand/${product.brand}`}>{product.brand}</Link>
          <FontAwesomeIcon icon={faChevronRight} className="separator" />
          <span>{product.title}</span>
        </div>
      </div>
      
      {/* 商品基本信息区域 */}
      <div className="product-detail-container">
        <div className="container">
          {/* 商品图片展示 */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img src={mainImage} alt={product.title} className="main-image" />
              <div className="image-zoom-hint">鼠标移入可查看大图</div>
            </div>
            <div className="thumbnail-list">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                  onClick={() => setMainImage(image)}
                >
                  <img src={image} alt={`${product.title} - 图片 ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="product-actions">
              <button className="action-button">
                <FontAwesomeIcon icon={faShare} />
                <span>分享</span>
              </button>
              <button className="action-button">
                <FontAwesomeIcon icon={faHeart} />
                <span>收藏</span>
              </button>
              <button className="action-button">
                <FontAwesomeIcon icon={faCommentDots} />
                <span>评论</span>
              </button>
            </div>
          </div>
          
          {/* 商品信息 */}
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            
            <div className="product-highlights">
              {product.discount && <span className="discount-badge">{product.discount}</span>}
              <p>{product.description}</p>
            </div>
            
            <div className="product-price">
              <div className="current-price">
                <span className="price-label">价格</span>
                <span className="price-symbol">¥</span>
                <span className="price-value">{selectedSku.price.toFixed(2)}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="original-price">
                  <span className="price-label">原价</span>
                  <span className="price-through">¥{product.originalPrice.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="product-promotion">
              <span className="promotion-label">促销</span>
              <div className="promotion-tags">
                <span className="promotion-tag">限时特惠</span>
                <span className="promotion-tag">满2000减200</span>
                <span className="promotion-tag">分期免息</span>
              </div>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">配送</span>
                <span className="meta-value">上海 <FontAwesomeIcon icon={faTruck} /> 快递: 免运费</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">服务</span>
                <span className="meta-value">
                  <span className="service-tag"><FontAwesomeIcon icon={faShield} /> 7天无理由退货</span>
                  <span className="service-tag"><FontAwesomeIcon icon={faShield} /> 30天保价</span>
                </span>
              </div>
            </div>
            
            {/* SKU选择 */}
            <div className="product-options">
              <div className="option-group">
                <div className="option-label">颜色</div>
                <div className="option-values">
                  {[...new Set(product.skus.map(sku => sku.color))].map(color => (
                    <div 
                      key={color} 
                      className={`option-value ${selectedSku.color === color ? 'selected' : ''}`}
                      onClick={() => handleSkuSelection('color', color)}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="option-group">
                <div className="option-label">存储容量</div>
                <div className="option-values">
                  {[...new Set(product.skus.map(sku => sku.storage))].map(storage => (
                    <div 
                      key={storage} 
                      className={`option-value ${selectedSku.storage === storage ? 'selected' : ''}`}
                      onClick={() => handleSkuSelection('storage', storage)}
                    >
                      {storage}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="option-group quantity">
                <div className="option-label">数量</div>
                <div className="quantity-selector">
                  <button 
                    className="quantity-button decrease" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-button increase" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedSku.stock}
                  >
                    +
                  </button>
                  <span className="stock-info">库存 {selectedSku.stock} 件</span>
                </div>
              </div>
            </div>
            
            {/* 购买按钮 */}
            <div className="product-actions-main">
              <button className="add-to-cart-button" onClick={addToCart}>
                <FontAwesomeIcon icon={faShoppingCart} />
                加入购物车
              </button>
              <button className="buy-now-button" onClick={buyNow}>
                立即购买
              </button>
            </div>
            
            {/* 卖家信息 */}
            <div className="seller-info">
              <div className="seller-name">
                <FontAwesomeIcon icon={faStore} />
                <Link to={`/seller/${product.seller.name}`}>{product.seller.name}</Link>
              </div>
              <div className="seller-rating">
                <span className="rating-stars">{renderStars(product.seller.rating)}</span>
                <span className="rating-value">{product.seller.rating}</span>
              </div>
              <button className="visit-store-button">进入店铺</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 商品详情标签页 */}
      <div className="product-tabs">
        <div className="container">
          <div className="tabs-header">
            <div 
              className={`tab ${activeTab === 'detail' ? 'active' : ''}`}
              onClick={() => setActiveTab('detail')}
            >
              商品详情
            </div>
            <div 
              className={`tab ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              规格参数
            </div>
            <div 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              用户评价({product.reviewCount})
            </div>
            <div 
              className={`tab ${activeTab === 'recommend' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommend')}
            >
              相关推荐
            </div>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'detail' && (
              <div className="tab-detail">
                <h3>商品介绍</h3>
                <div className="detail-content">
                  <p className="detail-description">{product.description}</p>
                  <div className="feature-list">
                    <h4>产品特点：</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="product-images">
                    {product.images.map((image, index) => (
                      <img key={index} src={image} alt={`${product.title} 详情图 ${index + 1}`} className="detail-image" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="tab-specs">
                <h3>规格参数</h3>
                <table className="specs-table">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                        <td className="spec-name">{spec.name}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <div className="reviews-summary">
                  <div className="rating-overall">
                    <div className="rating-number">{product.rating.toFixed(1)}</div>
                    <div className="rating-stars overall">{renderStars(product.rating)}</div>
                    <div className="rating-desc">总体评价</div>
                  </div>
                  <div className="rating-breakdown">
                    <div className="rating-tag">评价标签：</div>
                    <div className="rating-tags">
                      <span className="tag">外观漂亮(1024)</span>
                      <span className="tag">性能强劲(896)</span>
                      <span className="tag">电池耐用(645)</span>
                      <span className="tag">相机出色(578)</span>
                      <span className="tag">系统流畅(432)</span>
                    </div>
                  </div>
                </div>
                
                <div className="reviews-filter">
                  <div className="filter-options">
                    <span className="filter active">全部评价({product.reviewCount})</span>
                    <span className="filter">好评(2103)</span>
                    <span className="filter">中评(245)</span>
                    <span className="filter">差评(108)</span>
                    <span className="filter">有图(532)</span>
                    <span className="filter">视频(89)</span>
                  </div>
                </div>
                
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-name">{review.author}</div>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <div className="review-sku">
                        购买版本：{review.sku.color} {review.sku.storage}
                      </div>
                      <div className="review-content">{review.content}</div>
                      {review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((image, index) => (
                            <img key={index} src={image} alt={`用户评价图片 ${index + 1}`} className="review-image" />
                          ))}
                        </div>
                      )}
                      <div className="review-actions">
                        <span className="review-like">
                          <i className="like-icon"></i>
                          有用({review.likes})
                        </span>
                        <span className="review-comment">
                          <i className="comment-icon"></i>
                          回复
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="reviews-pagination">
                  <button className="pagination-button active">1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                  <span className="pagination-ellipsis">...</span>
                  <button className="pagination-button">100</button>
                  <button className="pagination-button next">下一页</button>
                </div>
              </div>
            )}
            
            {activeTab === 'recommend' && (
              <div className="tab-recommend">
                <h3>相关推荐</h3>
                <div className="recommend-products">
                  {/* 这里放推荐商品，实际项目中应该从API获取数据 */}
                  <div className="recommend-product-placeholder">
                    AI智能推荐功能开发中，敬请期待...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI导购助手 */}
      <div className="ai-assistant-float" onClick={toggleAIChat}>
        <div className="ai-icon">
          <FontAwesomeIcon icon={faRobot} />
        </div>
        <div className="ai-text">AI导购</div>
      </div>
      
      {/* AI聊天窗口 */}
      {showAIChat && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <FontAwesomeIcon icon={faRobot} className="ai-robot-icon" />
              AI智能导购助手
            </div>
            <button className="ai-chat-close" onClick={toggleAIChat}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="ai-chat-messages">
            {aiMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`ai-message ${msg.sender === 'user' ? 'user-message' : 'ai-response'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="ai-avatar">
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="ai-chat-input">
            <textarea 
              value={userInput}
              onChange={handleUserInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题，如：这个产品有什么特点？"
            />
            <button 
              className="send-button"
              onClick={sendMessage}
              disabled={!userInput.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 