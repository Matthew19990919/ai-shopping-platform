import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './ChatMessage.css';
import ProductCard from '../ProductCard/ProductCard';
import ProductRecommendationGroup from '../ProductRecommendation/ProductRecommendationGroup';
import ProductComparisonTable from '../ProductComparison/ProductComparisonTable';
import PriceAnalysisChart from '../PriceAnalysis/PriceAnalysisChart';
import mockData from '../../utils/mockData';
import remarkGfm from 'remark-gfm';

// 添加产品数据库，包含常见3D打印机型号和iPhone的详细参数
const productDataLibrary = {
  // 3D打印机数据
  "Prusa i3 MK3S+": {
    "价格": "约6999元，高端价位",
    "打印质量": "出色的精度和表面光洁度，层高可达0.05mm",
    "易用性": "自动校准，用户友好的界面，但需要一定的组装",
    "可靠性": "高质量组件，坚固耐用，故障率低，打印成功率高",
    "社区支持": "庞大的用户社区，官方支持良好，资源丰富"
  },
  "Creality Ender-3 S1 Pro": {
    "价格": "约2399元，入门级价格",
    "打印质量": "良好的精度，层高0.1mm，对于价格来说表现不错",
    "易用性": "部分预装，触摸屏操作，易于上手",
    "可靠性": "组件质量适中，性价比高，需要定期维护",
    "社区支持": "庞大的用户群体，大量教程和改装指南"
  },
  "Prusa i3": {
    "价格": "约6500-7500元，高端价位",
    "打印质量": "高精度，细节表现好，图层高度可调",
    "易用性": "较复杂，需要一定技术基础",
    "可靠性": "工业级可靠性，长时间打印稳定性高",
    "社区支持": "全球活跃的用户社区，问题解决资源丰富"
  },
  "Ender-3": {
    "价格": "约1200-3000元，根据型号差异",
    "打印质量": "基础良好，入门级优秀表现",
    "易用性": "需要一定调试，但操作简单",
    "可靠性": "家用级可靠性，性价比高",
    "社区支持": "大量用户和教程资源"
  },
  
  // iPhone数据
  "iPhone 16": {
    "处理器": "A18芯片，更强大的性能和AI处理能力",
    "屏幕": "6.1英寸Super Retina XDR，支持120Hz ProMotion高刷新率",
    "摄像头": "升级的4800万像素主摄，搭配4800万像素超广角和长焦镜头",
    "电池": "更大容量电池，支持更长续航时间，支持35W快充",
    "存储": "起步容量为256GB，最高可达1TB",
    "价格": "起售价6999元起",
    "新功能": "更先进的Apple Intelligence人工智能功能，空间视频拍摄能力"
  },
  "iPhone 15": {
    "处理器": "A16仿生芯片，6核CPU和5核GPU",
    "屏幕": "6.1英寸Super Retina XDR，60Hz刷新率",
    "摄像头": "4800万像素主摄，搭配1200万像素超广角镜头",
    "电池": "标准电池容量，支持MagSafe无线充电和20W快充",
    "存储": "128GB起步，最高可达512GB",
    "价格": "起售价5999元起",
    "新功能": "动态岛设计，USB-C接口，全天候显示屏"
  },
  
  // 添加苹果XS和华为P40的数据
  "iPhone XS": {
    "处理器": "A12仿生芯片，六核设计",
    "屏幕": "5.8英寸Super Retina OLED显示屏，2436 x 1125分辨率",
    "摄像头": "双1200万像素后置摄像头，支持智能HDR和人像模式",
    "电池": "2658mAh，支持无线充电",
    "存储": "64GB/256GB/512GB",
    "价格": "原售价8699元起",
    "特点": "Face ID面部识别，IP68防水防尘"
  },
  "华为P40": {
    "处理器": "麒麟990 5G八核处理器",
    "屏幕": "6.1英寸OLED屏幕，2340 x 1080分辨率",
    "摄像头": "5000万像素主摄+1600万像素超广角+800万像素长焦，徕卡认证",
    "电池": "3800mAh，支持22.5W快充",
    "存储": "128GB/256GB，支持NM卡扩展",
    "价格": "原售价4188元起",
    "特点": "5G支持，徕卡三摄，EMUI 10.1系统"
  },
  "苹果XS": {
    "处理器": "A12仿生芯片，六核设计",
    "屏幕": "5.8英寸Super Retina OLED显示屏，2436 x 1125分辨率",
    "摄像头": "双1200万像素后置摄像头，支持智能HDR和人像模式",
    "电池": "2658mAh，支持无线充电",
    "存储": "64GB/256GB/512GB",
    "价格": "原售价8699元起",
    "特点": "Face ID面部识别，IP68防水防尘"
  }
};

