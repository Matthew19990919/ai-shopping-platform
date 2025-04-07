import React, { useEffect, useState } from 'react';
import './HourglassFilter.css';
import { STAGES as FILTER_STAGES } from '../../services/filterService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faComments, faTags, faLayerGroup, faChartLine, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

// 为每个阶段分配图标
const stageIcons = {
  [FILTER_STAGES.INITIAL]: faComments,
  [FILTER_STAGES.NEEDS]: faTags,
  [FILTER_STAGES.PARAMETERS]: faFilter,
  [FILTER_STAGES.COMPARISON]: faLayerGroup,
  [FILTER_STAGES.PRICE_ANALYSIS]: faChartLine,
  [FILTER_STAGES.DECISION]: faClipboardCheck
};

// 为每个阶段分配问题提示
const stageQuestions = {
  [FILTER_STAGES.INITIAL]: "您想购买什么类型的产品？",
  [FILTER_STAGES.NEEDS]: "您会如何使用这个产品？有什么特别的需求？",
  [FILTER_STAGES.PARAMETERS]: "您有具体的价格范围、品牌偏好或其他要求吗？",
  [FILTER_STAGES.COMPARISON]: "在这些产品中，您更看重哪些方面？",
  [FILTER_STAGES.PRICE_ANALYSIS]: "您想了解这个产品的价格趋势吗？",
  [FILTER_STAGES.DECISION]: "这个产品是否符合您的需求？"
};

// 阶段名称的中文映射
const stageChineseNames = {
  [FILTER_STAGES.INITIAL]: "初始探索",
  [FILTER_STAGES.NEEDS]: "需求表达",
  [FILTER_STAGES.PARAMETERS]: "参数筛选",
  [FILTER_STAGES.COMPARISON]: "产品对比",
  [FILTER_STAGES.PRICE_ANALYSIS]: "价格分析",
  [FILTER_STAGES.DECISION]: "决策辅助"
};

// HourglassFilter组件：展示漏斗过滤模型
const HourglassFilter = ({ currentStage, filterCriteria }) => {
  const [animatedStage, setAnimatedStage] = useState(currentStage);
  const [displayedCriteria, setDisplayedCriteria] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // 格式化过滤条件为可读文本
  const formatCriteria = (criteria) => {
    if (!criteria || Object.keys(criteria).length === 0) {
      return {};
    }
    
    const formattedCriteria = {};
    
    // 处理价格
    if (criteria.price) {
      if (criteria.price.min && criteria.price.max) {
        formattedCriteria['价格'] = `${criteria.price.min}-${criteria.price.max}元`;
      } else if (criteria.price.min) {
        formattedCriteria['价格'] = `>${criteria.price.min}元`;
      } else if (criteria.price.max) {
        formattedCriteria['价格'] = `<${criteria.price.max}元`;
      } else if (criteria.price.target) {
        formattedCriteria['价格'] = `约${criteria.price.target}元`;
      }
    }
    
    // 处理品牌
    if (criteria.brands && criteria.brands.length > 0) {
      formattedCriteria['品牌'] = criteria.brands.join('、');
    }
    
    // 处理功能特性
    if (criteria.features && criteria.features.length > 0) {
      formattedCriteria['功能'] = criteria.features.join('、');
    }
    
    // 处理使用场景
    if (criteria.usage && criteria.usage.length > 0) {
      formattedCriteria['用途'] = criteria.usage.join('、');
    }
    
    // 处理性能要求
    if (criteria.performance && criteria.performance.length > 0) {
      formattedCriteria['性能'] = criteria.performance.join('、');
    }
    
    // 处理质量偏好
    if (criteria.quality && criteria.quality.length > 0) {
      formattedCriteria['品质'] = criteria.quality.join('、');
    }
    
    return formattedCriteria;
  };
  
  // 当组件挂载或过滤条件变化时，更新显示的条件
  useEffect(() => {
    setDisplayedCriteria(formatCriteria(filterCriteria));
  }, [filterCriteria]);
  
  // 当当前阶段变化时，更新动画阶段
  useEffect(() => {
    setAnimatedStage(currentStage);
  }, [currentStage]);
  
  // 获取阶段宽度（用于漏斗效果）
  const getWidthForStage = (stage) => {
    // 从INITIAL到DECISION逐渐减小宽度
    const stages = Object.values(FILTER_STAGES);
    const index = stages.indexOf(stage);
    const totalStages = stages.length;
    
    // 先确保索引有效
    if (index === -1) return 100;
    
    // 创建漏斗效果的递减宽度
    return 100 - (index * (60 / totalStages));
  };
  
  // 判断阶段是否激活
  const isStageActive = (stage) => {
    return stage === currentStage;
  };
  
  // 处理阶段鼠标悬停
  const handleStageMouseEnter = (stage, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setTooltipContent(stageQuestions[stage] || "");
    setShowTooltip(true);
  };
  
  // 处理阶段鼠标离开
  const handleStageMouseLeave = () => {
    setShowTooltip(false);
  };
  
  // 确定是否显示条件标签容器
  const shouldShowCriteriaLabels = Object.keys(displayedCriteria).length > 0;
  
  return (
    <div className="hourglass-filter-container">
      <div className="filter-stage-label">筛选阶段</div>
      <div className="hourglass-filter">
        {/* 漏斗阶段 */}
        {Object.values(FILTER_STAGES).map((stage) => (
          <div 
            key={stage}
            className={`filter-stage ${isStageActive(stage) ? 'active' : ''}`}
            style={{ width: `${getWidthForStage(stage)}%` }}
            onMouseEnter={(e) => handleStageMouseEnter(stage, e)}
            onMouseLeave={handleStageMouseLeave}
          >
            <div className="stage-icon">
              <FontAwesomeIcon icon={stageIcons[stage] || faFilter} />
            </div>
            <div className="stage-name">{stageChineseNames[stage] || stage}</div>
          </div>
        ))}
      </div>
      
      {/* 过滤条件标签 */}
      {shouldShowCriteriaLabels && (
        <div className="filter-criteria-labels">
          <div className="criteria-label-title">已识别条件:</div>
          <div className="criteria-labels">
            {Object.entries(displayedCriteria).map(([key, value]) => (
              <div key={key} className="criteria-label">
                <span className="criteria-key">{key}:</span>
                <span className="criteria-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 阶段提示工具提示 */}
      {showTooltip && (
        <div 
          className="stage-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 40}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default HourglassFilter;