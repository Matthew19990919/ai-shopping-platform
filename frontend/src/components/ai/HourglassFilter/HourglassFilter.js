import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSearch, 
  faListAlt, 
  faBalanceScale, 
  faShoppingCart,
  faArrowDown,
  faQuestionCircle,
  faCheckCircle,
  faTimes,
  faPencilAlt,
  faTrash,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { FILTER_STAGES } from '../../../services/filterService';
import './HourglassFilter.css';

// 阶段描述和图标
const STAGE_INFO = {
  [FILTER_STAGES.INITIAL]: {
    title: '需求探索',
    description: '了解您的购物需求',
    icon: faQuestionCircle,
    color: '#4285F4'
  },
  [FILTER_STAGES.NEEDS]: {
    title: '明确需求',
    description: '明确产品类别和基本功能',
    icon: faSearch,
    color: '#EA4335'
  },
  [FILTER_STAGES.PARAMETERS]: {
    title: '参数筛选',
    description: '根据价格、品牌、规格等筛选',
    icon: faFilter,
    color: '#FBBC05'
  },
  [FILTER_STAGES.COMPARISON]: {
    title: '产品对比',
    description: '对比筛选出的产品',
    icon: faBalanceScale,
    color: '#34A853'
  },
  [FILTER_STAGES.DECISION]: {
    title: '决策辅助',
    description: '分析优缺点和价格',
    icon: faCheckCircle,
    color: '#4285F4'
  }
};

/**
 * 沙漏筛选组件 - 展示用户在购物决策流程中的位置
 * @param {string} currentStage 当前阶段
 * @param {Object} filterCriteria 筛选条件
 * @param {number} productCount 当前筛选出的产品数量
 * @param {boolean} isVisible 是否显示组件
 * @param {Function} onStageClick 阶段点击回调
 * @param {Function} onFilterChange 筛选条件变更回调
 * @param {Function} onResetFilters 重置筛选条件回调
 */
const HourglassFilter = ({ 
  currentStage = FILTER_STAGES.INITIAL, 
  filterCriteria = {}, 
  productCount = 0,
  isVisible = true,
  onStageClick = () => {},
  onFilterChange = () => {},
  onResetFilters = () => {}
}) => {
  // 所有阶段，用于渲染
  const stages = Object.values(FILTER_STAGES);
  
  // 当前阶段索引
  const currentIndex = stages.indexOf(currentStage);
  
  // 动画类
  const [animate, setAnimate] = useState(false);
  
  // 筛选条件编辑状态
  const [editingFilter, setEditingFilter] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // 筛选条件的显示文本
  const filterText = Object.entries(filterCriteria).map(([key, value]) => 
    `${key}: ${value}`
  ).join(', ');
  
  // 当阶段变化时添加动画效果
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [currentStage]);

  // 处理筛选条件删除
  const handleDeleteFilter = (key) => {
    const newFilterCriteria = { ...filterCriteria };
    delete newFilterCriteria[key];
    onFilterChange(newFilterCriteria);
  };
  
  // 开始编辑筛选条件
  const handleEditFilter = (key, value) => {
    setEditingFilter(key);
    setEditValue(value);
  };
  
  // 保存编辑后的筛选条件
  const handleSaveFilter = () => {
    if (editingFilter && editValue.trim()) {
      const newFilterCriteria = { ...filterCriteria };
      newFilterCriteria[editingFilter] = editValue.trim();
      onFilterChange(newFilterCriteria);
      setEditingFilter(null);
      setEditValue('');
    }
  };
  
  // 取消编辑
  const handleCancelEdit = () => {
    setEditingFilter(null);
    setEditValue('');
  };

  if (!isVisible) return null;
  
  return (
    <div className="hourglass-filter">
      <div className="hourglass-header">
        <h3>智能筛选流程</h3>
        <div className="product-count">
          找到 <span>{productCount}</span> 个符合条件的产品
        </div>
      </div>
      
      <div className="hourglass-container">
        {/* 顶部漏斗 - 代表大量选择 */}
        <div className="hourglass-top">
          <div className="hourglass-contents"></div>
        </div>
        
        {/* 中间流程 - 展示各个阶段 */}
        <div className="hourglass-stages">
          {stages.map((stage, index) => {
            const stageInfo = STAGE_INFO[stage];
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            
            return (
              <div 
                key={stage}
                className={`hourglass-stage ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${animate && isActive ? 'animate' : ''}`}
                onClick={() => onStageClick(stage)}
                style={{ 
                  width: `${100 - (index * (100 / stages.length) / 2)}%`,
                  backgroundColor: isActive ? stageInfo.color : '#f0f0f0'
                }}
              >
                <div className="stage-icon">
                  <FontAwesomeIcon 
                    icon={stageInfo.icon} 
                    style={{ color: isActive ? stageInfo.color : '#888' }}
                  />
                </div>
                <div className="stage-info">
                  <h4 className={isActive ? 'active-text' : ''}>{stageInfo.title}</h4>
                  {isActive && <p>{stageInfo.description}</p>}
                </div>
                
                {index < stages.length - 1 && (
                  <div className="stage-arrow">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 底部漏斗 - 代表精准选择 */}
        <div className="hourglass-bottom">
          <div className="hourglass-contents"></div>
        </div>
      </div>
      
      {/* 当前筛选条件 */}
      {Object.keys(filterCriteria).length > 0 && (
        <div className="current-filters">
          <div className="filters-header">
            <h4>当前筛选条件:</h4>
            <button 
              className="reset-filters-btn" 
              onClick={onResetFilters}
              title="重置所有筛选条件"
            >
              <FontAwesomeIcon icon={faTrash} /> 重置
            </button>
          </div>
          <div className="filter-tags">
            {Object.entries(filterCriteria).map(([key, value]) => (
              <div key={key} className="filter-tag">
                {editingFilter === key ? (
                  // 编辑模式
                  <div className="filter-edit-mode">
                    <span className="filter-key">{key}:</span>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="filter-edit-input"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveFilter();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <div className="filter-actions">
                      <button 
                        className="filter-action-btn save-btn" 
                        onClick={handleSaveFilter}
                        title="保存"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button 
                        className="filter-action-btn cancel-btn" 
                        onClick={handleCancelEdit}
                        title="取消"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // 查看模式
                  <>
                    <span className="filter-key">{key}:</span>
                    <span className="filter-value">{value}</span>
                    <div className="filter-actions">
                      <button 
                        className="filter-action-btn edit-btn" 
                        onClick={() => handleEditFilter(key, value)}
                        title="编辑"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button 
                        className="filter-action-btn delete-btn" 
                        onClick={() => handleDeleteFilter(key)}
                        title="删除"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 导出组件和常量
export { HourglassFilter, FILTER_STAGES };