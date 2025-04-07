/**
 * 促销通知功能实现
 * 负责处理轮播图、促销活动弹窗和通知栏
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化公告栏
    initAnnouncementBar();
    
    // 初始化轮播图
    initCarousel();
    
    // 定时弹出促销通知
    schedulePromotions();
});

/**
 * 初始化公告栏
 */
function initAnnouncementBar() {
    const bar = document.getElementById('announcement-bar');
    if (!bar) return;
    
    // 公告信息数组
    const announcements = [
        "限时秒杀：每天10点、14点、20点，低至1折！",
        "新人专享：新用户注册立即领取50元优惠券！",
        "满减活动：全场满199减50，多买多减！",
        "会员特权：PLUS会员购物享95折优惠！"
    ];
    
    // 创建公告元素
    const announcementContent = document.createElement('div');
    announcementContent.className = 'announcement-content';
    
    // 添加公告文本
    let announcementText = '';
    announcements.forEach(text => {
        announcementText += `<span class="announcement-item">${text}</span>`;
    });
    
    announcementContent.innerHTML = announcementText;
    bar.appendChild(announcementContent);
    
    // 设置自动滚动效果
    setInterval(() => {
        // 如果滚动到了最后一个公告，重新开始
        if (bar.scrollLeft >= (bar.scrollWidth - bar.clientWidth)) {
            bar.scrollLeft = 0;
        } else {
            // 平滑滚动
            bar.scrollLeft += 1;
        }
    }, 30);
}

/**
 * 初始化轮播图
 */
function initCarousel() {
    const carousel = document.getElementById('promotion-carousel');
    if (!carousel) return;
    
    // 清空占位内容
    carousel.innerHTML = '';
    
    // 轮播图数据
    const slides = [
        {
            id: 1,
            image: "https://via.placeholder.com/1200x340/e1251b/FFFFFF?text=双十一全球狂欢节",
            title: "双十一全球狂欢节",
            link: "#"
        },
        {
            id: 2,
            image: "https://via.placeholder.com/1200x340/ff6b00/FFFFFF?text=新品首发5折起",
            title: "新品首发5折起",
            link: "#"
        },
        {
            id: 3,
            image: "https://via.placeholder.com/1200x340/4a90e2/FFFFFF?text=家电超级品类日",
            title: "家电超级品类日",
            link: "#"
        },
        {
            id: 4,
            image: "https://via.placeholder.com/1200x340/50c878/FFFFFF?text=进口好物折扣季",
            title: "进口好物折扣季",
            link: "#"
        }
    ];
    
    // 创建轮播图HTML结构
    let slidesHtml = '';
    let indicatorsHtml = '';
    
    slides.forEach((slide, index) => {
        // 轮播项
        slidesHtml += `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-id="${slide.id}">
                <a href="${slide.link}">
                    <img src="${slide.image}" alt="${slide.title}">
                </a>
            </div>
        `;
        
        // 指示器
        indicatorsHtml += `
            <div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
        `;
    });
    
    // 创建轮播图容器
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    carouselContainer.innerHTML = `
        <div class="carousel-slides">
            ${slidesHtml}
        </div>
        <div class="carousel-indicators">
            ${indicatorsHtml}
        </div>
        <div class="carousel-controls">
            <div class="carousel-control prev">&lt;</div>
            <div class="carousel-control next">&gt;</div>
        </div>
    `;
    
    carousel.appendChild(carouselContainer);
    
    // 设置自动轮播
    let currentSlide = 0;
    const slideCount = slides.length;
    const slideElements = carousel.querySelectorAll('.carousel-slide');
    const indicatorElements = carousel.querySelectorAll('.carousel-indicator');
    
    // 添加指示器点击事件
    indicatorElements.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
        });
    });
    
    // 添加控制按钮事件
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');
    
    prevButton.addEventListener('click', () => {
        showSlide((currentSlide - 1 + slideCount) % slideCount);
    });
    
    nextButton.addEventListener('click', () => {
        showSlide((currentSlide + 1) % slideCount);
    });
    
    // 切换到指定轮播图
    function showSlide(index) {
        // 移除当前激活的轮播图和指示器
        slideElements[currentSlide].classList.remove('active');
        indicatorElements[currentSlide].classList.remove('active');
        
        // 激活新的轮播图和指示器
        currentSlide = index;
        slideElements[currentSlide].classList.add('active');
        indicatorElements[currentSlide].classList.add('active');
    }
    
    // 自动轮播
    setInterval(() => {
        showSlide((currentSlide + 1) % slideCount);
    }, 5000);
}

/**
 * 定时弹出促销通知
 */
function schedulePromotions() {
    // 促销数据
    const promotions = [
        {
            id: 1,
            title: "限时抢购",
            content: "智能手表超值优惠，限时抢购价￥299！",
            image: "https://via.placeholder.com/80x80/f5f5f5/333333?text=智能手表",
            link: "#"
        },
        {
            id: 2,
            title: "新品首发",
            content: "全新无线耳机上市，预购享8折优惠！",
            image: "https://via.placeholder.com/80x80/f5f5f5/333333?text=无线耳机",
            link: "#"
        },
        {
            id: 3,
            title: "会员福利",
            content: "会员专属：指定商品满300减50！",
            image: "https://via.placeholder.com/80x80/f5f5f5/333333?text=会员福利",
            link: "#"
        }
    ];
    
    // 随机选择一个促销信息
    const randomPromotion = () => {
        const randomIndex = Math.floor(Math.random() * promotions.length);
        return promotions[randomIndex];
    };
    
    // 创建促销通知
    function createPromotionNotification(promotion) {
        // 检查是否已存在通知容器
        let container = document.querySelector('.promotion-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'promotion-notification-container';
            document.body.appendChild(container);
        }
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'promotion-notification';
        notification.innerHTML = `
            <div class="promotion-header">
                <div class="promotion-title">${promotion.title}</div>
                <div class="promotion-close">&times;</div>
            </div>
            <div class="promotion-content">
                <div class="promotion-image">
                    <img src="${promotion.image}" alt="${promotion.title}">
                </div>
                <div class="promotion-text">${promotion.content}</div>
            </div>
            <div class="promotion-actions">
                <a href="${promotion.link}" class="promotion-btn">立即查看</a>
            </div>
        `;
        
        // 添加关闭按钮事件
        const closeButton = notification.querySelector('.promotion-close');
        closeButton.addEventListener('click', () => {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // 添加到容器并显示
        container.appendChild(notification);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('closing');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 8000);
    }
    
    // 页面加载10秒后显示第一个促销
    setTimeout(() => {
        createPromotionNotification(randomPromotion());
    }, 10000);
    
    // 每隔30-60秒随机显示一个促销
    setInterval(() => {
        createPromotionNotification(randomPromotion());
    }, Math.random() * 30000 + 30000);
} 