import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faIdCard, 
  faMars, 
  faVenus, 
  faGenderless,
  faEdit,
  faSave,
  faTimes,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './user-info.css';

const UserInfo = () => {
  const { user, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user.nickname || '',
    phone: user.phone || '',
    gender: user.gender || 'male',
    birthday: user.birthday || '',
    realName: user.realName || '',
    idNumber: user.idNumber || '',
    bio: user.bio || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  // 调试输出当前编辑状态
  useEffect(() => {
    console.log('isEditing状态变化:', isEditing);
  }, [isEditing]);

  // 确保用户数据变化时更新表单数据
  useEffect(() => {
    setFormData({
      nickname: user.nickname || '',
      phone: user.phone || '',
      gender: user.gender || 'male',
      birthday: user.birthday || '',
      realName: user.realName || '',
      idNumber: user.idNumber || '',
      bio: user.bio || ''
    });
  }, [user]);

  // 开始编辑模式
  const handleEdit = () => {
    console.log('编辑按钮被点击，当前isEditing状态:', isEditing);
    
    // 强制切换为编辑模式
    setIsEditing(true);
    
    // 重置表单数据
    setFormData({
      nickname: user.nickname || '',
      phone: user.phone || '',
      gender: user.gender || 'male',
      birthday: user.birthday || '',
      realName: user.realName || '',
      idNumber: user.idNumber || '',
      bio: user.bio || ''
    });
    
    console.log('已设置isEditing为true，新的表单数据:', {
      nickname: user.nickname || '',
      phone: user.phone || '',
      gender: user.gender || 'male'
    });
  };

  // 取消编辑
  const handleCancel = () => {
    setIsEditing(false);
    setUpdateMessage({ type: '', text: '' });
  };

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log(`表单字段 ${name} 变化:`, { type, value, checked });
    
    // 根据输入类型处理值
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'number') {
      finalValue = Number(value);
    }
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: finalValue
      };
      console.log('更新后的表单数据:', updated);
      return updated;
    });
  };

  // 处理性别变更
  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsUpdating(true);
    setUpdateMessage({ type: '', text: '' });
    
    try {
      // 验证表单
      if (!formData.nickname) {
        throw new Error('昵称不能为空');
      }
      
      // 验证手机号格式
      if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
        throw new Error('手机号格式不正确');
      }
      
      // 验证身份证号格式
      if (formData.idNumber && !/^\d{17}[\dXx]$/.test(formData.idNumber)) {
        throw new Error('身份证号格式不正确');
      }
      
      // 调用API更新用户信息
      const result = await updateUserInfo(formData);
      
      if (result.success) {
        setUpdateMessage({ type: 'success', text: result.message || '个人信息更新成功' });
        setIsEditing(false);
      } else {
        setUpdateMessage({ type: 'error', text: result.message || '更新失败，请重试' });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理头像更新
  const handleAvatarUpdate = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUpdating(true);
      
      try {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        // 使用Promise包装FileReader
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        
        // 更新用户头像
        const result = await updateUserInfo({ avatar: dataUrl });
        
        if (result.success) {
          setUpdateMessage({ type: 'success', text: '头像更新成功' });
        } else {
          setUpdateMessage({ type: 'error', text: result.message || '头像更新失败' });
        }
      } catch (error) {
        setUpdateMessage({ type: 'error', text: '头像处理失败，请重试' });
        console.error('头像处理错误:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="user-info-container">
      <div className="section-header">
        <h2>个人信息</h2>
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 999, 
            display: 'inline-block',
            pointerEvents: 'auto'
          }}
        >
          {!isEditing && (
            <button 
              className="edit-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('编辑按钮点击事件触发');
                handleEdit();
              }}
              style={{
                cursor: 'pointer',
                zIndex: 100,
                position: 'relative',
                padding: '8px 15px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              data-testid="edit-user-info-button"
            >
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
              编辑信息
            </button>
          )}
        </div>
      </div>

      {/* 更新消息 */}
      {updateMessage.text && (
        <div className={`message-box ${updateMessage.type}`}>
          {updateMessage.text}
        </div>
      )}

      {/* 备用编辑按钮 - 确保用户能进入编辑模式 */}
      {!isEditing && (
        <div style={{ margin: '10px 0', textAlign: 'right' }}>
          <button 
            onClick={handleEdit}
            style={{
              padding: '8px 15px',
              backgroundColor: '#e1251b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            开始编辑个人信息
          </button>
        </div>
      )}

      <div className="user-info-content">
        {/* 头像部分 */}
        <div className="user-avatar-section">
          <div className="large-avatar">
            <img 
              src={user.avatar || "https://via.placeholder.com/150"} 
              alt="用户头像" 
            />
            {isEditing && (
              <div className="avatar-edit-overlay">
                <label htmlFor="avatar-upload" className="avatar-edit-button">
                  <FontAwesomeIcon icon={faCamera} />
                  <span>更换头像</span>
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpdate}
                />
              </div>
            )}
          </div>
          <h3 className="user-display-name">{user.nickname || user.email.split('@')[0]}</h3>
          <p className="user-join-date">注册时间：{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        {/* 个人信息表单 */}
        <div className="user-details-section">
          <form onSubmit={handleSubmit}>
            {/* 基本信息 */}
            <div className="info-group">
              <h3 className="group-title">基本信息</h3>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  昵称
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="请输入昵称"
                  />
                ) : (
                  <span className="info-value">{user.nickname || '未设置'}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  邮箱
                </label>
                <span className="info-value">{user.email}</span>
              </div>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faPhone} />
                  手机号
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入手机号"
                  />
                ) : (
                  <span className="info-value">{user.phone || '未设置'}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>性别</label>
                {isEditing ? (
                  <div className="gender-options">
                    <div 
                      className={`gender-option ${formData.gender === 'male' ? 'selected' : ''}`}
                      onClick={() => handleGenderChange('male')}
                    >
                      <FontAwesomeIcon icon={faMars} />
                      <span>男</span>
                    </div>
                    <div 
                      className={`gender-option ${formData.gender === 'female' ? 'selected' : ''}`}
                      onClick={() => handleGenderChange('female')}
                    >
                      <FontAwesomeIcon icon={faVenus} />
                      <span>女</span>
                    </div>
                    <div 
                      className={`gender-option ${formData.gender === 'other' ? 'selected' : ''}`}
                      onClick={() => handleGenderChange('other')}
                    >
                      <FontAwesomeIcon icon={faGenderless} />
                      <span>其他</span>
                    </div>
                  </div>
                ) : (
                  <span className="info-value">
                    {user.gender === 'male' ? '男' : 
                     user.gender === 'female' ? '女' : 
                     user.gender === 'other' ? '其他' : '未设置'}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label>生日</label>
                {isEditing ? (
                  <input 
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="info-value">{user.birthday || '未设置'}</span>
                )}
              </div>
            </div>
            
            {/* 实名认证 */}
            <div className="info-group">
              <h3 className="group-title">实名认证信息</h3>
              
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faIdCard} />
                  真实姓名
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    name="realName"
                    value={formData.realName}
                    onChange={handleChange}
                    placeholder="请输入真实姓名"
                  />
                ) : (
                  <span className="info-value">{user.realName || '未认证'}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>身份证号</label>
                {isEditing ? (
                  <input 
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="请输入身份证号"
                  />
                ) : (
                  <span className="info-value">
                    {user.idNumber ? user.idNumber.replace(/^(.{4})(.*)(.{4})$/, "$1****$3") : '未认证'}
                  </span>
                )}
              </div>
            </div>
            
            {/* 个人简介 */}
            <div className="info-group">
              <h3 className="group-title">个人简介</h3>
              
              <div className="form-group">
                <label>自我介绍</label>
                {isEditing ? (
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="介绍一下自己吧"
                    rows={4}
                  />
                ) : (
                  <span className="info-value bio-text">{user.bio || '这个人很懒，什么都没写...'}</span>
                )}
              </div>
            </div>
            
            {/* 操作按钮 */}
            {isEditing && (
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  取消
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span>保存中...</span>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      保存
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 