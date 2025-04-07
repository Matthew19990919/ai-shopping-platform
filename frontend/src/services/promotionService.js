/**
 * 促销服务
 * 提供获取促销活动、优惠券和活动专题相关功能
 */

// 模拟数据，实际项目中应该从API获取
const promotions = [
  {
    id: '1',
    title: '春季新品特惠',
    description: '春季新品上市，全场8折起',
    startDate: '2025-03-01',
    endDate: '2025-04-15',
    image: '/images/promotions/spring_sale.jpg',
    bannerImage: '/images/promotions/spring_sale.jpg',
    type: 'discount',
    discount: 20, // 折扣百分比
    minPurchase: 0,
    categories: ['clothing', 'shoes'],
    featured: true,
    status: 'active'
  },
  {
    id: '2',
    title: '数码盛宴',
    description: '数码产品满1000减100',
    startDate: '2025-03-10',
    endDate: '2025-05-30',
    image: '/images/promotions/digital_sale.jpg',
    bannerImage: '/images/promotions/digital_sale.jpg',
    type: 'voucher',
    discount: 100, // 减100元
    minPurchase: 1000, // 最低消费1000元
    categories: ['electronics', 'home-appliances'],
    featured: true,
    status: 'active'
  },
  {
    id: '3',
    title: '美妆节',
    description: '全场美妆产品买3免1',
    startDate: '2023-03-15',
    endDate: '2023-04-05',
    image: 'https://via.placeholder.com/800x300/FF69B4/FFFFFF?text=美妆节',
    bannerImage: 'https://via.placeholder.com/1200x400/FF69B4/FFFFFF?text=美妆节',
    type: 'bundle',
    bundleOffer: 'buy3get1free',
    categories: ['beauty', 'skincare'],
    featured: true,
    status: 'active'
  },
  {
    id: '4',
    title: '运动健身专场',
    description: '运动装备满300减50',
    startDate: '2023-03-01',
    endDate: '2023-03-31',
    image: 'https://via.placeholder.com/800x300/32CD32/FFFFFF?text=运动健身专场',
    bannerImage: 'https://via.placeholder.com/1200x400/32CD32/FFFFFF?text=运动健身专场',
    type: 'voucher',
    discount: 50,
    minPurchase: 300,
    categories: ['sports', 'fitness'],
    featured: false,
    status: 'active'
  },
  {
    id: '5',
    title: '新品尝鲜',
    description: '新品上架，首发特惠',
    startDate: '2025-03-15',
    endDate: '2025-06-15',
    image: '/images/promotions/new_products.jpg',
    bannerImage: '/images/promotions/new_products.jpg',
    type: 'discount',
    discount: 20,
    minPurchase: 0,
    categories: ['clothing', 'electronics'],
    featured: true,
    status: 'active'
  },
  {
    id: '6',
    title: '进口食品周',
    description: '全球美食，买满199元包邮',
    startDate: '2023-03-20',
    endDate: '2023-04-10',
    image: 'https://via.placeholder.com/800x300/FFA500/000000?text=进口食品周',
    bannerImage: 'https://via.placeholder.com/1200x400/FFA500/000000?text=进口食品周',
    type: 'freeShipping',
    minPurchase: 199,
    categories: ['food', 'imported'],
    featured: false,
    status: 'active'
  }
];

