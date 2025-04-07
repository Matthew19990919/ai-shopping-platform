document.addEventListener('DOMContentLoaded', () => {
  // 初始化实时时钟
  initializeClock();
  
  // 初始化倒计时
  initializeCountdown();
  
  // 加载实时数据
  loadRealTimeData();
  
  // 设置定时刷新
  setInterval(() => {
    refreshRealTimeData();
  }, 30000); // 每30秒刷新一次
});

// 实时时钟功能
function initializeClock() {
  const timeDisplay = document.getElementById('current-time');
  if (!timeDisplay) return;
  
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  updateClock(); // 立即执行一次
  setInterval(updateClock, 1000); // 每秒更新一次
}

// 倒计时功能
function initializeCountdown() {
  const hoursSpan = document.querySelector('#countdown .hours');
  const minutesSpan = document.querySelector('#countdown .minutes');
  const secondsSpan = document.querySelector('#countdown .seconds');
  
  if (!hoursSpan || !minutesSpan || !secondsSpan) return;
  
  // 设置倒计时结束时间（当前时间 + 2小时）
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 2);
  
  function updateCountdown() {
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) {
      // 倒计时结束，重置为新的2小时
      endTime.setHours(now.getHours() + 2);
      loadLimitedOffers(); // 重新加载限时抢购商品
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    hoursSpan.textContent = String(hours).padStart(2, '0');
    minutesSpan.textContent = String(minutes).padStart(2, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
  }
  
  updateCountdown(); // 立即执行一次
  setInterval(updateCountdown, 1000); // 每秒更新一次
}

// 加载实时数据
async function loadRealTimeData() {
  try {
    await Promise.all([
      loadNewArrivals(),
      loadTrendingProducts(),
      loadLimitedOffers()
    ]);
  } catch (error) {
    console.error('加载实时数据失败:', error);
  }
}

// 加载新品上架数据
async function loadNewArrivals() {
  const container = document.getElementById('new-arrivals-container');
  if (!container) return;
  
  try {
    // 实际应用中，这里应该是从后端API获取数据
    // 这里使用模拟数据演示
    const response = await mockApiCall('/api/products/new-arrivals');
    
    // 清空容器（移除加载动画）
    container.innerHTML = '';
    
    // 添加新品
    response.products.forEach(product => {
      const productElement = createRealTimeProductElement(product, 'new');
      container.appendChild(productElement);
    });
  } catch (error) {
    container.innerHTML = '<div class="error-message">加载失败，请稍后再试</div>';
    console.error('加载新品上架数据失败:', error);
  }
}

// 加载热销商品数据
async function loadTrendingProducts() {
  const container = document.getElementById('trending-container');
  if (!container) return;
  
  try {
    // 实际应用中，这里应该是从后端API获取数据
    const response = await mockApiCall('/api/products/trending');
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加热销商品
    response.products.forEach(product => {
      const productElement = createRealTimeProductElement(product, 'trending');
      container.appendChild(productElement);
    });
  } catch (error) {
    container.innerHTML = '<div class="error-message">加载失败，请稍后再试</div>';
    console.error('加载热销商品数据失败:', error);
  }
}

// 加载限时抢购数据
async function loadLimitedOffers() {
  const container = document.getElementById('limited-offers-container');
  if (!container) return;
  
  try {
    // 实际应用中，这里应该是从后端API获取数据
    const response = await mockApiCall('/api/products/limited-offers');
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加限时抢购商品
    response.products.forEach(product => {
      const productElement = createRealTimeProductElement(product, 'limited');
      container.appendChild(productElement);
    });
  } catch (error) {
    container.innerHTML = '<div class="error-message">加载失败，请稍后再试</div>';
    console.error('加载限时抢购数据失败:', error);
  }
}

// 刷新实时数据
function refreshRealTimeData() {
  // 随机选择一个模块进行更新，模拟实时更新效果
  const random = Math.random();
  
  if (random < 0.33) {
    updateNewArrivals();
  } else if (random < 0.66) {
    updateTrendingProducts();
  } else {
    updateLimitedOffers();
  }
}

