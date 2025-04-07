/**
 * 用户服务
 * 提供用户相关的API调用和数据处理功能
 */

// 模拟的订单数据
const mockOrders = [
  {
    id: 'ORD20230001',
    date: '2023-12-15T10:30:45',
    status: 'completed',
    totalAmount: 1299.00,
    paymentMethod: '支付宝',
    items: [
      {
        id: 1,
        name: '超薄笔记本电脑',
        price: 1299.00,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
        productId: 'p001'
      }
    ],
    shippingAddress: {
      name: '张三',
      phone: '138****6666',
      address: '上海市浦东新区张江高科技园区博云路**号'
    }
  },
  {
    id: 'ORD20230002',
    date: '2023-11-25T15:42:12',
    status: 'completed',
    totalAmount: 258.00,
    paymentMethod: '微信支付',
    items: [
      {
        id: 2,
        name: '无线蓝牙耳机',
        price: 129.00,
        quantity: 2,
        image: 'https://via.placeholder.com/80',
        productId: 'p002'
      }
    ],
    shippingAddress: {
      name: '张三',
      phone: '138****6666',
      address: '上海市浦东新区张江高科技园区博云路**号'
    }
  },
  {
    id: 'ORD20230003',
    date: '2023-12-01T09:15:33',
    status: 'shipping',
    totalAmount: 399.00,
    paymentMethod: '银联支付',
    items: [
      {
        id: 3,
        name: '智能手环',
        price: 399.00,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
        productId: 'p003'
      }
    ],
    shippingAddress: {
      name: '张三',
      phone: '138****6666',
      address: '上海市浦东新区张江高科技园区博云路**号'
    }
  },
  {
    id: 'ORD20230004',
    date: '2023-12-10T14:22:09',
    status: 'processing',
    totalAmount: 798.00,
    paymentMethod: '支付宝',
    items: [
      {
        id: 4,
        name: '智能音箱',
        price: 399.00,
        quantity: 2,
        image: 'https://via.placeholder.com/80',
        productId: 'p004'
      }
    ],
    shippingAddress: {
      name: '张三',
      phone: '138****6666',
      address: '上海市浦东新区张江高科技园区博云路**号'
    }
  },
  {
    id: 'ORD20230005',
    date: '2023-10-15T11:24:15',
    status: 'cancelled',
    totalAmount: 199.00,
    paymentMethod: '微信支付',
    items: [
      {
        id: 5,
        name: '移动电源',
        price: 199.00,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
        productId: 'p005'
      }
    ],
    shippingAddress: {
      name: '张三',
      phone: '138****6666',
      address: '上海市浦东新区张江高科技园区博云路**号'
    }
  }
];

// 模拟的收藏商品数据
const mockFavorites = [
  {
    id: 'p001',
    name: '超薄笔记本电脑',
    price: 1299.00,
    image: 'https://via.placeholder.com/200',
    description: '轻薄机身，高性能配置，长续航',
    addedAt: '2023-12-01T09:15:33'
  },
  {
    id: 'p002',
    name: '无线蓝牙耳机',
    price: 129.00,
    image: 'https://via.placeholder.com/200',
    description: '高音质，降噪，续航时间长',
    addedAt: '2023-11-28T14:22:09'
  },
  {
    id: 'p003',
    name: '智能手环',
    price: 399.00,
    image: 'https://via.placeholder.com/200',
    description: '多功能健康监测，防水设计',
    addedAt: '2023-11-20T11:24:15'
  },
  {
    id: 'p004',
    name: '智能音箱',
    price: 399.00,
    image: 'https://via.placeholder.com/200',
    description: 'AI语音助手，高质量音响',
    addedAt: '2023-11-15T10:30:45'
  }
];

