/**
 * 价格比较服务
 * 用于获取跨平台价格比较数据
 */
import axios from 'axios';

// 根据环境选择API基础URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://i-shopping-platform-api.anselmatthew2018.workers.dev/api/price-comparison'  // 已更新为您的Cloudflare账户名
  : 'http://localhost:3001/api/price-comparison';

/**
 * 根据关键词搜索多平台商品
 * @param {string} keyword 搜索关键词
 * @returns {Promise<Object>} 多平台搜索结果
 */
export const searchMultiPlatform = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('跨平台搜索失败:', error);
    throw error;
  }
};

/**
 * 获取商品的历史价格
 * @param {string} platform 平台代码
 * @param {string} productId 商品ID
 * @returns {Promise<Object>} 价格历史数据
 */
export const getProductPriceHistory = async (platform, productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`, {
      params: { platform, productId }
    });
    return response.data;
  } catch (error) {
    console.error('获取价格历史失败:', error);
    throw error;
  }
};

/**
 * 获取价格比较结果
 * @param {string} keyword 商品关键词
 * @returns {Promise<Object>} 价格比较结果
 */
export const comparePrices = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/compare`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('价格比较失败:', error);
    throw error;
  }
};

/**
 * 从URL中提取平台代码和商品ID
 * @param {string} url 商品URL
 * @returns {Object} 包含platform和productId的对象
 */
export const extractProductInfo = (url) => {
  try {
    // 示例URL: https://api.jd.com/item/JD_1234567890_0
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const idPart = pathParts[pathParts.length - 1];
    const platform = idPart.split('_')[0];
    const productId = idPart;
    
    return { platform, productId };
  } catch (error) {
    console.error('提取商品信息失败:', error);
    return { platform: null, productId: null };
  }
}; 