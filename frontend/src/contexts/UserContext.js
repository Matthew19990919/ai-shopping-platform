import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// 创建用户上下文
const UserContext = createContext();

// 用户上下文提供者组件
export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({});
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 在用户变化时获取用户偏好和历史
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          
          // 模拟从API获取数据
          // 在实际应用中，这里应该调用真实的API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 模拟用户偏好数据
          const mockPreferences = {
            categories: ['电子产品', '服装', '书籍'],
            brands: ['Apple', 'Samsung', 'Nike'],
            priceRange: {
              min: 100,
              max: 5000
            },
            color: ['黑色', '白色', '蓝色'],
            size: ['M', 'L']
          };
          
          // 模拟用户历史数据
          const mockHistory = [
            {
              id: 1,
              type: 'view',
              product: {
                id: 101,
                name: '智能手表',
                image: 'https://via.placeholder.com/100',
                price: 1299
              },
              timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 2,
              type: 'purchase',
              product: {
                id: 102,
                name: '无线耳机',
                image: 'https://via.placeholder.com/100',
                price: 899
              },
              timestamp: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: 3,
              type: 'view',
              product: {
                id: 103,
                name: '笔记本电脑',
                image: 'https://via.placeholder.com/100',
                price: 6999
              },
              timestamp: new Date(Date.now() - 259200000).toISOString()
            }
          ];
          
          // 模拟推荐数据
          const mockRecommendations = [
            {
              id: 201,
              name: '高清智能电视',
              image: 'https://via.placeholder.com/100',
              price: 3499,
              rating: 4.7
            },
            {
              id: 202,
              name: '智能音箱',
              image: 'https://via.placeholder.com/100',
              price: 599,
              rating: 4.5
            },
            {
              id: 203,
              name: '平板电脑',
              image: 'https://via.placeholder.com/100',
              price: 2999,
              rating: 4.8
            }
          ];
          
          setPreferences(mockPreferences);
          setHistory(mockHistory);
          setRecommendations(mockRecommendations);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // 如果没有用户，重置所有数据
        setPreferences({});
        setHistory([]);
        setRecommendations([]);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // 更新用户偏好
  const updatePreferences = async (newPreferences) => {
    try {
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 合并新的和现有的偏好
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      
      return { success: true, preferences: updatedPreferences };
    } catch (error) {
      console.error("Error updating preferences:", error);
      return { 
        success: false, 
        message: error.message || '更新偏好失败，请稍后再试。'
      };
    } finally {
      setLoading(false);
    }
  };

  // 添加浏览或购买历史
  const addToHistory = async (type, product) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const historyItem = {
        id: Date.now(),
        type, // 'view' 或 'purchase'
        product,
        timestamp: new Date().toISOString()
      };
      
      // 添加到历史记录中
      const updatedHistory = [historyItem, ...history];
      setHistory(updatedHistory);
      
      return { success: true };
    } catch (error) {
      console.error("Error adding to history:", error);
      return { 
        success: false, 
        message: error.message || '添加历史记录失败。'
      };
    }
  };

  // 提供上下文值
  const value = {
    preferences,
    history,
    recommendations,
    loading,
    updatePreferences,
    addToHistory
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 创建使用用户上下文的自定义钩子
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;