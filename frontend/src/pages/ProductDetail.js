import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faShoppingCart, 
  faHeart, 
  faShare, 
  faStar, 
  faStarHalfAlt,
  faCheck,
  faPlus,
  faMinus,
  faRobot,
  faPaperPlane,
  faTimes,
  faCommentDots,
  faChevronDown,
  faInfoCircle,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import ProductRecommendations from '../components/ProductRecommendations';
import { useCart } from '../contexts/CartContext';
// 导入全部服务方法
import * as RecommendationService from '../services/recommendationService';
import '../styles/productDetail.css';

// AI助手聊天组件
const AiAssistant = ({ product, isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      content: `欢迎咨询！我是您的AI购物助手，很高兴为您介绍${product?.name || '这款商品'}。请问有什么可以帮您解答的吗？` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 处理用户输入变化
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  // 处理用户发送消息
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = getAiResponse(input, product);
      setMessages(prev => [...prev, { id: Date.now(), type: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };
  
  // 生成快捷问题列表
  const quickQuestions = [
    `${product?.name}有什么特点？`,
    `这款商品的质量好吗？`,
    `这个产品适合什么场景使用？`,
    `有什么类似但更便宜的产品推荐吗？`
  ];
  
  // 处理快捷问题点击
  const handleQuickQuestion = (question) => {
    setInput(question);
    // 触发表单提交
    document.getElementById('ai-chat-form').dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };
  
  return (
    <div className={`ai-assistant-widget ${isOpen ? 'open' : ''}`}>
      <div className="ai-assistant-header">
        <div className="ai-header-title">
          <FontAwesomeIcon icon={faRobot} className="ai-icon" />
          <span>AI购物助手</span>
        </div>
        <button className="ai-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="ai-messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`ai-message ${msg.type}`}>
            {msg.type === 'ai' && (
              <div className="ai-avatar">
                <FontAwesomeIcon icon={faRobot} />
              </div>
            )}
            <div className="message-content">{msg.content}</div>
            {msg.type === 'user' && (
              <div className="user-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="ai-message ai">
            <div className="ai-avatar">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="message-content typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="ai-quick-questions">
        <div className="quick-questions-header">
          <span>快捷问题</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
        <div className="quick-questions-list">
          {quickQuestions.map((question, index) => (
            <button 
              key={index}
              className="quick-question"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      <form id="ai-chat-form" className="ai-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="输入您的问题..."
          className="ai-input"
        />
        <button type="submit" className="ai-send-btn" disabled={!input.trim()}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

// 根据用户输入和产品生成AI响应
const getAiResponse = (userInput, product) => {
  const input = userInput.toLowerCase();
  
  // 产品特点相关问题
  if (input.includes('特点') || input.includes('功能') || input.includes('优势') || input.includes('是什么')) {
    return `${product?.name || '这款商品'}的主要特点包括：
    1. ${product?.features?.[0] || 'AI智能降噪技术，有效过滤环境噪音'}
    2. ${product?.features?.[1] || '高品质音频解码，提供清晰的音质体验'}
    3. ${product?.features?.[2] || '人体工学设计，长时间佩戴舒适'}
    4. ${product?.features?.[3] || '强大的电池续航能力'}
    5. ${product?.features?.[4] || '简便的触控操作和语音助手支持'}`;
  }
  
  // 质量相关问题
  if (input.includes('质量') || input.includes('好吗') || input.includes('评价') || input.includes('评分') || input.includes('评论')) {
    return `根据用户反馈，${product?.name || '这款商品'}的整体质量评价很好，平均评分为${product?.rating || 4.5}分（满分5分）。大多数用户对其音质、降噪效果和佩戴舒适度给予了高度评价。有少数用户提到在长时间使用后耳朵会有轻微不适，但这属于个人体验差异。总的来说，这是一款性价比很高的产品。`;
  }
  
  // 使用场景相关问题
  if (input.includes('场景') || input.includes('适合') || input.includes('用途') || input.includes('什么时候')) {
    return `${product?.name || '这款商品'}适合以下使用场景：
    
    • 日常通勤：降噪功能可以有效隔绝地铁、公交等嘈杂环境
    • 室内办公：提供清晰的通话质量，适合远程会议
    • 运动健身：防水设计和稳固佩戴，适合跑步等运动场景
    • 休闲娱乐：高品质音频体验，让您沉浸在音乐和影视作品中
    
    无论是工作还是娱乐场景，这款产品都能满足您的需求。`;
  }
  
  // 比较和推荐
  if (input.includes('推荐') || input.includes('类似') || input.includes('更便宜') || input.includes('比较')) {
    return `如果您想了解类似但可能价格更实惠的产品，可以考虑以下几款：
    
    1. TechSound Basic版（¥199）：基础功能相似，但降噪效果略弱
    2. SoundPro Lite（¥249）：音质相近，但电池续航时间较短
    3. AudioMax E5（¥279）：整体性能接近，设计略显厚重
    
    不过，考虑到${product?.name || '当前商品'}的整体性价比和用户好评度，如果预算允许，我还是推荐您选择当前这款产品，它在音质和体验上会带给您更多惊喜。`;
  }
  
  // 价格相关问题
  if (input.includes('价格') || input.includes('多少钱') || input.includes('贵') || input.includes('便宜') || input.includes('优惠')) {
    return `${product?.name || '这款商品'}的当前售价为¥${product?.price || 299}，相比原价¥${product?.originalPrice || 499}有${product?.discount || '优惠'}。这个价格在同类产品中属于中高端定位，考虑到其功能和质量，性价比很不错。目前正在促销期，是比较好的购买时机。`;
  }
  
  // 默认回复
  return `感谢您的提问！关于"${userInput}"，${product?.name || '这款商品'}确实很出色。您可以查看商品详情了解更多信息，或者询问我关于功能特点、使用体验、价格优惠等方面的具体问题，我会尽力为您解答。`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('detail');
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  useEffect(() => {
    // 模拟API请求获取产品详情
    const fetchProductDetails = () => {
      setLoading(true);
      
      // 模拟延迟
      setTimeout(() => {
        // 模拟产品数据
        const mockProduct = {
          id,
          name: 'AI智能蓝牙耳机',
          price: 299.00,
          originalPrice: 499.00,
          discount: '6折',
          description: '采用最新AI降噪技术，提供清晰音质和舒适佩戴体验。支持语音助手，智能识别，自动连接等功能。',
          brand: 'TechSound',
          category: '数码产品',
          rating: 4.5,
          reviewCount: 128,
          stock: 50,
          images: [
            'https://via.placeholder.com/500x500?text=耳机图片1',
            'https://via.placeholder.com/500x500?text=耳机图片2',
            'https://via.placeholder.com/500x500?text=耳机图片3',
            'https://via.placeholder.com/500x500?text=耳机图片4',
          ],
          specifications: [
            { name: '颜色', value: '黑色' },
            { name: '连接方式', value: '蓝牙5.2' },
            { name: '续航时间', value: '8小时' },
            { name: '防水等级', value: 'IPX5' },
            { name: '重量', value: '45g' },
          ],
          features: [
            'AI智能降噪',
            '支持蓝牙5.2',
            '触控操作',
            '语音助手',
            '防水设计'
          ],
          attributes: {
            colors: [
              { name: '黑色', code: '#000000', image: 'https://via.placeholder.com/40x40?text=黑' },
              { name: '白色', code: '#FFFFFF', image: 'https://via.placeholder.com/40x40?text=白' },
              { name: '红色', code: '#FF0000', image: 'https://via.placeholder.com/40x40?text=红' }
            ],
            versions: [
              { name: '标准版', price: 299.00 },
              { name: '高级版', price: 399.00 },
              { name: '豪华版', price: 499.00 }
            ]
          }
        };
        
        setProduct(mockProduct);
        setMainImage(mockProduct.images[0]);
        // 初始化默认选择的属性
        setSelectedAttributes({
          color: mockProduct.attributes.colors[0].name,
          version: mockProduct.attributes.versions[0].name
        });
        setLoading(false);
        
        // 记录产品浏览，用于推荐系统
        RecommendationService.recordProductView(Number(id));
      }, 1000);
    };
    
    fetchProductDetails();
  }, [id]);

  // 处理图片切换
  const handleImageClick = (image) => {
    setMainImage(image);
  };

  // 处理属性选择
  const handleAttributeSelect = (attributeType, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeType]: value
    }));
  };

  // 处理数量增减
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // 获取当前选择版本的价格
  const getCurrentPrice = () => {
    if (!product) return 0;
    
    const selectedVersion = product.attributes.versions.find(
      version => version.name === selectedAttributes.version
    );
    
    return selectedVersion ? selectedVersion.price : product.price;
  };

  // 处理加入购物车
  const handleAddToCart = () => {
    if (!product) return;
    
    const currentPrice = getCurrentPrice();
    
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: product.originalPrice,
      image: product.images[0],
      selectedAttributes: selectedAttributes,
      stock: product.stock
    };
    
    const success = addToCart(productToAdd, quantity, selectedAttributes);
    
    if (success) {
      // 记录购买行为
      RecommendationService.recordProductPurchase(Number(id));
      
      setAddedToCart(true);
      setMessage({ text: '已成功加入购物车！', type: 'success' });
      
      // 5秒后重置状态
      setTimeout(() => {
        setAddedToCart(false);
        setMessage({ text: '', type: '' });
      }, 5000);
    } else {
      setMessage({ text: '加入购物车失败，请稍后再试', type: 'error' });
    }
  };

  // 处理立即购买
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  // 处理收藏
  const handleToggleFavorite = (isFavorite) => {
    RecommendationService.toggleFavorite(Number(id), isFavorite);
    // 这里可以添加UI反馈
  };

  // 处理AI助手切换
  const toggleAiAssistant = () => {
    setShowAiAssistant(prev => !prev);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div>加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container">
        {/* 导航路径 */}
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
            返回首页
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/category/electronics" className="breadcrumb-link">
            电子产品
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
        
        {/* 产品详情 */}
        <div className="product-detail-container">
          {/* 产品图片 */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="main-image" 
              />
            </div>
            
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                  onClick={() => handleImageClick(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name}-${index}`} 
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* 产品信息 */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-rating">
              {/* 评分 */}
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(product.rating)) {
                    return <FontAwesomeIcon key={i} icon={faStar} className="star-filled" />;
                  } else if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
                    return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star-filled" />;
                  } else {
                    return <FontAwesomeIcon key={i} icon={faStar} className="star-empty" />;
                  }
                })}
                <span className="rating-value">{product.rating}</span>
              </div>
              
              <span className="review-count">{product.reviewCount} 条评价</span>
              
              <span className="product-brand">品牌: {product.brand}</span>
              
              <button className="ask-ai-button" onClick={toggleAiAssistant}>
                <FontAwesomeIcon icon={faInfoCircle} className="ai-icon" />
                智能助手
              </button>
            </div>
            
            {/* 价格 */}
            <div className="price-container">
              <div className="price-label">价格:</div>
              <div className="price-value">¥{getCurrentPrice().toFixed(2)}</div>
              <div className="original-price">¥{product.originalPrice.toFixed(2)}</div>
              <div className="discount-tag">{product.discount}</div>
            </div>
            
            {/* 属性选择 */}
            <div className="attributes-container">
              {/* 颜色选择 */}
              <div className="attribute-group">
                <div className="attribute-label">颜色</div>
                <div className="attribute-options">
                  {product.attributes.colors.map((color, index) => (
                    <div 
                      key={index}
                      className={`color-option ${selectedAttributes.color === color.name ? 'selected' : ''}`}
                      onClick={() => handleAttributeSelect('color', color.name)}
                      title={color.name}
                    >
                      <div 
                        className="color-swatch" 
                        style={{ 
                          backgroundImage: `url(${color.image})`,
                          backgroundColor: color.code 
                        }}
                      />
                      {selectedAttributes.color === color.name && (
                        <FontAwesomeIcon icon={faCheck} className="color-check" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 版本选择 */}
              <div className="attribute-group">
                <div className="attribute-label">版本</div>
                <div className="attribute-options">
                  {product.attributes.versions.map((version, index) => (
                    <div 
                      key={index}
                      className={`version-option ${selectedAttributes.version === version.name ? 'selected' : ''}`}
                      onClick={() => handleAttributeSelect('version', version.name)}
                    >
                      <span>{version.name}</span>
                      <span className="version-price">¥{version.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 数量选择 */}
            <div className="quantity-container">
              <div className="quantity-label">数量</div>
              <div className="quantity-control">
                <button 
                  className="quantity-button" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input 
                  type="text" 
                  className="quantity-input" 
                  value={quantity} 
                  readOnly 
                />
                <button 
                  className="quantity-button" 
                  onClick={increaseQuantity}
                  disabled={product && quantity >= product.stock}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="stock-info">库存: {product.stock}件</div>
            </div>
            
            {/* 添加成功消息 */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            {/* 按钮 */}
            <div className="action-buttons">
              <button
                className="buy-now-button"
                onClick={handleBuyNow}
              >
                立即购买
              </button>
              
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="button-icon" />
                {addedToCart ? '已加入购物车' : '加入购物车'}
              </button>
            </div>
            
            {/* 收藏分享 */}
            <div className="secondary-actions">
              <div className="action-link">
                <FontAwesomeIcon icon={faHeart} className="action-icon" />
                收藏
              </div>
              
              <div className="action-link">
                <FontAwesomeIcon icon={faShare} className="action-icon" />
                分享
              </div>
            </div>
          </div>
        </div>
        
        {/* 选项卡导航 */}
        <div className="product-tabs">
          <div className="tab-header">
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
              用户评价（{product.reviewCount}）
            </div>
          </div>
          
          <div className="tab-content">
            {activeTab === 'detail' && (
              <div className="tab-pane">
                <h3>商品介绍</h3>
                <p>{product.description}</p>
                <h4>商品特点：</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`${product.name} 详情图 ${index + 1}`}
                    className="detail-image"
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="tab-pane">
                <h3>规格参数</h3>
                <table className="specs-table">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="spec-name">{spec.name}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <h3>用户评价</h3>
                <div className="review-summary">
                  <div className="review-rating">
                    <div className="rating-number">{product.rating.toFixed(1)}</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon 
                          key={i} 
                          icon={i < Math.floor(product.rating) ? faStar : (i === Math.floor(product.rating) && product.rating % 1 ? faStarHalfAlt : faStar)} 
                          className={i < Math.ceil(product.rating) ? "star-filled" : "star-empty"} 
                        />
                      ))}
                    </div>
                    <div className="review-count">{product.reviewCount}条评价</div>
                  </div>
                  
                  <div className="review-tags">
                    <span className="review-tag">音质好(42)</span>
                    <span className="review-tag">续航长(38)</span>
                    <span className="review-tag">佩戴舒适(29)</span>
                    <span className="review-tag">性价比高(24)</span>
                  </div>
                </div>
                
                <div className="reviews-list">
                  <div className="review-item">
                    <div className="review-user">
                      <img src="https://via.placeholder.com/40x40" alt="用户头像" className="user-avatar" />
                      <div className="user-name">用户***123</div>
                    </div>
                    <div className="review-content">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} className={i < 5 ? "star-filled" : "star-empty"} />
                        ))}
                        <span className="review-date">2023-05-10</span>
                      </div>
                      <div className="review-text">
                        音质非常好，降噪效果明显，佩戴舒适，续航也很长，物超所值！推荐购买。
                      </div>
                      <div className="review-attributes">
                        <span className="attribute">颜色：黑色</span>
                        <span className="attribute">版本：标准版</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-item">
                    <div className="review-user">
                      <img src="https://via.placeholder.com/40x40" alt="用户头像" className="user-avatar" />
                      <div className="user-name">用户***456</div>
                    </div>
                    <div className="review-content">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} className={i < 4 ? "star-filled" : "star-empty"} />
                        ))}
                        <span className="review-date">2023-05-05</span>
                      </div>
                      <div className="review-text">
                        整体不错，就是耳机有点大，戴久了耳朵有点疼。音质和降噪效果都很好。
                      </div>
                      <div className="review-attributes">
                        <span className="attribute">颜色：白色</span>
                        <span className="attribute">版本：高级版</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="load-more-reviews">
                    <button className="load-more-btn">查看更多评价</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 相似商品推荐 */}
        <div className="similar-products-section">
          <ProductRecommendations 
            type="similar" 
            productId={Number(id)}
            title="猜你喜欢" 
            limit={5} 
            showViewMore={true}
          />
        </div>
      </div>
      
      {/* AI助手悬浮按钮 */}
      <button 
        className={`ai-assistant-toggle ${showAiAssistant ? 'active' : ''}`}
        onClick={toggleAiAssistant}
      >
        <FontAwesomeIcon icon={showAiAssistant ? faTimes : faCommentDots} />
        <span>{showAiAssistant ? '关闭助手' : 'AI助手'}</span>
      </button>
      
      {/* AI助手组件 */}
      <AiAssistant 
        product={product} 
        isOpen={showAiAssistant} 
        onClose={() => setShowAiAssistant(false)} 
      />
    </div>
  );
};

export default ProductDetail; 