import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建认证上下文
const AuthContext = createContext();

// 提供身份验证上下文的提供者组件
export const AuthProvider = ({ children }) => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 模拟从本地存储中获取用户信息
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // 如果有错误，清除本地存储
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // 模拟API调用 - 在实际应用中，这里应该调用真实的API
      // const response = await api.post('/auth/login', { email, password });
      
      // 模拟响应数据
      const mockResponse = {
        user: {
          id: 1,
          email,
          nickname: email.split('@')[0],
          avatar: 'https://via.placeholder.com/50',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2)
      };
      
      // 存储用户信息和令牌
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      localStorage.setItem('token', mockResponse.token);
      
      // 更新状态
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.message || '登录失败，请检查您的邮箱和密码。' 
      };
    } finally {
      setLoading(false);
    }
  };

  // 注册函数
  const register = async (email, password, nickname) => {
    try {
      setLoading(true);
      
      // 模拟API调用 - 在实际应用中，这里应该调用真实的API
      // const response = await api.post('/auth/register', { email, password, nickname });
      
      // 模拟响应数据
      const mockResponse = {
        user: {
          id: Date.now(),
          email,
          nickname: nickname || email.split('@')[0],
          avatar: 'https://via.placeholder.com/50',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2)
      };
      
      // 存储用户信息和令牌
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      localStorage.setItem('token', mockResponse.token);
      
      // 更新状态
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: error.message || '注册失败，请稍后再试。' 
      };
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    // 清除本地存储
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 更新状态
    setUser(null);
    setIsAuthenticated(false);
  };

  // 更新用户信息
  const updateUserInfo = async (updatedInfo) => {
    try {
      console.log('开始更新用户信息:', updatedInfo);
      
      // 将更新操作包装在Promise中，模拟API调用
      return await new Promise((resolve) => {
        setTimeout(() => {
          try {
            console.log('更新前的用户信息:', user);
            const updatedUser = { ...user, ...updatedInfo };
            console.log('更新后的用户信息:', updatedUser);
            
            // 更新本地存储
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // 更新状态
            setUser(updatedUser);
            
            console.log('用户信息更新成功');
            resolve({ 
              success: true,
              user: updatedUser,
              message: '用户信息更新成功'
            });
          } catch (error) {
            console.error('用户信息更新失败:', error);
            resolve({
              success: false,
              message: error.message || '更新用户信息失败，请稍后再试。'
            });
          }
        }, 1000); // 延长延迟时间，确保有足够的UI反馈
      });
    } catch (error) {
      console.error("Update user info error:", error);
      return { 
        success: false, 
        message: error.message || '更新用户信息失败，请稍后再试。' 
      };
    }
  };

  // 提供上下文值
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 创建使用身份验证上下文的自定义钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 