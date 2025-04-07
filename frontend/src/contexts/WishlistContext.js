import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建收藏夹上下文
const WishlistContext = createContext();

// 创建收藏夹提供者组件
export const WishlistProvider = ({ children }) => {
  // 收藏夹状态
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从本地存储中获取收藏夹数据
  useEffect(() => {
    const loadWishlistItems = () => {
      try {
        const storedItems = localStorage.getItem('wishlistItems');
        if (storedItems) {
          setWishlistItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error('Error loading wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistItems();
  }, []);

  // 更新本地存储
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, loading]);

  // 添加商品到收藏夹
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      // 检查是否已存在相同商品
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        // 如果商品已存在，不做任何操作
        return prevItems;
      } else {
        // 如果商品不存在，添加新商品
        return [...prevItems, {
          ...product,
          addedAt: new Date().toISOString()
        }];
      }
    });

    return true; // 返回成功状态
  };

  // 从收藏夹中移除商品
  const removeFromWishlist = (id) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 检查商品是否在收藏夹中
  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // 切换商品在收藏夹中的状态
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false; // 返回移除后的状态
    } else {
      addToWishlist(product);
      return true; // 返回添加后的状态
    }
  };

  // 清空收藏夹
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // 获取收藏夹商品数量
  const getWishlistItemsCount = () => {
    return wishlistItems.length;
  };

  // 提供上下文值
  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistItemsCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// 创建使用收藏夹上下文的自定义钩子
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext; 