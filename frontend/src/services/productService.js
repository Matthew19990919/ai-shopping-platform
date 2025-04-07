/**
 * 产品服务
 * 提供商品数据获取、查询和操作相关功能
 */
import { getProductsMock } from './mockData';

// 产品缓存
let productsCache = null;

/**
 * 获取所有产品
 * @returns {Promise<Array>} 产品数组
 */
export const getAllProducts = async () => {
  if (productsCache) {
    return productsCache;
  }
  
  try {
    // 实际项目中应该从API获取
    const products = await getProductsMock();
    productsCache = products;
    return products;
  } catch (error) {
    console.error('获取产品数据失败:', error);
    return [];
  }
};

/**
 * 通过ID获取产品
 * @param {string} id 产品ID
 * @returns {Promise<Object|null>} 产品对象或null
 */
export const getProductById = async (id) => {
  try {
    const products = await getAllProducts();
    return products.find(product => product.id === id) || null;
  } catch (error) {
    console.error(`获取产品(ID: ${id})失败:`, error);
    return null;
  }
};

/**
 * 获取特色产品
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 特色产品数组
 */
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const products = await getAllProducts();
    
    // 按销量和评分排序，模拟特色产品
    const featured = products
      .filter(p => p.rating >= 4.5 || p.sales > 2000)
      .sort((a, b) => {
        const scoreA = (parseFloat(a.rating) || 0) * 10 + (a.sales || 0) / 1000;
        const scoreB = (parseFloat(b.rating) || 0) * 10 + (b.sales || 0) / 1000;
        return scoreB - scoreA;
      });
    
    return featured.slice(0, limit);
  } catch (error) {
    console.error('获取特色产品失败:', error);
    return [];
  }
};

/**
 * 获取新品
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 新品数组
 */
export const getNewProducts = async (limit = 6) => {
  try {
    const products = await getAllProducts();
    
    // 在实际项目中，应该基于添加日期排序
    // 这里使用随机排序模拟新品
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('获取新品失败:', error);
    return [];
  }
};

/**
 * 获取打折商品
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 打折商品数组
 */
export const getDiscountedProducts = async (limit = 6) => {
  try {
    const products = await getAllProducts();
    
    // 筛选有旧价格的商品（表示有折扣）
    const discounted = products
      .filter(p => p.oldPrice && parseFloat(p.oldPrice) > parseFloat(p.price))
      .sort((a, b) => {
        // 按折扣百分比排序
        const discountA = (parseFloat(a.oldPrice) - parseFloat(a.price)) / parseFloat(a.oldPrice);
        const discountB = (parseFloat(b.oldPrice) - parseFloat(b.price)) / parseFloat(b.oldPrice);
        return discountB - discountA;
      });
    
    return discounted.slice(0, limit);
  } catch (error) {
    console.error('获取打折商品失败:', error);
    return [];
  }
};

/**
 * 获取相关产品
 * @param {Object} product 产品对象
 * @param {number} limit 限制数量
 * @returns {Promise<Array>} 相关产品数组
 */
export const getRelatedProducts = async (product, limit = 4) => {
  if (!product) {
    return [];
  }
  
  try {
    const products = await getAllProducts();
    
    // 筛选同类别或同品牌的产品
    const related = products
      .filter(p => 
        p.id !== product.id && // 排除自身
        (p.category === product.category || p.brand === product.brand) // 同类别或同品牌
      )
      .sort(() => 0.5 - Math.random()); // 随机排序
    
    return related.slice(0, limit);
  } catch (error) {
    console.error('获取相关产品失败:', error);
    return [];
  }
};

/**
 * 获取产品类别列表
 * @returns {Promise<Array>} 类别数组
 */
export const getProductCategories = async () => {
  try {
    const products = await getAllProducts();
    
    // 提取所有类别并去重
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    return categories;
  } catch (error) {
    console.error('获取产品类别失败:', error);
    return [];
  }
};

/**
 * 获取产品品牌列表
 * @returns {Promise<Array>} 品牌数组
 */
export const getProductBrands = async () => {
  try {
    const products = await getAllProducts();
    
    // 提取所有品牌并去重
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    
    return brands;
  } catch (error) {
    console.error('获取产品品牌失败:', error);
    return [];
  }
};

export default {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getNewProducts,
  getDiscountedProducts,
  getRelatedProducts,
  getProductCategories,
  getProductBrands
}; 