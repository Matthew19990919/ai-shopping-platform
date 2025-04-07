import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Card, Button, Tooltip, Progress, Badge, Row, Col, Tabs, Divider, Tag, Spin, Empty } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  StarOutlined, 
  StarFilled,
  EyeOutlined, 
  ThunderboltOutlined, 
  PercentageOutlined,
  HistoryOutlined,
  SmileOutlined,
  RocketOutlined,
  SyncOutlined,
  UserOutlined,
  InfoCircleOutlined,
  FireOutlined,
  TagOutlined,
  BulbOutlined
} from '@ant-design/icons';
import './AiComponents.css';

const { TabPane } = Tabs;

const AiProductRecommendation = ({ currentProduct, location = 'product' }) => {
  const { 
    cartItems, 
    addToCart, 
    aiRecommendations, 
    purchaseHistory, 
    getUserPreferences, 
    trackUserBehavior
  } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [activeTab, setActiveTab] = useState('smart');
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [userInsights, setUserInsights] = useState(null);
  
  // 加载商品推荐
  useEffect(() => {
    setLoading(true);
    
    // 产品页面上的推荐需要基于当前产品
    if (location === 'product' && currentProduct) {
      generateRecommendationsForProduct(currentProduct);
    } 
    // 购物车和结账页面的推荐基于购物车内容
    else if ((location === 'cart' || location === 'checkout') && cartItems.length > 0) {
      generateRecommendationsForCart(cartItems);
    }
    // 首页和搜索页面的推荐基于用户历史行为
    else {
      generateRecommendationsForUser();
    }
    
    // 生成用户洞察数据
    generateUserInsights();
    
    // 模拟API延迟
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [currentProduct, cartItems, location]);
  
  // 为特定产品生成推荐
  const generateRecommendationsForProduct = (product) => {
    // 在实际项目中，这里应该调用后端API
    const mockRecommendations = [
      {
        id: 701,
        name: "高清智能摄像头",
        price: 129.99,
        originalPrice: 159.99,
        image: "/images/products/camera.jpg",
        rating: 4.7,
        reviewCount: 245,
        category: "智能安防",
        matchScore: 94,
        reasonCodes: ['complementary', 'popular', 'trending'],
        stockStatus: "in_stock",
        discount: "限时8折"
      },
      {
        id: 702,
        name: "智能门锁套装",
        price: 199.99,
        originalPrice: 249.99,
        image: "/images/products/smartlock.jpg",
        rating: 4.5,
        reviewCount: 183,
        category: "智能安防",
        matchScore: 91,
        reasonCodes: ['complementary', 'bundle_savings'],
        stockStatus: "limited",
        discount: "满300减50"
      },
      {
        id: 703,
        name: "家庭安防监控套件",
        price: 399.99,
        originalPrice: 499.99,
        image: "/images/products/securitykit.jpg",
        rating: 4.8,
        reviewCount: 127,
        category: "智能安防",
        matchScore: 87,
        reasonCodes: ['upsell', 'popular'],
        stockStatus: "in_stock",
        discount: "新品8折"
      },
      {
        id: 704,
        name: "防水户外摄像头",
        price: 89.99,
        originalPrice: 109.99,
        image: "/images/products/outdoorcam.jpg",
        rating: 4.2,
        reviewCount: 98,
        category: "智能安防",
        matchScore: 86,
        reasonCodes: ['complementary', 'trending'],
        stockStatus: "in_stock",
        discount: null
      },
      {
        id: 705,
        name: "移动侦测传感器",
        price: 49.99,
        originalPrice: 59.99,
        image: "/images/products/motionsensor.jpg",
        rating: 4.4,
        reviewCount: 156,
        category: "智能安防",
        matchScore: 83,
        reasonCodes: ['frequently_bought_together', 'value'],
        stockStatus: "in_stock",
        discount: "第二件半价"
      }
    ];
    
    setRecommendations(mockRecommendations);
  };
  
  // 为购物车生成推荐
  const generateRecommendationsForCart = (items) => {
    // 使用上下文中的AI推荐
    if (aiRecommendations && aiRecommendations.length > 0) {
      const enhancedRecommendations = aiRecommendations.map(rec => ({
        ...rec,
        rating: (Math.random() * (5 - 4) + 4).toFixed(1),
        reviewCount: Math.floor(Math.random() * 300) + 50,
        originalPrice: rec.price * (1 + Math.random() * 0.3).toFixed(2),
        stockStatus: Math.random() > 0.2 ? "in_stock" : "limited",
        reasonCodes: ['cart_based', 'personalized']
      }));
      
      setRecommendations(enhancedRecommendations);
    } else {
      // 备用推荐
      const fallbackRecommendations = [
        {
          id: 801,
          name: "多功能充电器",
          price: 39.99,
          originalPrice: 49.99,
          image: "/images/products/charger.jpg",
          rating: 4.3,
          reviewCount: 187,
          category: "电子配件",
          matchScore: 88,
          reasonCodes: ['cart_based', 'frequently_bought_together'],
          stockStatus: "in_stock",
          discount: "第二件半价"
        },
        {
          id: 802,
          name: "防水收纳包",
          price: 19.99,
          originalPrice: 24.99,
          image: "/images/products/storagebag.jpg",
          rating: 4.5,
          reviewCount: 142,
          category: "配件",
          matchScore: 85,
          reasonCodes: ['cart_based', 'value'],
          stockStatus: "in_stock",
          discount: "满50减10"
        }
      ];
      
      setRecommendations(fallbackRecommendations);
    }
  };
  
  // 基于用户历史生成推荐
  const generateRecommendationsForUser = () => {
    const preferences = getUserPreferences();
    
    // 模拟基于用户偏好的推荐
    const mockRecommendations = [
      {
        id: 901,
        name: "智能家居控制中心",
        price: 299.99,
        originalPrice: 349.99,
        image: "/images/products/smarthome.jpg",
        rating: 4.6,
        reviewCount: 213,
        category: "智能家居",
        matchScore: 95,
        reasonCodes: ['based_on_history', 'personalized', 'trending'],
        stockStatus: "in_stock",
        discount: "新品上市"
      },
      {
        id: 902,
        name: "多功能立式风扇",
        price: 129.99,
        originalPrice: 149.99,
        image: "/images/products/fan.jpg",
        rating: 4.4,
        reviewCount: 178,
        category: "家电",
        matchScore: 89,
        reasonCodes: ['seasonal', 'popular'],
        stockStatus: "limited",
        discount: "季末清仓"
      },
      {
        id: 903,
        name: "无线蓝牙音箱",
        price: 79.99,
        originalPrice: 99.99,
        image: "/images/products/speaker.jpg",
        rating: 4.7,
        reviewCount: 345,
        category: "电子产品",
        matchScore: 87,
        reasonCodes: ['trending', 'high_rated'],
        stockStatus: "in_stock",
        discount: "闪购特惠"
      }
    ];
    
    setRecommendations(mockRecommendations);
  };
  
  // 生成用户洞察数据
  const generateUserInsights = () => {
    const preferences = getUserPreferences();
    const purchaseCount = purchaseHistory.length;
    
    setUserInsights({
      favoriteCategory: preferences.favoriteCategory || '尚未确定',
      pricePreference: preferences.priceRangePreference || 'mid-range',
      purchaseFrequency: purchaseCount > 5 ? '高频' : purchaseCount > 2 ? '中频' : '低频',
      interestTags: ['智能家居', '电子产品', '时尚穿搭'].filter(() => Math.random() > 0.3),
      preferredPayment: Math.random() > 0.5 ? '支付宝' : '微信支付',
      recommendationAccuracy: Math.floor(Math.random() * 15) + 80
    });
  };
  
  // 添加到收藏夹
  const toggleFavorite = (productId) => {
    if (favoriteItems.includes(productId)) {
      setFavoriteItems(favoriteItems.filter(id => id !== productId));
    } else {
      setFavoriteItems([...favoriteItems, productId]);
      trackUserBehavior('add_to_favorites', { id: productId });
    }
  };
  
  // 查看产品详情
  const viewProductDetails = (product) => {
    trackUserBehavior('view_recommended_product', product);
    // 在实际项目中，这里应该实现导航到产品详情页
    console.log('查看产品详情:', product);
  };
  
  // 获取推荐原因描述
  const getReasonDescription = (reasonCodes) => {
    const reasonMap = {
      'complementary': '完美搭配您已选的商品',
      'popular': '热销商品',
      'trending': '近期流行趋势',
      'bundle_savings': '组合购买可节省更多',
      'upsell': '升级选择',
      'frequently_bought_together': '购买此商品的用户也购买了',
      'value': '超高性价比',
      'cart_based': '基于您的购物车推荐',
      'personalized': '根据您的偏好推荐',
      'based_on_history': '基于您的购买历史',
      'seasonal': '应季推荐',
      'high_rated': '高评分产品'
    };
    
    if (!reasonCodes || reasonCodes.length === 0) return '为您推荐';
    
    return reasonMap[reasonCodes[0]] || '为您推荐';
  };
  
  // 渲染推荐理由标签
  const renderReasonTags = (reasonCodes) => {
    if (!reasonCodes || reasonCodes.length === 0) return null;
    
    const tagColors = {
      'complementary': 'blue',
      'popular': 'volcano',
      'trending': 'orange',
      'bundle_savings': 'green',
      'upsell': 'purple',
      'frequently_bought_together': 'cyan',
      'value': 'lime',
      'cart_based': 'gold',
      'personalized': 'magenta',
      'based_on_history': 'geekblue',
      'seasonal': 'red',
      'high_rated': 'success'
    };
    
    return (
      <div className="recommendation-tags">
        {reasonCodes.slice(0, 2).map((code, index) => (
          <Tag key={index} color={tagColors[code] || 'default'}>
            {getReasonDescription(code)}
          </Tag>
        ))}
      </div>
    );
  };
  
  // 渲染推荐商品卡片
  const renderProductCard = (product) => {
    const isFavorite = favoriteItems.includes(product.id);
    const isInCart = cartItems.some(item => item.id === product.id);
    
    return (
      <Badge.Ribbon 
        text={product.discount} 
        color="red" 
        style={{ display: product.discount ? 'block' : 'none' }}
      >
        <Card 
          hoverable 
          className="ai-recommendation-card"
          cover={
            <div className="recommendation-image-container">
              <img 
                alt={product.name} 
                src={product.image || 'https://via.placeholder.com/150'} 
                className="recommendation-image"
              />
              <div className="recommendation-actions">
                <Button 
                  icon={<EyeOutlined />} 
                  shape="circle"
                  onClick={() => viewProductDetails(product)}
                  className="action-button"
                />
                <Button 
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />} 
                  shape="circle"
                  onClick={() => toggleFavorite(product.id)}
                  className={`action-button ${isFavorite ? 'favorite-active' : ''}`}
                />
              </div>
              <div className="match-score">
                <Tooltip title="AI匹配度">
                  <Progress 
                    type="circle" 
                    percent={product.matchScore} 
                    width={40}
                    format={percent => `${percent}%`}
                    strokeColor={product.matchScore > 90 ? '#52c41a' : '#1890ff'}
                  />
                </Tooltip>
              </div>
            </div>
          }
        >
          <div className="recommendation-content">
            <h3 className="product-name">{product.name}</h3>
            
            <div className="product-price">
              <span className="current-price">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <div className="product-rating">
              {[1, 2, 3, 4, 5].map(star => (
                product.rating >= star ? 
                <StarFilled key={star} className="star-icon" /> : 
                <StarOutlined key={star} className="star-icon" />
              ))}
              <span className="review-count">({product.reviewCount})</span>
            </div>
            
            {renderReasonTags(product.reasonCodes)}
            
            <div className="stock-status">
              {product.stockStatus === 'in_stock' ? (
                <Tag color="success">现货</Tag>
              ) : product.stockStatus === 'limited' ? (
                <Tag color="warning">库存有限</Tag>
              ) : (
                <Tag color="error">缺货</Tag>
              )}
            </div>
            
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              block
              disabled={isInCart || product.stockStatus === 'out_of_stock'}
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
            >
              {isInCart ? '已加入购物车' : '加入购物车'}
            </Button>
          </div>
        </Card>
      </Badge.Ribbon>
    );
  };
  
  // 渲染用户洞察面板
  const renderUserInsightsPanel = () => {
    if (!userInsights) return null;
    
    return (
      <div className="user-insights-panel">
        <div className="insights-header">
          <UserOutlined className="insights-icon" />
          <h3>个性化推荐洞察</h3>
          <Tooltip title="基于您的浏览、搜索和购买历史，我们为您提供个性化的商品推荐">
            <InfoCircleOutlined className="info-icon" />
          </Tooltip>
        </div>
        
        <div className="insights-content">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div className="insight-item">
                <SmileOutlined className="item-icon" />
                <div className="item-content">
                  <div className="item-label">偏好类别</div>
                  <div className="item-value">{userInsights.favoriteCategory}</div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="insight-item">
                <TagOutlined className="item-icon" />
                <div className="item-content">
                  <div className="item-label">价格偏好</div>
                  <div className="item-value">
                    {userInsights.pricePreference === 'budget' ? '经济实惠' :
                     userInsights.pricePreference === 'mid-range' ? '中等价位' : '高端产品'}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="insight-item">
                <HistoryOutlined className="item-icon" />
                <div className="item-content">
                  <div className="item-label">购买频率</div>
                  <div className="item-value">{userInsights.purchaseFrequency}</div>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="insight-accuracy">
            <div className="accuracy-header">
              <BulbOutlined className="accuracy-icon" />
              <span>推荐准确度</span>
            </div>
            <Progress 
              percent={userInsights.recommendationAccuracy} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div className="accuracy-note">
              基于您的反馈和互动持续优化
            </div>
          </div>
          
          <div className="interest-tags">
            <div className="tags-label">您可能感兴趣：</div>
            <div className="tags-container">
              {userInsights.interestTags.map((tag, index) => (
                <Tag key={index} color="blue">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染无推荐时的内容
  const renderEmptyState = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无个性化推荐"
    >
      <Button type="primary" onClick={() => setLoading(true)}>
        <SyncOutlined /> 刷新推荐
      </Button>
    </Empty>
  );
  
  // 处理标签切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    
    // 模拟不同标签下的数据加载
    setLoading(true);
    setTimeout(() => {
      // 根据选择的标签过滤或重新排序推荐
      if (key === 'popular') {
        setRecommendations(prev => [...prev].sort((a, b) => b.reviewCount - a.reviewCount));
      } else if (key === 'trending') {
        setRecommendations(prev => [...prev].sort((a, b) => b.matchScore - a.matchScore));
      } else if (key === 'value') {
        setRecommendations(prev => [...prev].filter(item => item.discount));
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="ai-recommendation-container">
      <div className="recommendation-header">
        <div className="header-title">
          <RocketOutlined className="header-icon" />
          <h2>{location === 'product' ? '猜您喜欢' : '为您推荐'}</h2>
        </div>
        <Tooltip title="查看推荐原理">
          <InfoCircleOutlined 
            className="explanation-icon" 
            onClick={() => setExplanationVisible(!explanationVisible)}
          />
        </Tooltip>
      </div>
      
      {explanationVisible && (
        <div className="recommendation-explanation">
          <p>
            <BulbOutlined /> 我们的AI系统基于您的浏览历史、购买记录和类似用户的偏好，为您提供个性化推荐。
            推荐结果会随着您的互动不断优化，以提供更符合您需求的商品建议。
          </p>
          <div className="explanation-actions">
            <Button size="small" onClick={() => setExplanationVisible(false)}>关闭</Button>
          </div>
        </div>
      )}
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="recommendation-tabs">
        <TabPane 
          tab={
            <span>
              <BulbOutlined /> 智能推荐
            </span>
          } 
          key="smart"
        />
        <TabPane 
          tab={
            <span>
              <FireOutlined /> 热门商品
            </span>
          } 
          key="popular"
        />
        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined /> 趋势
            </span>
          } 
          key="trending"
        />
        <TabPane 
          tab={
            <span>
              <PercentageOutlined /> 优惠
            </span>
          } 
          key="value"
        />
      </Tabs>
      
      {loading ? (
        <div className="recommendation-loading">
          <Spin size="large" />
          <p>正在分析您的偏好，生成个性化推荐...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="recommendations-grid">
          <Row gutter={[16, 24]}>
            {recommendations.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                {renderProductCard(product)}
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        renderEmptyState()
      )}
      
      {activeTab === 'smart' && !loading && (
        <>
          <Divider>
            <span className="divider-text">
              <RocketOutlined /> 个性化洞察
            </span>
          </Divider>
          {renderUserInsightsPanel()}
        </>
      )}
      
      <div className="recommendation-footer">
        <Button 
          type="link" 
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              generateRecommendationsForUser();
              setLoading(false);
            }, 1000);
          }}
        >
          <SyncOutlined /> 刷新推荐
        </Button>
      </div>
    </div>
  );
};

export default AiProductRecommendation; 