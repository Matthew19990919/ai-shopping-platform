import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 定义CORS头部
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 处理OPTIONS请求（CORS预检）
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders,
  });
});

// API首页
router.get('/', async () => {
  return new Response(JSON.stringify({ message: '欢迎使用AI导购平台API' }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 主页数据API
router.get('/api/home', async () => {
  const data = {
    banners: [
      { id: 1, imageUrl: 'https://via.placeholder.com/800x400?text=智能家居', link: '#' },
      { id: 2, imageUrl: 'https://via.placeholder.com/800x400?text=新品上市', link: '#' },
      { id: 3, imageUrl: 'https://via.placeholder.com/800x400?text=限时折扣', link: '#' }
    ],
    featuredProducts: [
      { id: 1, name: '智能手表', price: 1299, imageUrl: 'https://via.placeholder.com/300?text=智能手表', description: '支持心率监测、运动追踪等多种功能' },
      { id: 2, name: '无线耳机', price: 899, imageUrl: 'https://via.placeholder.com/300?text=无线耳机', description: '降噪技术，长续航' },
      { id: 3, name: '智能手机', price: 4999, imageUrl: 'https://via.placeholder.com/300?text=智能手机', description: '旗舰处理器，高清屏幕' },
      { id: 4, name: '笔记本电脑', price: 6999, imageUrl: 'https://via.placeholder.com/300?text=笔记本电脑', description: '轻薄设计，强劲性能' }
    ],
    categories: [
      { id: 1, name: '电子产品', count: 120, icon: '📱' },
      { id: 2, name: '服装', count: 85, icon: '👕' },
      { id: 3, name: '家居', count: 63, icon: '🏠' },
      { id: 4, name: '美妆', count: 47, icon: '💄' }
    ]
  };
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 产品列表API
router.get('/api/products', async () => {
  const products = [
    { id: 1, name: '智能手表', price: 1299, imageUrl: 'https://via.placeholder.com/300?text=智能手表', description: '支持心率监测、运动追踪等多种功能', rating: 4.5, reviews: 128 },
    { id: 2, name: '无线耳机', price: 899, imageUrl: 'https://via.placeholder.com/300?text=无线耳机', description: '降噪技术，长续航', rating: 4.3, reviews: 95 },
    { id: 3, name: '智能手机', price: 4999, imageUrl: 'https://via.placeholder.com/300?text=智能手机', description: '旗舰处理器，高清屏幕', rating: 4.7, reviews: 215 },
    { id: 4, name: '笔记本电脑', price: 6999, imageUrl: 'https://via.placeholder.com/300?text=笔记本电脑', description: '轻薄设计，强劲性能', rating: 4.6, reviews: 176 },
    { id: 5, name: '智能音箱', price: 599, imageUrl: 'https://via.placeholder.com/300?text=智能音箱', description: '语音控制，高品质音效', rating: 4.2, reviews: 82 },
    { id: 6, name: '平板电脑', price: 3299, imageUrl: 'https://via.placeholder.com/300?text=平板电脑', description: '轻薄便携，支持手写笔', rating: 4.4, reviews: 138 }
  ];
  
  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 价格比较API
router.get('/api/price-comparison/search', async (request) => {
  // 从URL查询参数中获取查询关键词
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';
  
  // 模拟价格比较搜索结果
  const results = [
    {
      productId: 'p101',
      name: `${query} 型号A`,
      platforms: [
        { name: '京东', price: 1299, link: '#', discount: '满1000减100', shipping: '免邮费' },
        { name: '天猫', price: 1349, link: '#', discount: '无', shipping: '免邮费' },
        { name: '苏宁', price: 1279, link: '#', discount: '赠送延保', shipping: '免邮费' }
      ],
      image: 'https://via.placeholder.com/200?text=商品图片'
    },
    {
      productId: 'p102',
      name: `${query} 型号B`,
      platforms: [
        { name: '京东', price: 1899, link: '#', discount: '满2000减200', shipping: '免邮费' },
        { name: '天猫', price: 1849, link: '#', discount: '满1500减100', shipping: '免邮费' },
        { name: '苏宁', price: 1929, link: '#', discount: '无', shipping: '免邮费' }
      ],
      image: 'https://via.placeholder.com/200?text=商品图片'
    }
  ];
  
  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 历史记录API
router.get('/api/price-comparison/history', async () => {
  const history = [
    { id: 1, query: '智能手表', date: '2023-04-05', results: 6 },
    { id: 2, query: '无线耳机', date: '2023-04-03', results: 8 },
    { id: 3, query: '智能手机', date: '2023-04-01', results: 12 }
  ];
  
  return new Response(JSON.stringify(history), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 比较详情API
router.get('/api/price-comparison/compare', async (request) => {
  // 从URL查询参数中获取产品ID
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId') || 'p101';
  
  // 模拟价格比较详情
  const details = {
    productId: productId,
    name: '商品型号 ' + productId.toUpperCase(),
    image: 'https://via.placeholder.com/300?text=商品图片',
    platforms: [
      { 
        name: '京东', 
        price: 1299, 
        link: '#', 
        priceHistory: [
          { date: '2023-04-01', price: 1399 },
          { date: '2023-04-03', price: 1349 },
          { date: '2023-04-05', price: 1299 }
        ],
        rating: 4.5,
        comments: [
          { user: '用户A', content: '质量很好，很满意', date: '2023-04-02' },
          { user: '用户B', content: '物流速度快，服务好', date: '2023-04-04' }
        ]
      },
      { 
        name: '天猫', 
        price: 1349, 
        link: '#', 
        priceHistory: [
          { date: '2023-04-01', price: 1399 },
          { date: '2023-04-03', price: 1379 },
          { date: '2023-04-05', price: 1349 }
        ],
        rating: 4.3,
        comments: [
          { user: '用户C', content: '产品符合预期', date: '2023-04-03' },
          { user: '用户D', content: '包装完好，无损坏', date: '2023-04-05' }
        ]
      },
      { 
        name: '苏宁', 
        price: 1279, 
        link: '#', 
        priceHistory: [
          { date: '2023-04-01', price: 1359 },
          { date: '2023-04-03', price: 1329 },
          { date: '2023-04-05', price: 1279 }
        ],
        rating: 4.4,
        comments: [
          { user: '用户E', content: '价格实惠，推荐购买', date: '2023-04-01' },
          { user: '用户F', content: '客服态度好，解答及时', date: '2023-04-04' }
        ]
      }
    ],
    specifications: [
      { name: '品牌', value: '品牌名称' },
      { name: '型号', value: productId.toUpperCase() },
      { name: '颜色', value: '黑色/白色/蓝色' },
      { name: '尺寸', value: '标准' },
      { name: '重量', value: '约200g' },
      { name: '保修', value: '12个月' }
    ]
  };
  
  return new Response(JSON.stringify(details), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// 处理404 - 未找到路由
router.all('*', () => {
  return new Response('未找到API路径', {
    status: 404,
    headers: corsHeaders
  });
});

// 主函数 - Worker入口点
export default {
  async fetch(request, env, ctx) {
    return router.handle(request);
  }
};