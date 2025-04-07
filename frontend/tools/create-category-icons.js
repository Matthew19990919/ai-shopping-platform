const fs = require('fs');
const path = require('path');

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成SVG
function generateSVG(width, height, text, bgColor = '#f5f5f5', textColor = '#aaa') {
  const fontSize = Math.floor(Math.min(width, height) / 3);
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}px" 
    fill="${textColor}" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >
    ${text}
  </text>
  <rect width="100%" height="1" fill="#ddd" y="0"/>
  <rect width="100%" height="1" fill="#ddd" y="${height-1}"/>
  <rect width="1" height="100%" fill="#ddd" x="0"/>
  <rect width="1" height="100%" fill="#ddd" x="${width-1}"/>
</svg>`;
}

// 定义分类图标
const categories = [
  { name: '手机数码', file: 'phone-digital.png', color: '#f69f9f' },
  { name: '电脑办公', file: 'computer-office.png', color: '#9fd8f6' },
  { name: '家用电器', file: 'home-appliance.png', color: '#f6e79f' },
  { name: '服装鞋帽', file: 'clothing.png', color: '#a3f69f' },
  { name: '美妆个护', file: 'beauty.png', color: '#f69fd8' },
  { name: '食品生鲜', file: 'food.png', color: '#c0f69f' },
  { name: '图书文娱', file: 'books.png', color: '#9fa8f6' },
  { name: '运动户外', file: 'sports.png', color: '#9ff6e2' },
  { name: '母婴玩具', file: 'baby-toys.png', color: '#f6c09f' },
  { name: '智能家居', file: 'smart-home.png', color: '#9fb8f6' },
  { name: '健康医药', file: 'health.png', color: '#bef69f' }
];

// 生成并保存分类图标
const outputDir = path.join(__dirname, '..', 'public', 'images', 'categories');
ensureDirectoryExists(outputDir);

categories.forEach(category => {
  const svg = generateSVG(50, 50, category.name.substr(0, 1), category.color, '#fff');
  const outputPath = path.join(outputDir, category.file);
  fs.writeFileSync(outputPath, svg);
  console.log(`已生成分类图标: ${outputPath}`);
});

console.log('所有分类图标生成完成！'); 