import React, { useState, useEffect } from 'react';
import { Input, Button, Tabs, Card, Alert, Spin, Result, Divider, message } from 'antd';
import { SearchOutlined, HistoryOutlined, TagOutlined, ShoppingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faChartLine, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import PlatformPriceComparisonTable from './PlatformPriceComparisonTable';
import PlatformPriceHistoryChart from './PlatformPriceHistoryChart';
import { searchMultiPlatform, getProductPriceHistory, extractProductInfo } from '../../services/priceComparisonService';

import './ChatMessage.css';

const { TabPane } = Tabs;
const { Search } = Input;

/**
 * 跨平台价格比较页面组件
 * 整合搜索栏、价格比较表和历史价格图表
 */
const PriceComparisonPage = () => {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedPlatformName, setSelectedPlatformName] = useState('');
  const [error, setError] = useState(null);

  // 根据关键词搜索多平台价格
  const handleSearch = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      message.warning('请输入搜索关键词');
      return;
    }

    setLoading(true);
    setError(null);
    setComparisonData(null);
    setHistoryData([]);
    setSelectedPlatform(null);
    setSelectedProductId(null);
    
    try {
      const data = await searchMultiPlatform(keyword);
      setComparisonData(data);
      setSearchKeyword(keyword);
    } catch (err) {
      console.error('搜索出错:', err);
      setError('搜索商品信息失败，请稍后重试');
      message.error('搜索商品信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 根据商品URL搜索
  const handleUrlSearch = async () => {
    if (!productUrl || productUrl.trim() === '') {
      message.warning('请输入商品URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 从URL中提取平台代码和产品ID
      const { platform, productId } = extractProductInfo(productUrl);
      
      if (!platform || !productId) {
        message.error('无效的商品URL格式');
        setError('无法从URL中提取平台和产品信息');
        setLoading(false);
        return;
      }
      
      // 获取价格历史
      await handleViewPriceHistory(platform, productId, getPlatformDisplayName(platform));
      
      // 切换到历史价格选项卡
      setActiveTab('history');
    } catch (err) {
      console.error('URL搜索出错:', err);
      setError('处理商品URL失败，请检查URL格式是否正确');
      message.error('处理商品URL失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看价格历史
  const handleViewPriceHistory = async (platform, productId, platformName) => {
    setHistoryLoading(true);
    setSelectedPlatform(platform);
    setSelectedProductId(productId);
    setSelectedPlatformName(platformName);
    
    try {
      const data = await getProductPriceHistory(platform, productId);
      setHistoryData(data);
      // 切换到历史价格选项卡
      setActiveTab('history');
    } catch (err) {
      console.error('获取价格历史失败:', err);
      message.error('获取价格历史失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  // 获取平台显示名称
  const getPlatformDisplayName = (platformCode) => {
    const platformMap = {
      'JD': '京东',
      'TMALL': '天猫',
      'PINDUODUO': '拼多多',
      'SUNING': '苏宁',
      'AMAZON': '亚马逊'
    };
    
    return platformMap[platformCode] || platformCode;
  };

  // 清空搜索和结果
  const handleClear = () => {
    setSearchKeyword('');
    setProductUrl('');
    setComparisonData(null);
    setHistoryData([]);
    setSelectedPlatform(null);
    setSelectedProductId(null);
    setError(null);
  };

  return (
    <div className="price-comparison-page">
      <Card 
        title={
          <div className="comparison-header">
            <FontAwesomeIcon icon={faShoppingCart} className="header-icon" />
            <span>跨平台价格比较</span>
          </div>
        }
        className="comparison-card"
      >
        <div className="search-section">
          <h3>
            <SearchOutlined /> 商品搜索
          </h3>
          <div className="keyword-search">
            <Search
              placeholder="输入商品关键词，如 iPhone 14 Pro"
              enterButton="搜索"
              size="large"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
          
          <Divider>或者</Divider>
          
          <div className="url-search">
            <Input
              placeholder="粘贴商品URL，如 https://item.jd.com/12345.html"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              size="large"
              addonAfter={
                <Button 
                  type="primary" 
                  icon={<FontAwesomeIcon icon={faExternalLinkAlt} />} 
                  onClick={handleUrlSearch}
                  loading={loading}
                >
                  查询
                </Button>
              }
            />
            <div className="search-tips">
              <small>支持京东、天猫、拼多多、苏宁、亚马逊等主流电商平台</small>
            </div>
          </div>
          
          {searchKeyword && (
            <div className="search-actions">
              <Button onClick={handleClear}>清空搜索</Button>
            </div>
          )}
        </div>
        
        {error && (
          <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
            className="error-alert"
          />
        )}
        
        {(comparisonData || historyData.length > 0) && (
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="comparison-tabs">
            <TabPane 
              tab={
                <span>
                  <TagOutlined /> 价格比较
                </span>
              } 
              key="comparison"
            >
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                  <p>正在获取多平台价格数据...</p>
                </div>
              ) : comparisonData ? (
                <PlatformPriceComparisonTable 
                  data={comparisonData} 
                  onViewHistory={handleViewPriceHistory}
                />
              ) : (
                <Result
                  status="info"
                  title="请输入搜索关键词"
                  subTitle="输入商品名称或关键词，比较不同平台的价格"
                />
              )}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <HistoryOutlined /> 价格历史
                </span>
              } 
              key="history"
              disabled={!selectedPlatform}
            >
              {selectedPlatform && (
                <PlatformPriceHistoryChart 
                  data={historyData}
                  loading={historyLoading}
                  platform={selectedPlatform}
                  platformName={selectedPlatformName}
                />
              )}
            </TabPane>
          </Tabs>
        )}
        
        {!comparisonData && !historyData.length && !loading && !error && (
          <div className="empty-state">
            <Result
              icon={<ShoppingOutlined />}
              title="比较跨平台价格，找到最佳购买时机"
              subTitle="输入商品名称或粘贴商品URL，我们将为您比较多平台价格并分析历史价格走势"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PriceComparisonPage; 