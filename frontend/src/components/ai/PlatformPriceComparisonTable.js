import React, { useState } from 'react';
import { Table, Tag, Button, Tooltip, Spin, Empty, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, 
  faTags, 
  faShoppingCart, 
  faCoins, 
  faTruck, 
  faStar, 
  faInfoCircle,
  faChartLine,
  faBell,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import PriceHistoryChart from './PriceHistoryChart';
import './ChatMessage.css';

/**
 * 平台价格比较表组件
 * 显示多个电商平台上同一商品的价格对比
 */
const PlatformPriceComparisonTable = ({ data, loading, onSelectProduct }) => {
  const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [priceAlertSet, setPriceAlertSet] = useState(false);
  
  // 显示价格历史图表模态框
  const showPriceHistory = (product) => {
    setSelectedProductForHistory(product);
    setShowHistoryModal(true);
  };
  
  // 关闭价格历史图表模态框
  const closePriceHistory = () => {
    setShowHistoryModal(false);
  };
  
  // 设置价格提醒
  const handleSetPriceAlert = (price) => {
    console.log(`为商品 ${selectedProductForHistory.title} 设置价格提醒: ¥${price}`);
    
    // 价格提醒功能在这里实现
    setPriceAlertSet(true);
    
    // 5秒后重置状态
    setTimeout(() => {
      setPriceAlertSet(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="price-comparison-loading">
        <Spin size="large" />
        <p>正在获取多平台价格数据...</p>
      </div>
    );
  }

  if (!data || !data.bestOffers || Object.keys(data.bestOffers).length === 0) {
    return (
      <Empty 
        description="暂无价格比较数据" 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
      />
    );
  }

  // 准备表格数据
  const tableData = Object.entries(data.bestOffers).map(([platform, offer]) => ({
    key: platform,
    platform: platform,
    platformName: offer.platformName,
    title: offer.title,
    price: offer.price,
    originalPrice: offer.originalPrice,
    discount: ((offer.originalPrice - offer.price) / offer.originalPrice * 100).toFixed(1),
    rating: offer.rating,
    sales: offer.sales,
    imageUrl: offer.imageUrl,
    url: offer.url,
    inStock: offer.inStock,
    deliveryFee: offer.deliveryFee,
    couponInfo: offer.couponInfo,
    productId: offer.id
  }));

  // 按价格排序
  tableData.sort((a, b) => a.price - b.price);

  const { lowestPrice, highestPrice, averagePrice, priceDifferencePercentage } = data.statistics;
  
  // 表格列定义
  const columns = [
    {
      title: '平台',
      dataIndex: 'platformName',
      key: 'platformName',
      width: 80,
      render: (text, record) => (
        <div className="platform-cell">
          <span className="platform-name">{text}</span>
          {record.price === lowestPrice && (
            <Tag color="red">最低价</Tag>
          )}
        </div>
      ),
    },
    {
      title: '商品',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="product-info-cell">
          <img 
            src={record.imageUrl} 
            alt={text}
            className="product-thumbnail"
          />
          <div className="product-info">
            <div className="product-title">{text}</div>
            <div className="product-meta">
              <span className="product-rating">
                <FontAwesomeIcon icon={faStar} /> {record.rating}
              </span>
              <span className="product-sales">
                <FontAwesomeIcon icon={faShoppingCart} /> {record.sales}件已售
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price, record) => (
        <div className="price-cell">
          <div className="current-price">¥{price.toFixed(2)}</div>
          {record.originalPrice > price && (
            <div className="original-price">¥{record.originalPrice.toFixed(2)}</div>
          )}
          {record.originalPrice > price && (
            <div className="discount-tag">
              <FontAwesomeIcon icon={faTag} /> {record.discount}%
            </div>
          )}
          {record.couponInfo && (
            <Tooltip title={record.couponInfo}>
              <div className="coupon-tag">
                <FontAwesomeIcon icon={faTags} /> 有优惠券
              </div>
            </Tooltip>
          )}
          {record.deliveryFee === 0 ? (
            <div className="free-shipping-tag">
              <FontAwesomeIcon icon={faTruck} /> 免运费
            </div>
          ) : (
            <div className="shipping-fee">
              <FontAwesomeIcon icon={faTruck} /> 运费¥{record.deliveryFee}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div className="action-cell">
          <Button 
            type="primary" 
            size="small"
            onClick={() => window.open(record.url, '_blank')}
          >
            去购买
          </Button>
          <Button
            size="small"
            onClick={() => showPriceHistory(record)}
            icon={<FontAwesomeIcon icon={faChartLine} />}
            className="price-history-btn"
          >
            价格历史
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="platform-price-comparison">
      <div className="comparison-header">
        <h3 className="comparison-title">
          <FontAwesomeIcon icon={faCoins} /> 跨平台价格对比
        </h3>
        <div className="price-statistics">
          <div className="stats-item">
            <Tooltip title="所有平台中最低的价格">
              <span className="stats-label">
                <FontAwesomeIcon icon={faInfoCircle} /> 最低价
              </span>
            </Tooltip>
            <span className="stats-value lowest-price">¥{lowestPrice.toFixed(2)}</span>
          </div>
          <div className="stats-item">
            <Tooltip title="所有平台中最高的价格">
              <span className="stats-label">
                <FontAwesomeIcon icon={faInfoCircle} /> 最高价
              </span>
            </Tooltip>
            <span className="stats-value highest-price">¥{highestPrice.toFixed(2)}</span>
          </div>
          <div className="stats-item">
            <Tooltip title="所有平台的平均价格">
              <span className="stats-label">
                <FontAwesomeIcon icon={faInfoCircle} /> 平均价
              </span>
            </Tooltip>
            <span className="stats-value">¥{averagePrice.toFixed(2)}</span>
          </div>
          <div className="stats-item">
            <Tooltip title="最高价与最低价之间的价差百分比">
              <span className="stats-label">
                <FontAwesomeIcon icon={faInfoCircle} /> 价差比
              </span>
            </Tooltip>
            <span className="stats-value price-diff">
              {priceDifferencePercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={tableData}
        pagination={false}
        className="price-comparison-table"
        rowClassName={(record) => record.price === lowestPrice ? 'lowest-price-row' : ''}
      />
      
      <div className="comparison-footer">
        <div className="recommendation">
          {priceDifferencePercentage > 20 ? (
            <div className="high-diff-tip">
              不同平台之间价格差异较大，建议比较后再购买
            </div>
          ) : (
            <div className="low-diff-tip">
              不同平台之间价格相近，可以选择自己常用的平台购买
            </div>
          )}
        </div>
        
        <div className="ai-recommendation">
          <FontAwesomeIcon icon={faInfoCircle} className="ai-recommendation-icon" />
          <span className="ai-recommendation-text">
            AI分析：当前商品近期价格处于{averagePrice > lowestPrice * 1.1 ? '相对高位' : '相对低位'}，
            {priceDifferencePercentage > 15 
              ? '跨平台比价有较大优势，建议货比三家' 
              : '价格比较稳定，可以放心购买'}
          </span>
        </div>
      </div>
      
      {/* 价格历史图表模态框 */}
      <Modal
        title={
          <div className="price-history-modal-title">
            <FontAwesomeIcon icon={faChartLine} className="modal-icon" />
            <span>{selectedProductForHistory?.title} - 价格历史</span>
          </div>
        }
        open={showHistoryModal}
        onCancel={closePriceHistory}
        width={700}
        footer={null}
        className="price-history-modal"
      >
        {selectedProductForHistory && (
          <>
            <div className="modal-product-info">
              <img 
                src={selectedProductForHistory.imageUrl}
                alt={selectedProductForHistory.title}
                className="modal-product-image"
              />
              <div className="modal-product-details">
                <h4 className="modal-product-title">{selectedProductForHistory.title}</h4>
                <div className="modal-product-price">
                  <span className="current-price">¥{selectedProductForHistory.price.toFixed(2)}</span>
                  {selectedProductForHistory.originalPrice > selectedProductForHistory.price && (
                    <span className="original-price">¥{selectedProductForHistory.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="modal-product-platform">
                  平台：{selectedProductForHistory.platformName}
                </div>
              </div>
            </div>
            
            <PriceHistoryChart 
              productId={selectedProductForHistory.productId}
              productName={selectedProductForHistory.title}
              currentPrice={selectedProductForHistory.price}
              onSetPriceAlert={handleSetPriceAlert}
            />
            
            {priceAlertSet && (
              <div className="price-alert-success">
                <FontAwesomeIcon icon={faBell} className="alert-icon" />
                价格提醒设置成功！当价格低于设定值时我们会通知您
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default PlatformPriceComparisonTable; 