import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Spin, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './ChatMessage.css';

// 平台颜色映射
const PLATFORM_COLORS = {
  JD: '#e03a3e', // 京东红
  TMALL: '#ff0036', // 天猫红
  PINDUODUO: '#e22e1f', // 拼多多红
  SUNING: '#fa0', // 苏宁黄
  AMAZON: '#ff9900', // 亚马逊橙
  DEFAULT: '#1890ff' // 默认蓝
};

/**
 * 价格历史图表组件
 * @param {Object} props 组件属性
 * @param {Array} props.data 历史价格数据
 * @param {boolean} props.loading 加载状态
 * @param {string} props.platform 平台代码
 * @param {string} props.platformName 平台名称
 */
const PlatformPriceHistoryChart = ({ data, loading, platform, platformName }) => {
  if (loading) {
    return (
      <div className="price-history-loading">
        <Spin size="large" />
        <p>正在获取价格历史数据...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Empty 
        description="暂无价格历史数据" 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
      />
    );
  }

  // 计算价格相关统计
  const prices = data.map(item => item.price);
  const currentPrice = prices[prices.length - 1];
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // 计算价格级别
  const isPriceGood = currentPrice <= (averagePrice * 0.95); // 比平均价低5%以上是好价
  const isPriceBad = currentPrice >= (averagePrice * 1.05); // 比平均价高5%以上是坏价
  
  // 格式化数据，确保日期格式一致
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }));
  
  // 设置图表的颜色
  const lineColor = PLATFORM_COLORS[platform] || PLATFORM_COLORS.DEFAULT;
  
  // 获取价格建议
  const getPriceAdvice = () => {
    if (isPriceGood) {
      return `目前价格低于历史平均价${((averagePrice - currentPrice) / averagePrice * 100).toFixed(1)}%，建议现在购买`;
    } else if (isPriceBad) {
      return `目前价格高于历史平均价${((currentPrice - averagePrice) / averagePrice * 100).toFixed(1)}%，建议等待价格回落`;
    } else {
      return '目前价格接近历史平均价，符合市场价值';
    }
  };
  
  // 最低价与最高价的时间点
  const lowestPricePoint = formattedData.find(item => item.price === lowestPrice);
  const highestPricePoint = formattedData.find(item => item.price === highestPrice);

  return (
    <div className="platform-price-history">
      <div className="history-header">
        <h3 className="history-title">
          <FontAwesomeIcon icon={faChartLine} /> {platformName}价格走势
        </h3>
        <div className="price-statistics">
          <div className="stats-item">
            <span className="stats-label">当前价格</span>
            <span className={`stats-value ${isPriceGood ? 'good-price' : isPriceBad ? 'bad-price' : ''}`}>
              ¥{currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="stats-item">
            <span className="stats-label">最低价</span>
            <span className="stats-value lowest-price">¥{lowestPrice.toFixed(2)}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">最高价</span>
            <span className="stats-value highest-price">¥{highestPrice.toFixed(2)}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">平均价</span>
            <span className="stats-value">¥{averagePrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="history-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: '日期', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              label={{ value: '价格 (元)', angle: -90, position: 'insideLeft' }}
              domain={[
                (dataMin) => Math.floor(dataMin * 0.95), // 最低价再低5%
                (dataMax) => Math.ceil(dataMax * 1.05)  // 最高价再高5%
              ]}
            />
            <Tooltip 
              formatter={(value) => [`¥${value.toFixed(2)}`, '价格']}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />
            
            {/* 价格曲线 */}
            <Line 
              type="monotone" 
              dataKey="price" 
              name={`${platformName}价格`}
              stroke={lineColor} 
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            
            {/* 平均价线 */}
            <ReferenceLine 
              y={averagePrice} 
              stroke="#888" 
              strokeDasharray="3 3"
              label={{ 
                value: `平均: ¥${averagePrice.toFixed(2)}`,
                position: 'right'
              }} 
            />
            
            {/* 最低价线 */}
            <ReferenceLine 
              y={lowestPrice} 
              stroke="green" 
              strokeDasharray="3 3"
              label={{ 
                value: `最低: ¥${lowestPrice.toFixed(2)}`,
                position: 'right'
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="history-insights">
        <div className="insight-section">
          <h4>
            <FontAwesomeIcon icon={faInfoCircle} /> 价格洞察
          </h4>
          <ul className="insight-list">
            <li>
              <strong>当前价格:</strong> {isPriceGood ? '好价' : isPriceBad ? '偏高' : '合理'}，
              {currentPrice === lowestPrice ? 
                '达到历史最低价！' : 
                `比历史最低价高 ${((currentPrice - lowestPrice) / lowestPrice * 100).toFixed(1)}%`
              }
            </li>
            <li>
              <strong>历史最低:</strong> ¥{lowestPrice.toFixed(2)}，出现在 {lowestPricePoint?.date || '未知日期'}
            </li>
            <li>
              <strong>历史最高:</strong> ¥{highestPrice.toFixed(2)}，出现在 {highestPricePoint?.date || '未知日期'}
            </li>
            <li>
              <strong>价格波动:</strong> {((highestPrice - lowestPrice) / lowestPrice * 100).toFixed(1)}%
            </li>
          </ul>
        </div>
        
        <div className="insight-section">
          <h4>购买建议</h4>
          <div className={`advice ${isPriceGood ? 'good-advice' : isPriceBad ? 'bad-advice' : 'neutral-advice'}`}>
            {getPriceAdvice()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPriceHistoryChart; 