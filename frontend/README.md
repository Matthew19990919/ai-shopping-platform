# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# 电商网站图片资源管理

本项目采用了统一的图片资源管理方案，解决产品图片缺失的问题。

## 图片资源目录结构

图片资源统一存放在 `public/images` 目录下，按以下类别组织：

```
public/images/
├── products/       # 产品图片
├── banners/        # 轮播图
├── promotions/     # 促销活动图片
├── categories/     # 分类图标
├── placeholders/   # 占位图
└── icons/          # 图标
```

## 图片服务

我们开发了专门的图片服务 `imageService.js`，统一处理图片资源：

1. **智能图片回退**: 当图片无法加载时，会自动使用占位图
2. **自动图片转换**: 根据产品名称生成一致的图片路径
3. **SVG占位图生成**: 动态生成高质量SVG占位图，不依赖外部服务

## 开发者指南

### 添加产品图片

产品图片应遵循以下命名规则：

- 使用产品ID: `product-{id}.jpg`
- 或使用产品名称的URL安全版本: `{product-name}.jpg`

### 测试图片批量下载

我们提供了一个便捷工具，可快速下载测试图片：

```bash
# 安装依赖
npm install axios fs-extra

# 运行下载脚本
cd frontend/tools
node download-test-images.js
```

该脚本会自动下载：
- 产品图片 (50张)
- 轮播图 (4张)
- 促销图片 (10张)
- 分类图标 (11张)
- 占位图 (6张)

## 使用方法

### 在组件中使用

```jsx
import { getProductImageUrl, handleImageError } from '../services/imageService';

// 使用方式一：直接获取图片URL
<img 
  src={getProductImageUrl(product.image, product.title)} 
  alt={product.title} 
/>

// 使用方式二：处理图片加载失败
<img 
  src={product.image} 
  alt={product.title}
  onError={(e) => handleImageError(e, 'product', product.title)} 
/>
```

### 图片类型

图片服务支持以下类型的图片：

- `product`: 产品图片
- `banner`: 轮播图
- `promotion`: 促销图片
- `category`: 分类图标
- `avatar`: 用户头像
- `logo`: 品牌logo

## 未来扩展

该方案设计考虑了未来的扩展性，可以轻松集成：

1. **CDN支持**: 可以方便地调整为使用CDN加速
2. **图片压缩**: 可添加自动压缩图片的功能
3. **图片懒加载**: 可以集成懒加载功能提升性能
4. **响应式图片**: 可以根据设备屏幕提供不同尺寸的图片
