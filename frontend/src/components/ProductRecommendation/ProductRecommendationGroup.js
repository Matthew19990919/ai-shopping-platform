import React, { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './ProductRecommendationGroup.css';

const ProductRecommendationGroup = ({ products, onProductSelect }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(0);
  
  const productsPerPage = window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  // 处理产品选择
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };
  
  // 处理产品排序
  const sortProducts = (products) => {
    switch (sortOption) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };
  
  const sortedProducts = sortProducts(products);
  const paginatedProducts = sortedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );
  
  return (
    <div className="product-recommendation-group">
      <div className="recommendation-controls">
        <div className="sort-control">
          <FontAwesomeIcon icon={faSort} />
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">默认排序</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="rating">评分优先</option>
          </select>
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-button prev"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="page-info">{currentPage + 1}/{totalPages}</span>
            <button 
              className="page-button next"
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
      
      <div className="products-container">
        {paginatedProducts.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            isSelected={selectedProduct && selectedProduct.id === product.id}
            onSelect={handleProductSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendationGroup; 