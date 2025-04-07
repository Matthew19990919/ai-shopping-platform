import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faComment,
  faRobot,
  faAngleLeft,
  faAngleRight,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { getAiShoppingHistory } from '../../services/userService';
import './user-ai-history.css';

const UserAiHistory = () => {
  const [aiHistory, setAiHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 加载AI历史记录
  const loadAiHistory = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAiShoppingHistory(page);
      setAiHistory(result.history);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError('获取AI购物记录失败，请稍后再试');
      console.error('Error fetching AI history:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadAiHistory(currentPage);
  }, [currentPage]);

  // 处理页面变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 格式化价格显示
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <div className="user-ai-history-container">
      <div className="section-header">
        <h2>AI购物记录</h2>
        <Link to="/ai-assistant" className="chat-with-ai-button">
          <FontAwesomeIcon icon={faRobot} />
          与AI助手对话
        </Link>
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
          <p>加载AI购物记录中...</p>
        </div>
      ) : (
        <>
          {/* AI购物历史记录列表 */}
          {aiHistory.length === 0 ? (
            <div className="empty-history">
              <p>您还没有使用AI购物助手</p>
              <Link to="/ai-assistant" className="ai-assistant-btn">立即体验AI导购</Link>
            </div>
          ) : (
            <div className="ai-history-list">
              {aiHistory.map(history => (
                <div className="ai-history-card" key={history.id}>
                  <div className="ai-history-header">
                    <div className="ai-history-time">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatDate(history.date)}</span>
                    </div>
                  </div>

                  <div className="ai-history-content">
                    <div className="user-query">
                      <FontAwesomeIcon icon={faComment} className="user-icon" />
                      <div className="query-text">
                        {history.query}
                      </div>
                    </div>

                    <div className="ai-response">
                      <FontAwesomeIcon icon={faRobot} className="ai-icon" />
                      <div className="response-content">
                        <div className="response-text">
                          {history.response}
                        </div>

                        {history.recommendations && history.recommendations.length > 0 && (
                          <div className="ai-recommendations">
                            {history.recommendations.map(product => (
                              <div className="ai-product-card" key={product.id}>
                                <Link to={`/product/${product.id}`} className="product-image">
                                  <img src={product.image} alt={product.name} />
                                </Link>
                                
                                <div className="product-info">
                                  <Link to={`/product/${product.id}`} className="product-name">
                                    {product.name}
                                  </Link>
                                  
                                  <div className="product-price">
                                    ¥{formatPrice(product.price)}
                                  </div>
                                  
                                  <Link to={`/product/${product.id}`} className="view-product-btn">
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    查看商品
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ai-history-footer">
                    <Link to="/ai-assistant" className="continue-chat-btn">
                      继续这个话题
                    </Link>
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

export default UserAiHistory; 