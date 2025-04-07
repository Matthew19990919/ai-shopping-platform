/**
 * 用户个性化推荐功能实现
 * 负责根据用户浏览历史和偏好推荐商品
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化用户个性化系统
    initPersonalization();
    
    // 加载用户推荐商品
    loadRecommendedProducts();
    
    // 监听用户行为
    trackUserBehavior();
});

/**
 * 初始化用户个性化系统
 */
function initPersonalization() {
    // 检查用户是否已有ID，如果没有则创建一个
    if (!localStorage.getItem('userId')) {
        const userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    
    // 初始化或读取用户偏好数据
    if (!localStorage.getItem('userPreferences')) {
        // 默认初始偏好
        const defaultPreferences = {
            categories: {},
            brands: {},
            priceRange: {
                min: 0,
                max: 10000
            },
            viewHistory: []
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    }
}

/**
 * 加载用户推荐商品
 */
function loadRecommendedProducts() {
    const container = document.getElementById('recommended-products');
    if (!container) return;
    
    // 获取用户偏好
    const preferences = getUserPreferences();
    
    // 从模拟API获取推荐商品
    getRecommendedProducts(preferences)
        .then(products => {
            // 清空容器
            container.innerHTML = '';
            
            // 渲染推荐产品
            if (products && products.length > 0) {
                products.forEach(product => {
                    const productElement = createProductElement(product);
                    container.appendChild(productElement);
                });
            } else {
                // 无推荐产品时显示默认商品
                showDefaultProducts(container);
            }
        })
        .catch(error => {
            console.error('加载推荐商品失败:', error);
            // 发生错误时显示默认商品
            showDefaultProducts(container);
        });
}

/**
 * 创建商品元素
 */
function createProductElement(product) {
    const element = document.createElement('div');
    element.className = 'user-recommendation-item';
    element.setAttribute('data-product-id', product.id);
    element.setAttribute('data-category', product.category);
    element.setAttribute('data-price', product.price);
    
    element.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.discount ? `<span class="product-discount">-${product.discount}%</span>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">¥${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
        </div>
    `;
    
    // 添加点击事件
    element.addEventListener('click', () => {
        // 记录用户点击
        recordProductClick(product);
        // 跳转到商品详情页
        window.location.href = `/product/${product.id}`;
    });
    
    return element;
}

/**
 * 显示默认商品
 */
function showDefaultProducts(container) {
    // 默认推荐商品数据
    const defaultProducts = [
        {
            id: 1,
            name: "智能无线耳机",
            price: 299.00,
            originalPrice: 399.00,
            discount: 25,
            category: "数码",
            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=智能耳机"
        },
        {
            id: 2,
            name: "全自动咖啡机",
            price: 1299.00,
            originalPrice: 1599.00,
            discount: 18,
            category: "家电",
            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=咖啡机"
        },
        {
            id: 3,
            name: "超薄笔记本电脑",
            price: 5999.00,
            originalPrice: 6999.00,
            discount: 14,
            category: "电脑",
            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=笔记本"
        },
        {
            id: 4,
            name: "运动智能手表",
            price: 899.00,
            originalPrice: 1099.00,
            discount: 18,
            category: "数码",
            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=智能手表"
        },
        {
            id: 5,
            name: "家用空气净化器",
            price: 1599.00,
            originalPrice: 1899.00,
            discount: 15,
            category: "家电",
            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=净化器"
        }
    ];
    
    // 清空容器
    container.innerHTML = '';
    
    // 渲染默认商品
    defaultProducts.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}

/**
 * 监听用户行为
 */
function trackUserBehavior() {
    // 监听商品点击
    document.addEventListener('click', function(e) {
        const productElement = e.target.closest('[data-product-id]');
        if (productElement) {
            const productId = productElement.getAttribute('data-product-id');
            const category = productElement.getAttribute('data-category');
            const price = parseFloat(productElement.getAttribute('data-price'));
            
            // 记录用户点击产品的行为
            updatePreferences({
                id: productId,
                category: category,
                price: price
            });
        }
    });
    
    // 监听搜索行为
    const searchInput = document.querySelector('input[type="text"][placeholder*="搜索"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                // 记录用户搜索
                recordSearch(this.value.trim());
            }
        });
    }
    
    // 监听分类导航点击
    const categoryLinks = document.querySelectorAll('.category-sidebar li');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 记录用户点击分类
            const category = this.textContent.trim();
            recordCategoryView(category);
        });
    });
}

