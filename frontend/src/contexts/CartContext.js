import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建购物车上下文
const CartContext = createContext();

// 创建购物车提供者组件
export const CartProvider = ({ children }) => {
  // 购物车状态
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  // 新增状态管理
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [userBehavior, setUserBehavior] = useState({
    browsingHistory: [],
    searchQueries: [],
    categoryPreferences: {},
    priceRangePreferences: {}
  });

  // 从本地存储加载购物车
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedSavedItems = localStorage.getItem('savedForLater');
    const storedHistory = localStorage.getItem('purchaseHistory');
    const storedBehavior = localStorage.getItem('userBehavior');
    
    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedSavedItems) setSavedForLater(JSON.parse(storedSavedItems));
    if (storedHistory) setPurchaseHistory(JSON.parse(storedHistory));
    if (storedBehavior) setUserBehavior(JSON.parse(storedBehavior));
  }, []);

  // 更新购物车总数和总价
  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
    
    // 保存到本地存储
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // 获取AI推荐
    if (cartItems.length > 0) {
      fetchAiRecommendations(cartItems);
    } else {
      setAiRecommendations([]);
    }
  }, [cartItems]);

  // 保存其他状态到本地存储
  useEffect(() => {
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
  }, [savedForLater]);
  
  useEffect(() => {
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);
  
  useEffect(() => {
    localStorage.setItem('userBehavior', JSON.stringify(userBehavior));
  }, [userBehavior]);

  // 模拟从AI服务获取推荐
  const fetchAiRecommendations = (items) => {
    // 在真实环境中，这里应该调用后端API
    setTimeout(() => {
      // 基于购物车项目的模拟推荐
      const categories = [...new Set(items.map(item => item.category))];
      const priceRange = {
        min: Math.min(...items.map(item => item.price)),
        max: Math.max(...items.map(item => item.price)),
        avg: items.reduce((sum, item) => sum + item.price, 0) / items.length
      };
      
      // 模拟推荐产品
      const mockRecommendations = [
        {
          id: 601,
          name: "智能空气净化器",
          price: 199.99,
          image: "/images/products/airpurifier.jpg",
          description: "与您购物车中的智能家居产品完美搭配",
          matchScore: 92,
          discount: "15%",
          saleEnds: "3天后结束"
        },
        {
          id: 602,
          name: "高级护肤套装",
          price: 259.99,
          image: "/images/products/skincare.jpg",
          description: "基于您的购买历史和偏好推荐",
          matchScore: 89,
          discount: "满300减50",
          saleEnds: "5天后结束"
        },
        {
          id: 603,
          name: "多功能厨房电器",
          price: 349.99,
          image: "/images/products/kitchenappliance.jpg",
          description: "基于您浏览的相关产品推荐",
          matchScore: 85,
          discount: "限时8折",
          saleEnds: "今日结束"
        }
      ];
      
      // 筛选与当前购物车更相关的推荐
      const filtered = mockRecommendations.filter(rec => {
        // 避免推荐已在购物车中的商品
        return !items.some(item => item.id === rec.id);
      });
      
      setAiRecommendations(filtered);
    }, 1000);
  };

  // 添加商品到购物车
  const addToCart = (product) => {
    setLastAddedItem(product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // 更新用户行为数据
    trackUserBehavior('add_to_cart', product);
  };

  // 从购物车移除商品
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // 更新用户行为数据
    trackUserBehavior('remove_from_cart', { id: productId });
  };

  // 更新购物车中商品数量
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
    
    // 更新用户行为数据
    trackUserBehavior('update_quantity', { id: productId, quantity });
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
    trackUserBehavior('clear_cart');
  };
  
  // 保存商品供以后购买
  const saveForLater = (productId) => {
    const itemToSave = cartItems.find(item => item.id === productId);
    
    if (itemToSave) {
      setSavedForLater(prev => [...prev, itemToSave]);
      removeFromCart(productId);
      trackUserBehavior('save_for_later', itemToSave);
    }
  };
  
  // 将保存的商品移回购物车
  const moveToCart = (productId) => {
    const itemToMove = savedForLater.find(item => item.id === productId);
    
    if (itemToMove) {
      addToCart(itemToMove);
      setSavedForLater(prev => prev.filter(item => item.id !== productId));
      trackUserBehavior('move_to_cart', itemToMove);
    }
  };
  
  // 完成购买并记录历史
  const completePurchase = (orderDetails) => {
    if (cartItems.length === 0) return false;
    
    // 记录购买历史
    const purchaseRecord = {
      orderId: `ORD-${Date.now()}`,
      items: [...cartItems],
      totalAmount: totalPrice,
      date: new Date().toISOString(),
      ...orderDetails
    };
    
    setPurchaseHistory(prev => [purchaseRecord, ...prev]);
    
    // 清空购物车
    clearCart();
    
    // 更新用户行为
    trackUserBehavior('complete_purchase', purchaseRecord);
    
    return purchaseRecord.orderId;
  };
  
  // 跟踪用户行为
  const trackUserBehavior = (action, data) => {
    const timestamp = new Date().toISOString();
    
    setUserBehavior(prev => {
      // 根据行为类型更新不同的统计数据
      const updated = { ...prev };
      
      // 更新分类偏好
      if (data && data.category) {
        const categoryCount = prev.categoryPreferences[data.category] || 0;
        updated.categoryPreferences = {
          ...prev.categoryPreferences,
          [data.category]: categoryCount + 1
        };
      }
      
      // 更新价格范围偏好
      if (data && data.price) {
        let priceRange;
        if (data.price < 50) priceRange = 'budget';
        else if (data.price < 200) priceRange = 'mid-range';
        else priceRange = 'premium';
        
        const rangeCount = prev.priceRangePreferences[priceRange] || 0;
        updated.priceRangePreferences = {
          ...prev.priceRangePreferences,
          [priceRange]: rangeCount + 1
        };
      }
      
      // 记录活动到浏览历史
      updated.browsingHistory = [
        { action, timestamp, data: data ? { ...data } : null },
        ...prev.browsingHistory.slice(0, 49) // 保留最近50条
      ];
      
      return updated;
    });
  };
  
  // 获取用户偏好分析
  const getUserPreferences = () => {
    // 分析用户行为并返回偏好摘要
    const { categoryPreferences, priceRangePreferences } = userBehavior;
    
    // 查找最喜欢的分类
    let favoriteCategory = null;
    let maxCategoryCount = 0;
    
    Object.entries(categoryPreferences).forEach(([category, count]) => {
      if (count > maxCategoryCount) {
        favoriteCategory = category;
        maxCategoryCount = count;
      }
    });
    
    // 查找价格范围偏好
    let priceRangePreference = 'mid-range'; // 默认
    let maxRangeCount = 0;
    
    Object.entries(priceRangePreferences).forEach(([range, count]) => {
      if (count > maxRangeCount) {
        priceRangePreference = range;
        maxRangeCount = count;
      }
    });
    
    return {
      favoriteCategory,
      priceRangePreference,
      recentPurchases: purchaseHistory.slice(0, 3)
    };
  };

  // 提供给组件的上下文值
  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    aiRecommendations,
    savedForLater,
    saveForLater,
    moveToCart,
    purchaseHistory,
    completePurchase,
    lastAddedItem,
    getUserPreferences,
    trackUserBehavior
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 创建使用购物车上下文的自定义钩子
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 