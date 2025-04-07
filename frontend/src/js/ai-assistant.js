/**
 * AI助手功能实现
 * 负责处理AI导购助手的展示、交互和产品推荐功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AI助手
    initAIAssistant();
});

/**
 * 初始化AI助手
 */
function initAIAssistant() {
    const container = document.getElementById('ai-assistant-container');
    if (!container) return;

    // 创建AI助手图标和聊天窗口
    createAIAssistantUI(container);
    
    // 添加点击事件
    const aiIcon = container.querySelector('.ai-assistant-icon');
    const chatWindow = container.querySelector('.ai-chat-window');
    
    aiIcon.addEventListener('click', function() {
        // 切换聊天窗口显示/隐藏
        if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
            chatWindow.style.display = 'flex';
            // 显示欢迎消息
            setTimeout(() => {
                addBotMessage("您好！我是AI智能导购助手，有什么可以帮您的吗？");
                addBotMessage("您可以向我咨询产品信息、比较不同商品，或者让我为您推荐适合的商品。");
                
                // 添加快速选项按钮
                addQuickOptions();
            }, 500);
        } else {
            chatWindow.style.display = 'none';
        }
    });
}

/**
 * 创建AI助手UI界面
 */
function createAIAssistantUI(container) {
    // 创建HTML结构
    container.innerHTML = `
        <div class="ai-assistant-icon">
            <img src="https://via.placeholder.com/40x40/FFFFFF/e1251b?text=AI" alt="AI助手" />
        </div>
        <div class="ai-chat-window" style="display: none;">
            <div class="ai-chat-header">
                <div class="ai-chat-title">智能导购助手</div>
                <div class="ai-chat-close">&times;</div>
            </div>
            <div class="ai-chat-messages"></div>
            <div class="ai-chat-input-container">
                <input type="text" class="ai-chat-input" placeholder="请输入您的问题...">
                <button class="ai-chat-send">发送</button>
            </div>
        </div>
    `;

    // 添加关闭按钮事件
    const closeBtn = container.querySelector('.ai-chat-close');
    closeBtn.addEventListener('click', function() {
        container.querySelector('.ai-chat-window').style.display = 'none';
    });

    // 添加发送按钮事件
    const sendBtn = container.querySelector('.ai-chat-send');
    const inputField = container.querySelector('.ai-chat-input');
    
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });

    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = inputField.value.trim();
        if (message) {
            addUserMessage(message);
            inputField.value = '';
            
            // 处理用户消息并生成回复
            handleUserMessage(message);
        }
    }
}

/**
 * 添加机器人消息
 */
function addBotMessage(message) {
    const messagesContainer = document.querySelector('.ai-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message bot-message';
    
    // 创建头像和消息内容
    messageElement.innerHTML = `
        <div class="ai-avatar">
            <img src="https://via.placeholder.com/30x30/e1251b/FFFFFF?text=AI" alt="AI">
        </div>
        <div class="ai-message-content">${message}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * 添加用户消息
 */
function addUserMessage(message) {
    const messagesContainer = document.querySelector('.ai-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message user-message';
    
    // 创建头像和消息内容
    messageElement.innerHTML = `
        <div class="ai-message-content">${message}</div>
        <div class="ai-avatar">
            <img src="https://via.placeholder.com/30x30/f5f5f5/333333?text=用户" alt="用户">
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * 添加快速选项按钮
 */
function addQuickOptions() {
    const messagesContainer = document.querySelector('.ai-chat-messages');
    const optionsElement = document.createElement('div');
    optionsElement.className = 'ai-quick-options';
    
    // 创建快速选项按钮
    optionsElement.innerHTML = `
        <button class="ai-quick-option" data-option="推荐商品">为我推荐商品</button>
        <button class="ai-quick-option" data-option="优惠活动">查询优惠活动</button>
        <button class="ai-quick-option" data-option="热门榜单">查看热门榜单</button>
    `;
    
    messagesContainer.appendChild(optionsElement);
    
    // 添加点击事件
    const optionButtons = optionsElement.querySelectorAll('.ai-quick-option');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.getAttribute('data-option');
            addUserMessage(option);
            handleUserMessage(option);
        });
    });
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * 处理用户消息
 */
