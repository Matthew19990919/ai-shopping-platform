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
  const fontSize = Math.floor(Math.min(width, height) / 10);
  
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

// 定义占位图
const placeholders = [
  { name: 'product-placeholder.png', width: 200, height: 200, text: '产品图片', bgColor: '#f5f5f5', textColor: '#888' },
  { name: 'banner-placeholder.png', width: 1200, height: 400, text: '轮播图', bgColor: '#e6f7ff', textColor: '#1890ff' },
  { name: 'category-placeholder.png', width: 50, height: 50, text: '分类', bgColor: '#f9f0ff', textColor: '#722ed1' },
  { name: 'promotion-placeholder.png', width: 280, height: 160, text: '促销活动', bgColor: '#f6ffed', textColor: '#52c41a' },
  { name: 'avatar-placeholder.png', width: 100, height: 100, text: '头像', bgColor: '#fff2e8', textColor: '#fa8c16' },
  { name: 'logo-placeholder.png', width: 120, height: 40, text: 'LOGO', bgColor: '#fff1f0', textColor: '#f5222d' }
];

// 添加轮播图
for (let i = 1; i <= 4; i++) {
  placeholders.push({ 
    name: `banner${i}.jpg`, 
    width: 1200, 
    height: 400, 
    text: `轮播图 ${i}`, 
    bgColor: '#e6f7ff', 
    textColor: '#1890ff',
    dir: 'banners'
  });
}

// 生成并保存SVG文件
placeholders.forEach(placeholder => {
  const svg = generateSVG(
    placeholder.width, 
    placeholder.height, 
    placeholder.text,
    placeholder.bgColor,
    placeholder.textColor
  );
  
  const dir = placeholder.dir || 'placeholders';
  const outputDir = path.join(__dirname, '..', 'public', 'images', dir);
  ensureDirectoryExists(outputDir);
  
  const outputPath = path.join(outputDir, placeholder.name);
  fs.writeFileSync(outputPath, svg);
  console.log(`已生成: ${outputPath}`);
});

console.log('所有占位图生成完成！'); 