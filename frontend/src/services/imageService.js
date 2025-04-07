/**
 * 图片服务
 * 提供统一的图片资源管理功能
 */

// 默认占位图配置
const DEFAULT_PLACEHOLDER = {
  product: '/images/placeholders/product-placeholder.png',
  banner: '/images/placeholders/banner-placeholder.png',
  category: '/images/placeholders/category-placeholder.png',
  promotion: '/images/placeholders/promotion-placeholder.png',
  avatar: '/images/placeholders/avatar-placeholder.png',
  logo: '/images/placeholders/logo-placeholder.png'
};

// 分类图标映射
const CATEGORY_ICONS = {
  '手机数码': '/images/categories/phone-digital.png',
  '电脑办公': '/images/categories/computer-office.png',
  '家用电器': '/images/categories/home-appliance.png',
  '服装鞋帽': '/images/categories/clothing.png',
  '美妆个护': '/images/categories/beauty.png',
  '食品生鲜': '/images/categories/food.png',
  '图书文娱': '/images/categories/books.png',
  '运动户外': '/images/categories/sports.png',
  '母婴玩具': '/images/categories/baby-toys.png',
  '智能家居': '/images/categories/smart-home.png',
  '健康医药': '/images/categories/health.png'
};

// 轮播图列表
const BANNER_IMAGES = [
  {
    id: 1,
    url: '/images/banners/banner1.jpg',
    alt: '促销活动1',
    link: '/promotions/1'
  },
  {
    id: 2,
    url: '/images/banners/banner2.jpg',
    alt: '促销活动2',
    link: '/promotions/2'
  },
  {
    id: 3,
    url: '/images/banners/banner3.jpg',
    alt: '促销活动3',
    link: '/promotions/3'
  },
  {
    id: 4,
    url: '/images/banners/banner4.jpg',
    alt: '促销活动4',
    link: '/promotions/4'
  },
  {
    id: 5,
    url: '/images/banners/banner5.jpg',
    alt: '促销活动5',
    link: '/promotions/5'
  },
  {
    id: 6,
    url: '/images/banners/banner6.jpg',
    alt: '促销活动6',
    link: '/promotions/6'
  }
];

/**
 * 生成SVG占位图，作为在线占位图的替代品
 * @param {number} width 图片宽度
 * @param {number} height 图片高度
 * @param {string} text 显示文字
 * @param {string} bgColor 背景颜色
 * @param {string} textColor 文字颜色
 * @returns {string} 数据URI格式的SVG图片
 */
