import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faQuestion, 
  faTags, 
  faUsers,
  faShield, 
  faBalanceScale, 
  faThumbsUp, 
  faThumbsDown,
  faChartLine,
  faCoins,
  faHeart,
  faAward,
  faHandHolding,
  faLightbulb,
  faCommentDots,
  faUserCheck,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './DecisionSupport.css';

/**
 * 决策支持组件 - 提供增强的决策辅助功能
 * 在购买决策阶段提供更详细的分析和建议
 */
const DecisionSupport = ({ 
  product, 
  userPreferences = {}, 
  userInteractions = [],
  valueFactors = null
}) => {
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [useCaseMatch, setUseCaseMatch] = useState({});
  const [ownershipCost, setOwnershipCost] = useState({});
  const [socialProof, setSocialProof] = useState({});
  const [valueAlignment, setValueAlignment] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 在组件挂载后计算各项决策指标
  useEffect(() => {
    if (product) {
      calculateConfidenceScore();
      analyzeUseCaseMatch();
      calculateOwnershipCost();
      generateSocialProof();
      assessValueAlignment();
    }
  }, [product, userPreferences]);
  
  // 计算推荐信心度
  const calculateConfidenceScore = () => {
    // 这里应该根据产品与用户需求的匹配度进行计算
    // 简单示例：基于多个因素的加权平均
    
    // 1. 基本需求匹配度 (40%)
    const needsMatchScore = calculateNeedsMatch() * 0.4;
    
    // 2. 价格合理性 (25%)
    const priceReasonabilityScore = calculatePriceReasonability() * 0.25;
    
    // 3. 产品质量评分 (20%)
    const qualityScore = (product.rating / 5) * 0.2;
    
    // 4. 用户交互历史相关性 (15%)
    const interactionRelevanceScore = calculateInteractionRelevance() * 0.15;
    
    // 总分
    const totalScore = needsMatchScore + priceReasonabilityScore + qualityScore + interactionRelevanceScore;
    setConfidenceScore(Math.min(Math.round(totalScore * 100), 100));
  };
  
  // 计算需求匹配度
  const calculateNeedsMatch = () => {
    // 实际应用中应考虑更多因素，这里简化处理
    const userNeeds = userPreferences.needs || [];
    const productFeatures = product.features || [];
    
    // 计算匹配的需求数量
    let matchCount = 0;
    userNeeds.forEach(need => {
      if (productFeatures.some(feature => 
        feature.toLowerCase().includes(need.toLowerCase())
      )) {
        matchCount++;
      }
    });
    
    return userNeeds.length > 0 ? matchCount / userNeeds.length : 0.5;
  };
  
  // 计算价格合理性
  const calculatePriceReasonability = () => {
    const userBudget = userPreferences.budget || Infinity;
    
    // 如果价格在预算内，得分高
    if (product.price <= userBudget) {
      // 价格越接近预算上限，得分越低
      return Math.max(0.7, 1 - (product.price / userBudget));
    } else {
      // 价格超过预算，根据超出程度降低得分
      return Math.max(0.1, 0.7 - (0.3 * (product.price - userBudget) / userBudget));
    }
  };
  
  // 计算用户交互历史相关性
  const calculateInteractionRelevance = () => {
    // 模拟计算：实际应用中应分析用户历史交互数据
    // 例如查看过的类似产品、搜索关键词等
    return 0.75; // 简化示例
  };
  
  // 分析使用场景匹配度
  const analyzeUseCaseMatch = () => {
    // 模拟几个主要使用场景及其匹配度
    const userUseCases = userPreferences.useCases || ['日常使用'];
    
    const useCaseMatchData = {
      primaryUseCase: userUseCases[0] || '日常使用',
      matchScore: Math.round(Math.random() * 40 + 60), // 60-100之间的随机数
      strengths: [
        '适合' + (userUseCases[0] || '日常') + '场景',
        product.category === '手机' ? '便携性好' : '操作简单',
        '功能齐全'
      ],
      limitations: [
        product.price > 3000 ? '高端定位，性价比较低' : '部分高级功能缺失',
        '需要适应期'
      ]
    };
    
    setUseCaseMatch(useCaseMatchData);
  };
  
  // 计算购后成本
  const calculateOwnershipCost = () => {
    // 模拟计算购后拥有成本
    const purchasePrice = product.price;
    const yearlyMaintenanceCost = Math.round(purchasePrice * 0.05); // 假设维护成本是购买价格的5%
    const accessoriesCost = Math.round(purchasePrice * 0.15); // 假设配件成本是购买价格的15%
    const upgradeCost = product.category === '手机' || product.category === '电脑' ? 
                        Math.round(purchasePrice * 0.2) : 0; // 电子产品通常需要升级
    
    // 根据品类估算使用寿命
    let estimatedLifespan = 3; // 默认3年
    if (product.category === '手机') estimatedLifespan = 2;
    else if (product.category === '家电') estimatedLifespan = 8;
    else if (product.category === '电脑') estimatedLifespan = 4;
    
    // 计算总拥有成本和每年平均成本
    const totalCost = purchasePrice + (yearlyMaintenanceCost * estimatedLifespan) + accessoriesCost + upgradeCost;
    const annualCost = Math.round(totalCost / estimatedLifespan);
    
    setOwnershipCost({
      purchasePrice,
      yearlyMaintenanceCost,
      accessoriesCost,
      upgradeCost,
      estimatedLifespan,
      totalCost,
      annualCost
    });
  };
  
  // 生成社会证明数据
  const generateSocialProof = () => {
    // 模拟社会证明数据
    const userReviewCount = Math.floor(Math.random() * 10000) + 500;
    const expertReviewCount = Math.floor(Math.random() * 10) + 1;
    
    // 模拟用户评价关键词
    const reviewKeywords = [
      { term: '质量好', count: Math.floor(Math.random() * 500) + 100, sentiment: 'positive' },
      { term: '性价比高', count: Math.floor(Math.random() * 400) + 80, sentiment: 'positive' },
      { term: '使用简单', count: Math.floor(Math.random() * 300) + 60, sentiment: 'positive' },
      { term: '外观漂亮', count: Math.floor(Math.random() * 200) + 50, sentiment: 'positive' },
      { term: '送货快', count: Math.floor(Math.random() * 150) + 40, sentiment: 'positive' },
      { term: '价格偏高', count: Math.floor(Math.random() * 100) + 20, sentiment: 'negative' },
      { term: '续航一般', count: Math.floor(Math.random() * 80) + 10, sentiment: 'negative' }
    ];
    
    // 按出现次数排序
    reviewKeywords.sort((a, b) => b.count - a.count);
    
    setSocialProof({
      rating: product.rating || 4.5,
      userReviewCount,
      expertReviewCount,
      reviewKeywords,
      // 构建几条虚拟的用户反馈
      recentReviews: [
        {
          username: '用户' + Math.floor(Math.random() * 10000),
          rating: Math.min(5, Math.max(3, Math.round(product.rating + (Math.random() - 0.5)))),
          comment: '这个产品比我想象的要好，很满意这次购买。',
          date: '3天前'
        },
        {
          username: '用户' + Math.floor(Math.random() * 10000),
          rating: Math.min(5, Math.max(3, Math.round(product.rating + (Math.random() - 0.5) - 0.5))),
          comment: '总体使用还行，有些小问题但不影响使用。',
          date: '1周前'
        }
      ]
    });
  };
  
  // 评估价值观匹配度
  const assessValueAlignment = () => {
    // 用户重视的因素(实际应从用户交互中提取)
    const defaultFactors = {
      priceValue: 0.8,    // 重视性价比
      quality: 0.6,       // 重视质量
      brandReputation: 0.4, // 一般关注品牌
      ecoFriendly: 0.3,    // 较少关注环保
      innovation: 0.5     // 中等关注创新
    };
    
    const factors = valueFactors || defaultFactors;
    
    // 模拟计算产品在各维度的得分
    const productScores = {
      priceValue: product.hasDiscount ? 0.9 : (product.price < 2000 ? 0.8 : 0.6),
      quality: (product.rating / 5) * 0.9,
      brandReputation: ['Apple', 'Samsung', 'Xiaomi', 'Huawei'].includes(product.brand) ? 0.9 : 0.7,
      ecoFriendly: Math.random() * 0.5 + 0.3, // 随机生成环保得分
      innovation: product.isNew ? 0.9 : 0.5
    };
    
    // 计算用户因素与产品评分的加权匹配度
    let totalWeight = 0;
    let weightedScore = 0;
    
    for (const factor in factors) {
      if (factors.hasOwnProperty(factor) && productScores.hasOwnProperty(factor)) {
        const weight = factors[factor];
        totalWeight += weight;
        weightedScore += weight * productScores[factor];
      }
    }
    
    const averageAlignment = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
    
    // 找出最契合的前3个因素和最不契合的因素
    const alignmentFactors = Object.keys(factors).map(factor => ({
      factor,
      userImportance: factors[factor],
      productScore: productScores[factor],
      alignment: factors[factor] * productScores[factor]
    }));
    
    alignmentFactors.sort((a, b) => b.alignment - a.alignment);
    
    setValueAlignment({
      overallScore: Math.round(averageAlignment * 100),
      topAlignedFactors: alignmentFactors.slice(0, 3),
      leastAlignedFactor: alignmentFactors[alignmentFactors.length - 1],
      allFactors: alignmentFactors
    });
  };
  
  // 获取信心度指示器样式和信息
  const getConfidenceIndicator = () => {
    if (confidenceScore >= 80) {
      return {
        icon: faCheckCircle,
        color: '#4CAF50',
        text: '高度推荐',
        description: '该产品非常适合您的需求'
      };
    } else if (confidenceScore >= 60) {
      return {
        icon: faCheckCircle,
        color: '#8BC34A',
        text: '推荐',
        description: '该产品适合您的大部分需求'
      };
    } else if (confidenceScore >= 40) {
      return {
        icon: faQuestion,
        color: '#FFC107',
        text: '中性推荐',
        description: '该产品部分满足您的需求'
      };
    } else {
      return {
        icon: faExclamationTriangle,
        color: '#F44336',
        text: '不推荐',
        description: '该产品可能不适合您的需求'
      };
    }
  };
  
  const confidenceIndicator = getConfidenceIndicator();
  
  // 渲染进度条
  const renderProgressBar = (percentage, color = '#4CAF50') => {
    return (
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }}
        ></div>
      </div>
    );
  };
  
  // 展示/隐藏详细分析
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // 获取价值观因素的友好名称
  const getFactorFriendlyName = (factorKey) => {
    const factorNames = {
      priceValue: '性价比',
      quality: '产品质量',
      brandReputation: '品牌声誉',
      ecoFriendly: '环保特性',
      innovation: '创新程度',
      durability: '耐用性',
      aesthetics: '美观设计',
      easeOfUse: '易用性'
    };
    
    return factorNames[factorKey] || factorKey;
  };
  
  return (
    <div className="decision-support-container">
      <div className="decision-header" onClick={toggleExpanded}>
        <div className="decision-title">
          <FontAwesomeIcon icon={faLightbulb} className="decision-icon" />
          <h3>智能决策助手</h3>
        </div>
        <div className="decision-subtitle">
          深度分析，辅助您做出最明智的购买决策
        </div>
        <div className="toggle-indicator">
          {isExpanded ? '收起' : '展开'} 详细分析
        </div>
      </div>
      
      <div className="decision-summary">
        <div className="confidence-indicator" style={{ borderColor: confidenceIndicator.color }}>
          <div className="confidence-icon-container" style={{ backgroundColor: confidenceIndicator.color }}>
            <FontAwesomeIcon icon={confidenceIndicator.icon} className="confidence-icon" />
          </div>
          <div className="confidence-info">
            <div className="confidence-text">{confidenceIndicator.text}</div>
            <div className="confidence-score">{confidenceScore}% 匹配度</div>
            <div className="confidence-description">{confidenceIndicator.description}</div>
          </div>
        </div>
        
        <div className="primary-usecase">
          <FontAwesomeIcon icon={faUserCheck} className="usecase-icon" />
          <div className="usecase-info">
            <div className="usecase-title">主要使用场景: {useCaseMatch.primaryUseCase}</div>
            <div className="usecase-match">
              匹配度: {useCaseMatch.matchScore}%
              {renderProgressBar(useCaseMatch.matchScore, '#42A5F5')}
            </div>
          </div>
        </div>
        
        <div className="value-match">
          <FontAwesomeIcon icon={faHeart} className="value-icon" />
          <div className="value-info">
            <div className="value-title">与您的价值观匹配度</div>
            <div className="value-score">
              {valueAlignment.overallScore}%
              {renderProgressBar(valueAlignment.overallScore, '#9C27B0')}
            </div>
            {valueAlignment.topAlignedFactors && (
              <div className="value-details">
                最匹配的因素: {getFactorFriendlyName(valueAlignment.topAlignedFactors[0]?.factor)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="decision-details">
          {/* 使用场景详细分析 */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faUserCheck} className="section-icon" />
              使用场景分析
            </h4>
            <div className="usecase-strengths">
              <div className="detail-subtitle">优势:</div>
              <ul className="strength-list">
                {useCaseMatch.strengths?.map((strength, index) => (
                  <li key={`strength-${index}`} className="strength-item">
                    <FontAwesomeIcon icon={faThumbsUp} className="strength-icon" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="usecase-limitations">
              <div className="detail-subtitle">局限性:</div>
              <ul className="limitation-list">
                {useCaseMatch.limitations?.map((limitation, index) => (
                  <li key={`limitation-${index}`} className="limitation-item">
                    <FontAwesomeIcon icon={faThumbsDown} className="limitation-icon" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 购后成本分析 */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faCoins} className="section-icon" />
              购后成本分析
            </h4>
            <div className="cost-overview">
              <div className="cost-item">
                <div className="cost-label">预计使用寿命:</div>
                <div className="cost-value">{ownershipCost.estimatedLifespan} 年</div>
              </div>
              <div className="cost-item">
                <div className="cost-label">总拥有成本:</div>
                <div className="cost-value">￥{ownershipCost.totalCost?.toLocaleString()}</div>
              </div>
              <div className="cost-item">
                <div className="cost-label">年均成本:</div>
                <div className="cost-value">￥{ownershipCost.annualCost?.toLocaleString()}/年</div>
              </div>
            </div>
            <div className="cost-breakdown">
              <div className="detail-subtitle">成本构成:</div>
              <div className="cost-chart">
                <div className="cost-bar purchase" style={{ width: `${ownershipCost.purchasePrice / ownershipCost.totalCost * 100}%` }}>
                  <span className="cost-bar-label">购买价</span>
                </div>
                <div className="cost-bar maintenance" style={{ width: `${ownershipCost.yearlyMaintenanceCost * ownershipCost.estimatedLifespan / ownershipCost.totalCost * 100}%` }}>
                  <span className="cost-bar-label">维护</span>
                </div>
                <div className="cost-bar accessories" style={{ width: `${ownershipCost.accessoriesCost / ownershipCost.totalCost * 100}%` }}>
                  <span className="cost-bar-label">配件</span>
                </div>
                <div className="cost-bar upgrade" style={{ width: `${ownershipCost.upgradeCost / ownershipCost.totalCost * 100}%` }}>
                  <span className="cost-bar-label">升级</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 社会证明 */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faUsers} className="section-icon" />
              用户评价分析
            </h4>
            <div className="review-overview">
              <div className="review-rating">
                <div className="rating-number">{socialProof.rating?.toFixed(1)}</div>
                <div className="rating-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon 
                      key={`star-${i}`}
                      icon={faStar} 
                      className={`star-icon ${i < Math.floor(socialProof.rating) ? 'full' : (i < socialProof.rating ? 'half' : 'empty')}`} 
                    />
                  ))}
                </div>
                <div className="rating-count">{socialProof.userReviewCount?.toLocaleString()} 条评价</div>
              </div>
              <div className="review-keywords">
                <div className="detail-subtitle">热门评价关键词:</div>
                <div className="keyword-cloud">
                  {socialProof.reviewKeywords?.slice(0, 5).map((keyword, index) => (
                    <span 
                      key={`keyword-${index}`} 
                      className={`keyword-tag ${keyword.sentiment}`}
                      style={{ fontSize: `${Math.min(16, 12 + (keyword.count / 100))}px` }}
                    >
                      {keyword.term}
                      <span className="keyword-count">({keyword.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="recent-reviews">
              <div className="detail-subtitle">用户评价摘要:</div>
              {socialProof.recentReviews?.map((review, index) => (
                <div key={`review-${index}`} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.username}</span>
                    <span className="review-date">{review.date}</span>
                    <div className="review-rating-mini">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FontAwesomeIcon 
                          key={`mini-star-${i}`}
                          icon={faStar} 
                          className={`mini-star ${i < review.rating ? 'full' : 'empty'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 价值观匹配分析 */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faBalanceScale} className="section-icon" />
              价值观匹配分析
            </h4>
            <div className="value-alignment-details">
              {valueAlignment.allFactors?.map((factor, index) => (
                <div key={`factor-${index}`} className="value-factor">
                  <div className="factor-name">{getFactorFriendlyName(factor.factor)}</div>
                  <div className="factor-bars">
                    <div className="factor-importance">
                      <span className="bar-label">重要性</span>
                      <div className="factor-bar-container">
                        <div 
                          className="factor-bar-fill importance-bar" 
                          style={{ width: `${factor.userImportance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="factor-score">
                      <span className="bar-label">产品得分</span>
                      <div className="factor-bar-container">
                        <div 
                          className="factor-bar-fill score-bar" 
                          style={{ width: `${factor.productScore * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="value-conclusion">
              <div className="detail-subtitle">结论:</div>
              <div className="value-recommendation">
                {valueAlignment.overallScore >= 75 ? (
                  <span className="positive-match">
                    <FontAwesomeIcon icon={faCheckCircle} /> 
                    该产品与您的价值观高度匹配
                  </span>
                ) : valueAlignment.overallScore >= 50 ? (
                  <span className="moderate-match">
                    <FontAwesomeIcon icon={faQuestion} />
                    该产品与您的部分价值观匹配
                  </span>
                ) : (
                  <span className="low-match">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    该产品与您的价值观匹配度较低
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* 最终建议 */}
          <div className="final-recommendation">
            <h4 className="recommendation-title">
              <FontAwesomeIcon icon={faHandHolding} className="recommendation-icon" />
              最终建议
            </h4>
            <div className="recommendation-content">
              <p className="recommendation-text">
                {confidenceScore >= 75 ? (
                  `基于全面分析，我们强烈推荐您购买${product.name}。它非常适合您的${useCaseMatch.primaryUseCase}需求，
                  且符合您重视${getFactorFriendlyName(valueAlignment.topAlignedFactors?.[0]?.factor)}的价值观。
                  用户反馈积极，总体拥有成本合理。这将是一个明智的购买决策。`
                ) : confidenceScore >= 50 ? (
                  `基于分析，${product.name}可以满足您的基本需求，特别是在${useCaseMatch.primaryUseCase}方面表现不错。
                  考虑到您重视${getFactorFriendlyName(valueAlignment.topAlignedFactors?.[0]?.factor)}，这款产品是一个不错的选择，
                  但也存在一些局限性。如果您能接受这些局限，这仍是一个合理的购买选择。`
                ) : (
                  `基于分析，我们不确定${product.name}是否是最适合您的选择。虽然它在某些方面符合您的需求，
                  但在${useCaseMatch.limitations?.[0]}等方面存在局限。考虑到您重视${getFactorFriendlyName(valueAlignment.topAlignedFactors?.[0]?.factor)}，
                  您可能需要考虑其他选项或进一步了解这款产品是否确实适合您。`
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionSupport;