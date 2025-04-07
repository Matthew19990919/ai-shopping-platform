/**
 * 全局主题配置
 * 用于覆盖Ant Design的默认主题
 */

const theme = {
  // 主色调
  'primary-color': '#e1251b',
  
  // 链接色
  'link-color': '#1890ff',
  'link-hover-color': '#40a9ff',
  'link-active-color': '#096dd9',
  
  // 成功色
  'success-color': '#52c41a',
  
  // 警告色
  'warning-color': '#faad14',
  
  // 错误色
  'error-color': '#f5222d',
  
  // 字体相关
  'font-family': 
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, " +
    "'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', " +
    "'Noto Color Emoji', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑'",
  
  'font-size-base': '14px',
  'heading-color': 'rgba(0, 0, 0, 0.85)',
  'text-color': 'rgba(0, 0, 0, 0.65)',
  'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
  
  // 边框相关
  'border-radius-base': '4px',
  'border-color-base': '#d9d9d9',
  
  // 盒子阴影
  'box-shadow-base': 
    '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    
  // 按钮相关
  'btn-font-weight': '500',
  'btn-border-radius-base': '4px',
  'btn-shadow': '0 2px 0 rgba(0, 0, 0, 0.015)',
  'btn-primary-shadow': '0 2px 0 rgba(225, 37, 27, 0.2)',
  
  // 输入框相关
  'input-height-base': '36px',
  'input-height-lg': '44px',
  
  // 菜单相关
  'menu-item-active-bg': '#fff1f0',
  
  // 动画相关
  'animation-duration-base': '.2s',
  'animation-duration-slow': '.3s',
  
  // 禁用状态
  'disabled-color': 'rgba(0, 0, 0, 0.25)',
  'disabled-bg': '#f5f5f5',
};

module.exports = theme; 