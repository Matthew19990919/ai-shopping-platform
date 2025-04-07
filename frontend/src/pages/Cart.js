import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faTrash, 
  faMinus, 
  faPlus, 
  faExclamationTriangle, 
  faChevronLeft,
  faSpinner,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import '../styles/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    loading, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart,
    clearCart,
    updateCartItemQuantity 
  } = useCart();
  
  const [quantities, setQuantities] = useState({});
  
  // 初始化各个商品的数量输入框
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);
  
  // 处理数量变更
  const handleQuantityChange = (e, itemId, maxQuantity) => {
    const newValue = parseInt(e.target.value) || 1;
    const validValue = Math.min(Math.max(newValue, 1), maxQuantity);
    
    setQuantities({
      ...quantities,
      [itemId]: validValue
    });
  };
  
  // 处理数量输入框失焦时更新购物车
  const handleQuantityBlur = (itemId) => {
    updateCartItemQuantity(itemId, quantities[itemId]);
  };
  
  // 渲染空购物车
  const renderEmptyCart = () => (
    <div className="empty-cart">
      <FontAwesomeIcon icon={faShoppingCart} className="empty-cart-icon" />
      <h3 className="empty-cart-title">您的购物车是空的</h3>
      <p className="empty-cart-subtitle">添加一些商品开始您的购物体验吧！</p>
      <Link to="/" className="shop-button">
        继续购物
      </Link>
    </div>
  );

  // 计算订单总额
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  // 计算总折扣金额
  const calculateTotalDiscount = useCallback(() => {
    return cartItems.reduce((discount, item) => {
      if (item.discountPrice) {
        return discount + (item.price - item.discountPrice) * item.quantity;
      }
      return discount;
    }, 0);
  }, [cartItems]);

  // 商品总数量
  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  // 加载中状态
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <div className="cart-breadcrumb">
            <Link to="/" className="back-link">
              <FontAwesomeIcon icon={faChevronLeft} className="back-icon" />
              返回首页
            </Link>
            <h1 className="cart-title">购物车</h1>
          </div>
          <div className="cart-content">
            <div className="cart-loading">
              <div className="loading-spinner"></div>
              <p>正在加载您的购物车...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <Link to="/" className="back-link">
            <FontAwesomeIcon icon={faChevronLeft} className="back-icon" />
            返回首页
          </Link>
          <h1 className="cart-title">购物车</h1>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            renderEmptyCart()
          ) : (
            <>
              <div className="cart-table-header">
                <div className="cart-product-info">商品信息</div>
                <div className="cart-unit-price">单价</div>
                <div className="cart-quantity">数量</div>
                <div className="cart-subtotal">小计</div>
                <div className="cart-actions">操作</div>
              </div>
              
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-product-details">
                    <div className="cart-product-image-container">
                      <img 
                        src={item.image || 'https://via.placeholder.com/80'} 
                        alt={item.name}
                        className="cart-product-image"
                      />
                    </div>
                    <div className="cart-product-text">
                      <h3 className="cart-product-name">
                        <Link to={`/product/${item.id}`} className="cart-product-link">
                          {item.name}
                        </Link>
                      </h3>
                      {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                        <div className="cart-product-attributes">
                          {Object.entries(item.selectedAttributes).map(([key, value]) => (
                            <span key={key}>{key}: {value} </span>
                          ))}
                        </div>
                      )}
                      {item.stock <= 5 && (
                        <div className="cart-stock-warning">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                          仅剩 {item.stock} 件
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="unit-price-container">
                    <span className="current-price">¥{item.discountPrice || item.price}</span>
                    {item.discountPrice && (
                      <span className="original-price">¥{item.price}</span>
                    )}
                  </div>
                  
                  <div className="quantity-control-container">
                    <div className="quantity-control">
                      <button 
                        className="quantity-button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="text"
                        className="quantity-input"
                        value={quantities[item.id] || item.quantity}
                        onChange={(e) => handleQuantityChange(e, item.id, item.stock)}
                        onBlur={() => handleQuantityBlur(item.id)}
                      />
                      <button 
                        className="quantity-button"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.stock}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="subtotal-container">
                    <span className="current-price">
                      ¥{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="cart-actions">
                    <button 
                      className="cart-action-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="action-icon" />
                      删除
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-footer">
                <button className="cart-clear-button" onClick={clearCart}>
                  <FontAwesomeIcon icon={faTimes} className="action-icon" />
                  清空购物车
                </button>
                
                <div className="cart-summary">
                  <div className="cart-count">
                    <span className="cart-count-text">共 {totalItems} 件商品</span>
                  </div>
                  
                  {calculateTotalDiscount() > 0 && (
                    <div className="cart-discount">
                      <span className="cart-discount-label">已优惠:</span>
                      <span className="cart-discount-amount">¥{calculateTotalDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="cart-total">
                    <span className="cart-total-label">合计:</span>
                    <span className="cart-total-amount">¥{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <Link to="/checkout" className="checkout-button">
                    去结算
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart; 