// 根据产品类型获取比较方面
const getComparisonAspects = (productName) => {
  // 标准化产品名称
  const normalizedName = productName.toLowerCase();
  
  // 判断产品类型
  if (normalizedName.includes('iphone')) {
    return ["处理器", "屏幕", "摄像头", "电池", "存储", "价格", "新功能"];
  } else if (normalizedName.includes('prusa') || normalizedName.includes('ender') || normalizedName.includes('打印机')) {
    return ["价格", "打印质量", "易用性", "可靠性", "社区支持"];
  }
  
  // 默认比较方面
  return ["价格", "性能", "特点", "用户评价"];
};

// 查找最接近的产品数据的辅助函数
const findClosestProduct = (name) => {
  if (!name) return null;
  
  // 标准化名称
  const normalizedName = name.toLowerCase().trim();
  
  // 直接匹配
  for (const key of Object.keys(productDataLibrary)) {
    if (key.toLowerCase() === normalizedName) {
      return key;
    }
  }
  
  // 部分匹配
  for (const key of Object.keys(productDataLibrary)) {
    if (normalizedName.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedName)) {
      return key;
    }
  }
  
  // iPhone特殊匹配
  if (normalizedName.includes('iphone') || normalizedName.includes('苹果')) {
    if (normalizedName.includes('16') || normalizedName.includes('十六')) {
      return "iPhone 16";
    }
    if (normalizedName.includes('15') || normalizedName.includes('十五')) {
      return "iPhone 15";
    }
    if (normalizedName.includes('xs') || normalizedName.includes('x s')) {
      return "iPhone XS";
    }
  }
  
  // 华为特殊匹配
  if (normalizedName.includes('华为') || normalizedName.includes('huawei')) {
    if (normalizedName.includes('p40')) {
      return "华为P40";
    }
  }
  
  // 关键词匹配
  const matchKeywords = {
    "prusa i3 mk3s+": ["prusa", "mk3s+"],
    "creality ender-3 s1 pro": ["ender-3 s1", "s1 pro", "creality s1"],
    "prusa i3": ["prusa i3", "普鲁萨", "prusa"],
    "ender-3": ["ender3", "ender-3", "恩德", "创想"],
    "iphone 16": ["iphone16", "iphone 16", "苹果16", "苹果 16"],
    "iphone 15": ["iphone15", "iphone 15", "苹果15", "苹果 15"],
    "iphone xs": ["iphonexs", "iphone xs", "苹果xs", "苹果 xs", "xs", "x s"],
    "华为p40": ["huaweip40", "华为p40", "华为 p40", "p40"]
  };
  
  for (const [product, keywords] of Object.entries(matchKeywords)) {
    if (keywords.some(keyword => normalizedName.includes(keyword.toLowerCase()))) {
      // 找到匹配的产品，返回对应的标准名称
      for (const key of Object.keys(productDataLibrary)) {
        if (key.toLowerCase().includes(product.toLowerCase())) {
          return key;
        }
      }
    }
  }
  
  // 特殊处理常见产品
  if (normalizedName.includes("prusa") && normalizedName.includes("mk3s")) {
    return "Prusa i3 MK3S+";
  }
  
  if (normalizedName.includes("ender") && normalizedName.includes("s1 pro")) {
    return "Creality Ender-3 S1 Pro";
  }
  
  // 如果没有找到匹配的产品，返回null
  return null;
};

