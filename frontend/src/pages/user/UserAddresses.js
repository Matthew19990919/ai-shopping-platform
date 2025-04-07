import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faEdit, 
  faTrashAlt, 
  faPlusCircle,
  faUser,
  faPhone,
  faTimes,
  faSave,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { 
  getUserAddresses, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress, 
  setDefaultAddress 
} from '../../services/userService';
import './user-addresses.css';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    zipCode: '',
    isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 加载地址数据
  const loadAddresses = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserAddresses();
      setAddresses(result.addresses);
    } catch (err) {
      setError('获取地址失败，请稍后再试');
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadAddresses();
  }, []);

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 打开添加地址表单
  const handleAddClick = () => {
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      zipCode: '',
      isDefault: false
    });
    setIsAddingAddress(true);
    setSuccessMessage('');
  };

  // 打开编辑地址表单
  const handleEditClick = (address) => {
    setFormData({
      id: address.id,
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      address: address.address,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
    setIsEditingAddress(address.id);
    setSuccessMessage('');
  };

  // 取消表单
  const handleCancel = () => {
    setIsAddingAddress(false);
    setIsEditingAddress(null);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      // 表单验证
      if (!formData.name || !formData.phone || !formData.province || 
          !formData.city || !formData.district || !formData.address) {
        throw new Error('请填写所有必填项');
      }

      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        throw new Error('手机号格式不正确');
      }

      if (isEditingAddress) {
        // 更新地址
        await updateUserAddress(isEditingAddress, formData);
        setSuccessMessage('地址已更新');
      } else {
        // 添加新地址
        await addUserAddress(formData);
        setSuccessMessage('地址已添加');
      }

      // 重新加载地址列表
      await loadAddresses();
      
      // 重置表单
      setIsAddingAddress(false);
      setIsEditingAddress(null);
    } catch (err) {
      setError(err.message || '保存地址失败，请稍后再试');
      console.error('Error saving address:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 删除地址
  const handleDelete = async (addressId) => {
    if (!window.confirm('确定要删除这个地址吗？')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await deleteUserAddress(addressId);
      await loadAddresses();
      setSuccessMessage('地址已删除');
    } catch (err) {
      setError('删除地址失败，请稍后再试');
      console.error('Error deleting address:', err);
    } finally {
      setLoading(false);
    }
  };

  // 设为默认地址
  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
      setSuccessMessage('默认地址已设置');
    } catch (err) {
      setError('设置默认地址失败，请稍后再试');
      console.error('Error setting default address:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-addresses-container">
      <div className="section-header">
        <h2>收货地址</h2>
        {!isAddingAddress && !isEditingAddress && (
          <button className="add-address-btn" onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlusCircle} />
            添加新地址
          </button>
        )}
      </div>

      {/* 显示提示信息 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* 加载中状态 */}
      {loading && addresses.length === 0 ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载地址中...</p>
        </div>
      ) : (
        <>
          {/* 添加/编辑地址表单 */}
          {(isAddingAddress || isEditingAddress) && (
            <div className="address-form-container">
              <h3 className="form-title">
                {isEditingAddress ? '编辑地址' : '添加新地址'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      收货人<span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faUser} className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="请输入收货人姓名"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      手机号码<span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <FontAwesomeIcon icon={faPhone} className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="请输入手机号码"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row three-columns">
                  <div className="form-group">
                    <label>
                      省份<span className="required">*</span>
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                    >
                      <option value="">请选择省份</option>
                      <option value="北京市">北京市</option>
                      <option value="上海市">上海市</option>
                      <option value="广东省">广东省</option>
                      <option value="江苏省">江苏省</option>
                      <option value="浙江省">浙江省</option>
                      {/* 更多省份选项... */}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      城市<span className="required">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">请选择城市</option>
                      {formData.province === '广东省' && (
                        <>
                          <option value="广州市">广州市</option>
                          <option value="深圳市">深圳市</option>
                          <option value="东莞市">东莞市</option>
                          {/* 更多城市选项... */}
                        </>
                      )}
                      {/* 根据省份显示不同的城市选项 */}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      区/县<span className="required">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                    >
                      <option value="">请选择区/县</option>
                      {formData.city === '广州市' && (
                        <>
                          <option value="天河区">天河区</option>
                          <option value="海珠区">海珠区</option>
                          <option value="越秀区">越秀区</option>
                          {/* 更多区县选项... */}
                        </>
                      )}
                      {/* 根据城市显示不同的区县选项 */}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    详细地址<span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="请输入详细地址，如街道、门牌号等"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>邮政编码</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="请输入邮政编码"
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                    />
                    设为默认收货地址
                  </label>
                </div>
                
                <div className="form-buttons">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>保存中...</span>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} />
                        保存
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 地址列表 */}
          {!isAddingAddress && !isEditingAddress && (
            <>
              {addresses.length === 0 ? (
                <div className="empty-addresses">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="empty-icon" />
                  <p>您还没有添加收货地址</p>
                  <button className="add-address-btn" onClick={handleAddClick}>
                    添加新地址
                  </button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-card ${address.isDefault ? 'default' : ''}`}
                    >
                      {address.isDefault && (
                        <div className="default-badge">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          默认地址
                        </div>
                      )}
                      
                      <div className="address-info">
                        <div className="address-header">
                          <span className="address-name">{address.name}</span>
                          <span className="address-phone">{address.phone}</span>
                        </div>
                        
                        <div className="address-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>
                            {address.province} {address.city} {address.district} {address.address}
                            {address.zipCode && <span className="zip-code">（{address.zipCode}）</span>}
                          </span>
                        </div>
                      </div>
                      
                      <div className="address-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditClick(address)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          编辑
                        </button>
                        
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(address.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          删除
                        </button>
                        
                        {!address.isDefault && (
                          <button 
                            className="default-btn"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            设为默认
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserAddresses; 