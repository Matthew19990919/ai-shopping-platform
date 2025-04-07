/**
 * 测试图片下载脚本（使用 Pixabay API）
 * 用于自动下载示例图片到项目的图片目录
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

// Pixabay API 配置
const PIXABAY_API_KEY = '37805853-24a869382d870838a92923c9d';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

// 配置
const config = {
  // 图片总数
  totalImages: {
    products: 50,
    banners: 4,
    promotions: 10,
    categories: 12
  },
  // 目标目录
  directories: {
    products: path.resolve(__dirname, '../public/images/products'),
    banners: path.resolve(__dirname, '../public/images/banners'),
    promotions: path.resolve(__dirname, '../public/images/promotions'),
    categories: path.resolve(__dirname, '../public/images/categories'),
    placeholders: path.resolve(__dirname, '../public/images/placeholders')
  },
  // 图片尺寸
  sizes: {
    products: '400x400',
    banners: '1200x400',
    promotions: '600x300',
    categories: '200x200'
  }
};

// 确保目录存在
async function ensureDirectories() {
  console.log('创建图片目录...');
  for (const dir of Object.values(config.directories)) {
    await fs.ensureDir(dir);
    console.log(`- 目录已创建: ${dir}`);
  }
}

// 下载单个图片
async function downloadImage(url, filepath) {
  try {
    console.log(`- 开始下载: ${url}`);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000 // 增加超时时间到30秒
    });

    await pipeline(
      response.data,
      fs.createWriteStream(filepath)
    );

    console.log(`- 下载成功: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`下载图片失败: ${url}`, error.message);
    return false;
  }
}

// 生成 SVG 占位图内容
function generateSVGContent(text, width, height, bgColor = '#f5f5f5', textColor = '#aaa') {
  // 计算合适的字体大小
  const fontSize = Math.floor(Math.min(width, height) / 10);
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text 
      x="50%" 
      y="50%" 
      font-family="Arial, sans-serif" 
      font-size="${fontSize}px" 
      fill="${textColor}" 
      text-anchor="middle" 
      dominant-baseline="middle"
    >
      ${text}
    </text>
    <rect width="100%" height="1" fill="#ddd" y="0"/>
    <rect width="100%" height="1" fill="#ddd" y="${height-1}"/>
    <rect width="1" height="100%" fill="#ddd" x="0"/>
    <rect width="1" height="100%" fill="#ddd" x="${width-1}"/>
  </svg>`;
}

// 创建 SVG 占位图
async function createSVGPlaceholder(filepath, text, width, height, bgColor = '#f5f5f5', textColor = '#aaa') {
  try {
    // 将扩展名改为 .svg
    const svgPath = filepath.replace(/\.(jpg|jpeg|png)$/i, '.svg');
    
    // 生成 SVG 内容
    const svgContent = generateSVGContent(text, width, height, bgColor, textColor);
    
    // 写入 SVG 文件
    await fs.writeFile(svgPath, svgContent, 'utf8');
    console.log(`- 已创建SVG占位图: ${path.basename(svgPath)}`);
    
    return svgPath;
  } catch (error) {
    console.error('创建SVG占位图失败:', error.message);
    return null;
  }
}

// 从 Pixabay 搜索图片
async function searchPixabayImages(query, count = 10, imageType = 'photo', orientation = 'all', category = '') {
  try {
    // 构建 API URL
    const url = new URL(PIXABAY_API_URL);
    url.searchParams.append('key', PIXABAY_API_KEY);
    url.searchParams.append('q', query);
    url.searchParams.append('image_type', imageType);
    url.searchParams.append('orientation', orientation);
    url.searchParams.append('per_page', count);
    url.searchParams.append('safesearch', 'true');
    
    if (category) {
      url.searchParams.append('category', category);
    }
    
    console.log(`- 搜索 Pixabay: ${query}`);
    
    // 发送请求
    const response = await axios.get(url.toString());
    
    if (response.data && response.data.hits && response.data.hits.length > 0) {
      console.log(`- 找到 ${response.data.hits.length} 张图片`);
      return response.data.hits;
    } else {
      console.warn(`- 没有找到 "${query}" 的图片`);
      return [];
    }
  } catch (error) {
    console.error(`搜索 Pixabay 图片失败:`, error.message);
    if (error.response) {
      console.error(`状态码: ${error.response.status}`);
      console.error(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    
    return [];
  }
}

// 创建占位图
async function createPlaceholders() {
  console.log('创建占位图...');
  
  const placeholders = [
    { name: 'product-placeholder.png', width: 400, height: 400, query: 'product', category: 'business' },
    { name: 'banner-placeholder.png', width: 1200, height: 400, query: 'banner', category: 'business' },
    { name: 'category-placeholder.png', width: 200, height: 200, query: 'category', category: 'business' },
    { name: 'promotion-placeholder.png', width: 600, height: 300, query: 'promotion sale', category: 'business' },
    { name: 'avatar-placeholder.png', width: 100, height: 100, query: 'profile', category: 'people' },
    { name: 'logo-placeholder.png', width: 200, height: 100, query: 'logo', category: 'business' }
  ];
  
  for (const placeholder of placeholders) {
    const images = await searchPixabayImages(
      placeholder.query, 
      1,
      'all',
      placeholder.width > placeholder.height ? 'horizontal' : 'vertical',
      placeholder.category
    );
    
    const filepath = path.join(config.directories.placeholders, placeholder.name);
    
    if (images.length > 0) {
      // 根据占位图尺寸选择合适的图片URL
      let imageUrl = '';
      if (Math.max(placeholder.width, placeholder.height) <= 640) {
        imageUrl = images[0].webformatURL;
      } else {
        imageUrl = images[0].largeImageURL;
      }
      
      const success = await downloadImage(imageUrl, filepath);
      if (!success) {
        // 下载失败时创建SVG占位图
        await createSVGPlaceholder(
          filepath, 
          placeholder.query, 
          placeholder.width, 
          placeholder.height
        );
      }
    } else {
      // 没有找到图片时创建SVG占位图
      await createSVGPlaceholder(
        filepath, 
        placeholder.query, 
        placeholder.width, 
        placeholder.height
      );
    }
  }
}

// 下载产品图片
async function downloadProductImages() {
  console.log('下载产品图片...');
  const categories = ['electronics', 'clothing', 'furniture', 'food', 'beauty'];
  
  let downloadedCount = 0;
  const totalToDownload = config.totalImages.products;
  
  for (const category of categories) {
    if (downloadedCount >= totalToDownload) break;
    
    const count = Math.ceil((totalToDownload - downloadedCount) / categories.length);
    const images = await searchPixabayImages(category, count, 'photo');
    
    for (let i = 0; i < images.length && downloadedCount < totalToDownload; i++) {
      const image = images[i];
      const filepath = path.join(config.directories.products, `product-${downloadedCount + 1}.jpg`);
      
      // 使用高质量图片URL
      const success = await downloadImage(image.largeImageURL, filepath);
      
      if (success) {
        downloadedCount++;
        console.log(`- 产品图片已下载 (${downloadedCount}/${totalToDownload}): product-${downloadedCount}.jpg`);
      } else {
        // 下载失败则创建SVG占位图
        await createSVGPlaceholder(filepath, category, 400, 400);
        downloadedCount++;
      }
      
      // 添加延迟，避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // 如果下载的图片数量不足，用SVG占位图补齐
  while (downloadedCount < totalToDownload) {
    const filepath = path.join(config.directories.products, `product-${downloadedCount + 1}.jpg`);
    await createSVGPlaceholder(filepath, '产品图片', 400, 400);
    downloadedCount++;
    console.log(`- 创建产品占位图 (${downloadedCount}/${totalToDownload}): product-${downloadedCount}.jpg`);
  }
}

// 下载轮播图
async function downloadBannerImages() {
  console.log('下载轮播图...');
  const queries = ['shopping banner', 'sale banner', 'promotion banner', 'ecommerce banner'];
  
  for (let i = 1; i <= config.totalImages.banners; i++) {
    const query = queries[i - 1] || queries[0];
    const images = await searchPixabayImages(query, 1, 'all', 'horizontal');
    
    const filepath = path.join(config.directories.banners, `banner${i}.jpg`);
    
    if (images.length > 0) {
      const success = await downloadImage(images[0].largeImageURL, filepath);
      
      if (!success) {
        // 下载失败则创建SVG占位图
        await createSVGPlaceholder(filepath, query, 1200, 400, '#e6f7ff', '#1890ff');
      }
    } else {
      // 没有找到图片则创建SVG占位图
      await createSVGPlaceholder(filepath, query, 1200, 400, '#e6f7ff', '#1890ff');
    }
  }
}

// 下载促销图片
async function downloadPromotionImages() {
  console.log('下载促销图片...');
  
  // 广告图片
  const adImages1 = await searchPixabayImages('advertisement small', 1, 'all', 'horizontal');
  if (adImages1.length > 0) {
    await downloadImage(
      adImages1[0].webformatURL,
      path.join(config.directories.promotions, 'ad1.jpg')
    );
  } else {
    await createSVGPlaceholder(
      path.join(config.directories.promotions, 'ad1.jpg'),
      '广告1',
      180,
      75
    );
  }
  
  const adImages2 = await searchPixabayImages('promotion small', 1, 'all', 'horizontal');
  if (adImages2.length > 0) {
    await downloadImage(
      adImages2[0].webformatURL,
      path.join(config.directories.promotions, 'ad2.jpg')
    );
  } else {
    await createSVGPlaceholder(
      path.join(config.directories.promotions, 'ad2.jpg'),
      '广告2',
      180,
      75
    );
  }
  
  console.log(`- 广告图片已处理: ad1.jpg, ad2.jpg`);
  
  // 促销图片
  const promotionQueries = ['sale', 'discount', 'promotion', 'special offer', 'deal'];
  
  for (let i = 1; i <= config.totalImages.promotions; i++) {
    const query = promotionQueries[i % promotionQueries.length];
    const images = await searchPixabayImages(query, 1, 'all', 'horizontal');
    
    const filepath = path.join(config.directories.promotions, `promotion-${i}.jpg`);
    
    if (images.length > 0) {
      const success = await downloadImage(images[0].largeImageURL, filepath);
      
      if (!success) {
        await createSVGPlaceholder(filepath, query, 600, 300, '#fff0f6', '#ff4d4f');
      }
    } else {
      await createSVGPlaceholder(filepath, query, 600, 300, '#fff0f6', '#ff4d4f');
    }
    
    // 添加延迟，避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

// 下载分类图片
async function downloadCategoryImages() {
  console.log('下载分类图片...');
  const categories = [
    { name: 'phone-digital.png', query: 'smartphone' },
    { name: 'computer-office.png', query: 'computer' },
    { name: 'home-appliance.png', query: 'appliance' },
    { name: 'clothing.png', query: 'fashion clothing' },
    { name: 'beauty.png', query: 'cosmetics' },
    { name: 'food.png', query: 'food' },
    { name: 'books.png', query: 'books' },
    { name: 'sports.png', query: 'sports' },
    { name: 'baby-toys.png', query: 'baby toys' },
    { name: 'smart-home.png', query: 'smart home' },
    { name: 'health.png', query: 'healthcare' }
  ];
  
  for (const category of categories) {
    const images = await searchPixabayImages(category.query, 1, 'all');
    
    const filepath = path.join(config.directories.categories, category.name);
    
    if (images.length > 0) {
      const success = await downloadImage(images[0].webformatURL, filepath);
      
      if (!success) {
        await createSVGPlaceholder(filepath, category.query, 200, 200);
      }
    } else {
      await createSVGPlaceholder(filepath, category.query, 200, 200);
    }
    
    // 添加延迟，避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

// 主函数
async function main() {
  try {
    console.log('开始下载测试图片...');
    console.log('使用 Pixabay API 下载图片');
    
    // 确保目录存在
    await ensureDirectories();
    
    // 顺序下载各类图片 (避免并发请求过多)
    await createPlaceholders();
    await downloadProductImages();
    await downloadBannerImages();
    await downloadPromotionImages();
    await downloadCategoryImages();
    
    console.log('所有图片下载完成！');
  } catch (error) {
    console.error('下载过程中出错:', error.message);
  }
}

// 执行主函数
main();