// 生成产品比较数据的函数
const generateComparisonData = (productName1, productName2) => {
  console.log(`尝试为 ${productName1} 和 ${productName2} 生成比较数据`);
  
  // 查找最匹配的产品
  const product1Key = findClosestProduct(productName1);
  const product2Key = findClosestProduct(productName2);
  
  console.log(`找到匹配产品: ${product1Key || '未找到'} 和 ${product2Key || '未找到'}`);
  
  // 如果两个产品都没有预设数据，使用通用比较维度
  if (!product1Key && !product2Key) {
    console.log("没有找到预设数据，使用通用比较模板");
    // 通用产品对比模板
    return {
      "价格": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" },
      "性能": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" },
      "特点": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" },
      "适用场景": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" },
      "优势": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" },
      "劣势": { [productName1]: "暂无具体数据", [productName2]: "暂无具体数据" }
    };
  }
  
  // 如果只有一个产品有预设数据，为另一个产品创建空数据
  if (product1Key && !product2Key) {
    const product1Data = productDataLibrary[product1Key];
    const aspectsToCompare = getComparisonAspects(product1Key);
    
    const comparisonData = {};
    aspectsToCompare.forEach(aspect => {
      comparisonData[aspect] = {
        [productName1]: product1Data[aspect] || "",
        [productName2]: "暂无具体数据"
      };
    });
    
    return comparisonData;
  }
  
  if (!product1Key && product2Key) {
    const product2Data = productDataLibrary[product2Key];
    const aspectsToCompare = getComparisonAspects(product2Key);
    
    const comparisonData = {};
    aspectsToCompare.forEach(aspect => {
      comparisonData[aspect] = {
        [productName1]: "暂无具体数据",
        [productName2]: product2Data[aspect] || ""
      };
    });
    
    return comparisonData;
  }
  
  // 获取产品数据
  const product1Data = productDataLibrary[product1Key];
  const product2Data = productDataLibrary[product2Key];
  
  // 根据产品类型获取比较方面
  const aspectsToCompare = getComparisonAspects(product1Key);
  
  // 整理比较数据
  const comparisonData = {};
  
  aspectsToCompare.forEach(aspect => {
    comparisonData[aspect] = {
      [productName1]: product1Data[aspect] || "",
      [productName2]: product2Data[aspect] || ""
    };
  });
  
  return comparisonData;
};

// 辅助函数：生成价格数据
function generatePriceData() {
  // 生成过去30天的日期
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });
  
  // 生成随机波动的价格数据
  const basePrice = 5000 + Math.random() * 1000;
  const prices = dates.map((date, index) => {
    // 在基础价格上增加一些随机波动
    let change = 0;
    
    // 添加一些价格波动的模式
    if (index % 7 === 0) { // 每周有一次大的波动
      change = (Math.random() - 0.3) * 300;
    } else {
      change = (Math.random() - 0.5) * 100;
    }
    
    // 确保价格不会太低
    const price = Math.max(basePrice + change, basePrice * 0.8);
    
    return {
      date,
      price: Math.round(price)
    };
  });
  
  return prices;
}

/**
 * 聊天消息组件
 * @param {Object} props
 * @param {string|Object} props.message 消息内容，可以是文本或对象
 * @param {boolean} props.isUser 是否是用户消息
 * @param {boolean} props.isStreaming 是否是流式消息
 * @param {string} props.timestamp 时间戳
 * @param {Object} props.mediaData 多媒体数据（图片、音频等）
 * @param {Array} props.products 产品数据数组
 */
