# 轮播图使用说明

## 图片规格
- 图片尺寸: 522×750 像素
- 图片格式: JPG 或 PNG
- 图片数量: 6张

## 图片保存位置
请将6张轮播图放在以下目录：
```
frontend/public/images/banners/
```

## 图片命名
请按以下格式命名图片：
- banner1.jpg
- banner2.jpg
- banner3.jpg
- banner4.jpg
- banner5.jpg
- banner6.jpg

## 图片链接配置
轮播图的链接已经在 `frontend/src/services/imageService.js` 文件中配置好，如果需要修改图片链接的指向页面，请修改该文件中的 `BANNER_IMAGES` 数组。

## 注意事项
1. 请确保图片质量良好，避免模糊或像素化
2. 图片内容应当与商品或促销活动相关，提高用户点击率
3. 如果更换图片，请保持文件名不变
4. 轮播图会自动每6秒切换一次，用户也可以通过点击指示器或左右箭头手动切换 