import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faAngleLeft,
  faAngleRight,
  faFileAlt,
  faShippingFast,
  faCheck,
  faTimes,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { getUserOrders } from '../../services/userService';
import './user-orders.css';

const OrderStatusBadge = ({ status }) => {
  let statusText = '';
  let statusIcon = null;
  let className = '';

  // 设置状态标签样式
  switch (status) {
    case 'pending':
      statusText = '待付款';
      statusIcon = faExclamationTriangle;
      className = 'status-pending';
      break;
    case 'processing':
      statusText = '处理中';
      statusIcon = faFileAlt;
      className = 'status-processing';
      break;
    case 'shipping':
      statusText = '配送中';
      statusIcon = faShippingFast;
      className = 'status-shipping';
      break;
    case 'completed':
      statusText = '已完成';
      statusIcon = faCheck;
      className = 'status-completed';
      break;
    case 'cancelled':
      statusText = '已取消';
      statusIcon = faTimes;
      className = 'status-cancelled';
      break;
    default:
      statusText = '未知状态';
      className = 'status-unknown';
  }

  return (
    <span className={`order-status-badge ${className}`}>
      {statusIcon && <FontAwesomeIcon icon={statusIcon} />}
      {statusText}
    </span>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 加载订单数据
  const loadOrders = async (page, status = 'all') => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserOrders(page);
      setOrders(result.orders);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError('获取订单失败，请稍后再试');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新加载
  useEffect(() => {
    loadOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // 处理页面变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 处理状态筛选变化
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理搜索变化
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 处理搜索提交
  const handleSearch = (e) => {
    e.preventDefault();
    // 实际项目中，这里应该调用API进行搜索
    console.log('搜索订单:', searchTerm);
  };

  // 格式化日期
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

  return (
    <div className="user-orders-container">
      <div className="section-header">
        <h2>我的订单</h2>
        <div className="order-actions">
          <div className="search-box">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="搜索订单号或商品名称"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
          <div className="filter-box">
            <FontAwesomeIcon icon={faFilter} />
            <select 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
            >
              <option value="all">全部订单</option>
              <option value="pending">待付款</option>
              <option value="processing">处理中</option>
              <option value="shipping">配送中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
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
          <p>加载订单中...</p>
        </div>
      ) : (
        <>
          {/* 订单列表 */}
          {orders.length === 0 ? (
            <div className="empty-orders">
              <p>没有找到订单记录</p>
              <Link to="/" className="shop-now-btn">去购物</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">订单号: {order.id}</span>
                      <span className="order-date">下单时间: {formatDate(order.date)}</span>
                    </div>
                    <div className="order-status">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                  
                  <div className="order-products">
                    {order.items.map(item => (
                      <div className="order-product" key={item.id}>
                        <div className="product-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="product-info">
                          <h4>{item.name}</h4>
                          <p className="product-price">
                            ¥{item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-amount">
                      <span>实付金额:</span>
                      <span className="amount">¥{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="order-actions-buttons">
                      <Link 
                        to={`/user/orders/${order.id}`} 
                        className="action-button view-details"
                      >
                        查看详情
                      </Link>
                      
                      {/* 根据订单状态显示不同的操作按钮 */}
                      {order.status === 'pending' && (
                        <button className="action-button pay-now">
                          立即付款
                        </button>
                      )}
                      
                      {order.status === 'shipping' && (
                        <button className="action-button confirm-receipt">
                          确认收货
                        </button>
                      )}
                      
                      {(order.status === 'completed' || order.status === 'shipping') && (
                        <button className="action-button track-order">
                          查看物流
                        </button>
                      )}
                      
                      {(order.status === 'completed') && (
                        <button className="action-button review">
                          评价
                        </button>
                      )}
                      
                      {(order.status === 'pending') && (
                        <button className="action-button cancel">
                          取消订单
                        </button>
                      )}
                    </div>
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

export default UserOrders; 