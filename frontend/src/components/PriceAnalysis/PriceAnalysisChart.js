import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './PriceAnalysisChart.css';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceAnalysisChart = ({ priceData }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('3m'); // 默认显示3个月
  const [showEvents, setShowEvents] = useState(true);
  const [statistics, setStatistics] = useState({
    lowestPrice: 0,
    highestPrice: 0,
    averagePrice: 0,
    currentPrice: 0,
    priceChange: 0,
    confidenceLevel: '高', // 高、中、低
    bestTimeToBuy: '',
    recommendation: ''
  });
  
  useEffect(() => {
    if (!priceData) return;
    
    // 根据选定的时间范围过滤数据
    const filteredData = filterDataByTimeRange(priceData, timeRange);
    
    // 处理图表数据
    const processedData = processChartData(filteredData);
    setChartData(processedData);
    
    // 计算价格统计数据
    calculatePriceStatistics(filteredData);
  }, [priceData, timeRange, showEvents]);
  
  // 根据时间范围过滤数据
  const filterDataByTimeRange = (data, range) => {
    if (!data || !data.history) return data;
    
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '1m':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
      default:
        return data;
    }
    
    const filteredHistory = data.history.filter(item => new Date(item.date) >= startDate);
    return { ...data, history: filteredHistory };
  };
  
  // 处理图表数据
  const processChartData = (data) => {
    if (!data || !data.history || data.history.length === 0) {
      return null;
    }
    
    // 提取日期和价格
    const labels = data.history.map(item => item.date);
    const prices = data.history.map(item => item.price);
    
    // 找出价格事件并将其显示在图表上
    const events = [];
    const eventDates = [];
    
    if (showEvents && data.events) {
      data.events.forEach(event => {
        const eventIndex = labels.findIndex(date => date === event.date);
        if (eventIndex > -1) {
          events.push({
            date: event.date,
            price: prices[eventIndex],
            description: event.description,
            type: event.type
          });
          eventDates.push(event.date);
        }
      });
    }
    
    // 生成未来预测数据
    const futureLabels = [];
    const futurePrices = [];
    
    if (data.prediction && data.prediction.length > 0) {
      data.prediction.forEach(item => {
        futureLabels.push(item.date);
        futurePrices.push(item.price);
      });
    }
    
    return {
      labels: [...labels, ...futureLabels],
      datasets: [
        {
          label: '历史价格',
          data: prices,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          segment: {
            borderDash: (ctx) => {
              return eventDates.includes(ctx.p0.parsed.x) ? [6, 6] : undefined;
            }
          },
          pointBackgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            const date = labels[index];
            return eventDates.includes(date) ? getEventColor(events.find(e => e.date === date)?.type) : 'rgba(54, 162, 235, 1)';
          },
          pointBorderColor: (ctx) => {
            const index = ctx.dataIndex;
            const date = labels[index];
            return eventDates.includes(date) ? getEventColor(events.find(e => e.date === date)?.type) : 'rgba(54, 162, 235, 1)';
          },
          pointStyle: (ctx) => {
            const index = ctx.dataIndex;
            const date = labels[index];
            return eventDates.includes(date) ? 'star' : 'circle';
          },
        },
        {
          label: '价格预测',
          data: [...Array(labels.length - futureLabels.length).fill(null), ...futurePrices],
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderDash: [5, 5],
          fill: true,
          tension: 0.2,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ],
      events
    };
  };
  
  // 根据事件类型获取颜色
  const getEventColor = (type) => {
    switch (type) {
      case 'promotion':
        return 'rgba(255, 99, 132, 1)'; // 促销活动 - 红色
      case 'release':
        return 'rgba(75, 192, 192, 1)'; // 新品发布 - 绿色
      case 'holiday':
        return 'rgba(255, 206, 86, 1)'; // 节假日 - 黄色
      case 'seasonal':
        return 'rgba(153, 102, 255, 1)'; // 季节性 - 紫色
      default:
        return 'rgba(54, 162, 235, 1)'; // 默认 - 蓝色
    }
  };
  
  // 计算价格统计数据
  const calculatePriceStatistics = (data) => {
    if (!data || !data.history || data.history.length === 0) {
      return;
    }
    
    const prices = data.history.map(item => item.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const currentPrice = prices[prices.length - 1];
    
    // 计算近期价格变化趋势
    const recentPrices = prices.slice(-5);
    const priceChange = ((recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0]) * 100;
    
    // 基于价格历史数据和预测数据生成购买建议
    let bestTimeToBuy = '';
    let recommendation = '';
    let confidenceLevel = '中';
    
    // 获取未来价格预测
    const futurePrices = data.prediction ? data.prediction.map(item => item.price) : [];
    
    if (futurePrices.length > 0) {
      const minFuturePrice = Math.min(...futurePrices);
      const minFuturePriceIndex = futurePrices.indexOf(minFuturePrice);
      
      if (currentPrice <= lowestPrice * 1.05) {
        // 当前价格接近历史最低
        bestTimeToBuy = '现在';
        recommendation = '当前价格接近历史最低，是个不错的购买时机。';
        confidenceLevel = '高';
      } else if (minFuturePrice < currentPrice * 0.9) {
        // 预测未来价格会降至少10%
        const futureDate = data.prediction[minFuturePriceIndex].date;
        bestTimeToBuy = futureDate;
        recommendation = `建议等待至${futureDate}购买，预计价格会降至${minFuturePrice}元。`;
        
        // 检查是否有促销事件
        const hasPromotionEvent = data.events && data.events.some(event => 
          event.type === 'promotion' && new Date(event.date) > new Date()
        );
        
        if (hasPromotionEvent) {
          confidenceLevel = '高';
        }
      } else if (priceChange > 10) {
        // 价格近期上涨超过10%
        bestTimeToBuy = '观望';
        recommendation = '价格近期有明显上涨趋势，建议暂时观望。';
        confidenceLevel = '中';
      } else if (priceChange < -10) {
        // 价格近期下跌超过10%
        bestTimeToBuy = '择机';
        recommendation = '价格近期有明显下跌趋势，可以择机购买。';
        confidenceLevel = '中';
      } else {
        // 价格相对稳定
        bestTimeToBuy = '任意';
        recommendation = '价格相对稳定，可以根据自身需求决定购买时机。';
        confidenceLevel = '中';
      }
      
      // 检查是否有季节性因素
      const hasSeasonalEvent = data.events && data.events.some(event => event.type === 'seasonal');
      if (hasSeasonalEvent) {
        recommendation += ' 注意该产品价格受季节性因素影响。';
      }
    } else {
      bestTimeToBuy = '无法确定';
      recommendation = '缺少足够的价格预测数据，无法提供准确的购买时机建议。';
      confidenceLevel = '低';
    }
    
    setStatistics({
      lowestPrice,
      highestPrice,
      averagePrice,
      currentPrice,
      priceChange,
      confidenceLevel,
      bestTimeToBuy,
      recommendation
    });
  };
  
  // 渲染Chart.js图表选项
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '历史价格走势与预测',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += `¥${context.parsed.y}`;
            
            // 添加事件信息
            if (chartData && chartData.events) {
              const event = chartData.events.find(e => e.date === chartData.labels[context.dataIndex]);
              if (event) {
                label += ` - ${event.description}`;
              }
            }
            
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期'
        }
      },
      y: {
        title: {
          display: true,
          text: '价格 (¥)'
        },
        beginAtZero: false
      }
    }
  };
  
  // 渲染时间范围选择器
  const renderTimeRangeSelector = () => (
    <div className="time-range-selector">
      <button 
        className={`time-range-button ${timeRange === '1m' ? 'active' : ''}`} 
        onClick={() => setTimeRange('1m')}
      >
        1个月
      </button>
      <button 
        className={`time-range-button ${timeRange === '3m' ? 'active' : ''}`} 
        onClick={() => setTimeRange('3m')}
      >
        3个月
      </button>
      <button 
        className={`time-range-button ${timeRange === '6m' ? 'active' : ''}`} 
        onClick={() => setTimeRange('6m')}
      >
        6个月
      </button>
      <button 
        className={`time-range-button ${timeRange === '1y' ? 'active' : ''}`} 
        onClick={() => setTimeRange('1y')}
      >
        1年
      </button>
      <button 
        className={`time-range-button ${timeRange === 'all' ? 'active' : ''}`} 
        onClick={() => setTimeRange('all')}
      >
        全部
      </button>
      <div className="chart-controls">
        <label className="event-toggle">
          <input 
            type="checkbox" 
            checked={showEvents} 
            onChange={(e) => setShowEvents(e.target.checked)} 
          />
          显示价格事件
        </label>
      </div>
    </div>
  );
  
  // 渲染价格统计信息
  const renderPriceStatistics = () => (
    <div className="price-statistics">
      <div className="statistics-row">
        <div className="statistic-item">
          <div className="statistic-label">当前价格</div>
          <div className="statistic-value">¥{statistics.currentPrice.toFixed(2)}</div>
        </div>
        <div className="statistic-item">
          <div className="statistic-label">历史最低</div>
          <div className="statistic-value lowest-price">¥{statistics.lowestPrice.toFixed(2)}</div>
        </div>
        <div className="statistic-item">
          <div className="statistic-label">历史最高</div>
          <div className="statistic-value highest-price">¥{statistics.highestPrice.toFixed(2)}</div>
        </div>
        <div className="statistic-item">
          <div className="statistic-label">平均价格</div>
          <div className="statistic-value">¥{statistics.averagePrice.toFixed(2)}</div>
        </div>
        <div className="statistic-item">
          <div className="statistic-label">近期变化</div>
          <div className={`statistic-value ${statistics.priceChange > 0 ? 'price-up' : statistics.priceChange < 0 ? 'price-down' : ''}`}>
            {statistics.priceChange > 0 ? '↑' : statistics.priceChange < 0 ? '↓' : '—'}
            {Math.abs(statistics.priceChange).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染购买建议
  const renderPurchaseRecommendation = () => (
    <div className="purchase-recommendation">
      <div className="recommendation-header">
        <h4>购买建议</h4>
        <div className={`confidence-indicator confidence-${statistics.confidenceLevel.toLowerCase()}`}>
          可信度: {statistics.confidenceLevel}
        </div>
      </div>
      <div className="recommendation-content">
        <div className="best-time">
          <span className="label">最佳购买时机:</span>
          <span className="value">{statistics.bestTimeToBuy}</span>
        </div>
        <div className="recommendation-text">
          {statistics.recommendation}
        </div>
      </div>
    </div>
  );
  
  // 渲染事件图例
  const renderEventLegend = () => (
    showEvents && (
      <div className="event-legend">
        <div className="legend-title">价格事件说明:</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-marker promotion"></span>
            <span className="legend-text">促销活动</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker release"></span>
            <span className="legend-text">新品发布</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker holiday"></span>
            <span className="legend-text">节假日</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker seasonal"></span>
            <span className="legend-text">季节性因素</span>
          </div>
        </div>
      </div>
    )
  );
  
  return (
    <div className="price-analysis-chart">
      {renderTimeRangeSelector()}
      
      {renderPriceStatistics()}
      
      <div className="chart-container">
        {chartData ? (
          <Line data={chartData} options={options} height={250} />
        ) : (
          <div className="no-data-message">暂无价格数据</div>
        )}
      </div>
      
      {renderEventLegend()}
      
      {renderPurchaseRecommendation()}
    </div>
  );
};

export default PriceAnalysisChart;