// 模拟的优惠券数据
const mockCoupons = [
  {
    id: 'c001',
    code: 'NEW10',
    name: '新用户专享券',
    discount: 10,
    minAmount: 100,
    validFrom: '2023-12-01T00:00:00',
    validTo: '2024-01-01T23:59:59',
    status: 'valid',
    description: '新用户首单满100减10元'
  },
  {
    id: 'c002',
    code: 'DEC20',
    name: '12月特惠券',
    discount: 20,
    minAmount: 200,
    validFrom: '2023-12-01T00:00:00',
    validTo: '2023-12-31T23:59:59',
    status: 'valid',
    description: '12月购物满200减20元'
  },
  {
    id: 'c003',
    code: 'TECH50',
    name: '数码专享券',
    discount: 50,
    minAmount: 500,
    validFrom: '2023-11-01T00:00:00',
    validTo: '2023-12-31T23:59:59',
    status: 'valid',
    description: '数码类商品满500减50元'
  },
  {
    id: 'c004',
    code: 'NOV15',
    name: '11月特惠券',
    discount: 15,
    minAmount: 150,
    validFrom: '2023-11-01T00:00:00',
    validTo: '2023-11-30T23:59:59',
    status: 'expired',
    description: '11月购物满150减15元'
  }
];

// 模拟的钱包数据
const mockWallet = {
  balance: 2358.65,
  points: 1256,
  transactions: [
    {
      id: 't001',
      type: 'deposit',
      amount: 1000,
      date: '2023-12-01T09:15:33',
      status: 'completed',
      description: '账户充值'
    },
    {
      id: 't002',
      type: 'payment',
      amount: -399,
      date: '2023-12-05T14:22:09',
      status: 'completed',
      description: '订单支付 #ORD20230003'
    },
    {
      id: 't003',
      type: 'refund',
      amount: 199,
      date: '2023-12-10T11:24:15',
      status: 'completed',
      description: '订单退款 #ORD20230005'
    },
    {
      id: 't004',
      type: 'deposit',
      amount: 2000,
      date: '2023-11-15T10:30:45',
      status: 'completed',
      description: '账户充值'
    },
    {
      id: 't005',
      type: 'payment',
      amount: -1299,
      date: '2023-12-15T10:30:45',
      status: 'completed',
      description: '订单支付 #ORD20230001'
    }
  ],
  cards: [
    {
      id: 'card001',
      type: 'debit',
      lastFourDigits: '8765',
      expiryDate: '03/25',
      holder: '张三',
      isDefault: true
    },
    {
      id: 'card002',
      type: 'credit',
      lastFourDigits: '1234',
      expiryDate: '06/26',
      holder: '张三',
      isDefault: false
    }
  ]
};

// 模拟的收货地址数据
const mockAddresses = [
  {
    id: 'addr001',
    name: '张三',
    phone: '13812345678',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    address: '张江高科技园区博云路123号',
    isDefault: true
  },
  {
    id: 'addr002',
    name: '张三(公司)',
    phone: '13912345678',
    province: '上海市',
    city: '上海市',
    district: '徐汇区',
    address: '漕河泾开发区宜山路900号',
    isDefault: false
  }
];

// 模拟的AI购物历史
const mockAiHistory = [
  {
    id: 'ai001',
    date: '2023-12-10T09:15:33',
    query: '推荐一款性价比高的笔记本电脑',
    response: '根据您的需求，我推荐这款超薄笔记本电脑，性能强劲且价格合理。',
    recommendations: [
      {
        id: 'p001',
        name: '超薄笔记本电脑',
        price: 1299.00,
        image: 'https://via.placeholder.com/80'
      }
    ]
  },
  {
    id: 'ai002',
    date: '2023-12-05T14:22:09',
    query: '有什么好的蓝牙耳机推荐吗？',
    response: '这款无线蓝牙耳机音质出色，而且电池续航时间长。',
    recommendations: [
      {
        id: 'p002',
        name: '无线蓝牙耳机',
        price: 129.00,
        image: 'https://via.placeholder.com/80'
      }
    ]
  },
  {
    id: 'ai003',
    date: '2023-11-28T11:24:15',
    query: '我想买一个健康监测的设备',
    response: '考虑到您的需求，这款智能手环具有心率监测、睡眠跟踪等多种健康监测功能。',
    recommendations: [
      {
        id: 'p003',
        name: '智能手环',
        price: 399.00,
        image: 'https://via.placeholder.com/80'
      }
    ]
  }
];

