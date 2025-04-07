import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Rate, Badge, Typography, Button } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import AnimatedElement from './AnimatedElement';
import { getProductImageUrl, handleImageError } from '../services/imageService';
import './ProductCard.css';

const { Meta } = Card;
const { Text, Title } = Typography;

/**
 * 增强版商品卡片组件
 * 
 * @param {Object} props
 * @param {Object} props.product - 商品数据
 * @param {Function} props.onAddToCart - 添加到购物车的回调
 * @param {Function} props.onToggleFavorite - 切换收藏状态的回调
 * @param {string} props.style - 卡片样式: 'default', 'compact', 'horizontal'
 * @param {number} props.index - 在列表中的索引，用于计算动画延迟
 */
const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  style = 'default',
  index = 0,
}) => {
  if (!product) return null;

  const {
    id,
    title,
    price,
    originalPrice,
    image,
    rating = 0,
    reviewCount = 0,
    discount,
    isNew,
    isFavorite,
    inStock = true,
    tags = [],
    brand = '',
  } = product;

  // 动画延迟，错开列表中的卡片动画
  const animationDelay = index * 0.1;

  // 计算折扣百分比
  const discountPercent = discount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // 卡片内容渲染
  const renderCardContent = () => (
    <>
      {/* 图片容器 */}
      <div className="product-image-container">
        <Link to={`/product/${id}`} className="img-hover-zoom">
          <img
            src={getProductImageUrl(image, title)}
            alt={title}
            className="product-image"
            onError={(e) => handleImageError(e, 'product', title)}
          />
        </Link>
        
        {/* 标志（折扣/新品）*/}
        <div className="product-badges">
          {discount && (
            <Badge.Ribbon
              text={`${discountPercent}% OFF`}
              color="#ff4d4f"
              className="discount-ribbon"
            />
          )}
          {isNew && <Badge className="new-badge" count="NEW" />}
        </div>
        
        {/* 快速操作按钮 */}
        <div className="product-actions">
          <Button
            type="primary"
            shape="circle"
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite && onToggleFavorite(id);
            }}
            className={`action-button favorite-button ${isFavorite ? 'active' : ''}`}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            className="action-button quick-view-button"
            onClick={(e) => {
              e.preventDefault();
              // 这里可以实现快速预览功能
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart && onAddToCart(product);
            }}
            className="action-button cart-button"
            disabled={!inStock}
          />
        </div>
      </div>
      
      {/* 卡片内容 */}
      <div className="product-info">
        {/* 品牌标签 */}
        {brand && (
          <Text className="product-brand" type="secondary">
            {brand}
          </Text>
        )}
        
        {/* 商品标题 */}
        <Link to={`/product/${id}`} className="product-title-link">
          <Title level={5} className="product-title text-truncate-2">
            {title}
          </Title>
        </Link>
        
        {/* 评分 */}
        <div className="product-rating">
          <Rate disabled defaultValue={rating} allowHalf={true} />
          <Text type="secondary" className="review-count">
            ({reviewCount})
          </Text>
        </div>
        
        {/* 价格 */}
        <div className="product-price">
          <Text strong className="current-price">
            ¥{price.toFixed(2)}
          </Text>
          {originalPrice && price < originalPrice && (
            <Text delete type="secondary" className="original-price">
              ¥{originalPrice.toFixed(2)}
            </Text>
          )}
        </div>
        
        {/* 标签 */}
        {tags.length > 0 && (
          <div className="product-tags">
            {tags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        )}
        
        {/* 库存状态 */}
        {!inStock && <Text type="danger">缺货</Text>}
      </div>
    </>
  );

  // 水平布局卡片渲染
  if (style === 'horizontal') {
    return (
      <AnimatedElement
        animation="fadeInUp"
        delay={animationDelay}
        className="product-card-horizontal"
      >
        <Card className="product-card horizontal-card">
          <div className="horizontal-layout">
            <div className="horizontal-image">
              {renderCardContent()}
            </div>
          </div>
        </Card>
      </AnimatedElement>
    );
  }

  // 默认卡片和紧凑卡片渲染
  return (
    <AnimatedElement
      animation="fadeInUp"
      delay={animationDelay}
      className={`product-card-wrapper ${style === 'compact' ? 'compact' : ''}`}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`product-card ${style === 'compact' ? 'compact-card' : ''}`}
          cover={null}
          bodyStyle={{ padding: style === 'compact' ? '12px' : '16px' }}
        >
          {renderCardContent()}
        </Card>
      </motion.div>
    </AnimatedElement>
  );
};

export default ProductCard; 