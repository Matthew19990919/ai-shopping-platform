import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faHistory, 
  faTimes, 
  faFire,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { 
  getSearchSuggestions, 
  getSearchHistory, 
  clearSearchHistory,
  getHotSearchTerms
} from '../services/searchService';
import '../styles/SearchBox.css';

const SearchBox = ({ placeholder = '搜索商品、品牌、活动' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [hotTerms, setHotTerms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // 加载热门搜索和历史记录
  useEffect(() => {
    setHotTerms(getHotSearchTerms());
    updateSearchHistory();
  }, []);
  
  // 当搜索框内容变化时获取搜索建议
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    
    const getSuggestions = async () => {
      setIsLoading(true);
      try {
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error('获取搜索建议失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 使用防抖，避免频繁请求
    const timer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // 监听点击事件，点击外部时关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // 更新搜索历史
  const updateSearchHistory = () => {
    const history = getSearchHistory(5);
    setHistory(history);
  };
  
  // 处理搜索框获取焦点
  const handleFocus = () => {
    updateSearchHistory();
    setShowDropdown(true);
  };
  
  // 处理搜索提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };
  
  // 处理搜索建议或历史项点击
  const handleItemClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSearchQuery(term);
    setShowDropdown(false);
  };
  
  // 处理清除搜索历史
  const handleClearHistory = (e) => {
    e.stopPropagation();
    clearSearchHistory();
    setHistory([]);
  };
  
  // 处理键盘导航
  const handleKeyDown = (e) => {
    // 计算所有可选项的总数
    const allItems = [...suggestions, ...history, ...hotTerms];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prevIndex => 
        prevIndex < allItems.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prevIndex => 
        prevIndex > 0 ? prevIndex - 1 : allItems.length - 1
      );
    } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < allItems.length) {
      e.preventDefault();
      handleItemClick(allItems[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };
  
  // 清空搜索框
  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current.focus();
  };
  
  return (
    <div className="search-box-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input 
          ref={searchInputRef}
          type="text" 
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        {searchQuery && (
          <button 
            type="button"
            className="clear-search-btn"
            onClick={clearSearch}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        
        <button type="submit" className="search-button">
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faSearch} />
          )}
        </button>
      </form>
      
      {showDropdown && (
        <div ref={dropdownRef} className="search-dropdown">
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className="dropdown-section">
              <h3 className="dropdown-heading">搜索建议</h3>
              <ul className="suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={`suggestion-${index}`}
                    className={activeIndex === index ? 'active' : ''}
                    onClick={() => handleItemClick(suggestion)}
                  >
                    <FontAwesomeIcon icon={faSearch} className="item-icon" />
                    <span dangerouslySetInnerHTML={{ 
                      __html: suggestion.replace(
                        new RegExp(searchQuery, 'gi'), 
                        match => `<strong>${match}</strong>`
                      )
                    }} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* 搜索历史 */}
          {history.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-header">
                <h3 className="dropdown-heading">搜索历史</h3>
                <button 
                  className="clear-history-btn"
                  onClick={handleClearHistory}
                >
                  清除
                </button>
              </div>
              <ul className="history-list">
                {history.map((item, index) => (
                  <li 
                    key={`history-${index}`}
                    className={activeIndex === (suggestions.length + index) ? 'active' : ''}
                    onClick={() => handleItemClick(item.query)}
                  >
                    <FontAwesomeIcon icon={faHistory} className="item-icon" />
                    <span>{item.query}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* 热门搜索 */}
          {hotTerms.length > 0 && (
            <div className="dropdown-section">
              <h3 className="dropdown-heading">热门搜索</h3>
              <ul className="hot-terms-list">
                {hotTerms.map((term, index) => (
                  <li 
                    key={`hot-${index}`}
                    className={activeIndex === (suggestions.length + history.length + index) ? 'active' : ''}
                    onClick={() => handleItemClick(term)}
                  >
                    <FontAwesomeIcon icon={faFire} className="item-icon hot-icon" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {!suggestions.length && !history.length && !hotTerms.length && (
            <div className="no-results">
              <p>没有找到相关内容</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox; 