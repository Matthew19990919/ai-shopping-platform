import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSort, 
  faList, 
  faGripHorizontal, 
  faChevronDown, 
  faChevronUp,
  faTimes,
  faAngleRight,
  faSearch,
  faHeart,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import ProductRecommendations from '../components/ProductRecommendations';
// 导入全部服务方法
import * as RecommendationService from '../services/recommendationService';
import '../styles/productList.css';

const ProductList = () => {
  // 获取路由参数和查询参数
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
  
  // 状态管理
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' 或 'list'
  const [sortBy, setSortBy] = useState('default'); // 默认排序
  const [filterOpen, setFilterOpen] = useState(false); // 移动端筛选面板状态
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false); // 移动端分类菜单状态
  const [priceRange, setPriceRange] = useState([0, 10000]); // 价格范围
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    features: [],
    ratings: []
  });
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // 模拟从API获取产品数据
    const fetchProducts = () => {
      setLoading(true);
      
      // 实际项目中应该从后端API获取数据
      // 这里使用模拟数据
      setTimeout(() => {
        // 生成模拟产品数据
        const mockProducts = Array(60).fill().map((_, index) => ({
          id: index + 1,
          name: `商品 ${index + 1}`,
          price: Math.floor(Math.random() * 5000) + 100,
          originalPrice: Math.floor(Math.random() * 6000) + 500,
          image: `https://via.placeholder.com/300x300?text=Product${index + 1}`,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviews: Math.floor(Math.random() * 500),
          sales: Math.floor(Math.random() * 1000),
          brand: ['品牌A', '品牌B', '品牌C', '品牌D'][Math.floor(Math.random() * 4)],
          features: ['特性1', '特性2', '特性3', '特性4'].slice(0, Math.floor(Math.random() * 4) + 1),
          isNew: Math.random() > 0.8,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30 + 10) : 0
        }));
        
        // 根据选择的排序方式排序产品
        let sortedProducts = [...mockProducts];
        switch (sortBy) {
          case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'sales':
            sortedProducts.sort((a, b) => b.sales - a.sales);
            break;
          default:
            // 默认排序 - 可以是综合排序
            break;
        }
        
        // 根据筛选条件筛选产品
        let filteredProducts = sortedProducts.filter(product => {
          // 价格范围筛选
          if (product.price < priceRange[0] || product.price > priceRange[1]) {
            return false;
          }
          
          // 品牌筛选
          if (selectedFilters.brand.length > 0 && !selectedFilters.brand.includes(product.brand)) {
            return false;
          }
          
          // 特性筛选
          if (selectedFilters.features.length > 0 && !selectedFilters.features.some(feature => product.features.includes(feature))) {
            return false;
          }
          
          // 评分筛选
          if (selectedFilters.ratings.length > 0 && !selectedFilters.ratings.some(rating => product.rating >= rating)) {
            return false;
          }
          
          // 搜索查询筛选
          if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          return true;
        });
        
        // 设置总页数
        setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
        
        // 分页
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
        
        setProducts(currentProducts);
        setLoading(false);
        
        // 记录分类或搜索查询，用于推荐系统
        if (category) {
          RecommendationService.recordSearch(`分类:${category}`);
        } else if (searchQuery) {
          RecommendationService.recordSearch(searchQuery);
        }
      }, 800);
    };
    
    fetchProducts();
  }, [category, searchQuery, sortBy, priceRange, selectedFilters, currentPage, productsPerPage]);

  // 切换视图方式
  const toggleView = (viewType) => {
    setView(viewType);
  };
  
  // 切换排序方式
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setCurrentPage(1); // 重置到第一页
  };
  
  // 处理价格范围变化
  const handlePriceRangeChange = (event, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(event.target.value, 10) || 0;
    setPriceRange(newPriceRange);
  };
  
  // 处理筛选项选择
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const updatedFilters = { ...prev };
      
      if (updatedFilters[filterType].includes(value)) {
        // 移除筛选项
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
      } else {
        // 添加筛选项
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      
      return updatedFilters;
    });
    
    setCurrentPage(1); // 重置到第一页
  };
  
  // 清除所有筛选条件
  const clearAllFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedFilters({
      brand: [],
      features: [],
      ratings: []
    });
    setCurrentPage(1);
  };
  
  // 分页处理
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 生成分页组件
  const renderPagination = () => {
    const pageNumbers = [];
    
    // 显示最多5个页码，当前页居中
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination">
        <button 
          className="page-btn prev" 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          上一页
        </button>
        
        {startPage > 1 && (
          <>
            <button className="page-btn" onClick={() => handlePageChange(1)}>1</button>
            {startPage > 2 && <span className="page-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button 
            key={number}
            className={`page-btn ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="page-ellipsis">...</span>}
            <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className="page-btn next" 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          下一页
        </button>
      </div>
    );
  };

  return (
    <div className="product-list-page">
      <Navbar />
      
      <div className="product-list-container">
        {/* 面包屑导航 */}
        <div className="breadcrumb">
          <Link to="/">首页</Link>
          <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-separator" />
          {category ? (
            <>
              <Link to="/products">全部商品</Link>
              <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-separator" />
              <span>{category}</span>
            </>
          ) : searchQuery ? (
            <>
              <Link to="/products">全部商品</Link>
              <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-separator" />
              <span>搜索结果: {searchQuery}</span>
            </>
          ) : (
            <span>全部商品</span>
          )}
        </div>
        
        <div className="product-list-content">
          {/* 分类侧边栏 */}
          <aside className={`category-sidebar ${categoryMenuOpen ? 'mobile-visible' : ''}`}>
            <div className="sidebar-header mobile-only">
              <h3>商品分类</h3>
              <button 
                className="close-sidebar" 
                onClick={() => setCategoryMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="category-list">
              <h3>商品分类</h3>
              <ul>
                <li className={!category ? 'active' : ''}>
                  <Link to="/products">全部商品</Link>
                </li>
                <li className={category === 'electronics' ? 'active' : ''}>
                  <Link to="/products/electronics">家用电器</Link>
                  <ul className="subcategory">
                    <li><Link to="/products/electronics/tv">电视</Link></li>
                    <li><Link to="/products/electronics/refrigerator">冰箱</Link></li>
                    <li><Link to="/products/electronics/washer">洗衣机</Link></li>
                  </ul>
                </li>
                <li className={category === 'phones' ? 'active' : ''}>
                  <Link to="/products/phones">手机数码</Link>
                  <ul className="subcategory">
                    <li><Link to="/products/phones/mobile">手机</Link></li>
                    <li><Link to="/products/phones/tablet">平板电脑</Link></li>
                    <li><Link to="/products/phones/accessories">手机配件</Link></li>
                  </ul>
                </li>
                <li className={category === 'computers' ? 'active' : ''}>
                  <Link to="/products/computers">电脑办公</Link>
                </li>
                <li className={category === 'appliances' ? 'active' : ''}>
                  <Link to="/products/appliances">小家电</Link>
                </li>
                <li className={category === 'homegoods' ? 'active' : ''}>
                  <Link to="/products/homegoods">家居家装</Link>
                </li>
              </ul>
            </div>
          </aside>
          
          {/* 主内容区 */}
          <div className="main-content">
            {/* 筛选和排序工具栏 */}
            <div className="filter-toolbar">
              <div className="mobile-toggles">
                <button
                  className="mobile-category-toggle"
                  onClick={() => setCategoryMenuOpen(true)}
                >
                  <FontAwesomeIcon icon={faList} />
                  <span>分类</span>
                </button>
                
                <button
                  className="mobile-filter-toggle"
                  onClick={() => setFilterOpen(true)}
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <span>筛选</span>
                </button>
              </div>
              
              <div className="sort-options">
                <span>排序: </span>
                <button
                  className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
                  onClick={() => handleSortChange('default')}
                >
                  默认
                </button>
                <button
                  className={`sort-btn ${sortBy === 'sales' ? 'active' : ''}`}
                  onClick={() => handleSortChange('sales')}
                >
                  销量
                </button>
                <button
                  className={`sort-btn ${sortBy === 'price-asc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('price-asc')}
                >
                  价格 <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <button
                  className={`sort-btn ${sortBy === 'price-desc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('price-desc')}
                >
                  价格 <FontAwesomeIcon icon={faChevronDown} />
                </button>
                <button
                  className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => handleSortChange('rating')}
                >
                  评分
                </button>
              </div>
              
              <div className="view-options">
                <button
                  className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => toggleView('grid')}
                >
                  <FontAwesomeIcon icon={faGripHorizontal} />
                </button>
                <button
                  className={`view-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => toggleView('list')}
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
              </div>
            </div>
            
            {/* 筛选条件 */}
            <div className={`filter-panel ${filterOpen ? 'mobile-visible' : ''}`}>
              <div className="filter-header mobile-only">
                <h3>筛选条件</h3>
                <button 
                  className="close-filter" 
                  onClick={() => setFilterOpen(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="filter-section">
                <h4>价格范围</h4>
                <div className="price-range">
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                  />
                  <span>至</span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                  />
                </div>
              </div>
              
              <div className="filter-section">
                <h4>品牌</h4>
                <div className="filter-options">
                  {['品牌A', '品牌B', '品牌C', '品牌D'].map((brand) => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedFilters.brand.includes(brand)}
                        onChange={() => handleFilterChange('brand', brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h4>特性</h4>
                <div className="filter-options">
                  {['特性1', '特性2', '特性3', '特性4'].map((feature) => (
                    <label key={feature} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedFilters.features.includes(feature)}
                        onChange={() => handleFilterChange('features', feature)}
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h4>评分</h4>
                <div className="filter-options">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedFilters.ratings.includes(rating)}
                        onChange={() => handleFilterChange('ratings', rating)}
                      />
                      <span>{rating}星及以上</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-actions">
                <button
                  className="clear-filters"
                  onClick={clearAllFilters}
                >
                  清除筛选
                </button>
                <button
                  className="apply-filters mobile-only"
                  onClick={() => setFilterOpen(false)}
                >
                  应用筛选
                </button>
              </div>
            </div>
            
            {/* 产品列表 */}
            <div className={`products-grid ${view === 'list' ? 'list-view' : ''}`}>
              {loading ? (
                // 加载中状态
                <>
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="product-card skeleton">
                      <div className="product-image skeleton-image"></div>
                      <div className="product-info">
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text short"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : products.length > 0 ? (
                // 产品列表
                products.map(product => (
                  <div key={product.id} className="product-card">
                    {product.discount > 0 && (
                      <div className="product-discount">
                        {product.discount}%<br />OFF
                      </div>
                    )}
                    {product.isNew && (
                      <div className="product-tag new">新品</div>
                    )}
                    <Link to={`/product/${product.id}`} className="product-link">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </Link>
                    <div className="product-info">
                      <Link to={`/product/${product.id}`} className="product-name">
                        {product.name}
                      </Link>
                      <div className="product-price">
                        <span className="current-price">¥{product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="product-meta">
                        <div className="product-rating">
                          <span className="rating-value">{product.rating}</span>
                          <span className="rating-count">({product.reviews}评价)</span>
                        </div>
                        <div className="product-sales">
                          已售{product.sales}件
                        </div>
                      </div>
                      <div className="product-brand">
                        品牌: {product.brand}
                      </div>
                      <div className="product-features">
                        {product.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                      <div className="product-actions">
                        <button className="action-btn wishlist">
                          <FontAwesomeIcon icon={faHeart} />
                          <span className="list-only">收藏</span>
                        </button>
                        <button className="action-btn cart">
                          <FontAwesomeIcon icon={faShoppingCart} />
                          <span className="list-only">加入购物车</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // 没有找到产品
                <div className="no-products">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <h3>未找到相关产品</h3>
                  <p>试试其他搜索条件或浏览我们的推荐商品</p>
                </div>
              )}
            </div>
            
            {/* 分页 */}
            {!loading && products.length > 0 && renderPagination()}
            
            {/* 个性化推荐 */}
            <div className="personalized-recommendations-section">
              <ProductRecommendations 
                type="personalized" 
                title="猜你喜欢" 
                limit={8} 
                showViewMore={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList; 