export const generateSVGPlaceholder = (width, height, text, bgColor = '#f5f5f5', textColor = '#aaa') => {
  // 计算合适的字体大小
  const fontSize = Math.floor(Math.min(width, height) / 10);
  
  // 使用更简单的SVG内容以减少体积
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="${fontSize}px" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  
  // 转换为静态数据URI
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * 获取产品图片URL
 * @param {string|null} imageUrl 原始图片URL
 * @param {string} productName 产品名称，用于生成占位图文本
 * @param {number} width 图片宽度
 * @param {number} height 图片高度
 * @returns {string} 最终的图片URL
 */
export const getProductImageUrl = (imageUrl, productName, width = 200, height = 200) => {
  console.log(`开始处理图片: 原始URL=${imageUrl}, 产品名称=${productName}`);
  // 获取公共URL前缀
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // 为推荐产品指定特殊处理
  if (imageUrl && (
      imageUrl.includes('personalized_') || 
      imageUrl.includes('similar_') || 
      imageUrl.includes('popular_'))) {
    // 构建绝对路径
    const recommendationImagePath = `${publicUrl}/images/products/recommendations/${imageUrl}`;
    console.log(`处理推荐产品图片: ${recommendationImagePath}`);
    
    // 添加时间戳以避免缓存问题
    const timestamp = new Date().getTime();
    return `${recommendationImagePath}?t=${timestamp}`;
  }
  
  // 如果存在有效的图片URL，则直接返回
  if (imageUrl && !imageUrl.includes('via.placeholder.com') && !imageUrl.startsWith('http://placeholder')) {
    console.log(`使用原始图片URL: ${imageUrl}`);
    // 可能需要添加公共URL前缀
    const finalUrl = imageUrl.startsWith('/') ? `${publicUrl}${imageUrl}` : imageUrl;
    return finalUrl;
  }
  
  // 使用已知产品图片，这些是我们已经上传的
  const knownProducts = {
    '咖啡机': '/images/products/coffee_machine.jpg',
    '折叠手机': '/images/products/foldable_phone.jpg',
    '耳机': '/images/products/headphones.jpg',
    '移动电源': '/images/products/powerbank.jpg',
    '智能手表': '/images/products/smartwatch.jpg'
  };
  
  // 如果是已知产品，直接返回对应图片URL
  if (knownProducts[productName]) {
    const knownProductUrl = `${publicUrl}${knownProducts[productName]}`;
    console.log(`使用已知产品图片: ${knownProductUrl}`);
    return knownProductUrl;
  }

  // 返回生成的SVG占位图
  console.log(`生成占位图: ${productName}`);
  return generateSVGPlaceholder(width, height, productName);
};

/**
 * 检查本地图片是否存在
 * 注意: 由于浏览器安全限制，这个方法在实际使用中可能需要服务器端支持
 * @param {string} path 图片路径
 * @returns {boolean} 图片是否存在
 */
const localImageExists = (path) => {
  // 已知存在的文件列表
  const knownExistingFiles = [
    '/images/logo.png',
    '/images/default-avatar.png',
    '/images/products/coffee_machine.jpg',
    '/images/products/foldable_phone.jpg',
    '/images/products/headphones.jpg',
    '/images/products/powerbank.jpg',
    '/images/products/smartwatch.jpg',
    '/images/promotions/ad1.jpg',
    '/images/promotions/ad2.jpg',
    '/images/promotions/flash_sale.jpg',
    '/images/promotions/member_day.jpg',
    '/images/promotions/new_user.jpg',
    '/images/placeholders/product-placeholder.png',
    '/images/placeholders/banner-placeholder.png',
    '/images/placeholders/category-placeholder.png',
    '/images/placeholders/promotion-placeholder.png',
    '/images/placeholders/avatar-placeholder.png',
    '/images/placeholders/logo-placeholder.png',
    '/images/banners/banner1.jpg',
    '/images/banners/banner2.jpg',
    '/images/banners/banner3.jpg',
    '/images/banners/banner4.jpg',
    '/images/banners/banner5.jpg',
    '/images/banners/banner6.jpg'
  ];
  
  // 检查路径是否在已知文件列表中
  return knownExistingFiles.includes(path);
};

/**
 * 获取分类图标
 * @param {string} categoryName 分类名称
 * @returns {string} 分类图标URL
 */
export const getCategoryIcon = (categoryName) => {
  return CATEGORY_ICONS[categoryName] || DEFAULT_PLACEHOLDER.category;
};

/**
 * 获取轮播图数据
 * @returns {Array} 轮播图数据数组
 */
export const getBannerImages = () => {
  console.log('获取轮播图数据...');
  try {
    // 添加时间戳以避免缓存问题
    const timestamp = new Date().getTime();
    
    // 从环境变量中获取公共URL前缀
    const publicUrl = process.env.PUBLIC_URL || '';
    
    console.log('原始轮播图数据:', BANNER_IMAGES);
    
    // 返回处理后的轮播图数据
    return BANNER_IMAGES.map(banner => {
      const normalizedUrl = banner.url.startsWith('/') ? banner.url : `/${banner.url}`;
      return {
        ...banner,
        url: `${publicUrl}${normalizedUrl}?t=${timestamp}`
      };
    });
  } catch (error) {
    console.error('获取轮播图数据时出错:', error);
    return [];
  }
};

/**
 * 获取促销图片
 * @param {string|null} imageUrl 原始图片URL
 * @param {string} promotionTitle 促销标题
 * @param {number} width 图片宽度
 * @param {number} height 图片高度
 * @returns {string} 最终的图片URL
 */
export const getPromotionImageUrl = (imageUrl, promotionTitle, width = 280, height = 160) => {
  // 获取公共URL前缀
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // 如果有有效的图片URL且不是占位图
  if (imageUrl && !imageUrl.includes('via.placeholder.com')) {
    // 如果是相对路径，添加PUBLIC_URL前缀
    return imageUrl.startsWith('/') ? `${publicUrl}${imageUrl}` : imageUrl;
  }
  
  // 已知的促销图片
  const knownPromotions = {
    '限时折扣': '/images/promotions/flash_sale.jpg',
    '满减优惠': '/images/promotions/member_day.jpg',
    '新品促销': '/images/promotions/new_user.jpg',
    '广告1': '/images/promotions/ad1.jpg',
    '广告2': '/images/promotions/ad2.jpg'
  };
  
  // 如果是已知促销，返回带PUBLIC_URL前缀的路径
  if (knownPromotions[promotionTitle]) {
    return `${publicUrl}${knownPromotions[promotionTitle]}`;
  }
  
  // 尝试使用默认的促销图片
  const defaultPromotionImage = `${publicUrl}/images/placeholders/promotion-placeholder.png`;
  
  // 检查默认图片是否存在
  if (localImageExists('/images/placeholders/promotion-placeholder.png')) {
    return defaultPromotionImage;
  }
  
  // 如果默认图片不存在，返回生成的SVG占位图
  return generateSVGPlaceholder(width, height, promotionTitle, '#e6f7ff', '#1890ff');
};

/**
 * 图片加载失败时的回调函数
 * @param {Event} event 事件对象
 * @param {string} type 图片类型
 * @param {string} fallbackText 替代文本
 */
export const handleImageError = (event, type = 'product', fallbackText = '') => {
  const img = event.target;
  
  // 如果图片已经被标记为处理过，则不再处理
  if (img.dataset.errorHandled === 'true') {
    return;
  }
  
  // 标记图片已被处理过，防止重复处理
  img.dataset.errorHandled = 'true';
  
  // 设置为占位图
  const width = img.width || 200;
  const height = img.height || 200;
  
  // 直接使用生成的SVG占位图，避免再次加载可能不存在的文件
  img.src = generateSVGPlaceholder(width, height, fallbackText || '图片加载失败');
    
  // 防止循环触发error事件
  img.onerror = null;
};

// 导出默认占位图，以便直接使用
export const IMAGE_PLACEHOLDERS = DEFAULT_PLACEHOLDER; 