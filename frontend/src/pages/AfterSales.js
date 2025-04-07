import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingBag, 
  faChevronRight, 
  faSearch, 
  faFilter,
  faCommentDots,
  faHeadset,
  faRobot,
  faClipboardCheck,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import AfterSalesAssistant from '../components/ai/AfterSalesAssistant';
import { getUserOrders } from '../services/userService';
import '../styles/afterSales.css';

const AfterSales = () => {
  // 组件状态
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: '您好，很高兴为您提供售后服务，有什么可以帮到您的吗？', time: new Date() }
  ]);
  const [userInput, setUserInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([
    '我收到的商品有质量问题',
    '我想申请退货',
    '商品与描述不符',
    '订单物流问题'
  ]);
  
  // 加载用户订单
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders(1, 10); // 正确传递参数
        const orderData = response.orders; // 从返回对象中获取 orders 数组
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        console.error('获取订单失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // 处理搜索和筛选
  useEffect(() => {
    if (!orders.length) return;
    
    let results = [...orders];
    
    // 应用搜索词
    if (searchTerm) {
      results = results.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 应用状态筛选
    if (statusFilter !== 'all') {
      results = results.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(results);
  }, [searchTerm, statusFilter, orders]);
  
  // 处理订单选择
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setSelectedIssueType('');
  };
  
  // 处理解决方案选择
  const handleSolutionSelect = (issueType, solution) => {
    // 这里可以实现解决方案的具体处理逻辑
    console.log(`选择了问题类型 ${issueType} 的解决方案: ${solution}`);
  };
  
  // 联系人工客服
  const handleContactSupport = () => {
    setShowChat(true);
  };
  
  // 发送聊天消息
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // 添加用户消息
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userInput, time: new Date() }
    ]);
    
    // 清空输入框
    setUserInput('');
    
    // 模拟客服回复
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'agent', 
          text: '感谢您的咨询，我正在为您处理相关问题，请稍等片刻...', 
          time: new Date() 
        }
      ]);
    }, 1000);
  };
  
  // 使用AI建议
  const handleUseSuggestion = (suggestion) => {
    setUserInput(suggestion);
  };
  
  // 渲染订单列表
  const renderOrderList = () => {
    if (loading) {
      return (
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>加载订单中...</p>
        </div>
      );
    }
    
    if (filteredOrders.length === 0) {
      return (
        <div className="no-orders">
          <FontAwesomeIcon icon={faShoppingBag} size="3x" />
          <p>没有找到符合条件的订单</p>
          {searchTerm || statusFilter !== 'all' ? (
            <button className="clear-filter-btn" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              清除筛选条件
            </button>
          ) : (
            <Link to="/" className="go-shopping-btn">去购物</Link>
          )}
        </div>
      );
    }
    
    return (
      <div className="order-list">
        {filteredOrders.map(order => (
          <div 
            key={order.id}
            className={`order-item ${selectedOrder && selectedOrder.id === order.id ? 'selected' : ''}`}
            onClick={() => handleOrderSelect(order)}
          >
            <div className="order-header">
              <div className="order-id">订单号: {order.id}</div>
              <div className={`order-status ${order.status}`}>
                {order.status === 'completed' ? '已完成' : 
                 order.status === 'shipping' ? '配送中' : 
                 order.status === 'processing' ? '处理中' : '已取消'}
              </div>
            </div>
            
            <div className="order-products">
              {order.items.map(item => (
                <div key={item.id} className="order-product">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="product-thumbnail"
                  />
                  <div className="product-info">
                    <div className="product-name">{item.name}</div>
                    <div className="product-price">
                      ¥{item.price} × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <div className="order-date">
                下单时间: {new Date(order.date).toLocaleDateString()}
              </div>
              <div className="order-amount">
                总计: ¥{order.totalAmount.toFixed(2)}
              </div>
            </div>
            
            <FontAwesomeIcon icon={faChevronRight} className="order-icon" />
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Navbar />
      
      <div className="after-sales-container">
        <div className="after-sales-header">
          <h1 className="after-sales-title">售后服务中心</h1>
          <p className="after-sales-subtitle">
            <FontAwesomeIcon icon={faRobot} className="ai-icon" />
            智能售后助手帮您快速解决问题
          </p>
        </div>
        
        <div className="after-sales-content">
          {/* 左侧订单列表 */}
          <div className="orders-section">
            <div className="orders-header">
              <h2 className="section-title">我的订单</h2>
              
              <div className="orders-filter">
                <div className="search-box">
                  <input 
                    type="text"
                    placeholder="搜索订单编号或商品名称"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
                
                <div className="status-filter">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">所有状态</option>
                    <option value="completed">已完成</option>
                    <option value="shipping">配送中</option>
                    <option value="processing">处理中</option>
                    <option value="canceled">已取消</option>
                  </select>
                  <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                </div>
              </div>
            </div>
            
            {renderOrderList()}
          </div>
          
          {/* 右侧售后助手 */}
          <div className="assistant-section">
            {selectedOrder ? (
              <AfterSalesAssistant 
                order={selectedOrder}
                issueType={selectedIssueType}
                onSolutionSelect={handleSolutionSelect}
                onContactSupport={handleContactSupport}
              />
            ) : (
              <div className="assistant-placeholder">
                <FontAwesomeIcon icon={faClipboardCheck} size="3x" className="placeholder-icon" />
                <h3>请选择需要售后服务的订单</h3>
                <p>选择左侧订单后，AI售后助手将帮您解决问题</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 人工客服聊天窗口 */}
      {showChat && (
        <div className="support-chat">
          <div className="chat-header">
            <div className="chat-title">
              <FontAwesomeIcon icon={faHeadset} />
              <span>客服中心</span>
            </div>
            <button 
              className="close-chat"
              onClick={() => setShowChat(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div 
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'agent-message'}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
                <div className="message-time">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="ai-suggestions">
            {aiSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="ai-suggestion-chip"
                onClick={() => handleUseSuggestion(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input 
              type="text"
              placeholder="请输入您的问题..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-message-btn"
              onClick={handleSendMessage}
            >
              <FontAwesomeIcon icon={faCommentDots} />
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AfterSales;