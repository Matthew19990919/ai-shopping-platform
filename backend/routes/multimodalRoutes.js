/**
 * 多模态输入处理路由
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 设置文件上传配置
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads');
      // 确保上传目录存在
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: function (req, file, cb) {
    // 验证文件类型
    if (file.fieldname === 'image') {
      // 图片类型过滤
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('只允许上传图片文件'));
      }
    } else if (file.fieldname === 'audio') {
      // 音频类型过滤
      const allowedMimes = ['audio/wav', 'audio/mpeg', 'audio/webm'];
      if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error('只允许上传WAV, MP3或WebM格式的音频文件'));
      }
    }
    cb(null, true);
  }
});

// 图像识别API端点
router.post('/image-recognition', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未上传图片文件' });
    }

    // 这里应该调用实际的图像识别服务
    // 示例中使用模拟数据
    const mockCategories = ['电子产品', '数码设备', '智能手机'];
    const mockObjects = ['手机', '屏幕', '电子设备'];
    const mockColors = ['黑色', '银色'];
    
    // 模拟匹配的产品数据
    const mockProducts = [
      {
        id: '1001',
        name: 'iPhone 15 Pro',
        price: 8999,
        description: '最新款智能手机，搭载A17 Pro芯片',
        imageUrl: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708',
        rating: 4.8,
        category: '智能手机',
        brand: 'Apple'
      },
      {
        id: '1002',
        name: '华为 Mate 60 Pro',
        price: 6999,
        description: '全新麒麟芯片，超长续航',
        imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/plp/phones/mate60-pro.png',
        rating: 4.9,
        category: '智能手机',
        brand: '华为'
      },
      {
        id: '1003',
        name: '小米 14 Ultra',
        price: 5999,
        description: '徕卡四摄，骁龙8Gen3旗舰处理器',
        imageUrl: 'https://cdn.cnbj1.fds.api.mi-img.com/product-images/xiaomi14ultra/specs-black.png',
        rating: 4.7,
        category: '智能手机',
        brand: '小米'
      }
    ];
    
    // 返回识别结果和匹配的产品
    res.json({
      success: true,
      categories: mockCategories,
      objects: mockObjects,
      colors: mockColors,
      mainCategory: '智能手机',
      confidence: 'high',
      matches: mockProducts // 添加匹配的产品
    });
    
    // 实际项目需要在图像处理完成后删除上传的文件
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('删除上传图片失败:', err);
    });
  } catch (error) {
    console.error('图像识别处理失败:', error);
    res.status(500).json({ success: false, error: `图像识别失败: ${error.message}` });
  }
});

// 语音识别API端点
router.post('/speech-recognition', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未上传音频文件' });
    }

    // 这里应该调用实际的语音识别服务
    // 示例中使用模拟数据
    const mockTexts = [
      "我想买一部新手机",
      "推荐一款性价比高的笔记本电脑",
      "帮我找一款适合送父母的礼物",
      "我需要一个防水的智能手表"
    ];
    
    const mockText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    
    // 返回识别结果
    res.json({
      success: true,
      text: mockText,
      confidence: 0.92
    });
    
    // 实际项目需要在语音处理完成后删除上传的文件
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('删除上传音频失败:', err);
    });
  } catch (error) {
    console.error('语音识别处理失败:', error);
    res.status(500).json({ success: false, error: `语音识别失败: ${error.message}` });
  }
});

module.exports = router;