// 用户信息缓存
let userInfoCache = null;

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async () => {
  if (userInfoCache) {
    return userInfoCache;
  }
  
  try {
    // 实际项目中应该从API获取
    // 这里使用模拟数据
    const userInfo = {
      id: "user123",
      username: "zhang_san",
      nickname: "张三",
      avatar: "https://via.placeholder.com/150",
      email: "zhangsan@example.com",
      phone: "1381234****",
      gender: "male",
      level: 3,
      points: 2580,
      memberSince: "2022-05-15"
    };
    
    userInfoCache = userInfo;
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

/**
 * 获取用户偏好
 * @returns {Promise<Object>} 用户偏好
 */
export const getUserPreferences = async () => {
  try {
    // 从本地存储获取
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
    
    // 如果没有存储的偏好，返回默认值
    return {
      categories: {
        "手机数码": 8,
        "电脑办公": 5,
        "家用电器": 3
      },
      brands: ["苹果", "小米", "华为"],
      priceRange: "medium"
    };
  } catch (error) {
    console.error('获取用户偏好失败:', error);
    return {
      categories: {},
      brands: [],
      priceRange: "medium"
    };
  }
};

/**
 * 更新用户偏好
 * @param {Object} preferences 用户偏好
 * @returns {Promise<boolean>} 是否成功
 */
export const updateUserPreferences = async (preferences) => {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('更新用户偏好失败:', error);
    return false;
  }
};

/**
 * 记录产品浏览
 * @param {Object} product 产品对象
 * @returns {Promise<boolean>} 是否成功
 */
export const recordProductView = async (product) => {
  if (!product || !product.id) {
    return false;
  }
  
  try {
    // 获取现有浏览历史
    const storedHistory = localStorage.getItem('viewHistory');
    let viewHistory = storedHistory ? JSON.parse(storedHistory) : [];
    
    // 检查是否已存在，如果存在则移除
    viewHistory = viewHistory.filter(item => item.id !== product.id);
    
    // 添加到历史记录开头
    viewHistory.unshift({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      category: product.category,
      brand: product.brand,
      timestamp: new Date().toISOString()
    });
    
    // 限制历史记录条数
    if (viewHistory.length > 50) {
      viewHistory = viewHistory.slice(0, 50);
    }
    
    // 保存到本地存储
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
    
    // 更新用户偏好
    await updateViewPreferences(product);
    
    return true;
  } catch (error) {
    console.error('记录产品浏览失败:', error);
    return false;
  }
};

/**
 * 更新浏览偏好
 * @param {Object} product 产品对象
 * @returns {Promise<void>}
 */
const updateViewPreferences = async (product) => {
  try {
    const preferences = await getUserPreferences();
    
    // 更新类别偏好
    if (product.category) {
      if (!preferences.categories) {
        preferences.categories = {};
      }
      
      const currentValue = preferences.categories[product.category] || 0;
      preferences.categories[product.category] = currentValue + 1;
    }
    
    // 更新品牌偏好
    if (product.brand) {
      if (!preferences.brands) {
        preferences.brands = [];
      }
      
      if (!preferences.brands.includes(product.brand)) {
        preferences.brands.push(product.brand);
        
        // 限制品牌数量
        if (preferences.brands.length > 10) {
          preferences.brands = preferences.brands.slice(0, 10);
        }
      }
    }
    
    // 更新价格偏好
    if (product.price) {
      const price = parseFloat(product.price);
      
      if (price < 100) {
        preferences.priceRange = "low";
      } else if (price >= 100 && price < 500) {
        preferences.priceRange = "medium";
      } else {
        preferences.priceRange = "high";
      }
    }
    
    // 保存更新后的偏好
    await updateUserPreferences(preferences);
  } catch (error) {
    console.error('更新浏览偏好失败:', error);
  }
};

/**
 * 获取浏览历史
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 浏览历史
 */
export const getViewHistory = async (limit = 20) => {
  try {
    const storedHistory = localStorage.getItem('viewHistory');
    const viewHistory = storedHistory ? JSON.parse(storedHistory) : [];
    
    return viewHistory.slice(0, limit);
  } catch (error) {
    console.error('获取浏览历史失败:', error);
    return [];
  }
};

/**
 * 清除浏览历史
 * @returns {Promise<boolean>} 是否成功
 */
export const clearViewHistory = async () => {
  try {
    localStorage.removeItem('viewHistory');
    return true;
  } catch (error) {
    console.error('清除浏览历史失败:', error);
    return false;
  }
};

/**
 * 获取购买历史
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 购买历史
 */
export const getPurchaseHistory = async (limit = 10) => {
  try {
    // 实际项目中应该从API获取
    // 这里使用模拟数据
    const mockPurchaseHistory = [
      {
        id: "p001",
        name: "智能手机 Pro Max",
        image: "https://via.placeholder.com/150",
        price: "5999.00",
        category: "手机数码",
        brand: "苹果",
        purchaseDate: "2023-11-05T08:30:00Z",
        orderNumber: "ORD20231105001"
      },
      {
        id: "p002",
        name: "笔记本电脑 超轻薄",
        image: "https://via.placeholder.com/150",
        price: "7999.00",
        category: "电脑办公",
        brand: "联想",
        purchaseDate: "2023-10-15T14:20:00Z",
        orderNumber: "ORD20231015003"
      },
      {
        id: "p003",
        name: "无线蓝牙耳机",
        image: "https://via.placeholder.com/150",
        price: "899.00",
        category: "手机数码",
        brand: "索尼",
        purchaseDate: "2023-09-28T11:45:00Z",
        orderNumber: "ORD20230928002"
      }
    ];
    
    return mockPurchaseHistory.slice(0, limit);
  } catch (error) {
    console.error('获取购买历史失败:', error);
    return [];
  }
};

/**
 * 获取用户收藏列表
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 收藏列表
 */
export const getFavorites = async (limit = 10) => {
  try {
    const storedFavorites = localStorage.getItem('userFavorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    return favorites.slice(0, limit);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return [];
  }
};

/**
 * 添加收藏
 * @param {Object} product 产品对象
 * @returns {Promise<boolean>} 是否成功
 */
export const addToFavorites = async (product) => {
  if (!product || !product.id) {
    return false;
  }
  
  try {
    // 获取现有收藏
    const storedFavorites = localStorage.getItem('userFavorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    // 检查是否已收藏
    if (favorites.some(item => item.id === product.id)) {
      return true; // 已经收藏，直接返回成功
    }
    
    // 准备保存的产品数据结构，确保包含必要属性
    const favoriteItem = {
      id: product.id,
      name: product.name || product.title || '未命名产品', // 兼容不同命名方式
      title: product.title || product.name || '未命名产品',
      image: product.image || product.img || product.imageUrl || '/images/placeholders/product-placeholder.png',
      price: product.price || '0.00',
      originalPrice: product.originalPrice,
      description: product.description || product.desc || '',
      category: product.category || '',
      brand: product.brand || '',
      addedAt: new Date().toISOString()
    };
    
    // 添加到收藏
    favorites.push(favoriteItem);
    
    // 保存到本地存储
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
    
    return true;
  } catch (error) {
    console.error('添加收藏失败:', error);
    return false;
  }
};

/**
 * 移除收藏
 * @param {string} productId 产品ID
 * @returns {Promise<boolean>} 是否成功
 */
export const removeFromFavorites = async (productId) => {
  if (!productId) {
    return false;
  }
  
  try {
    // 获取现有收藏
    const storedFavorites = localStorage.getItem('userFavorites');
    if (!storedFavorites) {
      return true; // 没有收藏，直接返回成功
    }
    
    let favorites = JSON.parse(storedFavorites);
    
    // 移除指定产品
    favorites = favorites.filter(item => item.id !== productId);
    
    // 保存到本地存储
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
    
    return true;
  } catch (error) {
    console.error('移除收藏失败:', error);
    return false;
  }
};

/**
 * 检查是否已收藏
 * @param {string} productId 产品ID
 * @returns {Promise<boolean>} 是否已收藏
 */
export const isFavorited = async (productId) => {
  if (!productId) {
    return false;
  }
  
  try {
    const storedFavorites = localStorage.getItem('userFavorites');
    if (!storedFavorites) {
      return false;
    }
    
    const favorites = JSON.parse(storedFavorites);
    return favorites.some(item => item.id === productId);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};

/**
 * 获取AI购物历史
 * @param {Object} params 分页参数
 * @returns {Promise<Object>} AI购物历史和分页信息
 */
export const getAiShoppingHistory = async (params = { page: 1, limit: 5 }) => {
  try {
    // 实际项目中应该从API获取
    // 这里使用模拟数据
    const mockAiHistory = [
      {
        id: "ai001",
        query: "推荐一款性价比高的智能手机",
        response: "根据您的需求，我推荐小米11系列，该手机搭载骁龙888处理器，拥有1亿像素摄像头和120Hz高刷新率屏幕，价格在3000-4000元之间，性价比很高。",
        recommendations: [
          {
            id: "101",
            name: "小米11",
            price: "3299.00",
            image: "https://via.placeholder.com/150"
          },
          {
            id: "102",
            name: "Redmi K40",
            price: "1999.00",
            image: "https://via.placeholder.com/150"
          }
        ],
        timestamp: "2023-11-10T09:15:00Z"
      },
      {
        id: "ai002",
        query: "我想为女朋友买一份生日礼物，预算500元左右",
        response: "对于500元左右的女友生日礼物，我推荐以下几个选择：1. 精美香水，如迪奥或香奈儿的小样套装；2. 品质口红套装；3. 精致首饰，如925银项链；4. 高品质蓝牙耳机。这些都是既实用又能表达心意的礼物选择。",
        recommendations: [
          {
            id: "201",
            name: "迪奥香水小样套装",
            price: "450.00",
            image: "https://via.placeholder.com/150"
          },
          {
            id: "202",
            name: "925银项链",
            price: "399.00",
            image: "https://via.placeholder.com/150"
          }
        ],
        timestamp: "2023-10-25T16:40:00Z"
      },
      {
        id: "ai003",
        query: "冬季适合穿什么款式的外套？",
        response: "冬季外套推荐：1. 羽绒服：保暖性最佳，适合严寒天气；2. 毛呢大衣：优雅经典，适合商务场合；3. 棉服：轻便保暖，适合日常穿着；4. 皮夹克：时尚耐穿，适合休闲场合。选择时注意保暖性、防风性和舒适度。",
        recommendations: [
          {
            id: "301",
            name: "轻薄羽绒服",
            price: "699.00",
            image: "https://via.placeholder.com/150"
          },
          {
            id: "302",
            name: "双面呢大衣",
            price: "899.00",
            image: "https://via.placeholder.com/150"
          }
        ],
        timestamp: "2023-10-15T11:20:00Z"
      }
    ];
    
    // 模拟分页
    const { page, limit } = params;
    const offset = (page - 1) * limit;
    const total = mockAiHistory.length;
    const data = mockAiHistory.slice(offset, offset + limit);
    
    return {
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('获取AI购物历史失败:', error);
    return {
      items: [],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0
      }
    };
  }
};

/**
 * 获取用户订单列表
 * @param {number} page 页码
 * @param {number} limit 每页数量
 * @returns {Promise<Object>} 包含订单列表和分页信息的对象
 */
export const getUserOrders = async (page = 1, limit = 10) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 计算分页
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalOrders = mockOrders.length;
  const totalPages = Math.ceil(totalOrders / limit);
  
  // 返回当前页的订单
  const orders = mockOrders.slice(startIndex, endIndex);
  
  return {
    orders,
    pagination: {
      page,
      limit,
      totalOrders,
      totalPages
    }
  };
};

/**
 * 获取订单详情
 * @param {string} orderId 订单ID
 * @returns {Promise<Object>} 订单详情
 */
export const getOrderDetails = async (orderId) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 查找对应订单
  const order = mockOrders.find(order => order.id === orderId);
  
  if (!order) {
    throw new Error('订单不存在');
  }
  
  return order;
};

/**
 * 获取用户优惠券列表
 * @param {string} status 优惠券状态（valid, used, expired）
 * @returns {Promise<Array>} 优惠券列表
 */
export const getUserCoupons = async (status = 'all') => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (status === 'all') {
    return mockCoupons;
  }
  
  return mockCoupons.filter(coupon => coupon.status === status);
};

/**
 * 获取用户钱包信息
 * @returns {Promise<Object>} 钱包信息
 */
export const getUserWallet = async () => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockWallet;
};

