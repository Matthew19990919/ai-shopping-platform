/**
 * 实时更新功能实现
 * 负责处理实时时钟、倒计时和商品实时数据更新
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化实时时钟
    initializeClock();
    
    // 初始化倒计时
    initializeCountdown();
    
    // 加载实时数据
    loadRealTimeData();
    
    // 设置定时刷新
    setInterval(refreshRealTimeData, 30000); // 每30秒刷新一次
});

/**
 * 初始化实时时钟
 */
function initializeClock() {
    const clockElement = document.getElementById('current-time');
    if (!clockElement) return;
    
    // 更新时钟
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // 立即更新一次
    updateClock();
    
    // 每秒更新一次
    setInterval(updateClock, 1000);
}

/**
 * 初始化倒计时
 */
function initializeCountdown() {
    const hoursElement = document.querySelector('.countdown .hours');
    const minutesElement = document.querySelector('.countdown .minutes');
    const secondsElement = document.querySelector('.countdown .seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // 设置目标时间（当天的23:59:59）
    function setTargetTime() {
        const now = new Date();
        // 设置为当天的23点
        const targetHour = 23;
        const targetMinute = 59;
        const targetSecond = 59;
        
        // 创建目标时间
        const targetTime = new Date(now);
        targetTime.setHours(targetHour, targetMinute, targetSecond, 0);
        
        // 如果当前时间已经超过目标时间，设置为明天
        if (now >= targetTime) {
            targetTime.setDate(targetTime.getDate() + 1);
        }
        
        return targetTime;
    }
    
    let targetTime = setTargetTime();
    
    // 更新倒计时
    function updateCountdown() {
        const now = new Date();
        const diff = targetTime - now;
        
        // 如果倒计时结束，重新设置目标时间
        if (diff <= 0) {
            targetTime = setTargetTime();
            return;
        }
        
        // 计算小时、分钟和秒数
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新显示
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新一次
    setInterval(updateCountdown, 1000);
}

/**
 * 加载实时数据
 */
function loadRealTimeData() {
    // 加载新品上架
    loadNewArrivals();
    
    // 加载热销商品
    loadTrendingProducts();
    
    // 加载限时抢购
    loadLimitedOffers();
}

/**
 * 加载新品上架
 */
function loadNewArrivals() {
    const container = document.getElementById('new-arrivals-container');
    if (!container) return;
    
    // 显示加载状态
    container.innerHTML = '<div class="skeleton-loading"></div>';
    
    // 调用模拟API
    mockApi('/api/products/new-arrivals')
        .then(products => {
            // 创建实时产品容器
            const productGrid = document.createElement('div');
            productGrid.className = 'real-time-product-grid';
            
            // 添加产品
            products.forEach(product => {
                const productElement = createRealTimeProduct(product);
                productGrid.appendChild(productElement);
            });
            
            // 替换内容
            container.innerHTML = '';
            container.appendChild(productGrid);
        })
        .catch(error => {
            console.error('加载新品失败:', error);
            container.innerHTML = '<div class="loading-error">加载失败，请刷新重试</div>';
        });
}

/**
 * 加载热销商品
 */
function loadTrendingProducts() {
    const container = document.getElementById('trending-container');
    if (!container) return;
    
    // 显示加载状态
    container.innerHTML = '<div class="skeleton-loading"></div>';
    
    // 调用模拟API
    mockApi('/api/products/trending')
        .then(products => {
            // 创建实时产品容器
            const productGrid = document.createElement('div');
            productGrid.className = 'real-time-product-grid';
            
            // 添加产品
            products.forEach(product => {
                const productElement = createRealTimeProduct(product);
                productGrid.appendChild(productElement);
            });
            
            // 替换内容
            container.innerHTML = '';
            container.appendChild(productGrid);
        })
        .catch(error => {
            console.error('加载热销失败:', error);
            container.innerHTML = '<div class="loading-error">加载失败，请刷新重试</div>';
        });
}

/**
 * 加载限时抢购
 */
function loadLimitedOffers() {
    const container = document.getElementById('limited-offers-container');
    if (!container) return;
    
    // 显示加载状态
    container.innerHTML = '<div class="skeleton-loading"></div>';
    
    // 调用模拟API
    mockApi('/api/products/limited-offers')
        .then(products => {
            // 创建实时产品容器
            const productGrid = document.createElement('div');
            productGrid.className = 'real-time-product-grid';
            
            // 添加产品
            products.forEach(product => {
                const productElement = createRealTimeProduct(product);
                productGrid.appendChild(productElement);
            });
            
            // 替换内容
            container.innerHTML = '';
            container.appendChild(productGrid);
        })
        .catch(error => {
            console.error('加载限时抢购失败:', error);
            container.innerHTML = '<div class="loading-error">加载失败，请刷新重试</div>';
        });
}

/**
 * 刷新实时数据
 */
function refreshRealTimeData() {
    // 随机选择一个类别进行刷新
    const random = Math.floor(Math.random() * 3);
    
    switch (random) {
        case 0:
            updateNewArrivals();
            break;
        case 1:
            updateTrendingProducts();
            break;
        case 2:
            updateLimitedOffers();
            break;
    }
}

/**
 * 更新新品上架
 */
function updateNewArrivals() {
    const container = document.getElementById('new-arrivals-container');
    if (!container) return;
    
    // 调用模拟API
    mockApi('/api/products/new-arrivals/updates')
        .then(updates => {
            if (!updates || updates.length === 0) return;
            
            const productGrid = container.querySelector('.real-time-product-grid');
            if (!productGrid) return;
            
            // 获取现有产品
            const existingProducts = Array.from(productGrid.querySelectorAll('.real-time-product'));
            
            // 对于每个更新
            updates.forEach((update, index) => {
                if (index >= existingProducts.length) return;
                
                const productElement = existingProducts[index];
                
                // 添加闪烁效果
                productElement.classList.add('product-update');
                
                // 更新价格和库存
                const priceElement = productElement.querySelector('.product-price');
                const stockElement = productElement.querySelector('.product-stock');
                
                if (priceElement) {
                    priceElement.innerHTML = `¥${update.price.toFixed(2)}`;
                    if (update.originalPrice) {
                        priceElement.innerHTML += `<span class="original-price">¥${update.originalPrice.toFixed(2)}</span>`;
                    }
                }
                
                if (stockElement) {
                    stockElement.textContent = `库存: ${update.stock}`;
                }
                
                // 移除闪烁效果
                setTimeout(() => {
                    productElement.classList.remove('product-update');
                }, 2000);
            });
        })
        .catch(error => {
            console.error('更新新品失败:', error);
        });
}

/**
 * 更新热销商品
 */
function updateTrendingProducts() {
    const container = document.getElementById('trending-container');
    if (!container) return;
    
    // 调用模拟API
    mockApi('/api/products/trending/updates')
        .then(updates => {
            if (!updates || updates.length === 0) return;
            
            const productGrid = container.querySelector('.real-time-product-grid');
            if (!productGrid) return;
            
            // 获取现有产品
            const existingProducts = Array.from(productGrid.querySelectorAll('.real-time-product'));
            
            // 对于每个更新
            updates.forEach((update, index) => {
                if (index >= existingProducts.length) return;
                
                const productElement = existingProducts[index];
                
                // 添加闪烁效果
                productElement.classList.add('product-update');
                
                // 更新价格和销量
                const priceElement = productElement.querySelector('.product-price');
                const soldElement = productElement.querySelector('.product-sold');
                
                if (priceElement) {
                    priceElement.innerHTML = `¥${update.price.toFixed(2)}`;
                    if (update.originalPrice) {
                        priceElement.innerHTML += `<span class="original-price">¥${update.originalPrice.toFixed(2)}</span>`;
                    }
                }
                
                if (soldElement) {
                    soldElement.textContent = `已售: ${update.sold}`;
                }
                
                // 移除闪烁效果
                setTimeout(() => {
                    productElement.classList.remove('product-update');
                }, 2000);
            });
        })
        .catch(error => {
            console.error('更新热销失败:', error);
        });
}

/**
 * 更新限时抢购
 */
function updateLimitedOffers() {
    const container = document.getElementById('limited-offers-container');
    if (!container) return;
    
    // 调用模拟API
    mockApi('/api/products/limited-offers/updates')
        .then(updates => {
            if (!updates || updates.length === 0) return;
            
            const productGrid = container.querySelector('.real-time-product-grid');
            if (!productGrid) return;
            
            // 获取现有产品
            const existingProducts = Array.from(productGrid.querySelectorAll('.real-time-product'));
            
            // 对于每个更新
            updates.forEach((update, index) => {
                if (index >= existingProducts.length) return;
                
                const productElement = existingProducts[index];
                
                // 添加闪烁效果
                productElement.classList.add('product-update');
                
                // 更新价格和剩余时间
                const priceElement = productElement.querySelector('.product-price');
                const timeElement = productElement.querySelector('.product-time');
                
                if (priceElement) {
                    priceElement.innerHTML = `¥${update.price.toFixed(2)}`;
                    if (update.originalPrice) {
                        priceElement.innerHTML += `<span class="original-price">¥${update.originalPrice.toFixed(2)}</span>`;
                    }
                }
                
                if (timeElement) {
                    timeElement.textContent = `剩余: ${update.timeLeft}`;
                }
                
                // 移除闪烁效果
                setTimeout(() => {
                    productElement.classList.remove('product-update');
                }, 2000);
            });
        })
        .catch(error => {
            console.error('更新限时抢购失败:', error);
        });
}

/**
 * 创建实时产品元素
 */
function createRealTimeProduct(product) {
    const element = document.createElement('div');
    element.className = 'real-time-product';
    element.setAttribute('data-product-id', product.id);
    
    element.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.discount ? `<span class="product-discount">-${product.discount}%</span>` : ''}
            ${product.tag ? `<span class="product-tag product-tag-${product.tag.toLowerCase()}">${product.tag}</span>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                ¥${product.price.toFixed(2)}
                ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-meta">
                ${product.stock !== undefined ? `<span class="product-stock">库存: ${product.stock}</span>` : ''}
                ${product.sold !== undefined ? `<span class="product-sold">已售: ${product.sold}</span>` : ''}
                ${product.timeLeft !== undefined ? `<span class="product-time">剩余: ${product.timeLeft}</span>` : ''}
            </div>
        </div>
    `;
    
    // 添加点击事件
    element.addEventListener('click', () => {
        window.location.href = `/product/${product.id}`;
    });
    
    return element;
}

/**
 * 模拟API调用
 */
function mockApi(endpoint) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            // 根据不同接口返回不同数据
            switch (endpoint) {
                case '/api/products/new-arrivals':
                    resolve([
                        {
                            id: 1,
                            name: "最新款智能手机 Pro",
                            price: 5999.00,
                            originalPrice: 6499.00,
                            discount: 7,
                            stock: 86,
                            tag: "新品",
                            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=新品1"
                        },
                        {
                            id: 2,
                            name: "高清智能家庭投影仪",
                            price: 3299.00,
                            originalPrice: 3699.00,
                            discount: 10,
                            stock: 42,
                            tag: "新品",
                            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=新品2"
                        },
                        {
                            id: 3,
                            name: "无线降噪耳机 MAX",
                            price: 1799.00,
                            originalPrice: 1999.00,
                            discount: 10,
                            stock: 128,
                            tag: "新品",
                            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=新品3"
                        },
                        {
                            id: 4,
                            name: "便携式咖啡机",
                            price: 799.00,
                            originalPrice: 899.00,
                            discount: 11,
                            stock: 53,
                            tag: "新品",
                            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=新品4"
                        },
                        {
                            id: 5,
                            name: "智能手表 Ultra",
                            price: 2599.00,
                            originalPrice: 2899.00,
                            discount: 10,
                            stock: 97,
                            tag: "新品",
                            image: "https://via.placeholder.com/200x200/f5f5f5/333333?text=新品5"
                        }
                    ]);
                    break;
                    
                case '/api/products/trending':
                    resolve([
                        {
                            id: 101,
                            name: "高性能游戏笔记本",
                            price: 9999.00,
                            originalPrice: 11999.00,
                            discount: 16,
                            sold: 2153,
                            tag: "热销",
                            image: "https://via.placeholder.com/200x200/fff8e6/333333?text=热销1"
                        },
                        {
                            id: 102,
                            name: "智能扫地机器人",
                            price: 1999.00,
                            originalPrice: 2399.00,
                            discount: 16,
                            sold: 3782,
                            tag: "热销",
                            image: "https://via.placeholder.com/200x200/fff8e6/333333?text=热销2"
                        },
                        {
                            id: 103,
                            name: "家用空气净化器",
                            price: 1599.00,
                            originalPrice: 1899.00,
                            discount: 15,
                            sold: 1872,
                            tag: "热销",
                            image: "https://via.placeholder.com/200x200/fff8e6/333333?text=热销3"
                        },
                        {
                            id: 104,
                            name: "超薄折叠手机",
                            price: 8999.00,
                            originalPrice: 9999.00,
                            discount: 10,
                            sold: 682,
                            tag: "热销",
                            image: "https://via.placeholder.com/200x200/fff8e6/333333?text=热销4"
                        },
                        {
                            id: 105,
                            name: "全自动咖啡机",
                            price: 4299.00,
                            originalPrice: 4999.00,
                            discount: 14,
                            sold: 926,
                            tag: "热销",
                            image: "https://via.placeholder.com/200x200/fff8e6/333333?text=热销5"
                        }
                    ]);
                    break;
                    
                case '/api/products/limited-offers':
                    resolve([
                        {
                            id: 201,
                            name: "智能电视 4K Pro",
                            price: 2999.00,
                            originalPrice: 4999.00,
                            discount: 40,
                            timeLeft: "23:45:12",
                            tag: "秒杀",
                            image: "https://via.placeholder.com/200x200/ffecec/333333?text=秒杀1"
                        },
                        {
                            id: 202,
                            name: "智能音箱 MAX",
                            price: 499.00,
                            originalPrice: 899.00,
                            discount: 44,
                            timeLeft: "09:23:42",
                            tag: "秒杀",
                            image: "https://via.placeholder.com/200x200/ffecec/333333?text=秒杀2"
                        },
                        {
                            id: 203,
                            name: "全身按摩椅",
                            price: 4999.00,
                            originalPrice: 7999.00,
                            discount: 37,
                            timeLeft: "16:08:31",
                            tag: "秒杀",
                            image: "https://via.placeholder.com/200x200/ffecec/333333?text=秒杀3"
                        },
                        {
                            id: 204,
                            name: "高端蓝牙耳机",
                            price: 599.00,
                            originalPrice: 999.00,
                            discount: 40,
                            timeLeft: "04:55:18",
                            tag: "秒杀",
                            image: "https://via.placeholder.com/200x200/ffecec/333333?text=秒杀4"
                        },
                        {
                            id: 205,
                            name: "专业摄影相机",
                            price: 5999.00,
                            originalPrice: 9599.00,
                            discount: 37,
                            timeLeft: "11:32:56",
                            tag: "秒杀",
                            image: "https://via.placeholder.com/200x200/ffecec/333333?text=秒杀5"
                        }
                    ]);
                    break;
                    
                case '/api/products/new-arrivals/updates':
                    resolve([
                        {
                            id: 1,
                            price: 5899.00,
                            originalPrice: 6499.00,
                            stock: 81
                        },
                        {
                            id: 3,
                            price: 1699.00,
                            originalPrice: 1999.00,
                            stock: 121
                        }
                    ]);
                    break;
                    
                case '/api/products/trending/updates':
                    resolve([
                        {
                            id: 101,
                            price: 9799.00,
                            originalPrice: 11999.00,
                            sold: 2165
                        },
                        {
                            id: 104,
                            price: 8799.00,
                            originalPrice: 9999.00,
                            sold: 689
                        }
                    ]);
                    break;
                    
                case '/api/products/limited-offers/updates':
                    resolve([
                        {
                            id: 202,
                            price: 479.00,
                            originalPrice: 899.00,
                            timeLeft: "09:12:18"
                        },
                        {
                            id: 204,
                            price: 549.00,
                            originalPrice: 999.00,
                            timeLeft: "04:43:52"
                        }
                    ]);
                    break;
                    
                default:
                    reject(new Error('未知的API端点'));
            }
        }, 1000);
    });
} 