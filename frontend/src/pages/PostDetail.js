import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, faComment, faEye, faBookmark, faTags, faShareAlt,
  faFlag, faChevronUp, faChevronDown, faReply, faUser
} from '@fortawesome/free-solid-svg-icons';
import '../styles/community.css';
import '../styles/postDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isPostBookmarked, setIsPostBookmarked] = useState(false);

  // 模拟获取帖子内容
  useEffect(() => {
    const fetchPostData = async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟从API获取的帖子数据
      const mockPost = {
        id: postId,
        title: "有没有人推荐一下这款智能扫地机器人？真的好用吗？",
        content: `
        <p>我最近在考虑入手一款智能扫地机器人，看到了这款支持AI导航的扫地机挺不错的，价格是2999元。</p>
        
        <p>主要功能有：</p>
        <ul>
          <li>激光导航和AI物体识别</li>
          <li>自动规划清扫路线</li>
          <li>APP远程控制</li>
          <li>自动回充和续航180分钟</li>
          <li>支持湿拖和扫地二合一</li>
        </ul>
        
        <p>但是我担心它在实际使用时会有一些问题：</p>
        <ol>
          <li>对于地毯的清扫效果如何？</li>
          <li>是否会缠绕电线和毛发？</li>
          <li>噪音控制怎么样？</li>
          <li>日常维护复杂不复杂？</li>
        </ol>
        
        <p>有使用过这款或者类似产品的朋友能分享一下使用体验吗？求真实评价，打算下个月促销的时候入手，谢谢大家！</p>
        
        <p>附上产品链接：<a href="#">智能扫地机器人产品页面</a></p>
        `,
        author: {
          id: 123,
          name: "清风徐来",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        publishDate: "2023-09-15 14:30",
        category: "数码电器",
        tags: ["智能家居", "扫地机器人", "购物咨询"],
        likes: 48,
        comments: 16,
        views: 230,
        isHot: true
      };
      
      setPost(mockPost);
      
      // 模拟评论数据
      const mockComments = [
        {
          id: 1,
          author: {
            id: 234,
            name: "科技达人",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            level: 4,
            isCertified: true
          },
          content: "我去年买了这款扫地机器人，用了将近一年了，整体来说还是挺不错的。激光导航很精准，几乎不会漏扫，对家具边角的清洁也做得很到位。湿拖功能中规中矩，适合日常的轻度清洁。\n\n但是如果你家里地毯比较多，可能还是不太适合，尤其是深色长毛地毯容易缠绕。电池续航确实如宣传所说，大概能连续工作3小时左右，足够清扫大户型了。",
          publishDate: "2023-09-15 15:05",
          likes: 32,
          dislikes: 3,
          replies: [
            {
              id: 11,
              author: {
                id: 123,
                name: "清风徐来",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              content: "谢谢分享！请问噪音大吗？我家有小孩，担心影响午睡。",
              publishDate: "2023-09-15 15:20",
              likes: 5,
              dislikes: 0
            },
            {
              id: 12,
              author: {
                id: 234,
                name: "科技达人",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg"
              },
              content: "噪音其实还好，有几个清扫模式可以选择，安静模式下噪音在55分贝左右，比普通吸尘器要安静不少。不过为了保证清洁效果，我一般用标准模式，噪音会稍大一些。",
              publishDate: "2023-09-15 15:45",
              likes: 8,
              dislikes: 0
            }
          ]
        },
        {
          id: 2,
          author: {
            id: 345,
            name: "家居控",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg",
            level: 3,
            isCertified: false
          },
          content: "这个价位的扫地机器人，我觉得性价比不错。我家有两只猫，所以毛发特别多，这款机器的防缠绕技术确实不错，基本不会出现电机堵塞的情况。不过湿拖功能个人觉得一般，还是需要定期手动拖地。\n\n另外APP的智能规划确实很方便，可以设置禁区和指定区域重点清扫，对于宠物经常活动的区域特别有用。电池续航在多次使用后会有一定程度的衰减，现在一次充满大概能用2小时多一点。",
          publishDate: "2023-09-15 16:12",
          likes: 24,
          dislikes: 1,
          replies: []
        },
        {
          id: 3,
          author: {
            id: 456,
            name: "数码评测师",
            avatar: "https://randomuser.me/api/portraits/men/42.jpg",
            level: 5,
            isCertified: true
          },
          content: "作为一个测试过多款扫地机器人的人，我认为这款产品在这个价位是可以考虑的。它的导航系统采用了目前主流的LDS激光雷达，精度和稳定性都不错。清扫能力方面，2200Pa的吸力对于日常灰尘和头发清理够用了。\n\n不过我不建议过度依赖它的湿拖功能，因为没有主动加压设计，对于顽固污渍处理能力有限。如果你对清洁要求特别高，可以考虑更高端一点的型号或者专门的擦地机器人。\n\n关于你提到的问题：\n1. 地毯清扫效果：中低毛地毯没问题，高毛地毯可能会有困难\n2. 电线缠绕：有防缠绕技术，但很长的线材最好提前收好\n3. 噪音：标准模式约60-65分贝，安静模式更低，可以接受\n4. 日常维护：尘盒需要经常清理，滤网和边刷大概1-2个月更换一次，总体不复杂",
          publishDate: "2023-09-15 18:30",
          likes: 45,
          dislikes: 2,
          replies: []
        }
      ];
      
      setComments(mockComments);
      setLoading(false);
    };
    
    fetchPostData();
  }, [postId]);

  // 处理评论提交
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      author: {
        id: 789, // 假设当前用户ID
        name: "当前用户",
        avatar: "https://randomuser.me/api/portraits/men/99.jpg",
        level: 2,
        isCertified: false
      },
      content: commentText,
      publishDate: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      replies: []
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };

  // 处理回复提交
  const handleReplySubmit = (commentId, e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Math.floor(Math.random() * 1000),
      author: {
        id: 789, // 假设当前用户ID
        name: "当前用户",
        avatar: "https://randomuser.me/api/portraits/men/99.jpg"
      },
      content: replyText,
      publishDate: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyText('');
    setShowReplyForm(null);
  };

  // 处理评论点赞
  const handleCommentLike = (commentId) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId));
    } else {
      setLikedComments([...likedComments, commentId]);
      setDislikedComments(dislikedComments.filter(id => id !== commentId));
    }
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const wasLiked = likedComments.includes(commentId);
        const wasDisliked = dislikedComments.includes(commentId);
        
        return {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
          dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };

  // 处理评论踩
  const handleCommentDislike = (commentId) => {
    if (dislikedComments.includes(commentId)) {
      setDislikedComments(dislikedComments.filter(id => id !== commentId));
    } else {
      setDislikedComments([...dislikedComments, commentId]);
      setLikedComments(likedComments.filter(id => id !== commentId));
    }
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const wasLiked = likedComments.includes(commentId);
        const wasDisliked = dislikedComments.includes(commentId);
        
        return {
          ...comment,
          likes: wasLiked ? comment.likes - 1 : comment.likes,
          dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes + 1
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };

  // 帖子点赞
  const handlePostLike = () => {
    setIsPostLiked(!isPostLiked);
    if (post) {
      setPost({
        ...post,
        likes: isPostLiked ? post.likes - 1 : post.likes + 1
      });
    }
  };

  // 帖子收藏
  const handlePostBookmark = () => {
    setIsPostBookmarked(!isPostBookmarked);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!post) {
    return <div className="community-container">帖子不存在或已被删除</div>;
  }

  return (
    <div className="community-container">
      {/* 面包屑导航 */}
      <div className="post-breadcrumb">
        <Link to="/">首页</Link> / 
        <Link to="/community">社区</Link> / 
        <Link to={`/community/category/${post.category}`}>{post.category}</Link> / 
        <span>帖子详情</span>
      </div>
      
      {/* 帖子内容 */}
      <div className="post-detail-card">
        <div className="post-header">
          <h1 className="post-title">
            {post.isHot && <span className="hot-tag">热门</span>}
            {post.title}
          </h1>
          
          <div className="post-meta">
            <div className="post-author">
              <img src={post.author.avatar} alt={post.author.name} />
              <Link to={`/user/${post.author.id}`}>{post.author.name}</Link>
            </div>
            <div className="post-time">{post.publishDate}</div>
            <div className="post-category">
              <Link to={`/community/category/${post.category}`}>{post.category}</Link>
            </div>
          </div>
          
          <div className="post-tags">
            <FontAwesomeIcon icon={faTags} className="tags-icon" />
            {post.tags.map((tag, index) => (
              <Link key={index} to={`/community/tag/${tag}`} className="tag">{tag}</Link>
            ))}
          </div>
        </div>
        
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        
        <div className="post-actions">
          <button 
            className={`action-button like-button ${isPostLiked ? 'active' : ''}`}
            onClick={handlePostLike}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>点赞 {post.likes}</span>
          </button>
          
          <button className="action-button">
            <FontAwesomeIcon icon={faComment} />
            <span>评论 {post.comments}</span>
          </button>
          
          <button 
            className={`action-button bookmark-button ${isPostBookmarked ? 'active' : ''}`}
            onClick={handlePostBookmark}
          >
            <FontAwesomeIcon icon={faBookmark} />
            <span>收藏</span>
          </button>
          
          <button className="action-button">
            <FontAwesomeIcon icon={faShareAlt} />
            <span>分享</span>
          </button>
          
          <button className="action-button report-button">
            <FontAwesomeIcon icon={faFlag} />
            <span>举报</span>
          </button>
        </div>
        
        <div className="post-stats">
          <div className="stat">
            <FontAwesomeIcon icon={faEye} />
            <span>{post.views} 浏览</span>
          </div>
        </div>
      </div>
      
      {/* 评论区 */}
      <div className="comments-section">
        <h3 className="section-title">评论 ({comments.length})</h3>
        
        {/* 评论表单 */}
        <div className="comment-form-container">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <textarea
                placeholder="输入你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">发布评论</button>
            </div>
          </form>
        </div>
        
        {/* 评论列表 */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">
              暂无评论，快来发表你的看法吧！
            </div>
          ) : (
            comments.map(comment => (
              <div className="comment-card" key={comment.id}>
                <div className="comment-header">
                  <div className="comment-author">
                    <img src={comment.author.avatar} alt={comment.author.name} />
                    <div className="author-info">
                      <div className="author-name">
                        <Link to={`/user/${comment.author.id}`}>{comment.author.name}</Link>
                        {comment.author.level && (
                          <span className="author-level">Lv.{comment.author.level}</span>
                        )}
                        {comment.author.isCertified && (
                          <span className="author-certified">官方认证</span>
                        )}
                      </div>
                      <div className="comment-time">{comment.publishDate}</div>
                    </div>
                  </div>
                </div>
                
                <div className="comment-content">
                  {comment.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="comment-actions">
                  <button 
                    className={`vote-button ${likedComments.includes(comment.id) ? 'active' : ''}`}
                    onClick={() => handleCommentLike(comment.id)}
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                    <span>{comment.likes}</span>
                  </button>
                  
                  <button 
                    className={`vote-button ${dislikedComments.includes(comment.id) ? 'active' : ''}`}
                    onClick={() => handleCommentDislike(comment.id)}
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                    <span>{comment.dislikes}</span>
                  </button>
                  
                  <button 
                    className="reply-button"
                    onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
                  >
                    <FontAwesomeIcon icon={faReply} />
                    <span>回复</span>
                  </button>
                </div>
                
                {/* 回复表单 */}
                {showReplyForm === comment.id && (
                  <div className="reply-form-container">
                    <form onSubmit={(e) => handleReplySubmit(comment.id, e)} className="reply-form">
                      <div className="form-group">
                        <textarea
                          placeholder={`回复 ${comment.author.name}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows="3"
                          required
                        ></textarea>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => setShowReplyForm(null)}>
                          取消
                        </button>
                        <button type="submit" className="submit-button">回复</button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* 回复列表 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies-list">
                    {comment.replies.map(reply => (
                      <div className="reply-card" key={reply.id}>
                        <div className="reply-header">
                          <div className="reply-author">
                            <img src={reply.author.avatar} alt={reply.author.name} />
                            <div className="author-info">
                              <div className="author-name">
                                <Link to={`/user/${reply.author.id}`}>{reply.author.name}</Link>
                              </div>
                              <div className="reply-time">{reply.publishDate}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="reply-content">{reply.content}</div>
                        
                        <div className="reply-actions">
                          <span className="reply-likes">
                            <FontAwesomeIcon icon={faThumbsUp} />
                            <span>{reply.likes}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 相关推荐 */}
      <div className="related-posts">
        <h3 className="section-title">相关推荐</h3>
        <div className="related-posts-list">
          <div className="related-post-card">
            <Link to="/community/post/2" className="related-post-title">最新款智能音箱对比评测：小米、华为、天猫精灵哪个更值得买？</Link>
            <div className="related-post-meta">
              <span>数码电器</span>
              <span>32评论</span>
            </div>
          </div>
          
          <div className="related-post-card">
            <Link to="/community/post/3" className="related-post-title">智能家居入门指南：从扫地机器人开始打造你的智能生活</Link>
            <div className="related-post-meta">
              <span>智能家居</span>
              <span>45评论</span>
            </div>
          </div>
          
          <div className="related-post-card">
            <Link to="/community/post/4" className="related-post-title">2023年最受好评的10款家用电器，第一名竟然是它！</Link>
            <div className="related-post-meta">
              <span>数码电器</span>
              <span>89评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 