// 模拟主题活动数据
const campaigns = [
  {
    id: '1',
    title: '时尚穿搭指南',
    subtitle: '2023春夏流行趋势',
    description: '探索最新时尚趋势，让你在这个春夏季焕发光彩。从街头风格到优雅正装，这里有适合各种场合的穿搭灵感。',
    image: 'https://via.placeholder.com/800x500/E6E6FA/000000?text=时尚穿搭指南',
    coverImage: 'https://via.placeholder.com/1200x600/E6E6FA/000000?text=时尚穿搭指南',
    date: '2023-03-15',
    categories: ['fashion', 'lifestyle'],
    tags: ['春夏流行', '时尚', '穿搭指南'],
    featured: true,
    sections: [
      {
        title: '春季必备单品',
        content: '轻薄风衣、印花裙装、休闲西装...',
        image: 'https://via.placeholder.com/600x400/E6E6FA/000000?text=春季必备单品'
      },
      {
        title: '色彩搭配技巧',
        content: '今年流行的色彩组合及搭配要点...',
        image: 'https://via.placeholder.com/600x400/E6E6FA/000000?text=色彩搭配技巧'
      }
    ],
    relatedProducts: ['101', '102', '103', '104', '105']
  },
  {
    id: '2',
    title: '智能家居生活',
    subtitle: '打造科技感十足的现代家庭',
    description: '探索如何利用智能家居设备提升生活品质，从智能音箱到自动化家电，让科技为生活带来便利。',
    image: 'https://via.placeholder.com/800x500/F0F8FF/000000?text=智能家居生活',
    coverImage: 'https://via.placeholder.com/1200x600/F0F8FF/000000?text=智能家居生活',
    date: '2023-03-10',
    categories: ['technology', 'home'],
    tags: ['智能家居', '科技生活', '家居自动化'],
    featured: true,
    sections: [
      {
        title: '入门级智能家居套装',
        content: '为初次接触智能家居的用户推荐的基础设备...',
        image: 'https://via.placeholder.com/600x400/F0F8FF/000000?text=入门级智能家居套装'
      },
      {
        title: '智能家居集成方案',
        content: '如何将不同品牌的智能设备整合到一个系统中...',
        image: 'https://via.placeholder.com/600x400/F0F8FF/000000?text=智能家居集成方案'
      }
    ],
    relatedProducts: ['201', '202', '203', '204', '205']
  },
  {
    id: '3',
    title: '健康饮食计划',
    subtitle: '营养均衡的一周食谱',
    description: '由营养师精心设计的一周健康饮食计划，帮助你保持健康的同时享受美食。包含早餐、午餐和晚餐的详细食谱和准备指南。',
    image: 'https://via.placeholder.com/800x500/F0FFF0/000000?text=健康饮食计划',
    coverImage: 'https://via.placeholder.com/1200x600/F0FFF0/000000?text=健康饮食计划',
    date: '2023-03-05',
    categories: ['food', 'health'],
    tags: ['健康饮食', '营养均衡', '食谱'],
    featured: false,
    sections: [
      {
        title: '高蛋白低脂早餐',
        content: '开启活力一天的营养早餐选择...',
        image: 'https://via.placeholder.com/600x400/F0FFF0/000000?text=高蛋白低脂早餐'
      },
      {
        title: '轻食午餐方案',
        content: '既能满足味蕾又不会让下午工作犯困的午餐选择...',
        image: 'https://via.placeholder.com/600x400/F0FFF0/000000?text=轻食午餐方案'
      }
    ],
    relatedProducts: ['301', '302', '303', '304', '305']
  }
];

// 模拟优惠券数据
const coupons = [
  {
    id: '1',
    code: 'WELCOME10',
    title: '新用户优惠券',
    description: '新用户首单可用',
    discountType: 'percentage',
    discountValue: 10, // 10%折扣
    minPurchase: 100,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    isForNewUser: true,
    isOneTime: true,
    categories: [],
    status: 'active'
  },
  {
    id: '2',
    code: 'SPRING50',
    title: '春季大促优惠券',
    description: '全场商品满300减50',
    discountType: 'fixed',
    discountValue: 50, // 直减50元
    minPurchase: 300,
    startDate: '2023-03-01',
    endDate: '2023-04-15',
    isForNewUser: false,
    isOneTime: false,
    categories: [],
    status: 'active'
  },
  {
    id: '3',
    code: 'TECH15',
    title: '数码产品优惠券',
    description: '数码产品专享15%折扣',
    discountType: 'percentage',
    discountValue: 15, // 15%折扣
    minPurchase: 500,
    startDate: '2023-03-10',
    endDate: '2023-03-31',
    isForNewUser: false,
    isOneTime: false,
    categories: ['electronics', 'mobile'],
    status: 'active'
  },
  {
    id: '4',
    code: 'BEAUTY30',
    title: '美妆护肤优惠券',
    description: '美妆产品满200减30',
    discountType: 'fixed',
    discountValue: 30, // 直减30元
    minPurchase: 200,
    startDate: '2023-03-15',
    endDate: '2023-04-05',
    isForNewUser: false,
    isOneTime: false,
    categories: ['beauty', 'skincare'],
    status: 'active'
  }
];

/**
 * 获取所有促销活动
 * @param {Object} options 可选参数
 * @returns {Promise<Array>} 促销活动数组
 */
export const getAllPromotions = async (options = {}) => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...promotions];
    
    // 过滤活动状态
    if (options.status) {
      result = result.filter(promo => promo.status === options.status);
    }
    
    // 过滤活动类型
    if (options.type) {
      result = result.filter(promo => promo.type === options.type);
    }
    
    // 过滤类别
    if (options.category) {
      result = result.filter(promo => promo.categories.includes(options.category));
    }
    
    // 根据是否特色过滤
    if (options.featured !== undefined) {
      result = result.filter(promo => promo.featured === options.featured);
    }
    
    // 仅返回当前有效的活动
    if (options.currentOnly) {
      const now = new Date();
      result = result.filter(promo => {
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        return now >= startDate && now <= endDate;
      });
    }
    
    return result;
  } catch (error) {
    console.error('获取促销活动失败:', error);
    return [];
  }
};

/**
 * 获取特定ID的促销活动
 * @param {string} id 促销活动ID
 * @returns {Promise<Object|null>} 促销活动对象或null
 */
