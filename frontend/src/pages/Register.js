import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await register(email, password, nickname);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <div className="back-to-home">
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} /> 返回首页
          </Link>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>用户注册</h1>
            <p>加入我们，享受AI智能购物体验</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="nickname">
                <FontAwesomeIcon icon={faUser} /> 昵称
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入昵称"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} /> 邮箱
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
                placeholder="请输入密码（至少6个字符）"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FontAwesomeIcon icon={faLock} /> 确认密码
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                required
              />
            </div>
            
            <div className="form-agreement">
              <input type="checkbox" id="agreement" required />
              <label htmlFor="agreement">
                我已阅读并同意 <Link to="/terms" className="auth-link">用户协议</Link> 和 <Link to="/privacy" className="auth-link">隐私政策</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              已有账号? <Link to="/login" className="auth-link">立即登录</Link>
            </p>
          </div>
          
          <div className="auth-divider">
            <span>或通过以下方式注册</span>
          </div>
          
          <div className="social-login">
            <button className="social-button wechat">
              微信注册
            </button>
            <button className="social-button qq">
              QQ注册
            </button>
            <button className="social-button weibo">
              微博注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 