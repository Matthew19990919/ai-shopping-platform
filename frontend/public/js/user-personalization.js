/**
 * 用户个性化推荐功能
 * 负责记录用户浏览行为，个性化推荐商品
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户个性化设置
    initPersonalization();
  
  // 加载推荐商品
  loadRecommendedProducts();
    
    // 跟踪用户行为
    trackUserBehavior();
});

/**
 * 初始化用户个性化
 */
function initPersonalization() {
    // 检查是否已经有用户ID
    if (!localStorage.getItem('userId')) {
        // 生成随机用户ID
        const userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('userId', userId);
    }
    
    // 检查是否已经有偏好设置
    if (!localStorage.getItem('userPreferences')) {
        // 设置默认偏好
        const defaultPreferences = {
            categories: {},
            searchTerms: [],
            viewedProducts: [],
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    }
}

/**
 * 加载推荐商品
 */
function loadRecommendedProducts() {
    const container = document.getElementById('user-recommendations-container');
    if (!container) return;
    
    // 显示加载状态
    container.innerHTML = '<div class="loading-spinner">正在为您加载个性化推荐...</div>';
    
    // 获取用户偏好
    const preferences = localStorage.getItem('userPreferences') 
        ? JSON.parse(localStorage.getItem('userPreferences')) 
        : null;
    
    if (!preferences || Object.keys(preferences.categories).length === 0) {
        // 如果没有偏好数据，显示默认推荐
        showDefaultProducts(container);
        return;
    }
    
    // 获取推荐商品
    getRecommendedProducts(preferences)
        .then(products => {
            if (!products || products.length === 0) {
                showDefaultProducts(container);
                return;
            }
            
            // 清空容器
            container.innerHTML = '';
            
            // 创建推荐标题
            const titleElement = document.createElement('div');
            titleElement.className = 'recommendation-title';
            titleElement.innerHTML = `
                <h3>为您推荐</h3>
                <span class="recommendation-subtitle">根据您的浏览记录和偏好生成</span>
            `;
            container.appendChild(titleElement);
            
            // 创建产品网格
            const productGrid = document.createElement('div');
            productGrid.className = 'user-recommendation-grid';
            
            // 添加产品
            products.forEach(product => {
                const productElement = createProductElement(product);
                productGrid.appendChild(productElement);
            });
            
            container.appendChild(productGrid);
            
            // 显示浏览历史分类
            const historyElement = document.createElement('div');
            historyElement.className = 'browsing-history';
            
            // 获取最常浏览的分类
            const categories = Object.entries(preferences.categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(entry => entry[0]);
            
            // 创建分类标签
            historyElement.innerHTML = '<div class="history-title">您感兴趣的分类：</div>';
            
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-tags';
            
            categories.forEach(category => {
                const tagElement = document.createElement('span');
                tagElement.className = 'category-tag';
                tagElement.textContent = category;
                tagElement.addEventListener('click', () => {
                    window.location.href = `/category/${category}`;
                });
                categoryContainer.appendChild(tagElement);
            });
            
            historyElement.appendChild(categoryContainer);
            container.appendChild(historyElement);
        })
        .catch(error => {
            console.error('加载推荐商品失败:', error);
            showDefaultProducts(container);
        });
}

/**
 * 创建产品元素
 */
function createProductElement(product) {
    const element = document.createElement('div');
    element.className = 'user-recommendation-item';
    element.setAttribute('data-product-id', product.id);
    
    element.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.discount ? `<span class="discount-label">-${product.discount}%</span>` : ''}
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <div class="product-price">
                <span class="current-price">¥${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    `;
    
    // 添加点击事件
    element.addEventListener('click', () => {
        recordProductClick(product);
        window.location.href = `/product/${product.id}`;
    });
    
    return element;
}

/**
 * 显示默认推荐商品
 */
function showDefaultProducts(container) {
    // 清空容器
    container.innerHTML = '';
    
    // 创建标题
    const titleElement = document.createElement('div');
    titleElement.className = 'recommendation-title';
    titleElement.innerHTML = '<h3>热门推荐</h3>';
    container.appendChild(titleElement);
    
    // 创建产品网格
    const productGrid = document.createElement('div');
    productGrid.className = 'user-recommendation-grid';
    
    // 添加默认热门产品
    const defaultProducts = [
        {
            id: 1001,
            name: "超薄折叠屏手机",
            price: 6999.00,
            originalPrice: 7999.00,
            discount: 12,
            image: "https://via.placeholder.com/200x200/f8f8f8/333333?text=热门1",
            category: "手机数码"
        },
        {
            id: 1002,
            name: "专业无人机航拍套装",
            price: 3299.00,
            originalPrice: 3699.00,
            discount: 10,
            image: "https://via.placeholder.com/200x200/f8f8f8/333333?text=热门2",
            category: "数码配件"
        },
        {
            id: 1003,
            name: "智能家居套装",
            price: 1499.00,
            originalPrice: 1999.00,
            discount: 25,
            image: "https://via.placeholder.com/200x200/f8f8f8/333333?text=热门3",
            category: "智能家居"
        },
        {
            id: 1004,
            name: "高端蓝牙音箱",
            price: 899.00,
            originalPrice: 1099.00,
            discount: 18,
            image: "https://via.placeholder.com/200x200/f8f8f8/333333?text=热门4",
            category: "音响设备"
        },
        {
            id: 1005,
            name: "电竞笔记本电脑",
            price: 8999.00,
            originalPrice: 9999.00,
            discount: 10,
            image: "https://via.placeholder.com/200x200/f8f8f8/333333?text=热门5",
            category: "电脑办公"
        }
    ];
    
    defaultProducts.forEach(product => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
    });
    
    container.appendChild(productGrid);
}

/**
 * 跟踪用户行为
 */
function trackUserBehavior() {
    // 监听产品点击
    document.addEventListener('click', function(event) {
        const productElement = event.target.closest('[data-product-id]');
        if (productElement) {
            const productId = productElement.getAttribute('data-product-id');
            const productName = productElement.querySelector('.product-name')?.textContent || '';
            const category = productElement.getAttribute('data-category') || '未分类';
            
            recordProductClick({
                id: productId,
                name: productName,
                category: category
            });
        }
    });
    
    // 监听搜索
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            const searchInput = searchForm.querySelector('input[type="search"]');
            if (searchInput && searchInput.value.trim()) {
                recordSearch(searchInput.value.trim());
            }
        });
    }
    
    // 监听分类点击
    document.addEventListener('click', function(event) {
        const categoryElement = event.target.closest('.category-item');
        if (categoryElement) {
            const category = categoryElement.getAttribute('data-category') || 
                             categoryElement.textContent.trim();
            
            if (category) {
                recordCategoryView(category);
            }
        }
    });
}

/**
 * 记录产品点击
 */
function recordProductClick(product) {
    if (!product || !product.id) return;
    
    try {
        // 获取当前偏好
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // 记录浏览过的产品
        if (!preferences.viewedProducts) {
            preferences.viewedProducts = [];
        }
        
        // 避免重复，并保持最新的在前面
        preferences.viewedProducts = preferences.viewedProducts.filter(p => p.id !== product.id);
        preferences.viewedProducts.unshift({
            id: product.id,
            name: product.name || '',
            timestamp: new Date().toISOString(),
            category: product.category || '未分类'
        });
        
        // 最多记录20个
        preferences.viewedProducts = preferences.viewedProducts.slice(0, 20);
        
        // 记录分类偏好
        if (product.category) {
            if (!preferences.categories) {
                preferences.categories = {};
            }
            
            preferences.categories[product.category] = (preferences.categories[product.category] || 0) + 1;
        }
        
        // 更新时间
        preferences.lastUpdated = new Date().toISOString();
        
        // 保存
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('记录产品点击失败:', error);
    }
}

/**
 * 记录搜索查询
 */
function recordSearch(query) {
    if (!query) return;
    
    try {
        // 获取当前偏好
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // 记录搜索词
        if (!preferences.searchTerms) {
            preferences.searchTerms = [];
        }
        
        // 避免重复，并保持最新的在前面
        preferences.searchTerms = preferences.searchTerms.filter(term => term.query !== query);
        preferences.searchTerms.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });
        
        // 最多记录10个
        preferences.searchTerms = preferences.searchTerms.slice(0, 10);
        
        // 更新时间
        preferences.lastUpdated = new Date().toISOString();
        
        // 保存
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('记录搜索查询失败:', error);
    }
}

/**
 * 记录分类浏览
 */
function recordCategoryView(category) {
    if (!category) return;
    
    try {
        // 获取当前偏好
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // 记录分类偏好
        if (!preferences.categories) {
            preferences.categories = {};
        }
        
        preferences.categories[category] = (preferences.categories[category] || 0) + 1;
        
        // 更新时间
        preferences.lastUpdated = new Date().toISOString();
        
        // 保存
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('记录分类浏览失败:', error);
    }
}

/**
 * 获取推荐商品（模拟）
 */
function getRecommendedProducts(preferences) {
  return new Promise((resolve) => {
    setTimeout(() => {
            // 模拟推荐算法
            // 根据用户浏览历史和分类偏好生成推荐
            
            // 获取最常浏览的分类
            const topCategories = Object.entries(preferences.categories || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(entry => entry[0]);
            
            // 模拟商品数据
            const allProducts = [
                // 手机数码
                {
                    id: 2001,
                    name: "旗舰智能手机",
                    price: 5999.00,
                    originalPrice: 6499.00,
                    discount: 7,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=手机1",
                    category: "手机数码"
                },
                {
                    id: 2002,
                    name: "平板电脑 Pro",
                    price: 3699.00,
                    originalPrice: 3999.00,
                    discount: 7,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=平板1",
                    category: "手机数码"
                },
                // 电脑办公
                {
                    id: 2003,
                    name: "轻薄笔记本",
                    price: 6299.00,
                    originalPrice: 6999.00,
                    discount: 10,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=电脑1",
                    category: "电脑办公"
                },
                {
                    id: 2004,
                    name: "机械键盘",
                    price: 499.00,
                    originalPrice: 599.00,
                    discount: 16,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=键盘1",
                    category: "电脑办公"
                },
                // 智能家居
                {
                    id: 2005,
                    name: "智能门锁",
                    price: 899.00,
                    originalPrice: 1099.00,
                    discount: 18,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=门锁1",
                    category: "智能家居"
                },
                {
                    id: 2006,
                    name: "智能音箱",
                    price: 299.00,
                    originalPrice: 399.00,
                    discount: 25,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=音箱1",
                    category: "智能家居"
                },
                // 数码配件
                {
                    id: 2007,
                    name: "无线充电器",
                    price: 129.00,
                    originalPrice: 159.00,
                    discount: 18,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=充电器1",
                    category: "数码配件"
                },
                {
                    id: 2008,
                    name: "蓝牙耳机",
                    price: 599.00,
                    originalPrice: 699.00,
                    discount: 14,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=耳机1",
                    category: "数码配件"
                },
                // 家用电器
                {
                    id: 2009,
                    name: "智能电视",
                    price: 3999.00,
                    originalPrice: 4599.00,
                    discount: 13,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=电视1",
                    category: "家用电器"
                },
                {
                    id: 2010,
                    name: "洗烘一体机",
                    price: 2999.00,
                    originalPrice: 3499.00,
                    discount: 14,
                    image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=洗衣机1",
                    category: "家用电器"
                }
            ];
            
            // 根据用户偏好筛选商品
            let recommendedProducts = [];
            
            // 添加浏览过分类的商品
            topCategories.forEach(category => {
                const categoryProducts = allProducts.filter(p => p.category === category);
                recommendedProducts = recommendedProducts.concat(categoryProducts);
            });
            
            // 如果推荐商品不足5个，添加热门商品
            if (recommendedProducts.length < 5) {
                const otherProducts = allProducts.filter(p => 
                    !topCategories.includes(p.category)
                );
                
                // 随机选择一些补充
                otherProducts.sort(() => Math.random() - 0.5);
                recommendedProducts = recommendedProducts.concat(
                    otherProducts.slice(0, 5 - recommendedProducts.length)
                );
            }
            
            // 最多返回5个产品
            recommendedProducts = recommendedProducts.slice(0, 5);
            
            resolve(recommendedProducts);
        }, 800);
  });
} 