export const getPromotionById = async (id) => {
  try {
    const promo = promotions.find(p => p.id === id);
    return promo || null;
  } catch (error) {
    console.error(`获取促销活动(ID: ${id})失败:`, error);
    return null;
  }
};

/**
 * 获取所有主题活动
 * @param {Object} options 可选参数
 * @returns {Promise<Array>} 主题活动数组
 */
export const getAllCampaigns = async (options = {}) => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...campaigns];
    
    // 根据特色过滤
    if (options.featured !== undefined) {
      result = result.filter(campaign => campaign.featured === options.featured);
    }
    
    // 按类别过滤
    if (options.category) {
      result = result.filter(campaign => campaign.categories.includes(options.category));
    }
    
    // 按标签过滤
    if (options.tag) {
      result = result.filter(campaign => campaign.tags.includes(options.tag));
    }
    
    // 最新活动
    if (options.latest) {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      result = result.slice(0, options.latest);
    }
    
    return result;
  } catch (error) {
    console.error('获取主题活动失败:', error);
    return [];
  }
};

/**
 * 获取特定ID的主题活动
 * @param {string} id 主题活动ID
 * @returns {Promise<Object|null>} 主题活动对象或null
 */
export const getCampaignById = async (id) => {
  try {
    const campaign = campaigns.find(c => c.id === id);
    return campaign || null;
  } catch (error) {
    console.error(`获取主题活动(ID: ${id})失败:`, error);
    return null;
  }
};

/**
 * 获取所有优惠券
 * @param {Object} options 可选参数
 * @returns {Promise<Array>} 优惠券数组
 */
export const getAllCoupons = async (options = {}) => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...coupons];
    
    // 根据状态过滤
    if (options.status) {
      result = result.filter(coupon => coupon.status === options.status);
    }
    
    // 按照折扣类型过滤
    if (options.discountType) {
      result = result.filter(coupon => coupon.discountType === options.discountType);
    }
    
    // 按照类别过滤
    if (options.category) {
      result = result.filter(coupon => 
        coupon.categories.length === 0 || coupon.categories.includes(options.category)
      );
    }
    
    // 仅返回当前有效的优惠券
    if (options.currentOnly) {
      const now = new Date();
      result = result.filter(coupon => {
        const startDate = new Date(coupon.startDate);
        const endDate = new Date(coupon.endDate);
        return now >= startDate && now <= endDate;
      });
    }
    
    // 按照最低消费过滤
    if (options.maxMinPurchase) {
      result = result.filter(coupon => coupon.minPurchase <= options.maxMinPurchase);
    }
    
    return result;
  } catch (error) {
    console.error('获取优惠券失败:', error);
    return [];
  }
};

/**
 * 获取特定代码的优惠券
 * @param {string} code 优惠券代码
 * @returns {Promise<Object|null>} 优惠券对象或null
 */
export const getCouponByCode = async (code) => {
  try {
    const coupon = coupons.find(c => c.code === code);
    return coupon || null;
  } catch (error) {
    console.error(`获取优惠券(Code: ${code})失败:`, error);
    return null;
  }
};

/**
 * 验证优惠券是否可用
 * @param {string} code 优惠券代码
 * @param {Object} orderInfo 订单信息
 * @returns {Promise<Object>} 验证结果
 */
export const validateCoupon = async (code, orderInfo) => {
  try {
    const coupon = await getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: '优惠券不存在' };
    }
    
    // 检查优惠券状态
    if (coupon.status !== 'active') {
      return { valid: false, message: '优惠券已失效' };
    }
    
    // 检查优惠券有效期
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    
    if (now < startDate || now > endDate) {
      return { valid: false, message: '优惠券不在有效期内' };
    }
    
    // 检查最低消费
    if (orderInfo.totalAmount < coupon.minPurchase) {
      return { 
        valid: false, 
        message: `订单金额不满足优惠券使用条件，需满${coupon.minPurchase}元`
      };
    }
    
    // 检查类别限制
    if (coupon.categories.length > 0) {
      const orderCategories = orderInfo.items.map(item => item.category);
      const hasMatchingCategory = coupon.categories.some(category => 
        orderCategories.includes(category)
      );
      
      if (!hasMatchingCategory) {
        return { 
          valid: false, 
          message: `该优惠券仅适用于特定类别商品: ${coupon.categories.join(', ')}`
        };
      }
    }
    
    // 计算折扣金额
    let discountAmount = 0;
    
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderInfo.totalAmount * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }
    
    return { 
      valid: true, 
      coupon, 
      discountAmount,
      message: '优惠券可用'
    };
  } catch (error) {
    console.error(`验证优惠券(Code: ${code})失败:`, error);
    return { valid: false, message: '验证优惠券时出错' };
  }
};

export default {
  getAllPromotions,
  getPromotionById,
  getAllCampaigns,
  getCampaignById,
  getAllCoupons,
  getCouponByCode,
  validateCoupon
}; 