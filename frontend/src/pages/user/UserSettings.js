import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faKey, 
  faBell, 
  faShieldAlt, 
  faLock,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './user-settings.css';

const UserSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [notifications, setNotifications] = useState({
    orderStatus: true,
    promotions: true,
    systemMessages: true,
    newsletter: false
  });
  const [privacy, setPrivacy] = useState({
    shareProfile: false,
    allowRecommendations: true,
    collectBrowsingData: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理标签切换
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 处理密码更改
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    // 验证密码
    if (!currentPassword) {
      setErrorMessage('请输入当前密码');
      setIsSubmitting(false);
      return;
    }

    if (!newPassword) {
      setErrorMessage('请输入新密码');
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('新密码长度必须至少为8个字符');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('两次输入的新密码不匹配');
      setIsSubmitting(false);
      return;
    }

    // 模拟API调用
    setTimeout(() => {
      setSuccessMessage('密码修改成功');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
    }, 1000);
  };

  // 处理通知设置变更
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 处理隐私设置变更
  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 保存通知设置
  const handleSaveNotifications = () => {
    setSuccessMessage('通知设置已保存');
    // 实际项目中应该调用API保存设置
  };

  // 保存隐私设置
  const handleSavePrivacy = () => {
    setSuccessMessage('隐私设置已保存');
    // 实际项目中应该调用API保存设置
  };

  return (
    <div className="user-settings-container">
      <div className="section-header">
        <h2>账户设置</h2>
      </div>

      <div className="settings-content">
        {/* 设置选项卡 */}
        <div className="settings-tabs">
          <button 
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => handleTabClick('password')}
          >
            <FontAwesomeIcon icon={faKey} />
            修改密码
          </button>
          <button 
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => handleTabClick('notifications')}
          >
            <FontAwesomeIcon icon={faBell} />
            通知设置
          </button>
          <button 
            className={activeTab === 'privacy' ? 'active' : ''}
            onClick={() => handleTabClick('privacy')}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            隐私设置
          </button>
        </div>

        {/* 设置内容 */}
        <div className="settings-panel">
          {/* 消息提示 */}
          {errorMessage && (
            <div className="message-box error">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="message-box success">
              {successMessage}
            </div>
          )}

          {/* 修改密码 */}
          {activeTab === 'password' && (
            <div className="password-settings">
              <p className="settings-description">
                定期更新密码可以提高账户安全性。新密码必须至少包含8个字符。
              </p>
              
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label htmlFor="currentPassword">当前密码</label>
                  <div className="password-input">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="请输入当前密码"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">新密码</label>
                  <div className="password-input">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="请输入新密码"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">确认新密码</label>
                  <div className="password-input">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '保存中...' : '保存修改'}
                </button>
              </form>
            </div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notifications' && (
            <div className="notification-settings">
              <p className="settings-description">
                选择您想要接收的通知类型。通过邮件地址 {user.email} 接收通知。
              </p>
              
              <div className="settings-list">
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>订单状态通知</h4>
                    <p>接收有关订单状态变更的通知</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.orderStatus}
                      onChange={() => handleNotificationChange('orderStatus')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>促销活动通知</h4>
                    <p>接收有关促销活动、优惠券和限时折扣的通知</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={() => handleNotificationChange('promotions')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>系统消息</h4>
                    <p>接收重要的系统公告和服务更新</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.systemMessages}
                      onChange={() => handleNotificationChange('systemMessages')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>周报和新闻邮件</h4>
                    <p>接收每周精选商品推荐和行业新闻</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={() => handleNotificationChange('newsletter')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <button 
                className="save-button"
                onClick={handleSaveNotifications}
              >
                保存设置
              </button>
            </div>
          )}

          {/* 隐私设置 */}
          {activeTab === 'privacy' && (
            <div className="privacy-settings">
              <p className="settings-description">
                管理您的隐私偏好和数据共享选项。保护您的个人信息安全。
              </p>
              
              <div className="settings-list">
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>个人资料共享</h4>
                    <p>允许与第三方合作伙伴共享您的个人资料信息</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={privacy.shareProfile}
                      onChange={() => handlePrivacyChange('shareProfile')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>个性化推荐</h4>
                    <p>允许根据您的浏览和购买历史提供个性化推荐</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={privacy.allowRecommendations}
                      onChange={() => handlePrivacyChange('allowRecommendations')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>数据收集</h4>
                    <p>允许收集您的浏览数据以改善网站服务</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={privacy.collectBrowsingData}
                      onChange={() => handlePrivacyChange('collectBrowsingData')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <button 
                className="save-button"
                onClick={handleSavePrivacy}
              >
                保存设置
              </button>
              
              <div className="data-actions">
                <button className="secondary-button">
                  下载我的数据
                </button>
                <button className="danger-button">
                  删除我的帐户
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings; 