const ChatMessage = ({ 
  message, 
  isUser, 
  isStreaming, 
  timestamp,
  mediaData,
  products = []
}) => {
  // 状态定义
  const [shouldShowComparison, setShouldShowComparison] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [shouldShowPriceAnalysis, setShouldShowPriceAnalysis] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  const [textData, setTextData] = useState(null);
  
  // 处理产品选择
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    // 模拟价格数据
    setPriceData(generatePriceData());
    // 显示价格分析
    setShouldShowPriceAnalysis(true);
  };

  // 检查消息是否包含图片标记
  const containsImageTag = typeof message === 'string' && message.includes('<div class="uploaded-image-preview">');
  
  // 使用useEffect处理消息格式化
  useEffect(() => {
    if (typeof message === 'string') {
      setProcessedContent(message);
    }
  }, [message]);
  
  // 处理图片消息展示
  const renderImageContent = () => {
    if (mediaData && mediaData.type === 'image') {
    return (
        <div className="message-image-content">
          <img 
            src={mediaData.content} 
            alt={mediaData.fileName || '上传图片'} 
            className="uploaded-image" 
          />
          {mediaData.fileName && (
            <div className="image-filename">{mediaData.fileName}</div>
          )}
      </div>
    );
    }
    return null;
  };

  // 处理HTML内容或文本消息
  const renderMessageContent = () => {
    // 如果是图片消息但没有mediaData，尝试从消息提取图片信息
    if (containsImageTag && !mediaData) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = message;
      const imgElement = tempDiv.querySelector('img');
      
      if (imgElement) {
        const imgSrc = imgElement.getAttribute('src');
        const captionDiv = tempDiv.querySelector('.image-caption');
        const caption = captionDiv ? captionDiv.textContent : '';
        
        // 提取图片部分和文本部分
        const textPart = message.split('<div class="uploaded-image-preview">')[0].trim();
    
    return (
          <>
            {textPart && <div className="message-text">{textPart}</div>}
            <div className="message-image-content">
              <img src={imgSrc} alt="上传图片" className="uploaded-image" />
              {caption && <div className="image-filename">{caption}</div>}
            </div>
          </>
        );
      }
    }
    
    // 处理普通文本消息
    return <div className="message-text">{processedContent}</div>;
  };

  // 如果传入了产品数组，则显示产品卡片
  const renderProductCards = () => {
    if (products && products.length > 0) {
    return (
        <div className="product-cards-container">
          {products.map((product, index) => (
            <div 
              key={index} 
              className={`product-card ${selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="product-image-container">
                <img 
                  src={product.imageUrl || '/images/placeholder-product.png'} 
                  alt={product.name}
                  className="product-image"
                />
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-brand">{product.brand}</div>
                
                <div className="product-rating">
                  <div className="product-stars">
                    {'★'.repeat(Math.floor(product.rating))}
                    {product.rating % 1 >= 0.5 ? '½' : ''}
                    {'☆'.repeat(5 - Math.ceil(product.rating))}
                  </div>
                  <span className="product-review-count">({product.rating})</span>
                </div>
                
                <div className="product-price">
                  <span className="current-price">¥{product.price}</span>
                </div>
                
                <div className="product-description">
                  {product.description}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
    }
    return null;
  };
  
  // 渲染组件
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      {/* 只保留助手消息的头像 */}
      {!isUser && (
      <div className="message-avatar">
          <div className="assistant-avatar">
            <FontAwesomeIcon icon={faRobot} />
          </div>
      </div>
      )}
      
      <div className="message-content-wrapper">
        <div className="message-content">
          {/* 渲染主要消息内容 */}
          {mediaData ? (
            <>
              {/* 如果有文本部分，先渲染文本 */}
              {message && typeof message === 'string' && message !== '' && (
                <div className="message-text">
                  {message.split('\n')[0]} {/* 仅显示第一行文本，避免显示HTML标记 */}
                </div>
              )}
              {/* 然后渲染媒体内容 */}
              {renderImageContent()}
            </>
          ) : (
            renderMessageContent()
          )}
          
          {/* 产品卡片列表 */}
          {renderProductCards()}
          
          {/* 产品比较表格和其他组件 */}
          {shouldShowComparison && products.length >= 2 && (
            <ProductComparisonTable products={products} />
          )}
          
          {/* 价格分析图表 */}
          {shouldShowPriceAnalysis && selectedProduct && (
            <div className="price-analysis-container">
              <h3 className="price-analysis-title">
                {selectedProduct.name} 价格分析
              </h3>
              <PriceAnalysisChart 
                priceData={priceData} 
                product={selectedProduct} 
              />
            </div>
          )}
        </div>
        
          {timestamp && (
            <div className="message-timestamp">
              {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          )}
      </div>
    </div>
  );
};

export default ChatMessage; 