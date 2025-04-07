import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faShoppingCart, 
  faTrashAlt,
  faAngleLeft,
  faAngleRight,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { getFavorites, removeFromFavorites } from '../../services/userService';
import { useCart } from '../../contexts/CartContext';
import './user-favorites.css';

const UserFavorites = () => {
  const [allFavorites, setAllFavorites] = useState([]);
  const [displayedFavorites, setDisplayedFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRemoving, setIsRemoving] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useCart();
  const itemsPerPage = 10;

  // 加载收藏列表
  const loadFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      // 获取收藏列表
      const favoritesData = await getFavorites();
      setAllFavorites(favoritesData || []);
      
      // 计算总页数
      const calculatedTotalPages = Math.ceil((favoritesData?.length || 0) / itemsPerPage);
      setTotalPages(calculatedTotalPages || 1);
      
      // 更新显示的商品
      updateDisplayedFavorites(favoritesData || [], currentPage);
    } catch (err) {
      setError('获取收藏列表失败，请稍后再试');
      console.error('Error fetching favorites:', err);
      // 确保即使出错也设置一个空数组，避免undefined错误
      setAllFavorites([]);
      setDisplayedFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // 更新当前页显示的收藏项目
  const updateDisplayedFavorites = (favorites, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedFavorites(favorites.slice(startIndex, endIndex));
  };

  // 初始加载
  useEffect(() => {
    loadFavorites();
  }, []);

  // 页面变化时更新显示的收藏项目
  useEffect(() => {
    updateDisplayedFavorites(allFavorites, currentPage);
  }, [currentPage, allFavorites]);

  // 处理页面变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 格式化价格显示
  const formatPrice = (price) => {
    // 确保price是数字
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    // 处理非数字或NaN的情况
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  // 移除收藏商品
  const handleRemove = async (productId) => {
    setIsRemoving(prev => ({ ...prev, [productId]: true }));

    try {
      await removeFromFavorites(productId);
      // 更新状态，从列表中移除商品
      const updatedFavorites = allFavorites.filter(item => item.id !== productId);
      setAllFavorites(updatedFavorites);
      
      // 如果当前页变为空并且不是第一页，回到上一页
      if (updatedFavorites.length > 0 && currentPage > 1 && 
          (currentPage - 1) * itemsPerPage >= updatedFavorites.length) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('移除收藏失败:', err);
    } finally {
      setIsRemoving(prev => ({ ...prev, [productId]: false }));
    }
  };

  // 添加到购物车
  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await addToCart(product, 1);
      // 显示添加成功的消息
      // 注意：实际项目中，应该使用一个通知/消息组件来显示反馈
      console.log('添加到购物车成功:', product.id);
    } catch (err) {
      console.error('添加到购物车失败:', err);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className="user-favorites-container">
      <div className="section-header">
        <h2>我的收藏</h2>
        <div className="favorite-count">
          共 <span>{allFavorites.length}</span> 件商品
        </div>
      </div>

      {/* 显示错误信息 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载收藏中...</p>
        </div>
      ) : (
        <>
          {/* 收藏列表 */}
          {allFavorites.length === 0 ? (
            <div className="empty-favorites">
              <p>您还没有收藏任何商品</p>
              <Link to="/" className="shop-now-btn">去购物</Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {displayedFavorites.map(product => (
                <div className="favorite-card" key={product.id}>
                  <div className="favorite-image">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.image || '/images/placeholders/product-placeholder.png'} 
                        alt={product.name || product.title || '商品图片'} 
                        onError={(e) => {
                          // 图片加载失败时使用占位图
                          e.target.onerror = null;
                          e.target.src = '/images/placeholders/product-placeholder.png';
                        }}
                      />
                    </Link>
                    <div className="favorite-actions">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(product.id)}
                        disabled={isRemoving[product.id]}
                      >
                        {isRemoving[product.id] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faTrashAlt} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="favorite-info">
                    <Link to={`/product/${product.id}`} className="favorite-name">
                      {product.name || product.title || '未命名商品'}
                    </Link>
                    
                    <p className="favorite-description">
                      {product.description || '暂无描述'}
                    </p>
                    
                    <div className="favorite-meta">
                      <span className="favorite-price">
                        ¥{formatPrice(product.price)}
                      </span>
                      {product.addedAt && (
                        <span className="favorite-date">
                          收藏于 {formatDate(product.addedAt)}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product.id]}
                    >
                      {addingToCart[product.id] ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faShoppingCart} />
                      )}
                      加入购物车
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="page-button prev"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
                上一页
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="page-button next"
              >
                下一页
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserFavorites; 