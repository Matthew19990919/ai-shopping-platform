import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faMobile, faQrcode, faCheck, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 如果有前一个页面的信息，登录后返回那个页面
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('请填写所有必填字段');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="back-to-home">
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} /> 返回首页
          </Link>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>用户登录</h1>
            <p>欢迎回来，请登录您的账户</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faUser} /> 邮箱
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} /> 密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">记住我</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                忘记密码?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              还没有账号? <Link to="/register" className="auth-link">立即注册</Link>
            </p>
          </div>
          
          <div className="auth-divider">
            <span>或通过以下方式登录</span>
          </div>
          
          <div className="social-login">
            <button className="social-button wechat">
              微信登录
            </button>
            <button className="social-button qq">
              QQ登录
            </button>
            <button className="social-button weibo">
              微博登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 