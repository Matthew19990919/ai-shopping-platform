/**
 * 搜索服务
 * 提供商品搜索、搜索历史管理、搜索推荐等功能
 */
import { getProductsMock } from './mockData';

// 缓存的商品数据
let cachedProducts = null;

/**
 * 获取所有商品数据
 * @returns {Promise<Array>} 商品数据数组
 */
export const getAllProducts = async () => {
  if (cachedProducts) {
    return cachedProducts;
  }
  
  try {
    // 从模拟API获取商品数据
    const products = await getProductsMock();
    cachedProducts = products;
    return products;
  } catch (error) {
    console.error('获取商品数据失败:', error);
    return [];
  }
};

/**
 * 搜索商品
 * @param {string} query 搜索关键词
 * @param {Object} filters 筛选条件
 * @param {string} sort 排序方式
 * @returns {Promise<Array>} 符合条件的商品数组
 */
export const searchProducts = async (query, filters = {}, sort = 'relevance') => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    // 获取所有商品
    const products = await getAllProducts();
    
    // 记录搜索历史
    recordSearchHistory(query);
    
    // 筛选匹配的商品
    let results = filterProducts(products, query, filters);
    
    // 排序结果
    results = sortResults(results, sort);
    
    return results;
  } catch (error) {
    console.error('搜索商品失败:', error);
    return [];
  }
};

/**
 * 根据条件筛选商品
 * @param {Array} products 商品数组
 * @param {string} query 搜索关键词
 * @param {Object} filters 筛选条件
 * @returns {Array} 筛选后的商品数组
 */
const filterProducts = (products, query, filters = {}) => {
  // 基本关键词匹配
  let results = products.filter(product => {
    const name = product.name?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    const queryLower = query.toLowerCase();
    
    // 搜索匹配得分
    let score = 0;
    
    // 名称匹配得最高分
    if (name.includes(queryLower)) {
      score += 10;
      // 如果名称开头就匹配，额外加分
      if (name.startsWith(queryLower)) {
        score += 5;
      }
    }
    
    // 品牌匹配
    if (brand.includes(queryLower)) {
      score += 8;
    }
    
    // 分类匹配
    if (category.includes(queryLower)) {
      score += 6;
    }
    
    // 描述匹配得较低分
    if (description.includes(queryLower)) {
      score += 3;
    }
    
    // 记录匹配得分
    product.searchScore = score;
    
    // 只返回有得分的商品
    return score > 0;
  });
  
  // 应用价格筛选
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    results = results.filter(product => {
      const price = parseFloat(product.price);
      
      if (filters.minPrice !== undefined && price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice !== undefined && price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  }
  
  // 应用品牌筛选
  if (filters.brands && filters.brands.length > 0) {
    results = results.filter(product => 
      filters.brands.some(brand => 
        product.brand?.toLowerCase() === brand.toLowerCase()
      )
    );
  }
  
  // 应用分类筛选
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(product => 
      filters.categories.some(category => 
        product.category?.toLowerCase() === category.toLowerCase()
      )
    );
  }
  
  return results;
};

/**
 * 对搜索结果进行排序
 * @param {Array} results 搜索结果
 * @param {string} sortBy 排序方式
 * @returns {Array} 排序后的结果
 */
const sortResults = (results, sortBy = 'relevance') => {
  const sortedResults = [...results];
  
  switch (sortBy) {
    case 'price_asc':
      // 价格从低到高
      sortedResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
      
    case 'price_desc':
      // 价格从高到低
      sortedResults.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
      
    case 'rating':
      // 评分从高到低
      sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
      
    case 'sales':
      // 销量从高到低
      sortedResults.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      break;
      
    case 'newest':
      // 最新上架
      sortedResults.sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate) : new Date(0);
        const dateB = b.publishDate ? new Date(b.publishDate) : new Date(0);
        return dateB - dateA;
      });
      break;
      
    case 'relevance':
    default:
      // 默认按相关度排序
      sortedResults.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
  }
  
  return sortedResults;
};

/**
 * 获取搜索历史
 * @param {number} limit 限制返回的记录数
 * @returns {Array} 搜索历史数组
 */
