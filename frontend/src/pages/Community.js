import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faComment, 
  faEye, 
  faBookmark, 
  faTags, 
  faFire, 
  faChartLine, 
  faPlus, 
  faFilter,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import '../styles/community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSortMethod, setActiveSortMethod] = useState('latest');
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  // 获取帖子数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 调用
    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          title: '有哪些高性价比的智能手机推荐?',
          content: '最近想换手机，预算在3000元左右，希望大家能推荐一些高性价比的智能手机...',
          author: {
            id: 101,
            name: '科技达人',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'discussion',
          tags: ['手机', '数码', '购物分享'],
          createdAt: '2023-12-15T09:30:00',
          likes: 156,
          comments: 42,
          views: 1245,
          isHot: true
        },
        {
          id: 2,
          title: '冬季穿搭指南：保暖又时尚的必备单品',
          content: '冬天来了，如何穿得暖和又不失时尚？这里分享几款我最近购买的单品...',
          author: {
            id: 102,
            name: '时尚博主',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'sharing',
          tags: ['服饰', '穿搭', '冬季'],
          createdAt: '2023-12-14T15:45:00',
          likes: 98,
          comments: 27,
          views: 876,
          isHot: false
        },
        {
          id: 3,
          title: '开箱评测：全新AI智能音箱体验',
          content: '这款新上市的AI智能音箱有许多创新功能，我使用了一周后来分享我的使用体验...',
          author: {
            id: 103,
            name: '测评达人',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'review',
          tags: ['智能设备', '开箱', '评测'],
          createdAt: '2023-12-13T11:20:00',
          likes: 203,
          comments: 56,
          views: 1678,
          isHot: true
        },
        {
          id: 4,
          title: '有人用过这款洗面奶吗？求真实评价',
          content: '最近看到一款日本的洗面奶很火，想问问用过的朋友效果怎么样...',
          author: {
            id: 104,
            name: '护肤小白',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'question',
          tags: ['美妆', '护肤', '求推荐'],
          createdAt: '2023-12-12T18:10:00',
          likes: 45,
          comments: 33,
          views: 562,
          isHot: false
        },
        {
          id: 5,
          title: '分享我的厨房改造经验与好物推荐',
          content: '最近完成了厨房改造，分享一下过程中的经验教训和推荐的厨房好物...',
          author: {
            id: 105,
            name: '生活家',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'sharing',
          tags: ['家居', '厨房', '好物推荐'],
          createdAt: '2023-12-11T10:05:00',
          likes: 187,
          comments: 49,
          views: 1382,
          isHot: true
        },
        {
          id: 6,
          title: '双12购物节：值得购买的商品汇总',
          content: '整理了双12各大平台的优惠活动和值得关注的商品，希望对大家有帮助...',
          author: {
            id: 106,
            name: '省钱达人',
            avatar: 'https://via.placeholder.com/40'
          },
          category: 'guide',
          tags: ['购物攻略', '优惠活动', '双12'],
          createdAt: '2023-12-10T14:30:00',
          likes: 312,
          comments: 87,
          views: 2453,
          isHot: true
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, [activeCategory, activeSortMethod]);

  // 分类列表
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'discussion', name: '讨论' },
    { id: 'question', name: '问答' },
    { id: 'sharing', name: '分享' },
    { id: 'review', name: '评测' },
    { id: 'guide', name: '攻略' }
  ];

  // 排序方式
  const sortMethods = [
    { id: 'latest', name: '最新发布' },
    { id: 'popular', name: '最受欢迎' },
    { id: 'commented', name: '评论最多' }
  ];

  // 热门话题
  const hotTopics = [
    '双12购物攻略',
    '年度好物盘点',
    '冬季护肤指南',
    '智能家居体验',
    '数码产品推荐',
    '穿搭灵感分享'
  ];

  // 切换分类
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // 切换排序方式
  const handleSortMethodChange = (methodId) => {
    setActiveSortMethod(methodId);
  };

  // 切换移动端筛选菜单显示
  const toggleMobileFilter = () => {
    setMobileFilterVisible(!mobileFilterVisible);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}分钟前`;
      }
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="community-container">
        <div className="community-header">
          <h1>社区讨论</h1>
          <p>分享体验、寻求建议、参与讨论</p>
        </div>

        <div className="community-content">
          {/* 左侧边栏 - 分类和筛选 */}
          <div className="community-sidebar">
            <div className="sidebar-section">
              <h3>分类</h3>
              <ul className="category-list">
                {categories.map(category => (
                  <li 
                    key={category.id}
                    className={activeCategory === category.id ? 'active' : ''}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>热门话题</h3>
              <ul className="hot-topics-list">
                {hotTopics.map((topic, index) => (
                  <li key={index}>
                    <Link to={`/community/topic/${encodeURIComponent(topic)}`}>
                      <FontAwesomeIcon icon={faFire} className="topic-icon" />
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 主内容区 - 帖子列表 */}
          <div className="community-main">
            {/* 移动端分类筛选按钮 */}
            <div className="mobile-filter-toggle" onClick={toggleMobileFilter}>
              <FontAwesomeIcon icon={faFilter} />
              <span>筛选与分类</span>
              <FontAwesomeIcon 
                icon={mobileFilterVisible ? faChevronUp : faChevronDown} 
                className="toggle-icon"
              />
            </div>

            {/* 移动端筛选菜单 */}
            <div className={`mobile-filter-menu ${mobileFilterVisible ? 'visible' : ''}`}>
              <div className="mobile-filter-section">
                <h4>分类</h4>
                <div className="mobile-category-list">
                  {categories.map(category => (
                    <button 
                      key={category.id}
                      className={activeCategory === category.id ? 'active' : ''}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mobile-filter-section">
                <h4>排序方式</h4>
                <div className="mobile-sort-list">
                  {sortMethods.map(method => (
                    <button 
                      key={method.id}
                      className={activeSortMethod === method.id ? 'active' : ''}
                      onClick={() => handleSortMethodChange(method.id)}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 操作栏 */}
            <div className="community-actions">
              <div className="sort-options">
                {sortMethods.map(method => (
                  <button 
                    key={method.id}
                    className={activeSortMethod === method.id ? 'active' : ''}
                    onClick={() => handleSortMethodChange(method.id)}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
              
              <Link to="/community/new-post" className="new-post-button">
                <FontAwesomeIcon icon={faPlus} />
                <span>发布讨论</span>
              </Link>
            </div>

            {/* 帖子列表 */}
            <div className="post-list">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>加载中...</p>
                </div>
              ) : (
                <>
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-avatar">
                        <img src={post.author.avatar} alt={post.author.name} />
                      </div>
                      
                      <div className="post-content">
                        <Link to={`/community/post/${post.id}`} className="post-title">
                          {post.isHot && <span className="hot-tag"><FontAwesomeIcon icon={faFire} /> 热门</span>}
                          {post.title}
                        </Link>
                        
                        <div className="post-excerpt">{post.content}</div>
                        
                        <div className="post-meta">
                          <div className="post-author">
                            <Link to={`/user/${post.author.id}`}>{post.author.name}</Link>
                          </div>
                          <div className="post-time">{formatDate(post.createdAt)}</div>
                          <div className="post-category">{categories.find(c => c.id === post.category)?.name || post.category}</div>
                        </div>
                        
                        <div className="post-tags">
                          <FontAwesomeIcon icon={faTags} className="tags-icon" />
                          {post.tags.map((tag, index) => (
                            <Link key={index} to={`/community/tag/${encodeURIComponent(tag)}`} className="tag">
                              {tag}
                            </Link>
                          ))}
                        </div>
                        
                        <div className="post-stats">
                          <div className="stat">
                            <FontAwesomeIcon icon={faThumbsUp} />
                            <span>{post.likes}</span>
                          </div>
                          <div className="stat">
                            <FontAwesomeIcon icon={faComment} />
                            <span>{post.comments}</span>
                          </div>
                          <div className="stat">
                            <FontAwesomeIcon icon={faEye} />
                            <span>{post.views}</span>
                          </div>
                          <button className="bookmark-button">
                            <FontAwesomeIcon icon={faBookmark} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="load-more">
                    <button>加载更多</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 右侧边栏 - 热门统计 */}
          <div className="community-sidebar right-sidebar">
            <div className="sidebar-section">
              <h3>社区热度</h3>
              <div className="community-stats">
                <div className="stat-item">
                  <div className="stat-icon"><FontAwesomeIcon icon={faChartLine} /></div>
                  <div className="stat-content">
                    <div className="stat-value">12,345</div>
                    <div className="stat-label">今日讨论</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon"><FontAwesomeIcon icon={faComment} /></div>
                  <div className="stat-content">
                    <div className="stat-value">45,678</div>
                    <div className="stat-label">总讨论数</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon"><FontAwesomeIcon icon={faFire} /></div>
                  <div className="stat-content">
                    <div className="stat-value">789</div>
                    <div className="stat-label">活跃用户</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>热门用户</h3>
              <ul className="hot-users-list">
                <li>
                  <img src="https://via.placeholder.com/32" alt="用户头像" />
                  <div className="user-info">
                    <div className="user-name">时尚博主</div>
                    <div className="user-title">时尚达人</div>
                  </div>
                  <button className="follow-button">关注</button>
                </li>
                <li>
                  <img src="https://via.placeholder.com/32" alt="用户头像" />
                  <div className="user-info">
                    <div className="user-name">科技达人</div>
                    <div className="user-title">数码专家</div>
                  </div>
                  <button className="follow-button">关注</button>
                </li>
                <li>
                  <img src="https://via.placeholder.com/32" alt="用户头像" />
                  <div className="user-info">
                    <div className="user-name">美食家</div>
                    <div className="user-title">美食评测师</div>
                  </div>
                  <button className="follow-button followed">已关注</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community; 