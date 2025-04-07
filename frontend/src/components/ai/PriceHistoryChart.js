import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faInfoCircle, 
  faBell, 
  faSpinner,
  faCheckCircle,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import './AiComponents.css';

/**
 * 价格历史图表组件
 * 展示商品的历史价格走势
 */
const PriceHistoryChart = ({ 
  productId,
  productName,
  currentPrice,
  onSetPriceAlert 
}) => {
  // 组件状态
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  
  // 加载价格历史数据
  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setLoading(true);
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟价格历史数据 - 实际项目中应该从API获取
        const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        const today = new Date();
        
        // 生成过去180天的价格数据点
        const mockPricePoints = [];
        let basePrice = currentPrice * 1.2; // 起始价格比当前价格高20%
        
        for (let i = 180; i >= 0; i--) {
          const date = new Date(today.getTime() - (i * oneDay));
          
          // 添加一些随机波动
          const fluctuation = (Math.random() - 0.5) * 0.05;
          const decay = (i / 180) * 0.2; // 随时间缓慢降价
          
          basePrice = basePrice * (1 + fluctuation - 0.005); // 每天平均下降0.5%
          
          // 为618和双11添加特殊降价
          const month = date.getMonth();
          const day = date.getDate();
          
          let discount = 1;
          let isEvent = false;
          let eventName = '';
          
          if ((month === 5 && day >= 15 && day <= 20) || // 6月中旬(618活动)
              (month === 10 && day >= 9 && day <= 13)) { // 11月初(双11活动)
            discount = 0.8 + Math.random() * 0.1; // 打8-9折
            isEvent = true;
            eventName = month === 5 ? '618大促' : '双11大促';
          }
          
          let price = Math.max(Math.round(basePrice * discount * 100) / 100, currentPrice * 0.95);
          
          mockPricePoints.push({
            date: date.toISOString().split('T')[0],
            price: price,
            isEvent: isEvent,
            eventName: eventName
          });
        }
        
        // 确保最后一个价格点是当前价格
        mockPricePoints[mockPricePoints.length - 1].price = currentPrice;
        
        // 计算统计数据
        const prices = mockPricePoints.map(point => point.price);
        const lowestPrice = Math.min(...prices);
        const highestPrice = Math.max(...prices);
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        // 计算最低价与当前价格的比较
        const priceDifference = currentPrice - lowestPrice;
        const priceDifferencePercent = (priceDifference / lowestPrice) * 100;
        
        // 计算价格趋势
        const recentPrices = prices.slice(-30); // 最近30天的价格
        let trend = 'stable';
        
        if (recentPrices[recentPrices.length - 1] < recentPrices[0] * 0.95) {
          trend = 'decreasing'; // 降价超过5%
        } else if (recentPrices[recentPrices.length - 1] > recentPrices[0] * 1.05) {
          trend = 'increasing'; // 涨价超过5%
        }
        
        // 找出低价时机
        const goodTimesToBuy = mockPricePoints
          .filter(point => point.price <= averagePrice * 0.9 && point.isEvent)
          .map(point => point.eventName)
          .filter((value, index, self) => self.indexOf(value) === index);
        
        setPriceData({
          points: mockPricePoints,
          lowestPrice,
          highestPrice,
          averagePrice,
          priceDifference,
          priceDifferencePercent,
          trend,
          goodTimesToBuy
        });
      } catch (error) {
        console.error('获取价格历史数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPriceHistory();
  }, [productId, currentPrice]);
  
  // 渲染价格趋势图
  const renderPriceChart = () => {
    if (!priceData) return null;
    
    const { points } = priceData;
    const maxPrice = Math.max(...points.map(p => p.price)) * 1.05;
    const minPrice = Math.min(...points.map(p => p.price)) * 0.95;
    const priceRange = maxPrice - minPrice;
    
    // 计算svg点坐标
    const svgPoints = points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.price - minPrice) / priceRange) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="price-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 价格线 */}
          <polyline
            fill="none"
            stroke="#3f51b5"
            strokeWidth="2"
            points={svgPoints}
          />
          
          {/* 特殊事件点 */}
          {points.map((point, index) => {
            if (point.isEvent) {
              const x = (index / (points.length - 1)) * 100;
              const y = 100 - ((point.price - minPrice) / priceRange) * 100;
              return (
                <circle
                  key={`event-${index}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="red"
                />
              );
            }
            return null;
          })}
          
          {/* 当前价格点 */}
          {(() => {
            const lastIndex = points.length - 1;
            const x = 100;
            const y = 100 - ((points[lastIndex].price - minPrice) / priceRange) * 100;
            return (
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="#4caf50"
              />
            );
          })()}
        </svg>
        
        <div className="price-chart-labels">
          <div className="price-label high-price">
            ¥{priceData.highestPrice.toFixed(2)}
          </div>
          <div className="price-label low-price">
            ¥{priceData.lowestPrice.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };
  
  // 处理设置价格提醒
  const handleSetAlert = () => {
    if (!alertPrice.trim()) return;
    
    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) return;
    
    if (onSetPriceAlert) {
      onSetPriceAlert(price);
    }
    
    setAlertSuccess(true);
    setTimeout(() => {
      setShowAlertInput(false);
      setAlertSuccess(false);
    }, 2000);
  };
  
  // 渲染价格评估和建议
  const renderPriceAnalysis = () => {
    if (!priceData) return null;
    
    const { trend, priceDifferencePercent, lowestPrice, averagePrice, goodTimesToBuy } = priceData;
    
    let trendIcon, trendColor, trendText;
    
    if (trend === 'decreasing') {
      trendIcon = faArrowDown;
      trendColor = '#4caf50';
      trendText = '近期价格呈下降趋势';
    } else if (trend === 'increasing') {
      trendIcon = faArrowUp;
      trendColor = '#f44336';
      trendText = '近期价格呈上升趋势';
    } else {
      trendIcon = faInfoCircle;
      trendColor = '#ff9800';
      trendText = '近期价格相对稳定';
    }
    
    // 购买建议
    let buyingAdvice;
    if (priceDifferencePercent <= 5) {
      buyingAdvice = '当前价格接近历史最低，是不错的购买时机';
    } else if (priceDifferencePercent <= 15) {
      buyingAdvice = '当前价格适中，可以考虑购买';
    } else {
      buyingAdvice = `建议等待降价，历史最低价为¥${lowestPrice.toFixed(2)}`;
    }
    
    return (
      <div className="price-analysis">
        <div className="price-trend">
          <FontAwesomeIcon icon={trendIcon} style={{ color: trendColor }} />
          <span className="trend-text">{trendText}</span>
        </div>
        
        <div className="price-advice">
          <FontAwesomeIcon icon={faInfoCircle} className="advice-icon" />
          <span>{buyingAdvice}</span>
        </div>
        
        {goodTimesToBuy.length > 0 && (
          <div className="good-times">
            <strong>购买时机:</strong> 
            {goodTimesToBuy.join('、')} 期间价格通常较低
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="price-history-chart-container">
      <div className="price-history-header">
        <h3 className="price-history-title">
          <FontAwesomeIcon icon={faChartLine} /> 历史价格走势
        </h3>
        
        <button 
          className="price-alert-btn"
          onClick={() => setShowAlertInput(!showAlertInput)}
        >
          <FontAwesomeIcon icon={faBell} /> 设置价格提醒
        </button>
      </div>
      
      {loading ? (
        <div className="price-loading">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>加载价格数据中...</p>
        </div>
      ) : (
        <>
          {/* 价格图表 */}
          {renderPriceChart()}
          
          {/* 价格分析 */}
          {renderPriceAnalysis()}
          
          {/* 价格提醒设置 */}
          {showAlertInput && (
            <div className="price-alert-setting">
              {alertSuccess ? (
                <div className="alert-success">
                  <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                  <span>价格提醒设置成功！降价时我们会通知您</span>
                </div>
              ) : (
                <>
                  <input 
                    type="number" 
                    placeholder="输入期望价格"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <button 
                    className="set-alert-btn"
                    onClick={handleSetAlert}
                  >
                    <FontAwesomeIcon icon={faBell} /> 确定
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PriceHistoryChart;