// 更新新品上架
async function updateNewArrivals() {
  const container = document.getElementById('new-arrivals-container');
  if (!container) return;
  
  try {
    const response = await mockApiCall('/api/products/new-arrivals/updates');
    if (response.updates.length > 0) {
      // 添加新商品到顶部
      response.updates.forEach(product => {
        const productElement = createRealTimeProductElement(product, 'new');
        productElement.classList.add('flash-animation');
        
        // 插入到顶部
        if (container.firstChild) {
          container.insertBefore(productElement, container.firstChild);
        } else {
          container.appendChild(productElement);
        }
        
        // 如果商品超过5个，移除最后一个
        if (container.children.length > 5) {
          container.removeChild(container.lastChild);
        }
      });
    }
  } catch (error) {
    console.error('更新新品上架数据失败:', error);
  }
}

// 更新热销商品
async function updateTrendingProducts() {
  const container = document.getElementById('trending-container');
  if (!container) return;
  
  try {
    const response = await mockApiCall('/api/products/trending/updates');
    if (response.updates.length > 0) {
      // 更新销量数据
      response.updates.forEach(update => {
        // 查找对应商品
        const productElements = container.querySelectorAll('.real-time-product');
        for (let i = 0; i < productElements.length; i++) {
          const element = productElements[i];
          const productId = element.getAttribute('data-product-id');
          
          if (productId === update.id.toString()) {
            // 更新销量
            const salesElement = element.querySelector('.real-time-product-sales');
            if (salesElement) {
              const currentSales = parseInt(salesElement.textContent.match(/\d+/)[0]);
              const newSales = currentSales + update.salesIncrement;
              salesElement.textContent = `已售${newSales}件`;
              
              // 添加闪烁效果
              element.classList.add('flash-animation');
              setTimeout(() => {
                element.classList.remove('flash-animation');
              }, 2000);
            }
            break;
          }
        }
      });
    }
  } catch (error) {
    console.error('更新热销商品数据失败:', error);
  }
}

// 更新限时抢购
async function updateLimitedOffers() {
  const container = document.getElementById('limited-offers-container');
  if (!container) return;
  
  try {
    const response = await mockApiCall('/api/products/limited-offers/updates');
    if (response.updates.length > 0) {
      // 更新库存和价格
      response.updates.forEach(update => {
        // 查找对应商品
        const productElements = container.querySelectorAll('.real-time-product');
        for (let i = 0; i < productElements.length; i++) {
          const element = productElements[i];
          const productId = element.getAttribute('data-product-id');
          
          if (productId === update.id.toString()) {
            // 更新价格（如果有变化）
            if (update.newPrice) {
              const priceElement = element.querySelector('.real-time-product-price');
              if (priceElement) {
                priceElement.textContent = `¥${update.newPrice}`;
                priceElement.classList.add('flash-animation');
                setTimeout(() => {
                  priceElement.classList.remove('flash-animation');
                }, 2000);
              }
            }
            
            // 更新库存
            const metaElement = element.querySelector('.real-time-product-meta');
            if (metaElement) {
              const stockElement = document.createElement('span');
              stockElement.className = 'real-time-product-stock';
              stockElement.textContent = `仅剩${update.stock}件`;
              stockElement.style.color = update.stock < 10 ? '#ff4d4f' : '#ff7a45';
              
              // 替换或添加库存信息
              const existingStock = metaElement.querySelector('.real-time-product-stock');
              if (existingStock) {
                metaElement.replaceChild(stockElement, existingStock);
              } else {
                metaElement.appendChild(stockElement);
              }
              
              // 添加闪烁效果
              element.classList.add('flash-animation');
              setTimeout(() => {
                element.classList.remove('flash-animation');
              }, 2000);
            }
            break;
          }
        }
      });
    }
  } catch (error) {
    console.error('更新限时抢购数据失败:', error);
  }
}