/**
 * 获取用户钱包交易记录
 * @param {number} page 页码
 * @param {number} limit 每页数量
 * @returns {Promise<Object>} 包含交易记录和分页信息的对象
 */
export const getWalletTransactions = async (page = 1, limit = 10) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const transactions = mockWallet.transactions;
  
  // 计算分页
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / limit);
  
  // 返回当前页的交易记录
  const paginatedTransactions = transactions.slice(startIndex, endIndex);
  
  return {
    transactions: paginatedTransactions,
    pagination: {
      page,
      limit,
      totalTransactions,
      totalPages
    }
  };
};

/**
 * 获取用户收货地址列表
 * @returns {Promise<Array>} 收货地址列表
 */
export const getUserAddresses = async () => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockAddresses;
};

/**
 * 添加新的收货地址
 * @param {Object} address 地址信息
 * @returns {Promise<Object>} 新增的地址对象
 */
export const addUserAddress = async (address) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 实际应用中这里应该调用API添加地址
  console.log('添加地址:', address);
  
  // 生成一个随机ID
  const newAddress = {
    ...address,
    id: 'addr' + Math.random().toString(36).substring(2, 8)
  };
  
  return newAddress;
};

/**
 * 更新收货地址
 * @param {string} addressId 地址ID
 * @param {Object} address 新的地址信息
 * @returns {Promise<boolean>} 操作是否成功
 */
export const updateUserAddress = async (addressId, address) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 实际应用中这里应该调用API更新地址
  console.log('更新地址:', addressId, address);
  
  return true;
};

/**
 * 删除收货地址
 * @param {string} addressId 地址ID
 * @returns {Promise<boolean>} 操作是否成功
 */
export const deleteUserAddress = async (addressId) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 实际应用中这里应该调用API删除地址
  console.log('删除地址:', addressId);
  
  return true;
};

/**
 * 设置默认收货地址
 * @param {string} addressId 地址ID
 * @returns {Promise<boolean>} 操作是否成功
 */
export const setDefaultAddress = async (addressId) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 实际应用中这里应该调用API设置默认地址
  console.log('设置默认地址:', addressId);
  
  return true;
};

export default {
  getUserInfo,
  getUserPreferences,
  updateUserPreferences,
  recordProductView,
  getViewHistory,
  clearViewHistory,
  getPurchaseHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorited,
  getAiShoppingHistory,
  getUserOrders,
  getOrderDetails,
  getUserCoupons,
  getUserWallet,
  getWalletTransactions,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress
}; 