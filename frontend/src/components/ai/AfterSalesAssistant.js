import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faQuestionCircle, 
  faTools, 
  faExchangeAlt, 
  faUndo, 
  faShippingFast,
  faInfoCircle,
  faHeadset,
  faThumbsUp,
  faThumbsDown,
  faChartLine,
  faHistory,
  faFileAlt,
  faComment,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import './AiComponents.css';
import { getAiSolution } from '../../services/afterSalesService';

/**
 * 售后服务智能助手组件
 * 提供智能问题分析、解决方案推荐和售后服务追踪
 */
const AfterSalesAssistant = ({ 
  order, 
  issueType = '',
  onSolutionSelect,
  onContactSupport
}) => {
  // 组件状态
  const [activeIssue, setActiveIssue] = useState(issueType);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);
  const [caseDifficulty, setCaseDifficulty] = useState(null);
  const [videoAssistanceAvailable, setVideoAssistanceAvailable] = useState(false);
  const [showRootCauseAnalysis, setShowRootCauseAnalysis] = useState(false);
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState(null);
  const [similarCases, setSimilarCases] = useState([]);
  const [showSimilarCases, setShowSimilarCases] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // 问题类型
  const issueTypes = [
    { id: 'quality', icon: faQuestionCircle, label: '商品质量问题' },
    { id: 'function', icon: faTools, label: '功能异常' },
    { id: 'wrong', icon: faExchangeAlt, label: '收到错误商品' },
    { id: 'return', icon: faUndo, label: '退换货申请' },
    { id: 'delivery', icon: faShippingFast, label: '物流问题' }
  ];
  
  // 当问题类型改变时，重新分析问题
  useEffect(() => {
    if (activeIssue) {
      analyzeIssue(activeIssue);
    }
  }, [activeIssue, order]);
  
  // 分析问题并提供解决方案
  const analyzeIssue = async (issueId) => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setShowRootCauseAnalysis(false);
    setShowSimilarCases(false);
    
    try {
      // 获取AI智能解决方案
      const productCategory = order?.items[0]?.category || 'general';
      const solution = await getAiSolution(issueId, productCategory);
      setAiSolution(solution);
      
      // 根据问题类型生成解决方案步骤
      setSolutions(solution.steps || []);
      
      // 分析案例难度
      if (issueId === 'quality' || issueId === 'function') {
        setCaseDifficulty('medium');
        setVideoAssistanceAvailable(true);
      } else if (issueId === 'wrong') {
        setCaseDifficulty('easy');
        setVideoAssistanceAvailable(false);
      } else if (issueId === 'return') {
        setCaseDifficulty('easy');
        setVideoAssistanceAvailable(false);
      } else {
        setCaseDifficulty('complex');
        setVideoAssistanceAvailable(true);
      }
      
      // 生成根因分析
      generateRootCauseAnalysis(issueId, productCategory);
      
      // 查找相似案例
      findSimilarCases(issueId, productCategory);
      
      // 为特定问题类型推荐相关产品
      if (issueId === 'function' || issueId === 'quality') {
        setRelatedProducts([
          { id: 1, name: '同款升级版商品', price: '¥499.00', imageUrl: 'https://via.placeholder.com/80' },
          { id: 2, name: '专业维修工具套装', price: '¥129.00', imageUrl: 'https://via.placeholder.com/80' }
        ]);
      } else if (issueId === 'delivery') {
        setRelatedProducts([
          { id: 3, name: '商品防震保护套', price: '¥39.00', imageUrl: 'https://via.placeholder.com/80' },
          { id: 4, name: '优质包装箱', price: '¥15.00', imageUrl: 'https://via.placeholder.com/80' }
        ]);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('获取AI解决方案失败:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }
  };
  
  // 生成根因分析
  const generateRootCauseAnalysis = (issueId, category) => {
    const rootCauses = {
      'quality': {
        causes: [
          { probability: 0.68, cause: '生产材料质量问题', impact: '导致产品外观或结构缺陷' },
          { probability: 0.22, cause: '生产过程控制不严', impact: '导致功能或性能不达标' },
          { probability: 0.10, cause: '运输过程中的损坏', impact: '导致产品外观或功能受损' }
        ],
        prevention: '建议对商品进行全面检查并拍照记录，以便商家分析问题根源。'
      },
      'function': {
        causes: [
          { probability: 0.45, cause: '产品设计或工艺缺陷', impact: '导致核心功能异常' },
          { probability: 0.35, cause: '兼容性问题', impact: '与其他设备或系统不匹配' },
          { probability: 0.20, cause: '使用方法不当', impact: '未按照说明书正确操作' }
        ],
        prevention: '建议先检查产品说明书，尝试重置或更新软件，再联系技术支持。'
      },
      'wrong': {
        causes: [
          { probability: 0.75, cause: '订单处理错误', impact: '系统配对错误的商品' },
          { probability: 0.20, cause: '包装标签错误', impact: '物流分拣过程中的混淆' },
          { probability: 0.05, cause: '库存管理问题', impact: '商品SKU管理不当' }
        ],
        prevention: '收到商品时请立即核对与订单的一致性，发现问题及时联系客服。'
      },
      'return': {
        causes: [
          { probability: 0.60, cause: '消费者需求变化', impact: '不再需要该商品' },
          { probability: 0.25, cause: '商品不符合预期', impact: '实物与描述有差异' },
          { probability: 0.15, cause: '找到更优选择', impact: '有更好的替代品' }
        ],
        prevention: '购买前充分了解商品信息，查看评价和实物图片，降低退货可能性。'
      },
      'delivery': {
        causes: [
          { probability: 0.40, cause: '物流公司处理延误', impact: '配送时间比预期长' },
          { probability: 0.30, cause: '地址信息不准确', impact: '快递无法准确投递' },
          { probability: 0.30, cause: '天气或特殊情况', impact: '不可抗力因素导致延误' }
        ],
        prevention: '填写准确的收货信息，选择信誉良好的物流公司，提前规划收货时间。'
      }
    };
    
    setRootCauseAnalysis(rootCauses[issueId] || {
      causes: [
        { probability: 0.5, cause: '未知原因', impact: '需要进一步分析' },
        { probability: 0.3, cause: '系统记录缺失', impact: '无法追踪具体问题' },
        { probability: 0.2, cause: '特殊情况', impact: '非常规问题' }
      ],
      prevention: '建议保留所有购物凭证和商品，便于售后分析和处理。'
    });
  };
  
  // 查找相似案例
  const findSimilarCases = (issueId, category) => {
    const similarCasesData = {
      'quality': [
        { id: 'SC001', title: '显示屏有亮点问题', resolution: '商家免费更换新机', timeToResolve: '5天' },
        { id: 'SC002', title: '外壳有轻微磨损', resolution: '部分退款补偿', timeToResolve: '3天' }
      ],
      'function': [
        { id: 'SC003', title: '无法开机/充电', resolution: '远程指导排除电池接触问题', timeToResolve: '1天' },
        { id: 'SC004', title: '蓝牙连接不稳定', resolution: '通过固件更新解决', timeToResolve: '2天' }
      ],
      'wrong': [
        { id: 'SC005', title: '收到错误颜色的商品', resolution: '安排退换正确商品', timeToResolve: '7天' },
        { id: 'SC006', title: '收到不同型号产品', resolution: '直接换货处理', timeToResolve: '5天' }
      ],
      'return': [
        { id: 'SC007', title: '7天无理由退货', resolution: '全额退款处理', timeToResolve: '10天' },
        { id: 'SC008', title: '商品不符合描述申请退款', resolution: '协商部分退款', timeToResolve: '7天' }
      ],
      'delivery': [
        { id: 'SC009', title: '物流长时间未更新', resolution: '联系物流公司加急处理', timeToResolve: '2天' },
        { id: 'SC010', title: '包裹派送失败', resolution: '重新安排派送', timeToResolve: '1天' }
      ]
    };
    
    setSimilarCases(similarCasesData[issueId] || [
      { id: 'SC000', title: '通用问题处理', resolution: '客服人工介入处理', timeToResolve: '3-5天' }
    ]);
  };
  
  // 选择问题类型
  const handleIssueSelect = (issueId) => {
    setActiveIssue(issueId);
    setFeedbackGiven(false);
  };
  
  // 选择解决方案
  const handleSolutionSelect = (solution) => {
    if (onSolutionSelect) {
      onSolutionSelect(activeIssue, solution);
    }
  };
  
  // 开始视频咨询
  const handleStartVideoAssistance = () => {
    alert('视频咨询功能即将开始，请保持网络通畅');
    // 实际项目中应调用视频会议API
  };
  
  // 提交反馈
  const handleFeedback = (isPositive) => {
    // 实际项目中应向后端发送反馈
    console.log(`用户提交了${isPositive ? '正面' : '负面'}反馈`);
    setFeedbackGiven(true);
    alert(`感谢您的${isPositive ? '正面' : '负面'}反馈，我们会继续${isPositive ? '保持' : '改进'}服务质量`);
  };
  
  return (
    <div className="after-sales-assistant">
      <div className="after-sales-header">
        <h2 className="after-sales-title">
          <FontAwesomeIcon icon={faRobot} className="ai-icon" />
          AI售后助手
        </h2>
      </div>
      
      <div className="after-sales-content">
        {order ? (
          <>
            <p className="order-info">
              <strong>订单号:</strong> {order.id} | 
              <strong>下单时间:</strong> {new Date(order.date).toLocaleString()}
            </p>
            
            {/* 问题类型选择 */}
            <div className="issue-selection">
              <h3>请选择您遇到的问题类型：</h3>
              <div className="support-options">
                {issueTypes.map(issue => (
                  <div 
                    key={issue.id}
                    className={`support-option ${activeIssue === issue.id ? 'active' : ''}`}
                    onClick={() => handleIssueSelect(issue.id)}
                  >
                    <FontAwesomeIcon icon={issue.icon} className="support-icon" />
                    <span>{issue.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 问题分析与解决方案 */}
            {activeIssue && (
              <div className="issue-analysis">
                <h3 className="issue-title">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  问题分析与解决方案
                </h3>
                
                {isAnalyzing ? (
                  <div className="analyzing">
                    <div className="ai-loading-spinner"></div>
                    <p>AI正在分析您的问题，请稍候...</p>
                  </div>
                ) : analysisComplete ? (
                  <>
                    {aiSolution && (
                      <div className="solution-summary">
                        <h4>{aiSolution.title}</h4>
                        <div className="solution-meta">
                          <span>预计处理时间: {aiSolution.estimatedTime}</span>
                          <span>成功率: {aiSolution.successRate}</span>
                          {caseDifficulty && (
                            <span className={`case-difficulty ${caseDifficulty}`}>
                              难度: {caseDifficulty === 'easy' ? '简单' : caseDifficulty === 'medium' ? '中等' : '复杂'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <ol className="solution-steps">
                      {solutions.map((step, index) => (
                        <li key={index} onClick={() => handleSolutionSelect(step)}>
                          <div className="step-number">{index + 1}</div>
                          <div className="step-content">{step}</div>
                        </li>
                      ))}
                    </ol>
                    
                    {/* 视频咨询选项 */}
                    {videoAssistanceAvailable && (
                      <div className="video-assistance">
                        <button 
                          className="video-assistance-btn"
                          onClick={handleStartVideoAssistance}
                        >
                          <FontAwesomeIcon icon={faVideo} />
                          开始视频咨询
                        </button>
                        <span className="video-assistance-tip">
                          针对您的问题，视频咨询可以更快解决
                        </span>
                      </div>
                    )}
                    
                    {/* 高级分析工具 */}
                    <div className="advanced-tools">
                      <div 
                        className={`advanced-tool-btn ${showRootCauseAnalysis ? 'active' : ''}`}
                        onClick={() => setShowRootCauseAnalysis(!showRootCauseAnalysis)}
                      >
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>查看根因分析</span>
                      </div>
                      <div 
                        className={`advanced-tool-btn ${showSimilarCases ? 'active' : ''}`}
                        onClick={() => setShowSimilarCases(!showSimilarCases)}
                      >
                        <FontAwesomeIcon icon={faHistory} />
                        <span>查看类似案例</span>
                      </div>
                      <div 
                        className="advanced-tool-btn"
                        onClick={() => window.open(`/service-report?orderId=${order.id}&issueType=${activeIssue}`, '_blank')}
                      >
                        <FontAwesomeIcon icon={faFileAlt} />
                        <span>生成服务报告</span>
                      </div>
                    </div>
                    
                    {/* 根因分析 */}
                    {showRootCauseAnalysis && rootCauseAnalysis && (
                      <div className="root-cause-analysis">
                        <h4>问题根因分析</h4>
                        <div className="root-causes">
                          {rootCauseAnalysis.causes.map((cause, index) => (
                            <div key={index} className="cause-item">
                              <div className="cause-probability" style={{width: `${cause.probability * 100}%`}}>
                                {(cause.probability * 100).toFixed(0)}%
                              </div>
                              <div className="cause-info">
                                <div className="cause-title">{cause.cause}</div>
                                <div className="cause-impact">{cause.impact}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="prevention-tip">
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <span>{rootCauseAnalysis.prevention}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* 类似案例 */}
                    {showSimilarCases && similarCases.length > 0 && (
                      <div className="similar-cases">
                        <h4>类似案例参考</h4>
                        <div className="cases-list">
                          {similarCases.map((caseItem, index) => (
                            <div key={index} className="case-item">
                              <div className="case-id">{caseItem.id}</div>
                              <div className="case-info">
                                <div className="case-title">{caseItem.title}</div>
                                <div className="case-resolution">解决方案: {caseItem.resolution}</div>
                                <div className="case-time">解决时间: {caseItem.timeToResolve}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 人工客服选项 */}
                    <div className="contact-support">
                      <button 
                        className="contact-support-btn"
                        onClick={onContactSupport}
                      >
                        <FontAwesomeIcon icon={faHeadset} />
                        联系人工客服
                      </button>
                      <span className="support-tip">
                        {caseDifficulty === 'complex' ? 
                          '您的问题较为复杂，建议联系人工客服' : 
                          '如果自助解决方案无法解决您的问题，请联系人工客服'}
                      </span>
                    </div>
                    
                    {/* 相关推荐产品 */}
                    {relatedProducts.length > 0 && (
                      <div className="related-products">
                        <h4 className="related-title">您可能还需要：</h4>
                        <div className="related-product-list">
                          {relatedProducts.map(product => (
                            <div key={product.id} className="related-product-item">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="related-product-image"
                              />
                              <div className="related-product-info">
                                <div className="related-product-name">{product.name}</div>
                                <div className="related-product-price">{product.price}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 用户反馈 */}
                    <div className="feedback-section">
                      <div className="feedback-question">解决方案对您有帮助吗？</div>
                      <div className="feedback-buttons">
                        <button 
                          className={`feedback-btn positive ${feedbackGiven ? 'disabled' : ''}`}
                          onClick={() => !feedbackGiven && handleFeedback(true)}
                          disabled={feedbackGiven}
                        >
                          <FontAwesomeIcon icon={faThumbsUp} /> 有帮助
                        </button>
                        <button 
                          className={`feedback-btn negative ${feedbackGiven ? 'disabled' : ''}`}
                          onClick={() => !feedbackGiven && handleFeedback(false)}
                          disabled={feedbackGiven}
                        >
                          <FontAwesomeIcon icon={faThumbsDown} /> 没帮助
                        </button>
                      </div>
                      {feedbackGiven && (
                        <div className="feedback-thanks">
                          感谢您的反馈！我们将不断改进服务质量。
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="select-prompt">请先选择问题类型</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-order-selected">
            <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            <p>请先选择需要售后服务的订单</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AfterSalesAssistant;