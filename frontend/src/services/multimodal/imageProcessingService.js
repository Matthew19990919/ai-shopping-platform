/**
 * 图像处理服务
 * 提供图片识别、分析和产品匹配功能
 */

import { getAllProducts } from '../searchService';

/**
 * 图片处理配置
 */
const config = {
  // 图片识别服务API端点
  imageRecognitionApiUrl: '/api/image-recognition',
  // 是否使用本地模拟识别（用于开发和测试）
  useLocalMockRecognition: true,
  // 最大图片大小（字节）
  maxImageSize: 5 * 1024 * 1024, // 5MB
  // 支持的图片格式
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

/**
 * 验证图片大小和格式
 * @param {File} imageFile 图片文件
 * @returns {Object} 验证结果
 */
export const validateImage = (imageFile) => {
  if (!imageFile) {
    return { valid: false, error: '没有提供图片文件' };
  }
  
  // 检查文件格式
  if (!config.supportedFormats.includes(imageFile.type)) {
    return { 
      valid: false, 
      error: `不支持的图片格式。请上传以下格式的图片: ${config.supportedFormats.map(f => f.replace('image/', '')).join(', ')}` 
    };
  }
  
  // 检查文件大小
  if (imageFile.size > config.maxImageSize) {
    return { 
      valid: false, 
      error: `图片大小超过限制。最大允许：${Math.round(config.maxImageSize / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * 从图片中提取特征信息
 * @param {File} imageFile 图片文件
 * @returns {Promise<Object>} 图片特征信息
 */
export const extractImageFeatures = async (imageFile) => {
  try {
    const validation = validateImage(imageFile);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // 如果使用本地模拟识别
    if (config.useLocalMockRecognition) {
      return mockImageRecognition(imageFile);
    }
    
    // 创建表单数据用于上传图片
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // 调用图像识别API
    const response = await fetch(config.imageRecognitionApiUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`图像识别请求失败: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('图像特征提取失败:', error);
    throw error;
  }
};

/**
 * 根据图片匹配商品
 * @param {File} imageFile 图片文件
 * @returns {Promise<Object>} 匹配结果
 */
export const matchProductsByImage = async (imageFile) => {
  try {
    // 提取图片特征
    const features = await extractImageFeatures(imageFile);
    
    // 获取所有商品
    const allProducts = await getAllProducts();
    
    // 根据提取的特征匹配商品
    const matchedProducts = allProducts.filter(product => {
      // 检查类别匹配
      if (features.categories && features.categories.length > 0) {
        // 如果商品类别与图片识别的类别有交集
        const categoryMatch = features.categories.some(category => 
          product.category && product.category.toLowerCase().includes(category.toLowerCase())
        );
        if (categoryMatch) return true;
      }
      
      // 检查物体匹配
      if (features.objects && features.objects.length > 0) {
        // 如果商品名称或描述包含识别的物体名称
        const objectMatch = features.objects.some(object => 
          (product.name && product.name.toLowerCase().includes(object.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(object.toLowerCase()))
        );
        if (objectMatch) return true;
      }
      
      // 检查颜色匹配
      if (features.colors && features.colors.length > 0 && product.colors) {
        const colorMatch = features.colors.some(color => 
          product.colors.some(productColor => productColor.toLowerCase().includes(color.toLowerCase()))
        );
        if (colorMatch) return true;
      }
      
      return false;
    });
    
    // 如果没有匹配的商品，尝试使用更宽松的匹配规则
    if (matchedProducts.length === 0) {
      const fallbackProducts = allProducts
        .filter(product => {
          // 使用主要物体分类作为关键词
          if (features.mainCategory) {
            return (
              (product.category && product.category.toLowerCase().includes(features.mainCategory.toLowerCase())) ||
              (product.name && product.name.toLowerCase().includes(features.mainCategory.toLowerCase())) ||
              (product.description && product.description.toLowerCase().includes(features.mainCategory.toLowerCase()))
            );
          }
          return false;
        })
        .slice(0, 5); // 限制数量
      
      if (fallbackProducts.length > 0) {
        return {
          success: true,
          products: fallbackProducts,
          matchType: 'fallback',
          recognizedObjects: features.objects || [],
          mainCategory: features.mainCategory,
          confidence: 'low'
        };
      }
    }
    
    return {
      success: matchedProducts.length > 0,
      products: matchedProducts.slice(0, 10), // 限制返回最多10个商品
      matchType: 'direct',
      recognizedObjects: features.objects || [],
      categories: features.categories || [],
      confidence: features.confidence || 'medium'
    };
  } catch (error) {
    console.error('图片商品匹配失败:', error);
    return {
      success: false,
      error: error.message || '图片处理失败，请重试'
    };
  }
};

/**
 * 本地模拟图像识别（用于开发和测试）
 * @param {File} imageFile 图片文件
 * @returns {Promise<Object>} 模拟识别结果
 */
const mockImageRecognition = async (imageFile) => {
  // 随机延迟模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 根据文件名进行简单分类
  const fileName = imageFile.name.toLowerCase();
  
  // 准备一些模拟数据
  const mockData = {
    // 电子产品相关
    electronic: {
      categories: ['电子产品', '数码产品'],
      objects: ['智能手机', '手机', '屏幕', '电子设备'],
      colors: ['黑色', '银色'],
      mainCategory: '手机',
      confidence: 'high'
    },
    // 服装相关
    clothing: {
      categories: ['服装', '时尚'],
      objects: ['衣服', 'T恤', '裤子', '鞋子'],
      colors: ['蓝色', '黑色', '白色'],
      mainCategory: '服装',
      confidence: 'high'
    },
    // 家居相关
    home: {
      categories: ['家居', '家具'],
      objects: ['沙发', '桌子', '椅子', '床'],
      colors: ['棕色', '白色', '米色'],
      mainCategory: '家具',
      confidence: 'medium'
    },
    // 美妆相关
    beauty: {
      categories: ['美妆', '护肤'],
      objects: ['化妆品', '护肤品', '面霜', '口红'],
      colors: ['粉色', '白色', '红色'],
      mainCategory: '美妆',
      confidence: 'high'
    },
    // 默认分类
    default: {
      categories: ['商品', '产品'],
      objects: ['物品', '商品'],
      colors: ['多色'],
      mainCategory: '商品',
      confidence: 'low'
    }
  };
  
  // 根据文件名确定类别
  let category = 'default';
  if (fileName.includes('phone') || fileName.includes('mobile') || fileName.includes('电子') || fileName.includes('手机') || fileName.includes('电脑')) {
    category = 'electronic';
  } else if (fileName.includes('cloth') || fileName.includes('shirt') || fileName.includes('shoes') || fileName.includes('服装') || fileName.includes('衣服') || fileName.includes('鞋')) {
    category = 'clothing';
  } else if (fileName.includes('furniture') || fileName.includes('home') || fileName.includes('家居') || fileName.includes('家具')) {
    category = 'home';
  } else if (fileName.includes('beauty') || fileName.includes('makeup') || fileName.includes('skincare') || fileName.includes('美妆') || fileName.includes('化妆')) {
    category = 'beauty';
  }
  
  // 返回模拟结果
  return mockData[category];
};

/**
 * 在浏览器中预览图片
 * @param {File} imageFile 图片文件
 * @returns {Promise<string>} 图片URL
 */
export const previewImage = (imageFile) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 调整图片大小（如果需要）
 * @param {File} imageFile 原始图片文件
 * @param {number} maxWidth 最大宽度
 * @param {number} maxHeight 最大高度
 * @returns {Promise<Blob>} 调整大小后的图片Blob
 */
export const resizeImage = (imageFile, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        // 计算新尺寸
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // 创建Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 将Canvas转换为Blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, imageFile.type);
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      
      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  validateImage,
  extractImageFeatures,
  matchProductsByImage,
  previewImage,
  resizeImage
};