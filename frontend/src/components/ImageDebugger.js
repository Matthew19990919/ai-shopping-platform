import React, { useEffect, useState } from 'react';

/**
 * 图片调试组件，用于检查图片是否能正确加载
 */
const ImageDebugger = () => {
  const [images, setImages] = useState([]);
  const [loadStates, setLoadStates] = useState({});
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    // 获取公共URL前缀
    const publicUrlPrefix = process.env.PUBLIC_URL || '';
    setPublicUrl(publicUrlPrefix);
    
    // 生成要测试的图片路径
    const relativePaths = [
      '/images/banners/banner1.jpg',
      '/images/banners/banner2.jpg',
      '/images/banners/banner3.jpg',
      '/images/banners/banner4.jpg',
      '/images/banners/banner5.jpg',
      '/images/banners/banner6.jpg'
    ];
    
    // 添加公共URL前缀
    const fullPaths = relativePaths.map(path => ({
      relative: path,
      full: `${publicUrlPrefix}${path}`
    }));
    
    setImages(fullPaths);
    
    // 打印当前服务的基本信息
    console.log('当前环境:', process.env.NODE_ENV);
    console.log('PUBLIC_URL:', publicUrlPrefix);
    console.log('当前URL:', window.location.href);
  }, []);

  const handleImageLoad = (path) => {
    console.log(`图片成功加载: ${path}`);
    setLoadStates(prev => ({
      ...prev,
      [path]: 'loaded'
    }));
  };

  const handleImageError = (path) => {
    console.error(`图片加载失败: ${path}`);
    setLoadStates(prev => ({
      ...prev,
      [path]: 'error'
    }));
    
    // 尝试检查文件是否存在
    fetch(path)
      .then(response => {
        if (!response.ok) {
          console.error(`文件请求失败: ${path}, 状态码: ${response.status}`);
        }
      })
      .catch(err => {
        console.error(`文件请求错误: ${path}`, err);
      });
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', maxWidth: '350px', maxHeight: '500px', overflow: 'auto' }}>
      <h3>图片加载调试器</h3>
      <div style={{ marginBottom: '10px', fontSize: '12px' }}>
        <div>PUBLIC_URL: {publicUrl || '(无)'}</div>
        <div>当前URL: {window.location.origin}</div>
      </div>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {images.map(pathObj => (
          <li key={pathObj.relative} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontSize: '12px' }}>
              <div>相对路径: {pathObj.relative}</div>
              <div>完整路径: {pathObj.full}</div>
              <div>
                状态: 
                {loadStates[pathObj.full] === 'loaded' && <span style={{ color: 'green' }}> ✓ 加载成功</span>}
                {loadStates[pathObj.full] === 'error' && <span style={{ color: 'red' }}> ✗ 加载失败</span>}
                {!loadStates[pathObj.full] && <span style={{ color: 'blue' }}> ... 加载中</span>}
              </div>
            </div>
            <div style={{ marginTop: '5px' }}>
              <img 
                src={`${pathObj.full}?t=${new Date().getTime()}`} 
                alt="图片测试" 
                style={{ width: '100px', height: 'auto', display: 'block' }} 
                onLoad={() => handleImageLoad(pathObj.full)}
                onError={() => handleImageError(pathObj.full)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageDebugger; 