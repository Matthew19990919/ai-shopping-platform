/**
 * AI导购助手功能
 * 实现了与用户对话交互和智能产品推荐
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化AI助手
    initAIAssistant();
});

/**
 * 初始化AI助手
 */
function initAIAssistant() {
    // 获取AI助手DOM元素
    const assistantElement = document.querySelector('.ai-assistant');
    if (!assistantElement) return;
  
    // 获取聊天界面、输入框和按钮
    const aiChatBox = assistantElement.querySelector('.ai-chat-box');
    const chatMessages = assistantElement.querySelector('.ai-chat-messages');
    const messageInput = assistantElement.querySelector('.ai-message-input');
    const sendButton = assistantElement.querySelector('.ai-send-button');
    const toggleButton = assistantElement.querySelector('.ai-toggle-button');
    
    // 初始状态（默认收起）
    let isExpanded = false;
    
    // 绑定切换按钮事件
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                assistantElement.classList.add('expanded');
  // 显示欢迎消息
  setTimeout(() => {
                    addBotMessage('您好！我是您的AI购物助手。有什么可以帮您的吗？您可以询问商品推荐、比较不同商品，或者寻求购物建议。');
                    addQuickReplies([
                        '热门商品推荐',
                        '今日优惠活动',
                        '如何选择手机'
                    ]);
                }, 300);
            } else {
                assistantElement.classList.remove('expanded');
            }
        });
    }
    
    // 绑定发送按钮事件
    if (sendButton && messageInput) {
  sendButton.addEventListener('click', () => {
            sendMessage();
  });
  
        // 绑定输入框回车事件
        messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
                sendMessage();
      e.preventDefault();
    }
  });
    }
    
    // 绑定快速回复事件
    chatMessages.addEventListener('click', (e) => {
        const quickReply = e.target.closest('.quick-reply-item');
        if (quickReply) {
            const replyText = quickReply.textContent;
            sendMessage(replyText);
  }
    });

    /**
     * 发送消息
     */
    function sendMessage(text) {
        const message = text || messageInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addUserMessage(message);
  
        // 清空输入框
        if (!text) {
            messageInput.value = '';
        }
        
        // 显示思考中状态
        const thinkingMsg = addBotMessage('思考中...', true);
  
        // 处理用户输入并获取回复
  setTimeout(() => {
            // 移除思考中消息
            if (thinkingMsg && thinkingMsg.parentNode) {
                thinkingMsg.parentNode.removeChild(thinkingMsg);
    }
    
            // 获取AI回复
            const response = getAIResponse(message);
            
            // 添加AI回复
            addBotMessage(response.text);
            
            // 如果有产品推荐
            if (response.products && response.products.length > 0) {
                addProductRecommendations(response.products);
            }
            
            // 如果有后续提示
            if (response.quickReplies && response.quickReplies.length > 0) {
                addQuickReplies(response.quickReplies);
            }
            
            // 滚动到底部
            scrollToBottom();
  }, 1000);
}

    /**
     * 添加用户消息
     */
    function addUserMessage(text) {
        const message = document.createElement('div');
        message.className = 'ai-chat-message user-message';
        message.innerHTML = `
            <div class="message-content">${text}</div>
        `;
  
        chatMessages.appendChild(message);
        scrollToBottom();
}

    /**
     * 添加机器人消息
     */
    function addBotMessage(text, isThinking = false) {
        const message = document.createElement('div');
        message.className = 'ai-chat-message bot-message';
        
        if (isThinking) {
            message.classList.add('thinking');
            message.innerHTML = `
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
    <div class="message-content">
                    <div class="thinking-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
        } else {
            message.innerHTML = `
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">${text}</div>
            `;
        }
        
        chatMessages.appendChild(message);
        scrollToBottom();
        
        return message;
}

    /**
     * 添加快速回复选项
     */
    function addQuickReplies(replies) {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';
        
        replies.forEach(reply => {
            const replyButton = document.createElement('button');
            replyButton.className = 'quick-reply-item';
            replyButton.textContent = reply;
            quickRepliesContainer.appendChild(replyButton);
        });
        
        chatMessages.appendChild(quickRepliesContainer);
        scrollToBottom();
}

    /**
     * 添加产品推荐
     */
    function addProductRecommendations(products) {
        const recommendationsContainer = document.createElement('div');
        recommendationsContainer.className = 'ai-product-recommendations';
        
        // 创建横向滚动容器
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'recommendations-scroll';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'ai-product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">¥${product.price.toFixed(2)}</div>
                    ${product.rating ? `
                        <div class="product-rating">
                            ${getStarRating(product.rating)}
                            <span>${product.rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </div>
                <a href="/product/${product.id}" class="view-product-button">查看详情</a>
            `;
            
            scrollContainer.appendChild(productCard);
        });
        
        recommendationsContainer.appendChild(scrollContainer);
        chatMessages.appendChild(recommendationsContainer);
        scrollToBottom();
}

    /**
     * 获取星级评分HTML
     */
    function getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
  
        // 添加满星
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // 添加半星
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // 添加空星
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    /**
     * 滚动到底部
     */
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * 获取AI响应（模拟）
     */
    function getAIResponse(userMessage) {
        // 将用户消息转为小写，用于匹配
        const message = userMessage.toLowerCase();
        
        // 产品推荐回复模板
        if (message.includes('推荐') || message.includes('什么好') || message.includes('热门')) {
            // 根据不同的查询返回不同的推荐
            if (message.includes('手机') || message.includes('智能手机')) {
                return {
                    text: '根据最近的销售数据和用户评价，以下几款手机非常受欢迎。它们各有特点，适合不同的需求和预算：',
                    products: [
    {
                            id: 1001,
                            name: '旗舰智能手机 Pro Max',
                            price: 6999.00,
                            rating: 4.8,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=旗舰手机'
                        },
                        {
                            id: 1002,
                            name: '轻薄5G智能手机',
                            price: 3499.00,
                            rating: 4.6,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=轻薄手机'
    },
    {
                            id: 1003,
                            name: '入门级智能手机',
      price: 1299.00,
                            rating: 4.3,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=入门手机'
                        }
                    ],
                    quickReplies: ['哪款拍照最好？', '电池续航怎么样？', '各有什么优缺点？']
                };
            } else if (message.includes('笔记本') || message.includes('电脑')) {
                return {
                    text: '以下是目前最受欢迎的笔记本电脑，覆盖了不同的使用场景和预算：',
                    products: [
    {
                            id: 2001,
                            name: '轻薄商务笔记本',
                            price: 5699.00,
                            rating: 4.7,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=轻薄本'
                        },
                        {
                            id: 2002,
                            name: '游戏笔记本电脑',
                            price: 8999.00,
                            rating: 4.9,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=游戏本'
                        },
                        {
                            id: 2003,
                            name: '入门级学生本',
                            price: 3799.00,
                            rating: 4.5,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=学生本'
                        }
                    ],
                    quickReplies: ['办公用哪款好？', '玩游戏推荐哪款？', '性价比最高的是？']
                };
            } else if (message.includes('耳机') || message.includes('耳麦')) {
                return {
                    text: '以下是当前最受好评的几款耳机，有不同类型和价位可供选择：',
                    products: [
        {
                            id: 3001,
                            name: '无线降噪耳机',
                            price: 1999.00,
                            rating: 4.7,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=降噪耳机'
        },
        {
                            id: 3002,
                            name: '运动蓝牙耳机',
                            price: 399.00,
                            rating: 4.5,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=运动耳机'
        },
        {
                            id: 3003,
                            name: '游戏电竞耳机',
                            price: 899.00,
                            rating: 4.8,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=游戏耳机'
        }
                    ],
                    quickReplies: ['降噪效果哪款好？', '运动用哪款合适？', '音质最好的是？']
                };
            } else {
                // 通用热门商品推荐
                return {
                    text: '以下是近期最受欢迎的热门商品，涵盖了不同类别：',
                    products: [
        {
                            id: 5001,
                            name: '智能手表 Pro',
                            price: 1999.00,
                            rating: 4.6,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=智能手表'
        },
        {
                            id: 5002,
                            name: '无线蓝牙音箱',
                            price: 699.00,
                            rating: 4.7,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=蓝牙音箱'
        },
        {
                            id: 5003,
                            name: '智能家居套装',
                            price: 1299.00,
                            rating: 4.4,
                            image: 'https://via.placeholder.com/120x120/f5f5f5/333333?text=智能家居'
        }
                    ],
                    quickReplies: ['有什么新品？', '现在有什么优惠？', '帮我推荐电子产品']
                };
            }
        }
        
        // 优惠活动查询
        else if (message.includes('优惠') || message.includes('活动') || message.includes('折扣') || message.includes('促销')) {
            return {
                text: '目前商城有以下几个活动正在进行中：\n1. 新人首单立减50元（无门槛）\n2. 满299减30，满499减60\n3. 数码产品满3000减300\n4. 会员日（每月18日）全场9折',
                quickReplies: ['如何成为会员？', '有什么商品推荐？', '怎么使用优惠券？']
            };
}

        // 商品比较
        else if (message.includes('对比') || message.includes('比较') || 
                (message.includes('还是') && (message.includes('哪个') || message.includes('哪款')))) {
            // 手机比较
            if (message.includes('手机')) {
                return {
                    text: '不同品牌和型号的手机各有优势：\n\n旗舰手机：拍照、性能最强，但价格较高\n中端机型：性价比高，日常使用流畅\n入门机型：价格实惠，基本功能完善\n\n具体选择要根据您的预算和使用需求来定。您更关注哪方面的性能呢？',
                    quickReplies: ['拍照效果', '电池续航', '游戏性能', '预算3000以内']
                };
            }
            // 电脑比较
            else if (message.includes('电脑') || message.includes('笔记本')) {
                return {
                    text: '笔记本电脑的选择主要取决于您的使用场景：\n\n商务本：轻薄便携，电池续航好\n游戏本：高性能，散热好，但较重\n创作本：屏幕色彩准确，性能均衡\n\n您主要用电脑做什么呢？这样我可以给您更精准的建议。',
                    quickReplies: ['办公使用', '玩游戏', '设计创作', '看视频影音']
                };
            }
            // 默认比较回复
            else {
                return {
                    text: '比较不同产品时，建议从以下几个方面考虑：\n1. 您的实际需求和使用场景\n2. 产品性能与您需求的匹配度\n3. 产品质量和品牌口碑\n4. 性价比\n\n您想了解哪类产品的具体比较呢？',
                    quickReplies: ['手机对比', '电脑对比', '家电对比']
                };
            }
        }
        
        // 选购指南
        else if (message.includes('怎么选') || message.includes('如何选择') || message.includes('购买建议')) {
            // 手机选购
            if (message.includes('手机')) {
                return {
                    text: '选择手机时，可以考虑以下几个方面：\n\n1. 处理器性能：决定运行速度和流畅度\n2. 内存和存储：影响多任务处理和存储空间\n3. 屏幕：尺寸、分辨率和屏幕技术\n4. 相机系统：拍照和视频录制质量\n5. 电池容量：续航时间\n6. 操作系统：iOS或Android的个人偏好\n\n您对哪方面更关注呢？',
                    quickReplies: ['拍照最好的手机', '续航最长的手机', '性价比最高的旗舰']
                };
            }
            // 笔记本选购
            else if (message.includes('电脑') || message.includes('笔记本')) {
                return {
                    text: '选购笔记本电脑可从这些方面考虑：\n\n1. 处理器：Intel或AMD，代数和型号\n2. 显卡：核显或独显，游戏需求选独显\n3. 内存：建议至少8GB，高性能需求16GB以上\n4. 存储：SSD更快，容量根据需求选择\n5. 屏幕：尺寸、分辨率、刷新率\n6. 电池：长续航还是性能优先\n\n您平时主要用电脑做什么呢？',
                    quickReplies: ['日常办公推荐', '游戏本推荐', '轻薄本推荐']
                };
            }
            // 默认选购建议
            else {
                return {
                    text: '选购电子产品时，建议考虑以下几点：\n\n1. 明确自己的需求和使用场景\n2. 设定合理的预算范围\n3. 查看专业评测和用户评价\n4. 比较不同品牌和型号的优缺点\n5. 考虑售后服务和保修政策\n\n您想了解哪类产品的选购建议呢？',
                    quickReplies: ['手机选购建议', '电脑选购建议', '智能家居推荐']
                };
            }
        }
        
        // 问候和闲聊
        else if (message.includes('你好') || message.includes('嗨') || message.includes('哈喽') || message.includes('您好')) {
            return {
                text: '您好！我是您的AI购物助手，很高兴为您服务。我可以帮您推荐商品、提供购物建议、比较不同产品，或者回答您关于商品的问题。请问有什么可以帮到您的吗？',
                quickReplies: ['热门商品推荐', '今日优惠活动', '如何选择手机']
            };
        }
        
        // 功能询问
        else if (message.includes('你能做什么') || message.includes('你能帮我') || message.includes('功能')) {
            return {
                text: '作为您的AI购物助手，我可以：\n\n1. 根据您的需求推荐合适的商品\n2. 提供不同商品的对比和选择建议\n3. 解答关于商品规格和功能的疑问\n4. 告知当前的促销活动和优惠信息\n5. 帮助解决购物过程中的问题\n\n有什么我可以帮您的吗？',
                quickReplies: ['推荐热门商品', '最新优惠活动', '如何挑选商品']
            };
        }
        
        // 默认回复
        else {
            return {
                text: '非常感谢您的咨询。我理解您想了解更多信息，为了给您提供更准确的帮助，您可以告诉我您对哪类商品感兴趣，或者您有什么具体的购物需求吗？',
                quickReplies: ['商品推荐', '今日优惠', '购物指南', '热门比较']
            };
        }
  }
} 