// 创建实时商品元素
function createRealTimeProductElement(product, type) {
  const element = document.createElement('div');
  element.className = 'real-time-product';
  element.setAttribute('data-product-id', product.id);
  
  // 添加点击事件，点击后跳转到商品详情页
  element.addEventListener('click', function() {
    window.location.href = `/product/${product.id}`;
  });
  
  // 设置鼠标样式为手型，表示可点击
  element.style.cursor = 'pointer';
  
  // 根据类型添加不同的标签
  let badge = '';
  if (type === 'new') {
    badge = '<span class="badge new-badge">新品</span>';
  } else if (type === 'limited') {
    badge = '<span class="badge limited-badge">限时</span>';
  } else if (product.hot) {
    badge = '<span class="badge hot-badge">热销</span>';
  }
  
  element.innerHTML = `
    <div class="real-time-product-image">
      <img src="${product.image}" alt="${product.name}">
      ${badge}
    </div>
    <div class="real-time-product-info">
      <h3 class="real-time-product-name">${product.name}</h3>
      <div class="real-time-product-price">
        <span class="current-price">¥${product.price.toFixed(2)}</span>
        ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
      </div>
      <div class="real-time-product-meta">
        <span class="real-time-product-sales">已售${product.sales}件</span>
        ${type === 'new' ? `<span class="real-time-product-time">${getTimeAgo(product.listingDate)}</span>` : ''}
      </div>
    </div>
  `;
  
  return element;
}

// 获取相对时间
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}天前`;
}

// 模拟API调用（实际应用中应替换为真实API调用）
function mockApiCall(endpoint) {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 根据端点返回不同的模拟数据
      switch(endpoint) {
        case '/api/products/new-arrivals':
          resolve({
            products: [
              {
                id: 101,
                title: "2024新款智能手表 运动监测血氧心率防水",
                price: 299.00,
                image: "/images/products/smartwatch.jpg",
                timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5分钟前
              },
              {
                id: 102,
                title: "无线降噪耳机 蓝牙5.2 持久续航",
                price: 499.00,
                image: "/images/products/headphones.jpg",
                timestamp: new Date(Date.now() - 12 * 60 * 1000) // 12分钟前
              },
              {
                id: 103,
                title: "便携式移动电源 22.5W快充 20000mAh",
                price: 129.00,
                image: "/images/products/powerbank.jpg",
                timestamp: new Date(Date.now() - 35 * 60 * 1000) // 35分钟前
              }
            ]
          });
          break;
          
        case '/api/products/trending':
          resolve({
            products: [
              {
                id: 201,
                title: "高端电竞耳机 7.1环绕声 RGB灯效",
                price: 399.00,
                image: "/images/products/headphones.jpg",
                sales: 1245
              },
              {
                id: 202,
                title: "机械键盘 青轴 104键 背光",
                price: 249.00,
                image: "/images/products/smartwatch.jpg",
                sales: 982
              },
              {
                id: 203,
                title: "电竞鼠标 16000DPI 可编程按键",
                price: 159.00,
                image: "/images/products/powerbank.jpg",
                sales: 1567
              }
            ]
          });
          break;
          
        case '/api/products/limited-offers':
          resolve({
            products: [
              {
                id: 301,
                title: "高清智能投影仪 1080P 自动对焦",
                price: 1999.00,
                image: "/images/products/smartwatch.jpg",
                stock: 15
              },
              {
                id: 302,
                title: "智能扫地机器人 激光导航 APP控制",
                price: 1499.00,
                image: "/images/products/headphones.jpg",
                stock: 8
              },
              {
                id: 303,
                title: "空气净化器 除菌除醛 静音模式",
                price: 899.00,
                image: "/images/products/powerbank.jpg",
                stock: 23
              }
            ]
          });
          break;
          
        case '/api/products/new-arrivals/updates':
          resolve({
            updates: [
              {
                id: 104,
                title: "智能空调遥控器 红外线+WiFi控制",
                price: 79.00,
                image: "/images/products/smartwatch.jpg",
                timestamp: new Date()
              }
            ]
          });
          break;
          
        case '/api/products/trending/updates':
          resolve({
            updates: [
              {
                id: 201,
                salesIncrement: 13
              },
              {
                id: 203,
                salesIncrement: 8
              }
            ]
          });
          break;
          
        case '/api/products/limited-offers/updates':
          resolve({
            updates: [
              {
                id: 302,
                stock: 5,
                newPrice: 1399.00
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