export const getSearchHistory = (limit = 10) => {
  const history = localStorage.getItem('searchHistory');
  if (!history) {
    return [];
  }
  
  try {
    const parsedHistory = JSON.parse(history);
    // 返回最近的N条记录
    return parsedHistory.slice(0, limit);
  } catch (error) {
    console.error('解析搜索历史失败:', error);
    return [];
  }
};

/**
 * 记录搜索历史
 * @param {string} query 搜索关键词
 */
export const recordSearchHistory = (query) => {
  if (!query || query.trim() === '') {
    return;
  }
  
  try {
    // 获取现有历史
    let history = getSearchHistory(20); // 获取最近20条
    
    // 清除重复项
    history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // 添加新记录到开头
    history.unshift({
      query: query,
      timestamp: Date.now()
    });
    
    // 限制历史记录数量
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    // 保存回本地存储
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch (error) {
    console.error('记录搜索历史失败:', error);
  }
};

/**
 * 清除搜索历史
 */
export const clearSearchHistory = () => {
  localStorage.removeItem('searchHistory');
};

/**
 * 获取热门搜索词
 * @returns {Array} 热门搜索词数组
 */
export const getHotSearchTerms = () => {
  // 这里返回模拟的热门搜索词，实际项目中应该从后端获取
  return [
    '智能手机',
    '蓝牙耳机',
    '笔记本电脑',
    '平板电脑',
    '智能手表',
    '电动牙刷',
    '空气净化器',
    '扫地机器人'
  ];
};

/**
 * 获取搜索建议
 * @param {string} query 搜索关键词
 * @returns {Promise<Array>} 搜索建议数组
 */
export const getSearchSuggestions = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    // 从缓存获取商品数据
    const products = await getAllProducts();
    
    // 构建查询索引（简化版，实际项目应使用更高级的分词和索引技术）
    const queryLower = query.toLowerCase().trim();
    const suggestions = new Set();
    
    // 从历史搜索中获取建议
    const history = getSearchHistory();
    history.forEach(item => {
      if (item.query.toLowerCase().includes(queryLower)) {
        suggestions.add(item.query);
      }
    });
    
    // 获取热门搜索中的建议
    const hotSearches = getHotSearchTerms();
    hotSearches.forEach(term => {
      if (term.toLowerCase().includes(queryLower)) {
        suggestions.add(term);
      }
    });
    
    // 从品牌中获取建议
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(queryLower)) {
        suggestions.add(`${brand} 品牌`);
      }
    });
    
    // 从分类中获取建议
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categories.forEach(category => {
      if (category && category.toLowerCase().includes(queryLower)) {
        suggestions.add(`${category} 分类`);
      }
    });
    
    // 从商品名称中获取建议
    products.forEach(product => {
      const name = product.name || '';
      if (name.toLowerCase().includes(queryLower)) {
        // 截取包含查询的部分以及前后一些上下文
        const index = name.toLowerCase().indexOf(queryLower);
        let start = Math.max(0, index - 5);
        let end = Math.min(name.length, index + queryLower.length + 15);
        let suggestion = name.substring(start, end);
        
        // 如果不是从开头截取，加上...
        if (start > 0) {
          suggestion = '...' + suggestion;
        }
        
        // 如果不是截取到结尾，加上...
        if (end < name.length) {
          suggestion = suggestion + '...';
        }
        
        suggestions.add(suggestion.trim());
      }
    });
    
    // 生成组合查询建议
    if (suggestions.size < 5) {
      // 添加智能组合建议
      const commonPrefixes = ['最新', '热门', '优质', '高端'];
      const commonSuffixes = ['商品', '推荐', '促销'];
      
      commonPrefixes.forEach(prefix => {
        suggestions.add(`${prefix}${query}`);
      });
      
      commonSuffixes.forEach(suffix => {
        suggestions.add(`${query}${suffix}`);
      });
    }
    
    // 控制返回数量，添加关联性排序
    return [...suggestions]
      .slice(0, 8)
      .sort((a, b) => {
        // 精确匹配的优先级最高
        const aExact = a.toLowerCase() === queryLower;
        const bExact = b.toLowerCase() === queryLower;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // 开头匹配的优先级其次
        const aStartsWith = a.toLowerCase().startsWith(queryLower);
        const bStartsWith = b.toLowerCase().startsWith(queryLower);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // 长度较短的优先
        return a.length - b.length;
      });
  } catch (error) {
    console.error('获取搜索建议失败:', error);
    return [];
  }
}; 