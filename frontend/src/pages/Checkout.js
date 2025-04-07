import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faMapMarkerAlt, 
  faUser, 
  faPhone, 
  faEdit, 
  faPlus, 
  faShoppingCart, 
  faCreditCard, 
  faTrash,
  faFileInvoice,
  faCommentDots,
  faTag,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import AiCheckoutAssistant from '../components/ai/AiCheckoutAssistant';
import '../styles/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getTotalDiscount, clearCart } = useCart();
  
  // AI推荐状态
  const [aiRecommendationMessage, setAiRecommendationMessage] = useState('');
  const [showRecommendationMessage, setShowRecommendationMessage] = useState(false);
  
  // 收货地址状态
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: '张三',
      phone: '138****1234',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      address: '张江高科技园区博云路2号',
      isDefault: true
    },
    {
      id: 2,
      name: '李四',
      phone: '139****5678',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      address: '清华大学家属区3号楼',
      isDefault: false
    }
  ]);
  
  // 支付方式状态
  const [paymentMethods] = useState([
    { id: 'alipay', name: '支付宝', icon: 'alipay.png', iconColor: '#1677FF' },
    { id: 'wechat', name: '微信支付', icon: 'wechat.png', iconColor: '#07C160' },
    { id: 'card', name: '银行卡支付', icon: 'card.png', iconColor: '#FF6A00' }
  ]);
  
  // 选中的地址和支付方式
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(addr => addr.isDefault) || addresses[0]);
  const [selectedPayment, setSelectedPayment] = useState('alipay');
  
  // 发票信息
  const [invoiceType, setInvoiceType] = useState('personal');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceTaxNumber, setInvoiceTaxNumber] = useState('');
  
  // 订单留言
  const [orderMessage, setOrderMessage] = useState('');
  
  // 处理订单提交
  const handleSubmitOrder = () => {
    if (!selectedAddress) {
      alert('请选择收货地址');
      return;
    }
    
    if (!selectedPayment) {
      alert('请选择支付方式');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('购物车为空，无法下单');
      return;
    }
    
    // 模拟处理订单提交
    alert('订单已提交成功！');
    clearCart(); // 清空购物车
    navigate('/order/success'); // 跳转到订单成功页面
  };
  
  // 计算运费（模拟计算）
  const calculateShipping = () => {
    const total = getCartTotal();
    return total > 99 ? 0 : 10;
  };
  
  // 计算应付金额
  const calculatePayable = () => {
    return getCartTotal() + calculateShipping();
  };

  // 添加新地址
  const handleAddAddress = () => {
    // 这里应该弹出一个表单让用户填写新地址
    alert('添加新地址功能暂未实现');
  };
  
  // 处理AI推荐
  const handleApplyRecommendation = (message) => {
    setAiRecommendationMessage(message);
    setShowRecommendationMessage(true);
    
    // 5秒后隐藏提示
    setTimeout(() => {
      setShowRecommendationMessage(false);
    }, 5000);
  };
  
  return (
    <>
      <Navbar />
      <div className="checkout-container">
        {/* AI推荐提示消息 */}
        {showRecommendationMessage && (
          <div className="ai-recommendation-message">
            <FontAwesomeIcon icon={faCheckCircle} className="recommendation-icon" />
            <span>{aiRecommendationMessage}</span>
            <button 
              className="close-recommendation"
              onClick={() => setShowRecommendationMessage(false)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
        
        <div className="checkout-breadcrumb">
          <Link to="/cart" className="back-link">
            <FontAwesomeIcon icon={faChevronLeft} className="back-icon" />
            返回购物车
          </Link>
          <h1 className="checkout-title">确认订单</h1>
        </div>
        
        {/* 收货地址卡片 */}
        <div className="checkout-card">
          <div className="checkout-card-header">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="checkout-card-icon" />
            <h2 className="checkout-card-title">收货地址</h2>
          </div>
          
          <div className="address-list">
            {addresses.map(address => (
              <div 
                key={address.id}
                className={`address-item ${selectedAddress && selectedAddress.id === address.id ? 'selected' : ''}`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className="address-info">
                  <div className="address-name-phone">
                    <div className="address-name">
                      <FontAwesomeIcon icon={faUser} className="address-icon" />
                      {address.name}
                    </div>
                    <div className="address-phone">
                      <FontAwesomeIcon icon={faPhone} className="address-icon" />
                      {address.phone}
                    </div>
                  </div>
                  <div className="address-location">
                    {address.isDefault && <span className="address-badge">默认</span>}
                    {address.province} {address.city} {address.district} {address.address}
                  </div>
                </div>
                <div className="address-actions">
                  <button 
                    className="address-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 编辑地址逻辑（暂未实现）
                      alert('编辑地址功能暂未实现');
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="add-address-btn" onClick={handleAddAddress}>
              <FontAwesomeIcon icon={faPlus} className="add-address-icon" />
              <span className="add-address-text">添加新地址</span>
            </div>
          </div>
        </div>
        
        {/* 商品清单卡片 */}
        <div className="checkout-card">
          <div className="checkout-card-header">
            <FontAwesomeIcon icon={faShoppingCart} className="checkout-card-icon" />
            <h2 className="checkout-card-title">商品清单</h2>
          </div>
          
          <div className="product-list">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="product-item">
                <img 
                  src={item.image || 'https://via.placeholder.com/80'} 
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-details">
                  <div className="product-name">
                    {item.name}
                  </div>
                  {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                    <div className="product-attributes">
                      {Object.entries(item.selectedAttributes).map(([key, value], idx) => (
                        <span key={key}>
                          {key}: {value}
                          {idx < Object.keys(item.selectedAttributes).length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="product-price">
                    <span className="product-current-price">¥{item.price}</span>
                    <span className="product-quantity">× {item.quantity}</span>
                  </div>
                </div>
                <div className="product-subtotal">
                  ¥{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 支付方式卡片 */}
        <div className="checkout-card">
          <div className="checkout-card-header">
            <FontAwesomeIcon icon={faCreditCard} className="checkout-card-icon" />
            <h2 className="checkout-card-title">支付方式</h2>
          </div>
          
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <div 
                key={method.id}
                className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedPayment(method.id)}
              >
                {/* 使用FontAwesome图标替代实际图片 */}
                <FontAwesomeIcon 
                  icon={method.id === 'alipay' ? ['fab', 'alipay'] : method.id === 'wechat' ? ['fab', 'weixin'] : faCreditCard} 
                  className="payment-icon"
                  style={{ color: method.iconColor }}
                />
                <span className="payment-name">{method.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 发票信息卡片 */}
        <div className="checkout-card">
          <div className="checkout-card-header">
            <FontAwesomeIcon icon={faFileInvoice} className="checkout-card-icon" />
            <h2 className="checkout-card-title">发票信息</h2>
          </div>
          
          <div className="invoice-types">
            <label className="invoice-type">
              <input
                type="radio"
                name="invoiceType"
                value="personal"
                checked={invoiceType === 'personal'}
                onChange={() => setInvoiceType('personal')}
                className="invoice-radio"
              />
              <span className="invoice-label">个人发票</span>
            </label>
            
            <label className="invoice-type">
              <input
                type="radio"
                name="invoiceType"
                value="company"
                checked={invoiceType === 'company'}
                onChange={() => setInvoiceType('company')}
                className="invoice-radio"
              />
              <span className="invoice-label">企业发票</span>
            </label>
          </div>
          
          {invoiceType === 'company' && (
            <>
              <div className="invoice-form-group">
                <label className="invoice-form-label">发票抬头</label>
                <input 
                  type="text" 
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  placeholder="请输入公司名称"
                  className="invoice-input"
                />
              </div>
              
              <div className="invoice-form-group">
                <label className="invoice-form-label">税号</label>
                <input 
                  type="text" 
                  value={invoiceTaxNumber}
                  onChange={(e) => setInvoiceTaxNumber(e.target.value)}
                  placeholder="请输入纳税人识别号"
                  className="invoice-input"
                />
              </div>
            </>
          )}
        </div>
        
        {/* 订单留言卡片 */}
        <div className="checkout-card">
          <div className="checkout-card-header">
            <FontAwesomeIcon icon={faCommentDots} className="checkout-card-icon" />
            <h2 className="checkout-card-title">订单留言</h2>
          </div>
          
          <div>
            <label className="order-message-label">留言内容</label>
            <textarea 
              value={orderMessage}
              onChange={(e) => setOrderMessage(e.target.value)}
              placeholder="选填，可以告诉我们您对订单的特殊要求"
              className="order-message-textarea"
            />
          </div>
        </div>
        
        {/* 结算卡片 */}
        <div className="checkout-card">
          <div className="order-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>商品总金额：</span>
                <span>¥{(getCartTotal() + getTotalDiscount()).toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>优惠：</span>
                <span className="summary-discount">-¥{getTotalDiscount().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>运费：</span>
                <span>{calculateShipping() > 0 ? `¥${calculateShipping().toFixed(2)}` : '免运费'}</span>
              </div>
              
              <div className="summary-total">
                <span className="summary-total-label">应付金额：</span>
                <span className="summary-total-amount">¥{calculatePayable().toFixed(2)}</span>
              </div>
              
              <div className="summary-shipping-info">
                <div className="summary-shipping-address">
                  寄送至：{selectedAddress ? `${selectedAddress.province} ${selectedAddress.city} ${selectedAddress.district} ${selectedAddress.address}` : '请选择收货地址'}
                </div>
                <div className="summary-shipping-person">
                  收货人：{selectedAddress ? `${selectedAddress.name} ${selectedAddress.phone}` : '请选择收货地址'}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="submit-order-btn"
            onClick={handleSubmitOrder}
            disabled={cartItems.length === 0}
          >
            提交订单
          </button>
        </div>
      </div>
      
      {/* AI结算助手 */}
      <AiCheckoutAssistant 
        cartItems={cartItems}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        orderMessage={orderMessage}
        setOrderMessage={setOrderMessage}
        onApplyRecommendation={handleApplyRecommendation}
      />
    </>
  );
};

export default Checkout; 