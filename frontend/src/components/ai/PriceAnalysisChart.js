import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './ChatMessage.css';

/**
 * 价格分析图表组件
 * @param {Object} props
 * @param {Array} props.priceData 价格数据数组，格式为[{date: '2023-01-01', price: 1999}, ...]
 * @param {Object} props.product 产品对象
 */
const PriceAnalysisChart = ({ priceData, product }) => {
  if (!priceData || priceData.length === 0) {
    return <div className="price-analysis-empty">暂无价格分析数据</div>;
  }

  // 计算平均价格
  const averagePrice = Math.round(
    priceData.reduce((sum, item) => sum + item.price, 0) / priceData.length
  );

  // 找出最高价和最低价
  const maxPrice = Math.max(...priceData.map(item => item.price));
  const minPrice = Math.min(...priceData.map(item => item.price));

  // 当前价格（使用最新的价格数据）
  const currentPrice = priceData[priceData.length - 1].price;

  // 计算价格趋势（通过比较前半部分和后半部分的平均价格）
  const midPoint = Math.floor(priceData.length / 2);
  const firstHalfAvg = priceData.slice(0, midPoint)
    .reduce((sum, item) => sum + item.price, 0) / midPoint;
  const secondHalfAvg = priceData.slice(midPoint)
    .reduce((sum, item) => sum + item.price, 0) / (priceData.length - midPoint);
  
  const priceTrend = secondHalfAvg > firstHalfAvg 
    ? '上涨' 
    : secondHalfAvg < firstHalfAvg 
      ? '下降' 
      : '稳定';

  // 价格评估（当前价格与平均价格的比较）
  const priceEvaluation = currentPrice < averagePrice 
    ? '当前价格低于平均价格，是较好的购买时机' 
    : currentPrice > averagePrice * 1.1 
      ? '当前价格显著高于平均价格，建议等待价格回落' 
      : '当前价格接近平均价格，属于正常范围';

  // 格式化日期标签，只显示部分日期点
  const formatXAxis = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 自定义工具提示
  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="price-tooltip">
          <p className="tooltip-date">{formatXAxis(data.date)}</p>
          <p className="tooltip-price">¥{data.price}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="price-analysis">
      <div className="price-info">
        <div className="price-info-item">
          <span className="info-label">当前价格:</span>
          <span className="info-value">¥{currentPrice}</span>
        </div>
        <div className="price-info-item">
          <span className="info-label">平均价格:</span>
          <span className="info-value">¥{averagePrice}</span>
        </div>
        <div className="price-info-item">
          <span className="info-label">最低价格:</span>
          <span className="info-value">¥{minPrice}</span>
        </div>
        <div className="price-info-item">
          <span className="info-label">最高价格:</span>
          <span className="info-value">¥{maxPrice}</span>
        </div>
      </div>
      
      <div className="price-chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={priceData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              interval={Math.ceil(priceData.length / 6)} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[minPrice * 0.9, maxPrice * 1.1]} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={renderTooltip} />
            <ReferenceLine y={averagePrice} stroke="#888" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#4568dc" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="price-analysis-summary">
        <p>价格趋势: <span className={`trend trend-${priceTrend === '上涨' ? 'up' : priceTrend === '下降' ? 'down' : 'stable'}`}>{priceTrend}</span></p>
        <p className="evaluation">{priceEvaluation}</p>
      </div>
    </div>
  );
};

export default PriceAnalysisChart; 