/**
 * 记录商品点击
 */
function recordProductClick(product) {
    updatePreferences(product);
    
    // 同步到服务器（模拟）
    // 实际项目中这里会发送数据到后端
    console.log('用户点击产品:', product);
}

/**
 * 记录搜索操作
 */
function recordSearch(query) {
    const preferences = getUserPreferences();
    
    // 添加搜索记录
    if (!preferences.searches) {
        preferences.searches = [];
    }
    
    // 限制记录数量
    if (preferences.searches.length >= 10) {
        preferences.searches.pop();
    }
    
    // 添加新搜索记录
    preferences.searches.unshift({
        query: query,
        timestamp: Date.now()
    });
    
    // 保存更新
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // 同步到服务器（模拟）
    console.log('用户搜索:', query);
}

/**
 * 记录分类查看
 */
function recordCategoryView(category) {
    const preferences = getUserPreferences();
    
    // 更新分类权重
    if (!preferences.categories[category]) {
        preferences.categories[category] = 1;
    } else {
        preferences.categories[category]++;
    }
    
    // 保存更新
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // 同步到服务器（模拟）
    console.log('用户查看分类:', category);
}

/**
 * 更新用户偏好
 */
function updatePreferences(product) {
    const preferences = getUserPreferences();
    
    // 更新分类权重
    if (product.category) {
        if (!preferences.categories[product.category]) {
            preferences.categories[product.category] = 1;
        } else {
            preferences.categories[product.category]++;
        }
    }
    
    // 更新品牌权重
    if (product.brand) {
        if (!preferences.brands[product.brand]) {
            preferences.brands[product.brand] = 1;
        } else {
            preferences.brands[product.brand]++;
        }
    }
    
    // 更新价格范围偏好
    if (product.price) {
        // 计算动态价格范围
        const priceRange = preferences.priceRange;
        priceRange.min = Math.min(priceRange.min, product.price * 0.8);
        priceRange.max = Math.max(priceRange.max, product.price * 1.2);
    }
    
    // 添加到浏览历史
    if (product.id) {
        // 如果已存在，则移除旧记录
        preferences.viewHistory = preferences.viewHistory.filter(item => item.id !== product.id);
        
        // 限制历史记录数量
        if (preferences.viewHistory.length >= 20) {
            preferences.viewHistory.pop();
        }
        
        // 添加新记录到最前面
        preferences.viewHistory.unshift({
            id: product.id,
            timestamp: Date.now()
        });
    }
    
    // 保存更新
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

/**
 * 获取用户偏好
 */
function getUserPreferences() {
    const preferences = localStorage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : {};
}

/**
 * 获取推荐商品（模拟API调用）
 */
function getRecommendedProducts(preferences) {
    return new Promise((resolve) => {
        // 模拟网络请求延迟
        setTimeout(() => {
            // 模拟的商品数据
            const allProducts = [
                {
                    id: 101,
                    name: "优质保温杯",
                    price: 129.00,
                    category: "日用",
                    brand: "膳魔师",
                    tags: ["日用", "厨房", "热销"],
                    image: "https://via.placeholder.com/200x200/eeffee/333333?text=保温杯"
                },
                {
                    id: 102,
                    name: "智能手环",
                    price: 199.00,
                    originalPrice: 249.00,
                    discount: 20,
                    category: "数码",
                    brand: "小米",
                    tags: ["数码", "穿戴", "热销"],
                    image: "https://via.placeholder.com/200x200/eeffee/333333?text=智能手环"
                },
                {
                    id: 103,
                    name: "无线充电器",
                    price: 149.00,
                    originalPrice: 179.00,
                    discount: 16,
                    category: "数码",
                    brand: "公牛",
                    tags: ["数码", "配件"],
document.addEventListener('DOMContentLoaded', () => {
  // 初始化用户个性化区域
  initializeUserPersonalization();
  
  // 设置定时刷新
  setInterval(() => {
    refreshUserActivity();
  }, 45000); // 每45秒刷新一次
});

// 初始化用户个性化区域
async function initializeUserPersonalization() {
  // 加载用户欢迎信息
  loadUserGreeting();
  
  // 加载浏览历史
  loadBrowsingHistory();
  
  // 加载推荐商品
  loadRecommendedProducts();
}

// 加载用户欢迎信息
function loadUserGreeting() {
  const greetingContainer = document.getElementById('user-greeting');
  if (!greetingContainer) return;
  
  // 检查用户是否已登录
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userData = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
  
  let greeting;
  
  if (isLoggedIn && userData) {
    // 用户已登录，显示个性化欢迎信息
    greeting = `
      <div class="user-greeting-content">
        <img src="${userData.avatar || '/images/default-avatar.png'}" alt="用户头像" class="user-avatar">
        <div class="greeting-text">
          <h3>Hi，${userData.username}</h3>
          <p>${getTimeBasedGreeting()}，欢迎回来！</p>
        </div>
      </div>
    `;
  } else {
    // 用户未登录，显示一般欢迎信息和登录按钮
    greeting = `
      <div class="user-greeting-content">
        <img src="/images/default-avatar.png" alt="游客" class="user-avatar">
        <div class="greeting-text">
          <h3>${getTimeBasedGreeting()}，欢迎光临</h3>
          <p>登录后享受更多优惠和个性化推荐</p>
          <div class="login-register-buttons">
            <a href="login.html" class="login-button">登录</a>
            <a href="register.html" class="register-button">注册</a>
          </div>
        </div>
      </div>
    `;
  }
  
  greetingContainer.innerHTML = greeting;
}

// 加载浏览历史
async function loadBrowsingHistory() {
  const container = document.getElementById('history-products');
  if (!container) return;
  
  try {
    // 实际应用中，这里应该从后端API或本地存储获取数据
    const response = await mockApiCall('/api/user/browsing-history');
    
    // 清空容器（移除加载动画）
    container.innerHTML = '';
    
    // 添加浏览历史
    if (response.products && response.products.length > 0) {
      response.products.forEach(product => {
        const productElement = createHistoryProductElement(product);
        container.appendChild(productElement);
      });
    } else {
      container.innerHTML = '<div class="empty-state">暂无浏览记录</div>';
    }
  } catch (error) {
    container.innerHTML = '<div class="error-message">加载失败，请稍后再试</div>';
    console.error('加载浏览历史失败:', error);
  }
}

// 加载推荐商品
async function loadRecommendedProducts() {
  const container = document.getElementById('recommended-products');
  if (!container) return;
  
  try {
    // 实际应用中，这里应该从后端API获取个性化推荐
    const response = await mockApiCall('/api/user/recommendations');
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加推荐商品
    if (response.products && response.products.length > 0) {
      response.products.forEach(product => {
        const productElement = createRecommendedProductElement(product);
        container.appendChild(productElement);
      });
    } else {
      container.innerHTML = '<div class="empty-state">暂无推荐商品</div>';
    }
  } catch (error) {
    container.innerHTML = '<div class="error-message">加载失败，请稍后再试</div>';
    console.error('加载推荐商品失败:', error);
  }
}

// 刷新用户活动
function refreshUserActivity() {
  // 随机选择一个活动进行更新，模拟实时更新效果
  const random = Math.random();
  
  if (random < 0.5) {
    updateBrowsingHistory();
  } else {
    updateRecommendations();
  }
}

// 更新浏览历史
async function updateBrowsingHistory() {
  const container = document.getElementById('history-products');
  if (!container) return;
  
  try {
    const response = await mockApiCall('/api/user/browsing-history/updates');
    
    if (response.updates && response.updates.length > 0) {
      // 添加新的浏览记录到开头
      response.updates.forEach(product => {
        const productElement = createHistoryProductElement(product);
        
        // 添加新内容标记
        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        badge.textContent = 'N';
        productElement.appendChild(badge);
        
        // 插入到开头
        if (container.firstChild) {
          container.insertBefore(productElement, container.firstChild);
        } else {
          container.appendChild(productElement);
        }
        
        // 淡出通知徽章
        setTimeout(() => {
          badge.style.transition = 'opacity 0.5s ease-out';
          badge.style.opacity = '0';
        }, 5000);
        
        // 如果产品超过8个，移除最后一个
        if (container.children.length > 8) {
          container.removeChild(container.lastChild);
        }
      });
    }
  } catch (error) {
    console.error('更新浏览历史失败:', error);
  }
}

// 更新推荐
async function updateRecommendations() {
  const container = document.getElementById('recommended-products');
  if (!container) return;
  
  try {
    const response = await mockApiCall('/api/user/recommendations/updates');
    
    if (response.updates && response.updates.length > 0) {
      // 随机位置插入新推荐
      response.updates.forEach(product => {
        const productElement = createRecommendedProductElement(product);
        productElement.classList.add('activity-item');
        
        // 随机位置插入
        const position = Math.floor(Math.random() * (container.children.length + 1));
        
        if (position < container.children.length) {
          container.insertBefore(productElement, container.children[position]);
        } else {
          container.appendChild(productElement);
        }
        
        // 如果产品超过8个，随机移除一个（不是刚添加的）
        if (container.children.length > 8) {
          const itemsToRemove = Array.from(container.children).filter(
            child => child !== productElement
          );
          const itemToRemove = itemsToRemove[Math.floor(Math.random() * itemsToRemove.length)];
          container.removeChild(itemToRemove);
        }
      });
    }
  } catch (error) {
    console.error('更新推荐失败:', error);
  }
}

// 创建历史商品元素
function createHistoryProductElement(product) {
  const div = document.createElement('div');
  div.className = 'history-product';
  div.setAttribute('data-product-id', product.id);
  
  div.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <div class="history-product-title">${product.title}</div>
    <div class="history-product-price">¥${product.price}</div>
  `;
  
  // 添加点击事件，跳转到商品详情页
  div.addEventListener('click', () => {
    window.location.href = `product/${product.id}.html`;
  });
  
  return div;
}

// 创建推荐商品元素
function createRecommendedProductElement(product) {
  const div = document.createElement('div');
  div.className = 'recommended-product';
  div.setAttribute('data-product-id', product.id);
  
  div.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <div class="recommended-product-title">${product.title}</div>
    <div class="recommended-product-price">¥${product.price}</div>
  `;
  
  // 添加点击事件，跳转到商品详情页
  div.addEventListener('click', () => {
    window.location.href = `product/${product.id}.html`;
  });
  
  return div;
}

// 根据时间获取问候语
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 6) {
    return '凌晨好';
  } else if (hour < 11) {
    return '早上好';
  } else if (hour < 13) {
    return '中午好';
  } else if (hour < 18) {
    return '下午好';
  } else {
    return '晚上好';
  }
}

// 模拟API调用
function mockApiCall(endpoint) {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 根据端点返回不同的模拟数据
      switch(endpoint) {
        case '/api/user/browsing-history':
          resolve({
            products: [
              {
                id: 401,
                title: "全自动智能咖啡机 15Bar压力 磨豆一体",
                price: 2999.00,
                image: "/images/products/smartwatch.jpg"
              },
              {
                id: 402,
                title: "超薄折叠手机 双屏设计 5G网络",
                price: 9999.00,
                image: "/images/products/headphones.jpg"
              },
              {
                id: 403,
                title: "4K HDR智能电视 55英寸 AI语音控制",
                price: 3499.00,
                image: "/images/products/powerbank.jpg"
              }
            ]
          });
          break;
          
        case '/api/user/recommendations':
          resolve({
            products: [
              {
                id: 501,
                title: "机械硬盘 4TB 7200转 缓存256MB",
                price: 599.00,
                image: "/images/products/smartwatch.jpg"
              },
              {
                id: 502,
                title: "固态硬盘 1TB NVMe PCIe 4.0",
                price: 799.00,
                image: "/images/products/headphones.jpg"
              },
              {
                id: 503,
                title: "电竞显示器 27英寸 2K 165Hz",
                price: 1799.00,
                image: "/images/products/powerbank.jpg"
              }
            ]
          });
          break;
          
        case '/api/user/browsing-history/updates':
          resolve({
            updates: [
              {
                id: 405,
                title: "真无线蓝牙耳机 主动降噪 IP55防水",
                price: 699.00,
                image: "/images/products/headphones.jpg"
              }
            ]
          });
          break;
          
        case '/api/user/recommendations/updates':
          resolve({
            updates: [
              {
                id: 505,
                title: "智能手环 心率血氧监测 14天续航",
                price: 249.00,
                image: "/images/products/smartwatch.jpg"
              }
            ]
          });
          break;
          
        default:
          resolve({ error: "未知端点" });
      }
    }, 800); // 延迟800ms
  });
} 