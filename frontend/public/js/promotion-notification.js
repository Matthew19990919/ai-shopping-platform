/**
 * 促销通知功能实现
 * 负责处理公告栏滚动、轮播图和促销弹窗
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，初始化促销功能');
    
    // 初始化公告栏滚动
    initAnnouncementBar();
    
    // 初始化轮播图
    initCarousel();
    
    // 初始化促销弹窗
    initPromotionPopup();
    
    // 通过控制台提供手动触发方法
    window.showCouponPopup = function() {
        console.log('手动触发优惠券弹窗');
        sessionStorage.removeItem('popupClosed');
        initPromotionPopup();
    };
    
    console.log('所有促销功能已初始化完成');
});

/**
 * 初始化公告栏滚动
 */
function initAnnouncementBar() {
    const announcementBar = document.querySelector('.announcement-bar');
    if (!announcementBar) return;
    
    const announcementItems = announcementBar.querySelectorAll('.announcement-item');
    if (announcementItems.length <= 1) return;
    
    let currentIndex = 0;
    
    // 设置第一个公告为可见
    announcementItems[0].classList.add('active');
    
    // 设置自动滚动
    setInterval(() => {
        // 隐藏当前公告
        announcementItems[currentIndex].classList.remove('active');
    
        // 移动到下一个公告
        currentIndex = (currentIndex + 1) % announcementItems.length;
        
        // 显示新的公告
        announcementItems[currentIndex].classList.add('active');
    }, 5000); // 每5秒切换一次
}

/**
 * 初始化轮播图
 */
function initCarousel() {
    const carousel = document.querySelector('.promotion-carousel');
    if (!carousel) return;
    
    const slideContainer = carousel.querySelector('.carousel-slides');
    if (!slideContainer) return;
    
    const slides = slideContainer.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');
    
    let currentIndex = 0;
    let slideInterval;
    let isTransitioning = false;
    
    // 创建指示器
    if (indicatorsContainer) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                if (isTransitioning || currentIndex === index) return;
                goToSlide(index);
  });
  
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // 设置按钮事件
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide((currentIndex + 1) % slides.length);
        });
    }
    
    // 跳转到指定幻灯片
    function goToSlide(index) {
        if (index === currentIndex) return;
        isTransitioning = true;
        
        // 更新指示器
        if (indicatorsContainer) {
            const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
            indicators[currentIndex].classList.remove('active');
            indicators[index].classList.add('active');
}

        // 计算滑动距离
        const slideWidth = slides[0].offsetWidth;
        const offset = (index - currentIndex) * slideWidth;
        
        // 动画过渡
        slideContainer.style.transition = 'transform 0.5s ease-in-out';
        slideContainer.style.transform = `translateX(${-index * 100}%)`;
    
        // 更新当前索引
        currentIndex = index;
    
        // 动画结束后重置状态
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
}

    // 自动轮播
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            if (!isTransitioning) {
                goToSlide((currentIndex + 1) % slides.length);
  }
        }, 5000); // 每5秒切换一次
    }
    
    // 鼠标悬停时暂停轮播
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // 开始自动轮播
    startAutoSlide();
    
    // 加载轮播图数据
    loadCarouselData();
}

/**
 * 加载轮播图数据
 */
function loadCarouselData() {
    const slideContainer = document.querySelector('.carousel-slides');
    if (!slideContainer) return;
    
    // 使用模拟数据
    const carouselData = [
        {
          id: 1,
            title: "新年大促销",
            subtitle: "全场商品低至5折起",
            buttonText: "立即抢购",
            image: "https://via.placeholder.com/1200x340/ff6b6b/ffffff?text=新年大促销",
            color: "#ff6b6b",
            link: "/promotions/new-year"
        },
        {
          id: 2,
            title: "会员特权日",
            subtitle: "会员专享95折，Plus会员再享额外9折",
            buttonText: "会员中心",
            image: "https://via.placeholder.com/1200x340/5f27cd/ffffff?text=会员特权日",
            color: "#5f27cd",
            link: "/member/privileges"
        },
        {
          id: 3,
            title: "新品首发",
            subtitle: "最新智能手机，预约享优惠",
            buttonText: "了解更多",
            image: "https://via.placeholder.com/1200x340/54a0ff/ffffff?text=新品首发",
            color: "#54a0ff",
            link: "/new-arrivals"
        }
    ];
    
    // 更新轮播图
    slideContainer.innerHTML = '';
    
    carouselData.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'carousel-slide';
        slideElement.style.backgroundColor = slide.color;
        
        slideElement.innerHTML = `
            <div class="carousel-content">
                <h2>${slide.title}</h2>
                <p>${slide.subtitle}</p>
                <a href="${slide.link}" class="carousel-button">${slide.buttonText}</a>
            </div>
            <div class="carousel-image">
                <img src="${slide.image}" alt="${slide.title}">
            </div>
        `;
        
        slideContainer.appendChild(slideElement);
  });
    
    // 更新指示器
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        
        carouselData.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                const slides = document.querySelectorAll('.carousel-slide');
                const currentSlide = document.querySelector('.carousel-slide.active');
                const currentIndex = Array.from(slides).indexOf(currentSlide);
                
                if (currentIndex === index) return;
                
                // 手动切换幻灯片
                slideContainer.style.transform = `translateX(-${index * 100}%)`;
                
                // 更新指示器
                const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
                indicators[currentIndex].classList.remove('active');
                indicators[index].classList.add('active');
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
}

