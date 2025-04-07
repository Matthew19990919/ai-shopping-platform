# AI导购平台API部署指南

本文档指导如何将后端API部署到Cloudflare Workers。

## 前期准备

已完成：
- 创建了后端Worker项目结构
- 编写了API代码（src/index.js）
- 创建了package.json和wrangler.toml配置文件
- 更新了前端代码中的API URL配置

## 手动完成步骤

### 1. 安装依赖

```bash
cd i-shopping-platform-api
npm install
```

### 2. 安装Wrangler CLI（如果尚未安装）

```bash
npm install -g wrangler
```

### 3. 登录到Cloudflare

```bash
wrangler login
```

按照浏览器中的提示完成授权。

### 4. 部署Worker

```bash
wrangler deploy
```

### 5. 提交代码更改到GitHub

```bash
git add .
git commit -m "添加后端API并更新前端配置"
git push
```

### 6. 重新部署前端（在Cloudflare Pages控制台）

前往Cloudflare Pages控制台，找到您的项目，点击"重新部署"。

## 测试与验证

1. 测试后端API：访问 `https://i-shopping-platform-api.anselmatthew2018.workers.dev/api/products`
2. 测试前端应用：访问 `https://ai-shopping-platform.anselmatthew2018.workers.dev`

## 常见问题解决

如遇问题，请参考Cloudflare文档：
- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)