function handleUserMessage(message) {
    // 模拟处理延迟
    setTimeout(() => {
        if (message.includes('推荐') || message.includes('介绍')) {
            recommendProducts();
        } else if (message.includes('优惠') || message.includes('活动') || message.includes('促销')) {
            showPromotions();
        } else if (message.includes('热门') || message.includes('排行') || message.includes('榜单')) {
            showPopularProducts();
        } else {
            // 通用回复
            addBotMessage("感谢您的咨询。目前我可以为您提供商品推荐、优惠活动查询和热门榜单查看服务。请问您需要什么帮助？");
            addQuickOptions();
        }
    }, 800);
}

/**
 * 推荐商品
 */
function recommendProducts() {
    addBotMessage("根据您的浏览记录和喜好，我为您推荐以下商品：");
    
    // 创建推荐商品列表
    const productsHtml = `
        <div class="ai-product-recommendations">
            <div class="ai-product-card">
                <img src="https://via.placeholder.com/80x80/f5f5f5/333333?text=商品1" alt="推荐商品1">
                <div class="ai-product-info">
                    <div class="ai-product-name">智能蓝牙耳机</div>
                    <div class="ai-product-price">¥129.00</div>
                </div>
            </div>
            <div class="ai-product-card">
                <img src="https://via.placeholder.com/80x80/f5f5f5/333333?text=商品2" alt="推荐商品2">
                <div class="ai-product-info">
                    <div class="ai-product-name">便携式充电宝</div>
                    <div class="ai-product-price">¥89.00</div>
                </div>
            </div>
            <div class="ai-product-card">
                <img src="https://via.placeholder.com/80x80/f5f5f5/333333?text=商品3" alt="推荐商品3">
                <div class="ai-product-info">
                    <div class="ai-product-name">智能手表</div>
                    <div class="ai-product-price">¥299.00</div>
                </div>
            </div>
        </div>
    `;
    
    addBotMessage(productsHtml);
    addBotMessage("这些是根据您的偏好推荐的热门商品。您对哪个商品感兴趣，想了解更多信息吗？");
}

/**
 * 显示优惠活动
 */
function showPromotions() {
    addBotMessage("目前商城正在进行以下促销活动：");
    
    // 创建优惠活动列表
    const promotionsHtml = `
        <div class="ai-promotions">
            <div class="ai-promotion-card">
                <div class="ai-promotion-title">限时秒杀</div>
                <div class="ai-promotion-desc">每天10点、14点、20点准时开抢，低至1折！</div>
            </div>
            <div class="ai-promotion-card">
                <div class="ai-promotion-title">满199减50</div>
                <div class="ai-promotion-desc">全场商品满199元立减50元，多买多减！</div>
            </div>
            <div class="ai-promotion-card">
                <div class="ai-promotion-title">新人专享</div>
                <div class="ai-promotion-desc">新用户注册即送50元优惠券，无门槛使用！</div>
            </div>
        </div>
    `;
    
    addBotMessage(promotionsHtml);
    addBotMessage("您对哪个活动感兴趣？我可以为您提供更详细的信息。");
}

/**
 * 显示热门商品
 */
function showPopularProducts() {
    addBotMessage("以下是当前最热门的商品榜单：");
    
    // 创建热门商品列表
    const popularHtml = `
        <div class="ai-popular-products">
            <div class="ai-popular-card">
                <div class="ai-popular-rank">1</div>
                <img src="https://via.placeholder.com/60x60/f5f5f5/333333?text=热销1" alt="热门商品1">
                <div class="ai-popular-info">
                    <div class="ai-popular-name">智能手机 Pro Max</div>
                    <div class="ai-popular-price">¥4999.00</div>
                </div>
            </div>
            <div class="ai-popular-card">
                <div class="ai-popular-rank">2</div>
                <img src="https://via.placeholder.com/60x60/f5f5f5/333333?text=热销2" alt="热门商品2">
                <div class="ai-popular-info">
                    <div class="ai-popular-name">无线蓝牙耳机</div>
                    <div class="ai-popular-price">¥799.00</div>
                </div>
            </div>
            <div class="ai-popular-card">
                <div class="ai-popular-rank">3</div>
                <img src="https://via.placeholder.com/60x60/f5f5f5/333333?text=热销3" alt="热门商品3">
                <div class="ai-popular-info">
                    <div class="ai-popular-name">智能家居套装</div>
                    <div class="ai-popular-price">¥1299.00</div>
                </div>
            </div>
        </div>
    `;
    
    addBotMessage(popularHtml);
    addBotMessage("这是当前最热销的三款商品。您想了解哪款商品的详细信息？");
} 