/**
 * 初始化促销弹窗
 */
function initPromotionPopup() {
    // 清除之前的会话存储记录，确保弹窗能够显示
    sessionStorage.removeItem('popupClosed');
    
    // 延迟显示弹窗，给用户一些浏览时间
    setTimeout(() => {
        // 检查是否已经关闭过
        const popupClosed = sessionStorage.getItem('popupClosed');
        if (popupClosed) return;
        
        // 创建弹窗
        showPromotionPopup({
            title: "限时优惠券",
            content: "新人专享，注册即可获得100元优惠券",
            image: "/images/promotions/limited-time-coupon.png",
            primaryAction: {
                text: "立即领取",
                link: "/coupon/new-user"
            },
            secondaryAction: {
                text: "稍后再说",
                link: "#"
            }
        });
    }, 3000); // 减少为3秒，便于测试查看
}

/**
 * 显示促销弹窗
 */
function showPromotionPopup(data) {
    // 控制台日志，确认函数被调用
    console.log('显示优惠券弹窗', data);
    
    // 创建弹窗元素
    const popupContainer = document.createElement('div');
    popupContainer.className = 'promotion-notification-container';
    popupContainer.id = 'coupon-popup-container';
    
    popupContainer.innerHTML = `
        <div class="promotion-notification">
            <div class="promotion-notification-header">
                <h3>${data.title}</h3>
                <button class="promotion-notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="promotion-notification-content">
                ${data.image ? `
                    <div class="promotion-notification-image">
                        <img src="${data.image}" alt="${data.title}" onload="console.log('优惠券图片加载成功')" onerror="console.log('优惠券图片加载失败', this.src)">
                    </div>
                ` : ''}
                <div class="promotion-notification-text">
                    ${data.content}
                </div>
            </div>
            <div class="promotion-notification-actions">
                ${data.primaryAction ? `
                    <a href="${data.primaryAction.link}" class="promotion-action-primary">
                        ${data.primaryAction.text}
                    </a>
                ` : ''}
                ${data.secondaryAction ? `
                    <a href="${data.secondaryAction.link}" class="promotion-action-secondary">
                        ${data.secondaryAction.text}
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // 检查是否已存在相同弹窗，避免重复显示
    if (document.getElementById('coupon-popup-container')) {
        console.log('已存在一个优惠券弹窗，不重复显示');
        return;
    }
    
    // 添加到文档
    document.body.appendChild(popupContainer);
    console.log('优惠券弹窗已添加到DOM');
    
    // 添加动画类
    setTimeout(() => {
        popupContainer.classList.add('show');
        console.log('优惠券弹窗显示动画已触发');
    }, 100);
    
    // 添加关闭事件
    const closeButton = popupContainer.querySelector('.promotion-notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closePromotionPopup(popupContainer);
        });
    }

    // 添加次要操作关闭事件
    const secondaryAction = popupContainer.querySelector('.promotion-action-secondary');
    if (secondaryAction) {
        secondaryAction.addEventListener('click', (e) => {
            e.preventDefault();
            closePromotionPopup(popupContainer);
        });
    }
}

/**
 * 关闭促销弹窗
 */
function closePromotionPopup(popupContainer) {
    // 添加关闭中的类名，用于动画
    popupContainer.classList.add('closing');
    
    // 移除显示类
    popupContainer.classList.remove('show');
    
    // 设置会话存储，记录已关闭
    sessionStorage.setItem('popupClosed', 'true');
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (popupContainer && popupContainer.parentElement) {
            popupContainer.parentElement.removeChild(popupContainer);
        }
    }, 300);
    
    // 添加控制台日志，方便调试
    console.log('优惠券弹窗已关闭');
}

// 立即调用函数，确保脚本加载完成后能够直接触发弹窗
// 使用setTimeout是为了确保DOM已完全加载
setTimeout(function() {
    // 如果DOM已经加载完成，则手动触发弹窗显示
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('脚本加载完成，手动触发弹窗');
        
        // 清除缓存并显示弹窗
        sessionStorage.removeItem('popupClosed');
        
        // 创建并显示弹窗
        showPromotionPopup({
            title: "限时优惠券",
            content: "新人专享，注册即可获得100元优惠券",
            image: "/images/promotions/limited-time-coupon.png",
            primaryAction: {
                text: "立即领取",
                link: "/coupon/new-user"
            },
            secondaryAction: {
                text: "稍后再说",
                link: "#"
            }
        });
    }
}, 2000); 