/**
 * 数据分析服务
 * 实现电商平台的各种数据分析功能
 */

import * as RecommendationService from './recommendationService';

// 模拟销售数据
const mockSalesData = {
  // 按日期的销售数据（最近30天）
  dailySales: Array(30).fill().map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    
    return {
      date: date.toISOString().slice(0, 10),
      sales: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 50) + 10,
      visitors: Math.floor(Math.random() * 1000) + 200,
      conversionRate: Math.random() * 0.05 + 0.01
    };
  }),
  
  // 按分类的销售数据
  categorySales: [
    { category: '智能家居', sales: 12500, orders: 650, avgOrderValue: 192 },
    { category: '手机数码', sales: 18900, orders: 1020, avgOrderValue: 185 },
    { category: '电脑办公', sales: 9800, orders: 430, avgOrderValue: 228 },
    { category: '穿戴设备', sales: 6700, orders: 350, avgOrderValue: 191 },
    { category: '游戏设备', sales: 4300, orders: 210, avgOrderValue: 205 },
    { category: '个人护理', sales: 7600, orders: 420, avgOrderValue: 181 },
    { category: '健康设备', sales: 5200, orders: 280, avgOrderValue: 186 }
  ],
  
  // 按用户类型的销售数据
  userTypeSales: [
    { type: '新用户', sales: 15800, orders: 920, avgOrderValue: 172 },
    { type: '回头客', sales: 32500, orders: 1650, avgOrderValue: 197 },
    { type: '高频用户', sales: 16700, orders: 790, avgOrderValue: 211 }
  ],
  
  // 按支付方式的销售数据
  paymentMethodSales: [
    { method: '支付宝', sales: 28500, orders: 1450, percentage: 43.2 },
    { method: '微信支付', sales: 24700, orders: 1280, percentage: 37.5 },
    { method: '银行卡', sales: 9800, orders: 480, percentage: 14.8 },
    { method: '其他', sales: 3000, orders: 150, percentage: 4.5 }
  ]
};

// 模拟用户数据
const mockUserData = {
  // 用户增长数据（最近30天）
  userGrowth: Array(30).fill().map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    
    return {
      date: date.toISOString().slice(0, 10),
      newUsers: Math.floor(Math.random() * 100) + 20,
      activeUsers: Math.floor(Math.random() * 500) + 300,
      totalUsers: 10000 + (index * 50) + Math.floor(Math.random() * 30)
    };
  }),
  
  // 用户来源分布
  userSources: [
    { source: '直接访问', users: 3500, percentage: 35 },
    { source: '搜索引擎', users: 2800, percentage: 28 },
    { source: '社交媒体', users: 1500, percentage: 15 },
    { source: '邮件营销', users: 800, percentage: 8 },
    { source: '推荐链接', users: 900, percentage: 9 },
    { source: '其他', users: 500, percentage: 5 }
  ],
  
  // 用户地域分布
  userRegions: [
    { region: '华东', users: 4200, percentage: 42 },
    { region: '华南', users: 2500, percentage: 25 },
    { region: '华北', users: 1800, percentage: 18 },
    { region: '西南', users: 800, percentage: 8 },
    { region: '西北', users: 400, percentage: 4 },
    { region: '东北', users: 300, percentage: 3 }
  ],
  
  // 用户设备分布
  userDevices: [
    { device: '移动端', users: 6500, percentage: 65 },
    { device: '桌面端', users: 3200, percentage: 32 },
    { device: '平板', users: 300, percentage: 3 }
  ]
};

// 模拟商品数据
const mockProductData = {
  // 商品销量排行（Top 10）
  topSellingProducts: [
    { id: 2, title: '高端智能手机', sales: 1243, revenue: 7457757 },
    { id: 3, title: '无线蓝牙耳机', sales: 985, revenue: 885515 },
    { id: 11, title: '电动牙刷', sales: 876, revenue: 261924 },
    { id: 8, title: '无线充电器', sales: 765, revenue: 98685 },
    { id: 9, title: '智能音箱', sales: 743, revenue: 296457 },
    { id: 12, title: '智能体脂秤', sales: 654, revenue: 130146 },
    { id: 1, title: '智能扫地机器人', sales: 632, revenue: 1263368 },
    { id: 6, title: '笔记本电脑', sales: 587, revenue: 4108413 },
    { id: 4, title: '智能手表', sales: 543, revenue: 867357 },
    { id: 5, title: '4K高清电视', sales: 498, revenue: 1991502 }
  ],
  
  // 商品评分排行（Top 10）
  topRatedProducts: [
    { id: 2, title: '高端智能手机', rating: 4.9, reviewCount: 1258 },
    { id: 5, title: '4K高清电视', rating: 4.8, reviewCount: 875 },
    { id: 1, title: '智能扫地机器人', rating: 4.7, reviewCount: 1032 },
    { id: 6, title: '笔记本电脑', rating: 4.7, reviewCount: 943 },
    { id: 11, title: '电动牙刷', rating: 4.7, reviewCount: 1156 },
    { id: 4, title: '智能手表', rating: 4.6, reviewCount: 782 },
    { id: 10, title: '游戏手柄', rating: 4.6, reviewCount: 567 },
    { id: 3, title: '无线蓝牙耳机', rating: 4.5, reviewCount: 1432 },
    { id: 7, title: '智能门锁', rating: 4.5, reviewCount: 643 },
    { id: 12, title: '智能体脂秤', rating: 4.5, reviewCount: 821 }
  ],
  
  // 库存状态
  inventoryStatus: [
    { status: '充足', count: 124, percentage: 62 },
    { status: '适中', count: 56, percentage: 28 },
    { status: '不足', count: 18, percentage: 9 },
    { status: '缺货', count: 2, percentage: 1 }
  ]
};

