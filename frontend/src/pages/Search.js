import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSortAmountDown, 
  faSortAmountUp, 
  faStar, 
  faSortNumericDown, 
  faSortNumericUp, 
  faSearch,
  faHistory,
  faTimes,
  faClock,
  faLightbulb,
  faArrowRight,
  faTags,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { 
  searchProducts, 
  getSearchHistory, 
  clearSearchHistory,
  getHotSearchTerms,
  getSearchSuggestions
} from '../services/searchService';
import '../styles/Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  // 状态管理
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [hotSearches, setHotSearches] = useState([]);
  
  // 筛选和排序选项
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [filters, setFilters] = useState({
    categories: searchParams.get('categories')?.split(',') || [],
    brands: searchParams.get('brands')?.split(',') || [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });
  
  // 可用的分类和品牌（通常从后端获取，这里使用静态数据）
  const availableCategories = [
    { id: 'phones', name: '手机数码' },
    { id: 'computers', name: '电脑办公' },
    { id: 'home_appliances', name: '家用电器' },
    { id: 'clothing', name: '服装鞋包' },
    { id: 'beauty', name: '美妆个护' },
    { id: 'food', name: '食品生鲜' }
  ];
  
  const availableBrands = [
    { id: 'apple', name: '苹果' },
    { id: 'huawei', name: '华为' },
    { id: 'xiaomi', name: '小米' },
    { id: 'samsung', name: '三星' },
    { id: 'oppo', name: 'OPPO' },
    { id: 'vivo', name: 'vivo' },
    { id: 'lenovo', name: '联想' },
    { id: 'dell', name: '戴尔' }
  ];
  
  // 获取AI搜索助手结果
  const [aiSuggestions, setAiSuggestions] = useState(null);
  
  // 页码和分页
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const itemsPerPage = 20;
  
  // 搜索建议相关
  const [searchInput, setSearchInput] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsTimeoutRef = useRef(null);
  
  // 当搜索参数变化时执行搜索
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setTotalCount(0);
    }
    
    // 获取搜索历史
    const history = getSearchHistory(5);
    setSearchHistory(history);
    
    // 获取热门搜索词
    setHotSearches(getHotSearchTerms());
  }, [query, sortBy, filters, currentPage]);
  
  // 监听搜索输入变化获取搜索建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim().length > 1) {
        try {
          // 防抖处理，300毫秒后才请求
          if (suggestionsTimeoutRef.current) {
            clearTimeout(suggestionsTimeoutRef.current);
          }
          
          suggestionsTimeoutRef.current = setTimeout(async () => {
            const suggestionsResult = await getSearchSuggestions(searchInput);
            setSuggestions(suggestionsResult);
            setShowSuggestions(true);
          }, 300);
        } catch (err) {
          console.error('获取搜索建议出错:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    fetchSuggestions();
    
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [searchInput]);
  
  // AI导购功能 - 搜索分析与智能提示
  const generateAiShopping = (searchQuery, results) => {
    if (!searchQuery || searchQuery.trim().length < 2 || results.length === 0) {
      return null;
    }
    
    // 分析搜索结果的模式和特征
    const priceRanges = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    let totalPrice = 0;
    let maxPrice = 0;
    let minPrice = Infinity;
    
    // 分析价格分布
    results.forEach(product => {
      const price = parseFloat(product.price);
      totalPrice += price;
      maxPrice = Math.max(maxPrice, price);
      minPrice = Math.min(minPrice, price);
      
      if (price < 200) {
        priceRanges.low++;
      } else if (price < 1000) {
        priceRanges.medium++;
      } else {
        priceRanges.high++;
      }
    });
    
    const avgPrice = totalPrice / results.length;
    
    // 提取热门品牌和属性
    const brandCounts = {};
    const attributeCount = {};
    
    results.forEach(product => {
      // 品牌统计
      if (product.brand) {
        brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
      }
      
      // 属性统计
      if (product.attributes) {
        Object.entries(product.attributes).forEach(([key, value]) => {
          attributeCount[`${key}:${value}`] = (attributeCount[`${key}:${value}`] || 0) + 1;
        });
      }
    });
    
    // 获取最热门的品牌
    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([brand]) => brand);
    
    // 价格分布建议
    let priceAdvice = '';
    if (priceRanges.high > priceRanges.medium && priceRanges.high > priceRanges.low) {
      priceAdvice = `您搜索的"${searchQuery}"多为高端商品，价格区间较宽 (¥${minPrice.toFixed(2)} - ¥${maxPrice.toFixed(2)})。您是否考虑设置价格筛选？`;
    } else if (priceRanges.medium > priceRanges.low) {
      priceAdvice = `您搜索的"${searchQuery}"价格多在¥${(avgPrice * 0.8).toFixed(2)} - ¥${(avgPrice * 1.2).toFixed(2)}区间，性价比较高。`;
    } else {
      priceAdvice = `您搜索的"${searchQuery}"多为经济实惠型商品，平均价格为¥${avgPrice.toFixed(2)}。`;
    }
    
    // 根据搜索词和结果构建智能提示
    let suggestions = [];
    const queryLower = searchQuery.toLowerCase();
    
    if (queryLower.includes('手机') || queryLower.includes('电脑')) {
      suggestions.push(`比较新款的${searchQuery}`);
      suggestions.push(`性价比高的${searchQuery}`);
      suggestions.push(`${searchQuery}配件`);
    } else if (queryLower.includes('耳机') || queryLower.includes('音箱')) {
      suggestions.push(`无线${searchQuery}`);
      suggestions.push(`降噪${searchQuery}`);
      suggestions.push(`专业${searchQuery}`);
    } else {
      suggestions.push(`高品质${searchQuery}`);
      suggestions.push(`${searchQuery}推荐`);
      suggestions.push(`${searchQuery}热销款`);
    }
    
    // 添加品牌相关建议
    if (topBrands.length > 0) {
      topBrands.forEach(brand => {
        suggestions.push(`${brand}${searchQuery}`);
      });
    }
    
    // 构建最终AI导购建议
    return {
      priceAdvice: priceAdvice,
      relatedTerms: suggestions.slice(0, 5),
      suggestion: `基于您对"${searchQuery}"的搜索，我们分析了${results.length}件商品，${topBrands.length > 0 ? `其中${topBrands.join('、')}是热门品牌。` : ''}${priceAdvice}您也可以尝试以下相关搜索:`,
      popularBrands: topBrands
    };
  };
  
  // 执行搜索
  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 执行搜索
      const searchResults = await searchProducts(searchQuery, filters, sortBy);
      
      // 更新结果
      setResults(searchResults);
      setTotalCount(searchResults.length);
      
      // 获取AI搜索助手结果
      if (searchQuery.length > 2) {
        const aiResult = generateAiShopping(searchQuery, searchResults);
        setAiSuggestions(aiResult);
      } else {
        setAiSuggestions(null);
      }
    } catch (err) {
      setError('搜索时发生错误，请稍后再试');
      console.error('搜索错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理排序变更
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // 保留其他搜索参数，更新排序参数
    searchParams.set('sort', newSortBy);
    setSearchParams(searchParams);
  };
  
  // 处理过滤器变更
  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...filters };
    
    if (filterType === 'categories' || filterType === 'brands') {
      if (newFilters[filterType].includes(value)) {
        // 如果已选中，则移除
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        // 否则添加
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      
      // 更新URL参数
      if (newFilters[filterType].length > 0) {
        searchParams.set(filterType, newFilters[filterType].join(','));
      } else {
        searchParams.delete(filterType);
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
    setSearchParams(searchParams);
  };
  
  // 应用价格筛选
  const applyPriceFilter = () => {
    // 更新URL参数
    if (filters.minPrice) {
      searchParams.set('minPrice', filters.minPrice);
    } else {
      searchParams.delete('minPrice');
    }
    
    if (filters.maxPrice) {
      searchParams.set('maxPrice', filters.maxPrice);
    } else {
      searchParams.delete('maxPrice');
    }
    
    setSearchParams(searchParams);
  };
  
  // 清除所有筛选
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: '',
      maxPrice: ''
    });
    
    // 清除URL中的筛选参数
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    searchParams.delete('categories');
    searchParams.delete('brands');
    setSearchParams(searchParams);
  };
  
  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };
  
  // 处理建议点击
  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };
  
  // 搜索历史相关操作
  const handleHistoryClick = (historyItem) => {
    navigate(`/search?q=${encodeURIComponent(historyItem.query)}`);
  };
  
  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };
  
  // 热门搜索词点击
  const handleHotSearchClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };
  
  // 相关搜索词点击
  const handleRelatedSearchClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };
  
  // 渲染分页控件
  const renderPagination = () => {
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    
    if (pageCount <= 1) return null;
    
    const pages = [];
    const maxDisplayedPages = 5;
    
    // 确定要显示的页码范围
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(pageCount, startPage + maxDisplayedPages - 1);
    
    // 调整以确保显示的页数不变
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
    
    // 生成页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="search-pagination">
        {currentPage > 1 && (
          <button
            className="pagination-button prev"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            上一页
          </button>
        )}
        
        {pages}
        
        {currentPage < pageCount && (
          <button
            className="pagination-button next"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            下一页
          </button>
        )}
      </div>
    );
  };
  
  // 处理页码变更
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 更新URL参数
    searchParams.set('page', pageNumber);
    setSearchParams(searchParams);
    
    // 滚动到页面顶部
    window.scrollTo(0, 0);
  };
  
  // 计算当前页的商品
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div className="search-page">
      <Navbar />
      
      <div className="search-container">
        {/* 增强版搜索框 */}
        <div className="enhanced-search-box">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索商品、品牌、分类..."
                className="search-input"
                aria-label="搜索输入框"
              />
              {searchInput && (
                <button 
                  type="button" 
                  className="clear-search" 
                  onClick={() => setSearchInput('')}
                  aria-label="清除搜索"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
              <button type="submit" className="search-button" aria-label="搜索按钮">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            
            {/* 搜索建议下拉框 */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FontAwesomeIcon icon={faSearch} className="suggestion-icon" />
                    <span dangerouslySetInnerHTML={{ 
                      __html: suggestion.replace(
                        new RegExp(`(${searchInput})`, 'gi'), 
                        '<strong>$1</strong>'
                      ) 
                    }} />
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
        
        <div className="search-header">
          <div className="search-breadcrumb">
            <Link to="/">首页</Link> <FontAwesomeIcon icon={faArrowRight} className="breadcrumb-arrow" /> 搜索结果：{query}
          </div>
          
          <div className="search-summary">
            {!isLoading && (
              <p>
                {query ? `搜索"${query}"，找到 ${totalCount} 个商品` : '请输入搜索关键词'}
              </p>
            )}
          </div>
        </div>
        
        <div className="search-content">
          {/* 筛选侧边栏 */}
          <div className={`search-filters ${filterVisible ? 'visible' : ''}`}>
            <div className="filter-header">
              <h3><FontAwesomeIcon icon={faFilter} className="filter-icon" /> 筛选条件</h3>
              <button 
                className="clear-filters"
                onClick={clearAllFilters}
              >
                <FontAwesomeIcon icon={faTimes} /> 清除全部
              </button>
            </div>
            
            {/* 分类筛选 */}
            <div className="filter-section">
              <h4><FontAwesomeIcon icon={faTags} className="filter-section-icon" /> 商品分类</h4>
              <div className="category-filters">
                {availableCategories.map(category => (
                  <label key={category.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleFilterChange('categories', category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 品牌筛选 */}
            <div className="filter-section">
              <h4><FontAwesomeIcon icon={faTags} className="filter-section-icon" /> 品牌</h4>
              
              {/* 品牌快速筛选展示 */}
              {aiSuggestions && aiSuggestions.popularBrands && aiSuggestions.popularBrands.length > 0 && (
                <div className="popular-brands">
                  <div className="popular-brands-label">热门品牌:</div>
                  <div className="popular-brands-list">
                    {aiSuggestions.popularBrands.map((brand, index) => (
                      <button
                        key={index}
                        className={`popular-brand-btn ${filters.brands.includes(brand.toLowerCase()) ? 'active' : ''}`}
                        onClick={() => handleFilterChange('brands', brand.toLowerCase())}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="brand-filters">
                {availableBrands.map(brand => (
                  <label key={brand.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.id)}
                      onChange={() => handleFilterChange('brands', brand.id)}
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 价格区间筛选 */}
            <div className="filter-section">
              <h4><FontAwesomeIcon icon={faShoppingCart} className="filter-section-icon" /> 价格区间</h4>
              
              {/* 快速价格区间选择 */}
              <div className="price-quick-filters">
                <button 
                  className={`price-range-btn ${filters.minPrice === '0' && filters.maxPrice === '100' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters({...filters, minPrice: '0', maxPrice: '100'});
                    searchParams.set('minPrice', '0');
                    searchParams.set('maxPrice', '100');
                    setSearchParams(searchParams);
                  }}
                >
                  ¥0-100
                </button>
                <button 
                  className={`price-range-btn ${filters.minPrice === '100' && filters.maxPrice === '500' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters({...filters, minPrice: '100', maxPrice: '500'});
                    searchParams.set('minPrice', '100');
                    searchParams.set('maxPrice', '500');
                    setSearchParams(searchParams);
                  }}
                >
                  ¥100-500
                </button>
                <button 
                  className={`price-range-btn ${filters.minPrice === '500' && filters.maxPrice === '1000' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters({...filters, minPrice: '500', maxPrice: '1000'});
                    searchParams.set('minPrice', '500');
                    searchParams.set('maxPrice', '1000');
                    setSearchParams(searchParams);
                  }}
                >
                  ¥500-1000
                </button>
                <button 
                  className={`price-range-btn ${filters.minPrice === '1000' && filters.maxPrice === '' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters({...filters, minPrice: '1000', maxPrice: ''});
                    searchParams.set('minPrice', '1000');
                    searchParams.delete('maxPrice');
                    setSearchParams(searchParams);
                  }}
                >
                  ¥1000以上
                </button>
              </div>
              
              <div className="price-filter">
                <input
                  type="number"
                  placeholder="最低价"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="最高价"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
                <button onClick={applyPriceFilter}>确定</button>
              </div>
            </div>
            
            {/* 关闭按钮（移动端使用） */}
            <button 
              className="close-filters-mobile"
              onClick={() => setFilterVisible(false)}
            >
              关闭筛选
            </button>
          </div>
          
          {/* 主内容区 */}
          <div className="search-main">
            {/* 排序工具栏 */}
            <div className="search-toolbar">
              <button 
                className="filter-toggle-mobile"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <FontAwesomeIcon icon={faFilter} /> 筛选
              </button>
              
              <div className="sort-options">
                <button 
                  className={sortBy === 'relevance' ? 'active' : ''}
                  onClick={() => handleSortChange('relevance')}
                >
                  <FontAwesomeIcon icon={faSortAmountDown} /> 综合排序
                </button>
                <button 
                  className={sortBy === 'sales' ? 'active' : ''}
                  onClick={() => handleSortChange('sales')}
                >
                  <FontAwesomeIcon icon={faSortNumericDown} /> 销量
                </button>
                <button 
                  className={sortBy === 'rating' ? 'active' : ''}
                  onClick={() => handleSortChange('rating')}
                >
                  <FontAwesomeIcon icon={faStar} /> 评价
                </button>
                <button 
                  className={sortBy === 'price_asc' ? 'active' : ''}
                  onClick={() => handleSortChange('price_asc')}
                >
                  <FontAwesomeIcon icon={faSortAmountUp} /> 价格↑
                </button>
                <button 
                  className={sortBy === 'price_desc' ? 'active' : ''}
                  onClick={() => handleSortChange('price_desc')}
                >
                  <FontAwesomeIcon icon={faSortAmountDown} /> 价格↓
                </button>
                <button 
                  className={sortBy === 'newest' ? 'active' : ''}
                  onClick={() => handleSortChange('newest')}
                >
                  最新
                </button>
              </div>
            </div>
            
            {/* AI搜索助手建议 */}
            {aiSuggestions && (
              <div className="ai-search-suggestions">
                <div className="ai-suggestion-content">
                  <FontAwesomeIcon icon={faLightbulb} className="ai-icon" />
                  <div className="ai-text">
                    <p>{aiSuggestions.suggestion}</p>
                    <div className="related-searches">
                      {aiSuggestions.relatedTerms.map((term, index) => (
                        <button 
                          key={index}
                          onClick={() => handleRelatedSearchClick(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 搜索结果 */}
            {isLoading ? (
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <p>正在搜索，请稍候...</p>
              </div>
            ) : error ? (
              <div className="search-error">
                <p>{error}</p>
              </div>
            ) : paginatedResults.length > 0 ? (
              <div className="search-results">
                {paginatedResults.map((product, index) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : query ? (
              <div className="no-results">
                <p>抱歉，没有找到与"{query}"相关的商品</p>
                <div className="empty-search-suggestions">
                  <h3>你可以尝试：</h3>
                  <ul>
                    <li>检查你的拼写</li>
                    <li>使用更通用的关键词</li>
                    <li>减少筛选条件</li>
                    <li>尝试使用以下热门搜索词</li>
                  </ul>
                  <div className="hot-search-terms">
                    {hotSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleHotSearchClick(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="start-search">
                <p>请在上方搜索框输入关键词开始搜索</p>
                
                {/* 搜索历史 */}
                {searchHistory.length > 0 && (
                  <div className="search-history-section">
                    <div className="history-header">
                      <h3>
                        <FontAwesomeIcon icon={faHistory} /> 搜索历史
                      </h3>
                      <button 
                        className="clear-history"
                        onClick={handleClearHistory}
                      >
                        <FontAwesomeIcon icon={faTimes} /> 清除
                      </button>
                    </div>
                    <div className="history-items">
                      {searchHistory.map((item, index) => (
                        <div 
                          key={index}
                          className="history-item"
                          onClick={() => handleHistoryClick(item)}
                        >
                          <FontAwesomeIcon icon={faClock} />
                          <span>{item.query}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 热门搜索 */}
                <div className="hot-search-section">
                  <h3>热门搜索</h3>
                  <div className="hot-search-terms">
                    {hotSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleHotSearchClick(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 分页控件 */}
            {paginatedResults.length > 0 && renderPagination()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Search; 