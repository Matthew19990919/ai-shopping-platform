import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicketAlt, 
  faCalendarAlt, 
  faStore, 
  faInfoCircle,
  faExclamationTriangle,
  faGift,
  faShoppingBag,
  faTags,
  faFilter,
  faSearch,
  faExclamationCircle,
  faCut,
  faPercent,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import { getUserCoupons } from '../../services/userService';
import PromotionBanner from '../../components/PromotionBanner';
import './user-coupons.css';

const UserCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateCoupons, setAnimateCoupons] = useState(false);

  // 自定义促销公告数据
  const couponAnnouncements = [
    {
      id: 1,
      icon: faCut,
      text: "领券中心新增满300减50神券，限量发放中！",
      link: "/promotions/special",
      type: "primary"
    },
    {
      id: 2,
      icon: faPercent,
      text: "限时：会员专享券满199减50，仅限今日！",
      link: "/member/coupons",
      type: "secondary"
    },
    {
      id: 3,
      icon: faFire,
      text: "新人专享：首单满100减20，无门槛立减券等你领",
      link: "/promotions/new-user",
      type: "warning"
    }
  ];

  // 加载优惠券数据
  const loadCoupons = async (status) => {
    setLoading(true);
    setError(null);
    setAnimateCoupons(false);

    try {
      const couponsData = await getUserCoupons(status);
      setCoupons(couponsData || []);
      
      // 添加延迟以启用动画效果
      setTimeout(() => {
        setAnimateCoupons(true);
      }, 100);
    } catch (err) {
      setError('获取优惠券失败，请稍后再试');
      console.error('Error fetching coupons:', err);
      // 确保即使出错也设置一个空数组，避免undefined错误
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新加载
  useEffect(() => {
    loadCoupons(statusFilter);
  }, [statusFilter]);

  // 处理状态筛选变化
  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('日期格式化错误:', error, dateString);
      return '无效日期';
    }
  };

  // 剩余有效期
  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error('计算剩余天数错误:', error, endDate);
      return 0;
    }
  };

  // 过滤显示的优惠券
  const filteredCoupons = coupons.filter(coupon => {
    if (!searchTerm) return true;
    return (
      (coupon.name && coupon.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coupon.code && coupon.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // 获取优惠券状态标签
  const getCouponStatusBadge = (status, days) => {
    if (status === 'expired') {
      return (
        <span className="ds-badge ds-badge-outline" style={{color: 'var(--text-tertiary)', borderColor: 'var(--text-tertiary)'}}>
          已过期
        </span>
      );
    } else if (status === 'used') {
      return (
        <span className="ds-badge ds-badge-outline" style={{color: 'var(--text-tertiary)', borderColor: 'var(--text-tertiary)'}}>
          已使用
        </span>
      );
    } else if (days <= 3) {
      return (
        <span className="ds-badge ds-badge-error">
          即将到期
        </span>
      );
    } else {
      return (
        <span className="ds-badge ds-badge-success">
          可使用
        </span>
      );
    }
  };

  return (
    <div className="user-coupons-container">
      {/* 促销横幅 */}
      <PromotionBanner announcements={couponAnnouncements} />
      
      <div className="section-header">
        <h2><FontAwesomeIcon icon={faTicketAlt} style={{marginRight: '10px'}} />我的优惠券</h2>
        <div className="coupon-tabs">
          <button 
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => handleStatusChange('all')}
          >
            全部
          </button>
          <button 
            className={statusFilter === 'valid' ? 'active' : ''}
            onClick={() => handleStatusChange('valid')}
          >
            可使用
          </button>
          <button 
            className={statusFilter === 'used' ? 'active' : ''}
            onClick={() => handleStatusChange('used')}
          >
            已使用
          </button>
          <button 
            className={statusFilter === 'expired' ? 'active' : ''}
            onClick={() => handleStatusChange('expired')}
          >
            已过期
          </button>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="ds-flex ds-justify-between ds-items-center ds-mb-3">
        <div className="ds-input-group" style={{maxWidth: '300px'}}>
          <div className="ds-input-group-prepend">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input 
            type="text" 
            className="ds-input" 
            placeholder="搜索优惠券" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ds-flex ds-gap-2 ds-items-center">
          <button className="ds-btn ds-btn-ghost ds-btn-sm">
            <FontAwesomeIcon icon={faFilter} className="ds-btn-icon" />
            筛选
          </button>
          <button className="ds-btn ds-btn-primary ds-btn-sm">
            <FontAwesomeIcon icon={faTags} className="ds-btn-icon" />
            去领券中心
          </button>
        </div>
      </div>

      {/* 显示错误信息 */}
      {error && (
        <div className="error-message ds-fade-in">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载优惠券中...</p>
        </div>
      ) : (
        <>
          {/* 优惠券列表 */}
          {filteredCoupons.length === 0 ? (
            <div className="empty-coupons ds-fade-in">
              <FontAwesomeIcon icon={faGift} className="empty-icon" />
              <p>{searchTerm ? '没有找到匹配的优惠券' : '暂无优惠券'}</p>
              <p className="ds-text-tertiary" style={{fontSize: '14px', marginTop: '-10px'}}>
                {searchTerm ? '请尝试其他搜索词' : '前往领券中心获取优惠活动'}
              </p>
              <button className="get-coupon-btn ds-ripple">
                <FontAwesomeIcon icon={faShoppingBag} style={{marginRight: '8px'}} />
                去领券中心
              </button>
            </div>
          ) : (
            <div className="coupons-list">
              {filteredCoupons.map((coupon, index) => (
                <div 
                  key={coupon.id} 
                  className={`coupon-card ${coupon.status === 'valid' ? 'valid' : 
                              coupon.status === 'used' ? 'used' : 'expired'} 
                              ${animateCoupons ? 'ds-fade-in' : ''}`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="coupon-left">
                    <div className="coupon-amount">
                      <span className="amount-symbol">¥</span>
                      <span className="amount-value">{coupon.discount || coupon.amount || 0}</span>
                    </div>
                    <div className="coupon-threshold">
                      {coupon.minAmount || coupon.threshold 
                        ? `满${coupon.minAmount || coupon.threshold}元可用` 
                        : '无门槛'}
                    </div>
                  </div>
                  
                  <div className="coupon-middle">
                    <div className="ds-flex ds-justify-between ds-items-center ds-mb-2">
                      <h3 className="coupon-name">{coupon.name}</h3>
                      {getCouponStatusBadge(coupon.status, getRemainingDays(coupon.validTo))}
                    </div>
                    
                    {coupon.description && (
                      <p className="ds-text-secondary ds-text-2-lines ds-mb-2" style={{fontSize: '13px'}}>
                        {coupon.description}
                      </p>
                    )}
                    
                    <p className="coupon-scope">
                      <FontAwesomeIcon icon={faStore} />
                      {coupon.scope || '全场通用'}
                    </p>
                    
                    <p className="coupon-time">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {formatDate(coupon.validFrom)} - {formatDate(coupon.validTo)}
                    </p>
                    
                    {coupon.status === 'valid' && (
                      <div className="coupon-expiry">
                        剩余 <span>{getRemainingDays(coupon.validTo)}</span> 天
                      </div>
                    )}

                    {coupon.code && (
                      <div className="ds-tag ds-tag-primary ds-mt-2">
                        优惠码: {coupon.code}
                      </div>
                    )}
                  </div>
                  
                  <div className="coupon-right">
                    {coupon.status === 'valid' ? (
                      <button className="use-btn ds-ripple">
                        立即使用
                      </button>
                    ) : (
                      <div className="coupon-status">
                        {coupon.status === 'used' ? '已使用' : '已过期'}
                      </div>
                    )}
                    
                    <button className="details-btn">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      规则详情
                    </button>
                  </div>
                  
                  <div className="coupon-decoration"></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserCoupons; 