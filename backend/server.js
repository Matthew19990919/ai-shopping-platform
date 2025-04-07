const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');

// 导入路由
const multimodalRoutes = require('./routes/multimodalRoutes');
const priceComparisonRoutes = require('./routes/priceComparisonRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

const DEEPSEEK_API_KEY = 'sk-325dbf5907ed422598cbbbf0bfd1b177';

// 简单的内存数据库，存储用户信息
// 注意：这只是演示用途，实际应用中应该使用真正的数据库
const users = [];

// AI聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received request:', req.body);

    // 检查请求体中是否包含必要的消息数组
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({ error: '请求格式不正确，缺少消息数组' });
    }

    // 确保与DeepSeek API的连接使用正确的URL和请求体格式
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: "deepseek-chat",
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      timeout: 30000 // 设置30秒超时
    });

    // 检查响应是否为JSON格式
    console.log('DeepSeek response type:', typeof response.data);
    console.log('DeepSeek response:', response.data);

    if (!response.data || !response.data.choices) {
      throw new Error('DeepSeek API返回的数据格式不正确');
    }

    res.json(response.data);

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // 检查是否为网络错误
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: '无法连接到DeepSeek服务器',
        details: `网络错误: ${error.message}`
      });
    }

    // 检查是否是API密钥错误
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'DeepSeek API授权失败',
        details: 'API密钥可能无效或已过期'
      });
    }

    // 检查是否是请求格式错误
    if (error.response?.status === 400) {
      return res.status(400).json({
        error: 'DeepSeek API请求格式错误',
        details: error.response?.data || error.message
      });
    }

    // 如果响应内容不是JSON格式
    if (error.message.includes('Unexpected token')) {
      return res.status(500).json({
        error: 'DeepSeek API返回了非JSON格式的响应',
        details: error.message,
        suggestion: '可能是API地址错误或服务器故障'
      });
    }

    // 返回更详细的错误信息
    res.status(500).json({
      error: '服务器错误',
      details: error.response?.data || error.message,
      errorType: error.name
    });
  }
});

// 注册用户接口
app.post('/api/register', (req, res) => {
  const { username, email, phone, password } = req.body;
  
  // 验证必填字段
  if (!username || !email || !phone || !password) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }
  
  // 检查用户名是否已存在
  const userExists = users.some(user => 
    user.username === username || 
    user.email === email || 
    user.phone === phone
  );
  
  if (userExists) {
    return res.status(400).json({ error: '用户名、邮箱或手机号已被注册' });
  }
  
  // 创建新用户（实际应用中应对密码进行加密）
  const newUser = {
    id: users.length + 1,
    username,
    email,
    phone,
    password, // 实际应用中应该是加密的密码
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // 返回成功消息（不返回密码）
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: '注册成功',
    user: userWithoutPassword
  });
});

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户名和密码
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码都是必填的' });
  }
  
  // 查找用户（允许使用用户名、邮箱或手机号登录）
  const user = users.find(user => 
    (user.username === username || 
     user.email === username || 
     user.phone === username) && 
    user.password === password
  );
  
  if (!user) {
    return res.status(401).json({ error: '用户名或密码不正确' });
  }
  
  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: '登录成功',
    user: userWithoutPassword
  });
});

// 注册API路由
app.use('/api', multimodalRoutes);
app.use('/api/price-comparison', priceComparisonRoutes);

// 提供前端构建的静态文件
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 所有未匹配的路由返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 基础路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 