// 模拟营销数据
const mockMarketingData = {
  // 营销活动效果
  campaigns: [
    { name: '618促销', sales: 12500, orders: 650, conversion: 0.085, roi: 2.3 },
    { name: '双11大促', sales: 28900, orders: 1420, conversion: 0.092, roi: 3.1 },
    { name: '年终特惠', sales: 18700, orders: 980, conversion: 0.078, roi: 2.7 },
    { name: '暑期专场', sales: 9800, orders: 520, conversion: 0.065, roi: 1.9 },
    { name: '新品首发', sales: 6700, orders: 350, conversion: 0.072, roi: 2.1 }
  ],
  
  // 优惠券使用情况
  coupons: [
    { type: '满减券', issued: 10000, used: 4500, conversion: 0.45, value: 45000 },
    { type: '折扣券', issued: 8000, used: 3200, conversion: 0.40, value: 32000 },
    { type: '新用户券', issued: 5000, used: 2800, conversion: 0.56, value: 28000 },
    { type: '会员券', issued: 6000, used: 3600, conversion: 0.60, value: 36000 }
  ]
};

/**
 * 获取销售概览数据
 * @returns {Object} 销售概览数据
 */
export const getSalesOverview = () => {
  // 计算总销售额、总订单数、平均订单金额
  const totalSales = mockSalesData.dailySales.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = mockSalesData.dailySales.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = Math.round(totalSales / totalOrders);
  
  // 计算环比增长
  const currentSales = mockSalesData.dailySales.slice(-7).reduce((sum, day) => sum + day.sales, 0);
  const previousSales = mockSalesData.dailySales.slice(-14, -7).reduce((sum, day) => sum + day.sales, 0);
  const salesGrowth = ((currentSales - previousSales) / previousSales * 100).toFixed(2);
  
  const currentOrders = mockSalesData.dailySales.slice(-7).reduce((sum, day) => sum + day.orders, 0);
  const previousOrders = mockSalesData.dailySales.slice(-14, -7).reduce((sum, day) => sum + day.orders, 0);
  const ordersGrowth = ((currentOrders - previousOrders) / previousOrders * 100).toFixed(2);
  
  // 计算访客数和转化率
  const totalVisitors = mockSalesData.dailySales.reduce((sum, day) => sum + day.visitors, 0);
  const conversionRate = (totalOrders / totalVisitors * 100).toFixed(2);
  
  return {
    totalSales,
    totalOrders,
    avgOrderValue,
    salesGrowth: Number(salesGrowth),
    ordersGrowth: Number(ordersGrowth),
    totalVisitors,
    conversionRate: Number(conversionRate)
  };
};

/**
 * 获取销售趋势数据
 * @param {string} period - 'day' | 'week' | 'month'
 * @returns {Array} 销售趋势数据
 */
