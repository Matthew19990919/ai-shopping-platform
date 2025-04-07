import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faLightbulb, 
  faInfoCircle, 
  faTag, 
  faCreditCard,
  faTimes,
  faShieldAlt,
  faTruck,
  faPercent,
  faGift,
  faHistory,
  faShoppingBag,
  faCheckCircle,
  faExclamationCircle,
  faStoreAlt,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import './AiComponents.css';

/**
 * AI结算助手组件
 * 在结算页面提供智能填单、优惠推荐、支付方式建议等功能
 */
const AiCheckoutAssistant = ({ 
  cartItems, 
  selectedAddress, 
  setSelectedAddress,
  selectedPayment,
  setSelectedPayment,
  orderMessage,
  setOrderMessage,
  onApplyRecommendation 
}) => {
  // 组件状态
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [userPreferences, setUserPreferences] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [showPurchaseAnalysis, setShowPurchaseAnalysis] = useState(false);
  const [purchaseAnalysis, setPurchaseAnalysis] = useState(null);
  const [suggestionFeedback, setSuggestionFeedback] = useState({});

  // 模拟加载用户偏好
  useEffect(() => {
    const loadUserPreferences = async () => {
      // 实际项目中应该从API获取
      setUserPreferences({
        preferredPayment: 'alipay',
        frequentlyUsedAddresses: ['home', 'work'],
        recentCategories: ['electronics', 'books', 'fashion'],
        priceRangeSensitivity: 'medium',
        deliveryPreference: 'fast',
        lastPurchaseDetails: {
          date: '2023-12-01',
          amount: 299.00,
          category: 'electronics'
        }
      });
    };
    
    loadUserPreferences();
  }, []);

  // 模拟生成智能建议
  useEffect(() => {
    if (isOpen && userPreferences) {
      setLoading(true);
      
      // 模拟API请求延迟
      const timer = setTimeout(() => {
        generateCheckoutSuggestions();
        generatePurchaseAnalysis();
        setLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, cartItems, selectedAddress, selectedPayment, userPreferences]);

  // 生成购买分析
  const generatePurchaseAnalysis = () => {
    // 分析购物车商品
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const categories = [...new Set(cartItems.map(item => item.category || '其他'))];
    
    setPurchaseAnalysis({
      totalAmount,
      itemCount,
      categories,
      averagePrice: totalAmount / itemCount,
      highestPriceItem: cartItems.reduce((max, item) => item.price > max.price ? item : max, cartItems[0]),
      potentialSavings: Math.round(totalAmount * 0.15),
      deliveryEstimate: estimateDelivery(selectedAddress, cartItems),
      returnProbability: calculateReturnProbability(cartItems),
      satisfactionPrediction: Math.min(95, 80 + Math.floor(Math.random() * 15))
    });
  };
  
  // 预估配送时间
  const estimateDelivery = (address, items) => {
    // 实际项目中应该根据地址和商品计算
    const baseTime = 2; // 基础配送时间（天）
    const hasLargeItems = items.some(item => item.isLarge || item.weight > 5);
    const hasExpressItems = items.some(item => item.isExpress);
    
    let minDays = baseTime;
    let maxDays = baseTime + 2;
    
    if (hasLargeItems) {
      minDays += 1;
      maxDays += 2;
    }
    
    if (hasExpressItems) {
      minDays = Math.max(1, minDays - 1);
      maxDays = Math.max(2, maxDays - 1);
    }
    
    return {
      minDays,
      maxDays,
      isExpress: hasExpressItems
    };
  };
  
  // 计算退货概率
  const calculateReturnProbability = (items) => {
    // 实际项目中应该基于商品类别、价格等因素计算
    const highReturnCategories = ['clothing', 'shoes', 'fashion'];
    const hasHighReturnItems = items.some(item => 
      highReturnCategories.includes(item.category) || 
      item.price > 500
    );
    
    return hasHighReturnItems ? 'medium' : 'low';
  };

  // 生成结算建议
  const generateCheckoutSuggestions = () => {
    const newSuggestions = [];
    
    // 1. 根据购物车商品生成支付方式建议
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalAmount > 1000 && selectedPayment !== 'card') {
      newSuggestions.push({
        type: 'payment',
        icon: faCreditCard,
        title: '支付方式建议',
        content: '对于金额较大的订单，建议使用银行卡支付，可获得更好的交易保障。',
        action: '切换到银行卡支付',
        benefit: '更高安全保障',
        handler: () => setSelectedPayment('card')
      });
    } else if (totalAmount < 200 && totalAmount > 0 && selectedPayment !== 'wechat') {
      newSuggestions.push({
        type: 'payment',
        icon: faCreditCard,
        title: '支付方式建议',
        content: '小额订单推荐使用微信支付，更便捷快速。',
        action: '切换到微信支付',
        benefit: '更便捷流程',
        handler: () => setSelectedPayment('wechat')
      });
    }
    
    // 2. 添加售后保障提示
    if (cartItems.some(item => item.price > 500)) {
      newSuggestions.push({
        type: 'warranty',
        icon: faShieldAlt,
        title: '保障服务建议',
        content: '您购买的商品中包含高价值物品，建议添加延长保修服务以获得更长时间的保障。',
        action: '添加延保服务',
        benefit: '延长保修期',
        handler: () => onApplyRecommendation('已为您高价值商品添加延保服务，额外获得12个月保修')
      });
    }
    
    // 3. 生成订单备注建议
    if (!orderMessage) {
      newSuggestions.push({
        type: 'note',
        icon: faInfoCircle,
        title: '订单备注建议',
        content: '您可以添加订单备注，例如配送时间偏好、开箱验货需求等，帮助商家更好地服务您。',
        action: '添加智能备注',
        benefit: '提高服务质量',
        handler: () => {
          const suggestions = [
            '请在工作日配送，周末不在家',
            '收货时需要开箱验货，谢谢',
            '请送货前电话联系，谢谢'
          ];
          const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
          setOrderMessage(randomSuggestion);
        }
      });
    }
    
    // 4. 优惠券推荐
    newSuggestions.push({
      type: 'discount',
      icon: faTag,
      title: '优惠券推荐',
      content: '系统检测到您有1张未使用的优惠券可用于当前订单，可节省¥20.00元。',
      action: '应用优惠券',
      benefit: '节省¥20.00',
      handler: () => onApplyRecommendation('优惠券已自动应用，已为您节省¥20.00')
    });
    
    // 5. 配送方式建议
    newSuggestions.push({
      type: 'delivery',
      icon: faTruck,
      title: '配送方式优化',
      content: '检测到您的购物车有多个相同商家的商品，建议合并配送以减少包装和配送时间。',
      action: '合并配送',
      benefit: '减少等待时间',
      handler: () => onApplyRecommendation('已为您优化配送方式，预计将减少1-2天配送时间')
    });
    
    // 6. 购物节活动提醒
    newSuggestions.push({
      type: 'promotion',
      icon: faGift,
      title: '限时活动提醒',
      content: '您的订单满¥500，再加¥50即可参与双12满减活动，额外立减¥50！',
      action: '查看推荐商品',
      benefit: '多买更划算',
      handler: () => alert('跳转到推荐商品页面功能开发中')
    });
    
    // 7. 历史订单关联商品
    if (userPreferences && userPreferences.lastPurchaseDetails) {
      newSuggestions.push({
        type: 'related',
        icon: faHistory,
        title: '基于历史订单推荐',
        content: '发现您之前购买过相关商品的配件，是否要一并购买？',
        action: '查看配件',
        benefit: '完善使用体验',
        handler: () => alert('查看配件功能开发中')
      });
    }
    
    setSuggestions(newSuggestions);
  };

  // 关闭助手
  const handleClose = () => {
    setIsOpen(false);
  };

  // 使用当前建议
  const handleUseSuggestion = (index) => {
    const suggestionIndex = index !== undefined ? index : currentSuggestion;
    
    if (suggestions.length > 0 && suggestionIndex < suggestions.length) {
      suggestions[suggestionIndex].handler();
      
      // 记录已选建议
      setSelectedSuggestions(prev => [...prev, suggestionIndex]);
      
      // 移动到下一个建议
      if (currentSuggestion < suggestions.length - 1) {
        setCurrentSuggestion(currentSuggestion + 1);
      }
    }
  };
  
  // 提供建议反馈
  const handleSuggestionFeedback = (index, isHelpful) => {
    setSuggestionFeedback(prev => ({
      ...prev,
      [index]: isHelpful
    }));
  };

  // 渲染购买分析
  const renderPurchaseAnalysis = () => {
    if (!purchaseAnalysis) return null;
    
    return (
      <div className="purchase-analysis">
        <h4 className="analysis-title">
          <FontAwesomeIcon icon={faShoppingBag} />
          订单智能分析
        </h4>
        
        <div className="analysis-metrics">
          <div className="analysis-metric">
            <div className="metric-label">订单总金额</div>
            <div className="metric-value">¥{purchaseAnalysis.totalAmount.toFixed(2)}</div>
          </div>
          
          <div className="analysis-metric">
            <div className="metric-label">商品数量</div>
            <div className="metric-value">{purchaseAnalysis.itemCount}件</div>
          </div>
          
          <div className="analysis-metric">
            <div className="metric-label">平均单价</div>
            <div className="metric-value">¥{purchaseAnalysis.averagePrice.toFixed(2)}</div>
          </div>
          
          <div className="analysis-metric highlight">
            <div className="metric-label">潜在节省</div>
            <div className="metric-value">¥{purchaseAnalysis.potentialSavings.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="analysis-insights">
          <div className="analysis-insight">
            <FontAwesomeIcon icon={faTruck} className="insight-icon" />
            <div className="insight-content">
              <div className="insight-title">配送预估</div>
              <div className="insight-value">
                {purchaseAnalysis.deliveryEstimate.isExpress ? 
                  <span className="positive">加急配送</span> : 
                  <span>普通配送</span>
                }
                <span className="insight-detail">
                  预计{purchaseAnalysis.deliveryEstimate.minDays}-{purchaseAnalysis.deliveryEstimate.maxDays}天送达
                </span>
              </div>
            </div>
          </div>
          
          <div className="analysis-insight">
            <FontAwesomeIcon 
              icon={purchaseAnalysis.returnProbability === 'low' ? faCheckCircle : faExclamationCircle} 
              className={`insight-icon ${purchaseAnalysis.returnProbability === 'low' ? 'positive' : 'warning'}`}
            />
            <div className="insight-content">
              <div className="insight-title">退货可能性</div>
              <div className="insight-value">
                {purchaseAnalysis.returnProbability === 'low' ? 
                  <span className="positive">低</span> : 
                  <span className="warning">中等</span>
                }
                <span className="insight-detail">
                  基于商品类别和价格分析
                </span>
              </div>
            </div>
          </div>
          
          <div className="analysis-insight">
            <FontAwesomeIcon icon={faStoreAlt} className="insight-icon" />
            <div className="insight-content">
              <div className="insight-title">商家数量</div>
              <div className="insight-value">
                {cartItems.map(item => item.seller || '默认商家').filter((v, i, a) => a.indexOf(v) === i).length}家
                <span className="insight-detail">
                  {cartItems.map(item => item.seller || '默认商家').filter((v, i, a) => a.indexOf(v) === i).length > 1 ?
                    '多商家配送，可能分批送达' : '单一商家，配送更高效'
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="analysis-insight">
            <FontAwesomeIcon icon={faHourglassHalf} className="insight-icon" />
            <div className="insight-content">
              <div className="insight-title">最佳购买时机</div>
              <div className="insight-value">
                现在
                <span className="insight-detail">
                  当前价格处于合理区间
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="satisfaction-prediction">
          <div className="satisfaction-label">
            <FontAwesomeIcon icon={faCheckCircle} />
            满意度预测
          </div>
          <div className="satisfaction-bar">
            <div 
              className="satisfaction-progress"
              style={{width: `${purchaseAnalysis.satisfactionPrediction}%`}}
            >
              {purchaseAnalysis.satisfactionPrediction}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="ai-assistant-minimized" onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faRobot} />
        <span>AI结算助手</span>
      </div>
    );
  }

  return (
    <div className="ai-checkout-assistant">
      <div className="ai-assistant-header">
        <div className="ai-assistant-title">
          <FontAwesomeIcon icon={faRobot} className="ai-icon" />
          <h3>AI结算助手</h3>
        </div>
        <div className="ai-assistant-actions">
          <button 
            className={`ai-analysis-toggle ${showPurchaseAnalysis ? 'active' : ''}`}
            onClick={() => setShowPurchaseAnalysis(!showPurchaseAnalysis)}
          >
            <FontAwesomeIcon icon={faShoppingBag} />
            {showPurchaseAnalysis ? '隐藏分析' : '查看分析'}
          </button>
          <button className="ai-close-btn" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      {showPurchaseAnalysis && renderPurchaseAnalysis()}
      
      <div className="ai-assistant-content">
        {loading ? (
          <div className="ai-loading">
            <div className="ai-loading-spinner"></div>
            <p>正在分析您的订单信息...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <>
            <div className="suggestions-progress">
              <div className="progress-indicator">
                {suggestions.map((_, index) => (
                  <div 
                    key={index} 
                    className={`progress-dot ${index === currentSuggestion ? 'active' : ''} ${selectedSuggestions.includes(index) ? 'completed' : ''}`}
                    onClick={() => setCurrentSuggestion(index)}
                  />
                ))}
              </div>
              <div className="progress-text">
                建议 {currentSuggestion + 1}/{suggestions.length}
              </div>
            </div>
            
            <div className="suggestion-carousel">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className={`ai-suggestion-card ${index === currentSuggestion ? 'active' : ''}`}
                  style={{transform: `translateX(${(index - currentSuggestion) * 100}%)`}}
                >
                  <div className="suggestion-header">
                    <FontAwesomeIcon icon={suggestion.icon} className="suggestion-icon" />
                    <h4>{suggestion.title}</h4>
                  </div>
                  
                  <div className="suggestion-content">
                    <p>{suggestion.content}</p>
                    
                    <div className="suggestion-benefit">
                      <FontAwesomeIcon icon={faPercent} />
                      <span>收益: {suggestion.benefit}</span>
                    </div>
                    
                    <button 
                      className="suggestion-action-btn"
                      onClick={() => handleUseSuggestion(index)}
                      disabled={selectedSuggestions.includes(index)}
                    >
                      {selectedSuggestions.includes(index) ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} /> 已应用
                        </>
                      ) : (
                        suggestion.action
                      )}
                    </button>
                    
                    {selectedSuggestions.includes(index) && !suggestionFeedback.hasOwnProperty(index) && (
                      <div className="suggestion-feedback">
                        <span>这个建议有帮助吗?</span>
                        <div className="feedback-buttons">
                          <button 
                            className="feedback-btn"
                            onClick={() => handleSuggestionFeedback(index, true)}
                          >
                            👍
                          </button>
                          <button 
                            className="feedback-btn"
                            onClick={() => handleSuggestionFeedback(index, false)}
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {suggestionFeedback.hasOwnProperty(index) && (
                      <div className="feedback-thanks">
                        感谢您的反馈！
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="suggestion-navigation">
              <button 
                className="nav-btn prev"
                disabled={currentSuggestion === 0}
                onClick={() => setCurrentSuggestion(prev => Math.max(0, prev - 1))}
              >
                ← 上一个
              </button>
              <button 
                className="nav-btn next"
                disabled={currentSuggestion === suggestions.length - 1}
                onClick={() => setCurrentSuggestion(prev => Math.min(suggestions.length - 1, prev + 1))}
              >
                下一个 →
              </button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="apply-all-suggestions">
                <button 
                  className="apply-all-btn"
                  onClick={() => {
                    suggestions.forEach((_, index) => {
                      if (!selectedSuggestions.includes(index)) {
                        handleUseSuggestion(index);
                      }
                    });
                  }}
                  disabled={selectedSuggestions.length === suggestions.length}
                >
                  {selectedSuggestions.length === suggestions.length ? (
                    <>已应用所有建议</>
                  ) : (
                    <>一键应用所有建议 ({suggestions.length - selectedSuggestions.length})</>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="ai-no-suggestions">
            <FontAwesomeIcon icon={faLightbulb} className="no-suggestions-icon" />
            <p>您的订单看起来很完善！如需帮助，请随时点击我。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCheckoutAssistant;