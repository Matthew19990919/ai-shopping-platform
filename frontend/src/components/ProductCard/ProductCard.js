import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faCheckCircle, faTag } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

const ProductCard = ({ product, isSelected, onSelect }) => {
  // 生成星级评分
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} className="star-icon filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalfAlt} className="star-icon filled" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-star-${i}`} icon={faStar} className="star-icon empty" />);
    }
    
    return stars;
  };

  return (
    <div 
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(product)}
    >
      {product.discount > 0 && (
        <div className="discount-badge">
          <FontAwesomeIcon icon={faTag} />
          <span>{Math.round(product.discount * 100)}% 折扣</span>
        </div>
      )}
      
      <div className="product-image-container">
        <img 
          src={product.image || '/images/placeholder-product.png'} 
          alt={product.name}
          className="product-image"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-brand">{product.brand}</div>
        
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        
        <div className="product-price">
          <span className="current-price">¥{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">¥{product.originalPrice}</span>
          )}
        </div>
        
        <div className="product-features">
          {product.features && product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="feature">
              <FontAwesomeIcon icon={faCheckCircle} className="feature-icon" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 