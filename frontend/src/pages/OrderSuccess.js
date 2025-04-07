import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faShoppingBag, 
  faHome, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import '../styles/orderSuccess.css';

// 模拟推荐商品数据
const recommendedProducts = [
  {
    id: 1,
    name: '2023新款轻薄笔记本电脑14英寸',
    price: 4299,
    image: 'https://via.placeholder.com/220x180/f5f5f5?text=笔记本电脑'
  },
  {
    id: 2,
    name: '智能蓝牙无线耳机 降噪长续航',
    price: 299,
    image: 'https://via.placeholder.com/220x180/f5f5f5?text=无线耳机'
  },
  {
    id: 3,
    name: '超薄便携充电宝 20000mAh大容量',
    price: 129,
    image: 'https://via.placeholder.com/220x180/f5f5f5?text=充电宝'
  },
  {
    id: 4,
    name: '智能手环 心率监测 运动防水',
    price: 199,
    image: 'https://via.placeholder.com/220x180/f5f5f5?text=智能手环'
  }
];

const OrderSuccess = () => {
  // 模拟订单数据
  const orderInfo = {
    orderId: '20230501' + Math.floor(Math.random() * 10000),
    orderTime: new Date().toLocaleString(),
    paymentMethod: '支付宝',
    total: 4299.00,
    address: '上海市浦东新区张江高科技园区博云路2号',
    recipient: '张三',
    phone: '138****1234'
  };
  
  // 倒计时自动跳转
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  return (
    <>
      <Navbar />
      <div className="success-container">
        <div className="success-card">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          <h1 className="success-title">订单提交成功</h1>
          <p className="success-message">
            您的订单已成功提交，我们将尽快为您安排发货。
            您可以在个人中心的"我的订单"中查看订单详情和物流信息。
          </p>
          
          <div className="success-info">
            <div className="info-row">
              <div className="info-label">订单编号：</div>
              <div className="info-value">{orderInfo.orderId}</div>
            </div>
            <div className="info-row">
              <div className="info-label">下单时间：</div>
              <div className="info-value">{orderInfo.orderTime}</div>
            </div>
            <div className="info-row">
              <div className="info-label">支付方式：</div>
              <div className="info-value">{orderInfo.paymentMethod}</div>
            </div>
            <div className="info-row">
              <div className="info-label">订单金额：</div>
              <div className="info-value">¥{orderInfo.total.toFixed(2)}</div>
            </div>
            <div className="info-row">
              <div className="info-label">收货地址：</div>
              <div className="info-value">{orderInfo.address}</div>
            </div>
            <div className="info-row">
              <div className="info-label">收货人：</div>
              <div className="info-value">{orderInfo.recipient} {orderInfo.phone}</div>
            </div>
          </div>
          
          <div className="success-actions">
            <Link to="/user/orders" className="action-button action-button-primary">
              <FontAwesomeIcon icon={faShoppingBag} style={{ marginRight: '8px' }} />
              查看我的订单
            </Link>
            <Link to="/" className="action-button action-button-outline">
              <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} />
              返回首页
            </Link>
          </div>
          
          <div className="countdown">
            <span>{countdown}秒后自动跳转到订单详情页面</span>
          </div>
        </div>
        
        <div className="recommendation-section">
          <h2 className="recommendation-title">您可能还喜欢</h2>
          <div className="recommendation-list">
            {recommendedProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="recommendation-item">
                <img src={product.image} alt={product.name} className="recommendation-image" />
                <div className="recommendation-content">
                  <div className="recommendation-name">{product.name}</div>
                  <div className="recommendation-price">¥{product.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess; 