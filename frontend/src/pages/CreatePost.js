import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, faLink, faListUl, faQuoteLeft, 
  faHeading, faBold, faItalic, faUnderline,
  faTimes, faExclamationCircle, faTag
} from '@fortawesome/free-solid-svg-icons';
import '../styles/createPost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // 分类选项
  const categories = [
    '数码电器', '智能家居', '手机', '电脑配件', '穿戴设备', 
    '相机', '游戏设备', '网络设备', '家电', '其他'
  ];
  
  // 编辑器工具栏选项
  const toolbarOptions = [
    { icon: faHeading, name: '标题', action: () => insertText('## 标题\n\n') },
    { icon: faBold, name: '粗体', action: () => insertText('**粗体文字**') },
    { icon: faItalic, name: '斜体', action: () => insertText('*斜体文字*') },
    { icon: faUnderline, name: '下划线', action: () => insertText('<u>下划线文字</u>') },
    { icon: faListUl, name: '列表', action: () => insertText('\n- 列表项1\n- 列表项2\n- 列表项3\n\n') },
    { icon: faQuoteLeft, name: '引用', action: () => insertText('\n> 引用内容\n\n') },
    { icon: faLink, name: '链接', action: () => insertText('[链接文字](https://example.com)') },
    { icon: faImage, name: '图片', action: () => insertText('![图片描述](https://example.com/image.jpg)') }
  ];
  
  // 插入文本到内容中
  const insertText = (text) => {
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 10);
  };
  
  // 添加标签
  const addTag = (e) => {
    e.preventDefault();
    if (!currentTag.trim()) return;
    
    // 检查标签是否已存在
    if (tags.includes(currentTag.trim())) {
      setErrors({...errors, tag: '该标签已存在'});
      return;
    }
    
    // 检查标签数量
    if (tags.length >= 5) {
      setErrors({...errors, tag: '最多添加5个标签'});
      return;
    }
    
    setTags([...tags, currentTag.trim()]);
    setCurrentTag('');
    setErrors({...errors, tag: null});
  };
  
  // 移除标签
  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    setErrors({...errors, tag: null});
  };
  
  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = '请输入标题';
    } else if (title.length < 5) {
      newErrors.title = '标题至少需要5个字符';
    } else if (title.length > 100) {
      newErrors.title = '标题不能超过100个字符';
    }
    
    if (!content.trim()) {
      newErrors.content = '请输入内容';
    } else if (content.length < 20) {
      newErrors.content = '内容至少需要20个字符';
    }
    
    if (!category) {
      newErrors.category = '请选择分类';
    }
    
    if (tags.length === 0) {
      newErrors.tags = '请至少添加一个标签';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功后跳转到帖子详情页
      navigate('/community/post/1');
    } catch (error) {
      console.error('发布失败', error);
      setErrors({...errors, submit: '发布失败，请稍后重试'});
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 内容预览渲染（简易Markdown解析）
  const renderPreview = () => {
    if (!content) return <p className="preview-empty">预览内容为空</p>;
    
    // 简易的Markdown解析
    let html = content
      // 处理标题
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/# (.*?)$/gm, '<h1>$1</h1>')
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 处理链接
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 处理图片
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
      // 处理引用
      .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
      // 处理无序列表
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+?)(?=<\/li>|$)/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n?<ul>/g, '')
      // 处理段落
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    html = `<p>${html}</p>`;
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };
  
  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>发布新帖子</h1>
        <p>分享你的问题或经验，与社区成员一起讨论</p>
      </div>
      
      {errors.submit && (
        <div className="error-message global-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <form className="create-post-form" onSubmit={handleSubmit}>
        {/* 标题输入 */}
        <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
          <label htmlFor="post-title">标题</label>
          <input
            type="text"
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入标题，简洁明了地描述你的问题或观点"
            maxLength="100"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
          <div className="input-counter">{title.length}/100</div>
        </div>
        
        {/* 分类选择 */}
        <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
          <label htmlFor="post-category">分类</label>
          <select
            id="post-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- 请选择分类 --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <div className="error-message">{errors.category}</div>}
        </div>
        
        {/* 标签输入 */}
        <div className={`form-group ${errors.tags || errors.tag ? 'has-error' : ''}`}>
          <label>标签</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {tags.map((tag, index) => (
                <div className="tag-item" key={index}>
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(index)} className="tag-remove">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <div className="tag-input-wrapper">
                <FontAwesomeIcon icon={faTag} className="tag-icon" />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                  placeholder={tags.length ? "添加更多标签" : "添加标签"}
                  maxLength="20"
                />
                <button type="button" className="add-tag-button" onClick={addTag}>添加</button>
              </div>
            </div>
          </div>
          {errors.tag && <div className="error-message">{errors.tag}</div>}
          {errors.tags && <div className="error-message">{errors.tags}</div>}
          <div className="tags-hint">添加1-5个与内容相关的标签，用于更好地分类和被搜索到</div>
        </div>
        
        {/* 内容编辑器 */}
        <div className={`form-group ${errors.content ? 'has-error' : ''}`}>
          <label htmlFor="post-content">内容</label>
          
          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="toolbar-buttons">
                {toolbarOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    title={option.name}
                    className="toolbar-button"
                    onClick={option.action}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                  </button>
                ))}
              </div>
              
              <div className="editor-mode-toggle">
                <button
                  type="button"
                  className={`mode-button ${!previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(false)}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className={`mode-button ${previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(true)}
                >
                  预览
                </button>
              </div>
            </div>
            
            <div className="editor-content">
              {!previewMode ? (
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入帖子内容，支持Markdown格式..."
                  rows="12"
                  className={errors.content ? 'has-error' : ''}
                ></textarea>
              ) : (
                <div className="content-preview">
                  {renderPreview()}
                </div>
              )}
            </div>
          </div>
          
          {errors.content && <div className="error-message">{errors.content}</div>}
          <div className="content-hint">
            支持基本 Markdown 语法，可以使用工具栏按钮快速插入格式化文本
          </div>
        </div>
        
        {/* 提交按钮 */}
        <div className="form-actions">
          <Link to="/community" className="cancel-button">取消</Link>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '发布中...' : '发布帖子'}
          </button>
        </div>
      </form>
      
      <div className="posting-tips">
        <h3>发帖小贴士</h3>
        <ul>
          <li>请确保您的帖子符合社区规范</li>
          <li>提供尽可能多的细节，以便他人更好地理解和回答您的问题</li>
          <li>添加适当的标签，增加帖子曝光度</li>
          <li>发布前检查您的内容是否清晰、条理</li>
          <li>尊重他人，保持友善的讨论环境</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost; 