export const getSalesTrend = (period = 'day') => {
  switch (period) {
    case 'week':
      // 按周汇总
      const weekData = [];
      for (let i = 0; i < 4; i++) {
        const weekStart = i * 7;
        const weekEnd = weekStart + 7;
        const weekSales = mockSalesData.dailySales.slice(weekStart, weekEnd).reduce((sum, day) => sum + day.sales, 0);
        const weekOrders = mockSalesData.dailySales.slice(weekStart, weekEnd).reduce((sum, day) => sum + day.orders, 0);
        const startDate = mockSalesData.dailySales[weekStart].date;
        const endDate = mockSalesData.dailySales[Math.min(weekEnd - 1, mockSalesData.dailySales.length - 1)].date;
        
        weekData.push({
          period: `${startDate} 至 ${endDate}`,
          sales: weekSales,
          orders: weekOrders
        });
      }
      return weekData;
      
    case 'month':
      // 模拟按月汇总（由于示例只有30天数据，这里简化处理）
      const currentMonthSales = mockSalesData.dailySales.slice(-30).reduce((sum, day) => sum + day.sales, 0);
      const currentMonthOrders = mockSalesData.dailySales.slice(-30).reduce((sum, day) => sum + day.orders, 0);
      const previousMonthSales = currentMonthSales * 0.9 + (Math.random() * 1000 - 500);
      const previousMonthOrders = currentMonthOrders * 0.9 + (Math.random() * 100 - 50);
      
      const thisMonth = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      return [
        {
          period: `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}`,
          sales: Math.round(previousMonthSales),
          orders: Math.round(previousMonthOrders)
        },
        {
          period: `${thisMonth.getFullYear()}-${(thisMonth.getMonth() + 1).toString().padStart(2, '0')}`,
          sales: Math.round(currentMonthSales),
          orders: Math.round(currentMonthOrders)
        }
      ];
      
    case 'day':
    default:
      // 按日返回
      return mockSalesData.dailySales;
  }
};

/**
 * 获取按分类的销售数据
 * @returns {Array} 按分类的销售数据
 */
export const getCategorySales = () => {
  return mockSalesData.categorySales;
};

/**
 * 获取用户增长数据
 * @returns {Array} 用户增长数据
 */
export const getUserGrowth = () => {
  return mockUserData.userGrowth;
};

/**
 * 获取用户分布数据
 * @returns {Object} 用户分布数据
 */
export const getUserDistribution = () => {
  return {
    sources: mockUserData.userSources,
    regions: mockUserData.userRegions,
    devices: mockUserData.userDevices
  };
};

/**
 * 获取商品销售排行
 * @param {number} limit 返回数量限制
 * @returns {Array} 商品销售排行
 */
export const getTopSellingProducts = (limit = 10) => {
  return mockProductData.topSellingProducts.slice(0, limit);
};

/**
 * 获取商品评分排行
 * @param {number} limit 返回数量限制
 * @returns {Array} 商品评分排行
 */
export const getTopRatedProducts = (limit = 10) => {
  return mockProductData.topRatedProducts.slice(0, limit);
};

/**
 * 获取库存状态
 * @returns {Array} 库存状态数据
 */
export const getInventoryStatus = () => {
  return mockProductData.inventoryStatus;
};

/**
 * 获取营销活动效果
 * @returns {Array} 营销活动效果数据
 */
export const getCampaignPerformance = () => {
  return mockMarketingData.campaigns;
};

/**
 * 获取优惠券使用情况
 * @returns {Array} 优惠券使用情况数据
 */
export const getCouponUsage = () => {
  return mockMarketingData.coupons;
};

/**
 * 获取推荐系统效果分析
 * @returns {Object} 推荐系统效果分析数据
 */
export const getRecommendationAnalytics = () => {
  // 模拟数据：实际应用中应该根据真实的推荐系统数据计算
  const userBehaviorData = RecommendationService.getUserBehaviorData();
  
  // 计算推荐点击率（CTR）
  const impressions = 12500;
  const clicks = 1875;
  const ctr = (clicks / impressions * 100).toFixed(2);
  
  // 计算推荐转化率
  const conversions = 375;
  const conversionRate = (conversions / clicks * 100).toFixed(2);
  
  // 浏览记录统计
  const viewCount = userBehaviorData.viewHistory.length;
  
  // 推荐算法效果对比
  const algorithmComparison = [
    { algorithm: "基于内容", ctr: 12.5, conversionRate: 18.2, revenue: 15800 },
    { algorithm: "协同过滤", ctr: 15.8, conversionRate: 21.5, revenue: 19200 },
    { algorithm: "热门商品", ctr: 10.2, conversionRate: 15.8, revenue: 12500 },
    { algorithm: "混合推荐", ctr: 16.5, conversionRate: 22.3, revenue: 21500 }
  ];
  
  return {
    ctr: Number(ctr),
    conversionRate: Number(conversionRate),
    viewCount,
    algorithmComparison
  };
};

/**
 * 获取AI助手使用分析
 * @returns {Object} AI助手使用分析数据
 */
export const getAIAssistantAnalytics = () => {
  // 模拟数据：实际应用中应该根据AI助手的使用数据计算
  return {
    totalInteractions: 8750,
    uniqueUsers: 2450,
    averageInteractionsPerUser: 3.57,
    completionRate: 85.3,
    satisfactionRate: 92.1,
    topQuestions: [
      { question: "如何选择合适的手机?", count: 356 },
      { question: "电脑配置推荐", count: 298 },
      { question: "智能家居产品比较", count: 275 },
      { question: "耳机音质对比", count: 243 },
      { question: "如何退换商品", count: 187 }
    ],
    conversionFromAssistant: 28.5
  };
}; 