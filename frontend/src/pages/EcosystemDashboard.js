import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faTimesCircle, 
  faUserFriends, 
  faShoppingBag, 
  faRobot, 
  faSearch, 
  faTag, 
  faChartLine,
  faSyncAlt,
  faServer,
  faDatabase,
  faMemory,
  faMicrochip,
  faNetworkWired,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import * as EcosystemService from '../services/ecosystemService';
import * as DataAnalysisService from '../services/dataAnalysisService';
import '../styles/ecosystemDashboard.css';

const EcosystemDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [integrationStatus, setIntegrationStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 模拟获取仪表盘数据
  const fetchDashboardData = () => {
    setLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      // 获取生态系统健康状态
      const healthStatus = EcosystemService.checkEcosystemHealth();
      setSystemStatus(healthStatus);
      
      // 模拟性能指标数据
      setPerformanceMetrics({
        cpu: {
          usage: Math.floor(Math.random() * 30) + 20,
          cores: 8,
          temperature: Math.floor(Math.random() * 15) + 45
        },
        memory: {
          used: Math.floor(Math.random() * 2000) + 4000,
          total: 8192,
          swapUsed: Math.floor(Math.random() * 500)
        },
        disk: {
          used: Math.floor(Math.random() * 50) + 150,
          total: 500,
          readRate: Math.floor(Math.random() * 50) + 10,
          writeRate: Math.floor(Math.random() * 30) + 5
        },
        network: {
          inbound: Math.floor(Math.random() * 10) + 5,
          outbound: Math.floor(Math.random() * 15) + 8,
          connections: Math.floor(Math.random() * 500) + 1000
        },
        transactions: {
          perSecond: Math.floor(Math.random() * 50) + 10,
          avgResponseTime: Math.floor(Math.random() * 100) + 50,
          errorRate: (Math.random() * 0.8).toFixed(2)
        }
      });
      
      // 模拟集成状态数据
      setIntegrationStatus([
        { 
          name: "支付系统", 
          status: "operational", 
          lastSync: "今天 10:15:32",
          transactions: Math.floor(Math.random() * 100) + 50
        },
        { 
          name: "库存系统", 
          status: "operational", 
          lastSync: "今天 10:18:45",
          transactions: Math.floor(Math.random() * 200) + 100
        },
        { 
          name: "物流系统", 
          status: "warning", 
          lastSync: "今天 09:45:12",
          transactions: Math.floor(Math.random() * 50) + 20,
          warning: "同步延迟"
        },
        { 
          name: "会员系统", 
          status: "operational", 
          lastSync: "今天 10:12:08",
          transactions: Math.floor(Math.random() * 150) + 80
        },
        { 
          name: "供应商系统", 
          status: "operational", 
          lastSync: "今天 10:05:30",
          transactions: Math.floor(Math.random() * 30) + 10
        },
        { 
          name: "数据分析系统", 
          status: "operational", 
          lastSync: "今天 10:20:15",
          transactions: Math.floor(Math.random() * 500) + 200
        },
        { 
          name: "CRM系统", 
          status: "error", 
          lastSync: "今天 08:30:22",
          transactions: 0,
          error: "连接失败"
        }
      ]);
      
      setLastUpdated(new Date());
      setLoading(false);
    }, 1200);
  };

  // 获取状态图标
  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon operational" />;
      case 'warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon warning" />;
      case 'error':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon error" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon unknown" />;
    }
  };
  
  // 刷新数据
  const refreshData = () => {
    fetchDashboardData();
  };
  
  // 获取CPU使用率进度条颜色
  const getCpuUsageColor = (usage) => {
    if (usage < 50) return '#52c41a';
    if (usage < 80) return '#faad14';
    return '#f5222d';
  };
  
  // 获取内存使用率
  const getMemoryUsage = () => {
    if (!performanceMetrics.memory) return 0;
    const { used, total } = performanceMetrics.memory;
    return Math.round((used / total) * 100);
  };
  
  // 获取磁盘使用率
  const getDiskUsage = () => {
    if (!performanceMetrics.disk) return 0;
    const { used, total } = performanceMetrics.disk;
    return Math.round((used / total) * 100);
  };
  
  // 渲染系统状态卡片
  const renderSystemStatusCards = () => {
    if (!systemStatus || Object.keys(systemStatus).length === 0) {
      return <div className="loading-message">加载系统状态...</div>;
    }
    
    return (
      <div className="status-cards">
        {Object.entries(systemStatus).map(([system, data]) => (
          <div key={system} className="status-card">
            <div className="status-header">
              {system === 'userSystem' && <FontAwesomeIcon icon={faUserFriends} className="system-icon" />}
              {system === 'productSystem' && <FontAwesomeIcon icon={faShoppingBag} className="system-icon" />}
              {system === 'recommendationSystem' && <FontAwesomeIcon icon={faChartLine} className="system-icon" />}
              {system === 'aiSystem' && <FontAwesomeIcon icon={faRobot} className="system-icon" />}
              {system === 'searchSystem' && <FontAwesomeIcon icon={faSearch} className="system-icon" />}
              {system === 'promotionSystem' && <FontAwesomeIcon icon={faTag} className="system-icon" />}
              <h3 className="system-name">
                {system === 'userSystem' && '用户系统'}
                {system === 'productSystem' && '商品系统'}
                {system === 'recommendationSystem' && '推荐系统'}
                {system === 'aiSystem' && 'AI系统'}
                {system === 'searchSystem' && '搜索系统'}
                {system === 'promotionSystem' && '营销系统'}
              </h3>
              {getStatusIcon(data.status)}
            </div>
            <div className="status-details">
              <div className="status-item">
                <span className="item-label">状态:</span>
                <span className={`item-value ${data.status}`}>
                  {data.status === 'operational' && '正常运行'}
                  {data.status === 'warning' && '警告'}
                  {data.status === 'error' && '错误'}
                </span>
              </div>
              <div className="status-item">
                <span className="item-label">响应时间:</span>
                <span className="item-value">{data.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // 渲染性能指标
  const renderPerformanceMetrics = () => {
    if (!performanceMetrics || Object.keys(performanceMetrics).length === 0) {
      return <div className="loading-message">加载性能指标...</div>;
    }
    
    const { cpu, memory, disk, network, transactions } = performanceMetrics;
    const memoryUsage = getMemoryUsage();
    const diskUsage = getDiskUsage();
    
    return (
      <div className="performance-section">
        <div className="performance-row">
          <div className="performance-card">
            <div className="performance-header">
              <FontAwesomeIcon icon={faMicrochip} className="performance-icon" />
              <h3>CPU</h3>
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">使用率:</span>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${cpu.usage}%`, 
                      backgroundColor: getCpuUsageColor(cpu.usage) 
                    }}
                  ></div>
                </div>
                <span className="metric-value">{cpu.usage}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">核心数:</span>
                <span className="metric-value">{cpu.cores}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">温度:</span>
                <span className="metric-value">{cpu.temperature}°C</span>
              </div>
            </div>
          </div>
          
          <div className="performance-card">
            <div className="performance-header">
              <FontAwesomeIcon icon={faMemory} className="performance-icon" />
              <h3>内存</h3>
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">使用率:</span>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${memoryUsage}%`, 
                      backgroundColor: getCpuUsageColor(memoryUsage) 
                    }}
                  ></div>
                </div>
                <span className="metric-value">{memoryUsage}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">已用/总计:</span>
                <span className="metric-value">{memory.used}MB / {memory.total}MB</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">交换空间:</span>
                <span className="metric-value">{memory.swapUsed}MB</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-row">
          <div className="performance-card">
            <div className="performance-header">
              <FontAwesomeIcon icon={faDatabase} className="performance-icon" />
              <h3>磁盘</h3>
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">使用率:</span>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${diskUsage}%`, 
                      backgroundColor: getCpuUsageColor(diskUsage) 
                    }}
                  ></div>
                </div>
                <span className="metric-value">{diskUsage}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">已用/总计:</span>
                <span className="metric-value">{disk.used}GB / {disk.total}GB</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">IO速率:</span>
                <span className="metric-value">读: {disk.readRate}MB/s | 写: {disk.writeRate}MB/s</span>
              </div>
            </div>
          </div>
          
          <div className="performance-card">
            <div className="performance-header">
              <FontAwesomeIcon icon={faNetworkWired} className="performance-icon" />
              <h3>网络</h3>
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">入站流量:</span>
                <span className="metric-value">{network.inbound} MB/s</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">出站流量:</span>
                <span className="metric-value">{network.outbound} MB/s</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">活动连接:</span>
                <span className="metric-value">{network.connections}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-row">
          <div className="performance-card full-width">
            <div className="performance-header">
              <FontAwesomeIcon icon={faExchangeAlt} className="performance-icon" />
              <h3>交易</h3>
            </div>
            <div className="performance-metrics horizontal">
              <div className="metric-item">
                <span className="metric-label">每秒交易数:</span>
                <span className="metric-value">{transactions.perSecond}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">平均响应时间:</span>
                <span className="metric-value">{transactions.avgResponseTime} ms</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">错误率:</span>
                <span className={`metric-value ${parseFloat(transactions.errorRate) > 1 ? 'warning' : ''}`}>
                  {transactions.errorRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染集成状态表格
  const renderIntegrationStatus = () => {
    if (!integrationStatus || integrationStatus.length === 0) {
      return <div className="loading-message">加载集成状态...</div>;
    }
    
    return (
      <div className="integration-table-container">
        <table className="integration-table">
          <thead>
            <tr>
              <th>系统</th>
              <th>状态</th>
              <th>最后同步时间</th>
              <th>今日交易数</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            {integrationStatus.map((system, index) => (
              <tr key={index} className={system.status === 'error' ? 'error-row' : ''}>
                <td>{system.name}</td>
                <td className="status-cell">
                  {getStatusIcon(system.status)}
                  <span className={`status-text ${system.status}`}>
                    {system.status === 'operational' && '正常'}
                    {system.status === 'warning' && '警告'}
                    {system.status === 'error' && '错误'}
                  </span>
                </td>
                <td>{system.lastSync}</td>
                <td>{system.transactions}</td>
                <td>
                  {system.warning && <span className="warning-text">{system.warning}</span>}
                  {system.error && <span className="error-text">{system.error}</span>}
                  {!system.warning && !system.error && <span className="normal-text">正常</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染仪表盘内容
  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载生态系统状态...</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            系统概览
          </button>
          <button 
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            性能指标
          </button>
          <button 
            className={`tab-button ${activeTab === 'integration' ? 'active' : ''}`}
            onClick={() => setActiveTab('integration')}
          >
            系统集成
          </button>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <h2 className="section-title">系统状态</h2>
              {renderSystemStatusCards()}
              
              <h2 className="section-title">服务可用性</h2>
              <div className="availability-chart">
                <div className="availability-bar">
                  <div className="availability-fill" style={{width: '99.8%'}}></div>
                </div>
                <div className="availability-labels">
                  <span className="availability-value">99.8%</span>
                  <span className="availability-period">过去30天</span>
                </div>
              </div>
              
              <h2 className="section-title">今日数据</h2>
              <div className="today-metrics">
                <div className="metric-box">
                  <div className="metric-value">1,283</div>
                  <div className="metric-label">活跃用户</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">185</div>
                  <div className="metric-label">新订单</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">¥36,542</div>
                  <div className="metric-label">销售额</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">4,762</div>
                  <div className="metric-label">AI助手互动</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div className="performance-tab">
              <h2 className="section-title">性能指标</h2>
              {renderPerformanceMetrics()}
            </div>
          )}
          
          {activeTab === 'integration' && (
            <div className="integration-tab">
              <h2 className="section-title">系统集成状态</h2>
              {renderIntegrationStatus()}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="ecosystem-dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>生态系统监控仪表盘</h1>
            <div className="header-subtitle">
              实时监控商城所有子系统的运行状态和性能
            </div>
          </div>
          
          <div className="header-actions">
            <button className="refresh-button" onClick={refreshData}>
              <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'spinning' : ''} />
              刷新数据
            </button>
            <div className="last-updated">
              {lastUpdated ? `上次更新: ${lastUpdated.toLocaleTimeString()}` : '未更新'}
            </div>
          </div>
        </div>
        
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default EcosystemDashboard; 