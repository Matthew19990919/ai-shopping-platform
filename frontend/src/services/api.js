import axios from 'axios';

// 根据环境选择API基础URL
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://i-shopping-platform-api.anselmatthew2018.workers.dev' // 已设置为您的Cloudflare账户名
  : 'http://localhost:3001';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { BASE_URL, apiClient };
export default apiClient;