import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSort, faInfoCircle, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './ProductComparisonTable.css';

const ProductComparisonTable = ({ products }) => {
  const [allSpecs, setAllSpecs] = useState([]);
  const [importantSpecs, setImportantSpecs] = useState([]);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // 提取并合并所有产品规格参数
  useEffect(() => {
    if (!products || products.length === 0) return;

    // 收集所有规格键
    const allKeys = new Set();
    products.forEach(product => {
      if (product.specs) {
        Object.keys(product.specs).forEach(key => allKeys.add(key));
      }
    });

    // 转换为数组格式
    const specsList = Array.from(allKeys).map(key => {
      // 确定这个规格是否为数字类型
      const isNumeric = products.some(product => 
        product.specs && 
        product.specs[key] && 
        !isNaN(parseFloat(product.specs[key]))
      );

      return {
        name: key,
        isNumeric,
        // 默认重要规格
        isImportant: ['内存', '存储', 'CPU', '屏幕', '电池', '摄像头', '重量'].includes(key)
      };
    });

    setAllSpecs(specsList);
    setImportantSpecs(specsList.filter(spec => spec.isImportant));
  }, [products]);

  // 处理排序
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 获取排序后的产品列表
  const getSortedProducts = () => {
    const sortableProducts = [...products];
    if (sortConfig.key === null) return sortableProducts;
    
    return sortableProducts.sort((a, b) => {
      // 处理价格排序
      if (sortConfig.key === 'price') {
        if (a.price < b.price) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a.price > b.price) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
      
      // 处理规格排序
      if (a.specs && b.specs) {
        const aValue = a.specs[sortConfig.key];
        const bValue = b.specs[sortConfig.key];
        
        // 检查是否为数字值
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'ascending' 
            ? aNum - bNum 
            : bNum - aNum;
        }
        
        // 字符串比较
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
  };

  // 获取单元格样式类
  const getCellClass = (key, value, index) => {
    if (!value) return 'no-value';
    
    const spec = allSpecs.find(s => s.name === key);
    if (!spec || !spec.isNumeric) return '';
    
    // 对于数字规格，查找最大/最小值以突出显示
    const allValues = products
      .map(p => p.specs && p.specs[key] ? parseFloat(p.specs[key]) : null)
      .filter(v => v !== null);
    
    if (allValues.length <= 1) return '';
    
    const currentValue = parseFloat(value);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    
    // 对于不同的规格类型，最大或最小值可能是更好的
    const betterIsHigher = !['重量', '厚度'].includes(key);
    
    if (betterIsHigher && currentValue === maxValue) return 'best-value';
    if (!betterIsHigher && currentValue === minValue) return 'best-value';
    
    return '';
  };

  // 渲染规格值
  const renderSpecValue = (product, specName) => {
    if (!product.specs || !product.specs[specName]) {
      return <span className="no-value">-</span>;
    }
    
    const value = product.specs[specName];
    
    // 布尔值的特殊渲染
    if (value === true) return <FontAwesomeIcon icon={faCheck} className="check-icon" />;
    if (value === false) return <FontAwesomeIcon icon={faTimes} className="times-icon" />;
    
    return value;
  };

  // 确定要显示的规格列表
  const specsToShow = showAllSpecs ? allSpecs : importantSpecs;
  const sortedProducts = getSortedProducts();

  return (
    <div className="product-comparison-table-container">
      <div className="comparison-controls">
        <button 
          className={`spec-toggle ${showAllSpecs ? 'active' : ''}`}
          onClick={() => setShowAllSpecs(!showAllSpecs)}
        >
          {showAllSpecs ? '只显示重要参数' : '显示所有参数'}
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="product-comparison-table">
          <thead>
            <tr>
              <th className="spec-header">规格参数</th>
              {sortedProducts.map((product, index) => (
                <th key={product.id} className="product-header">
                  <div className="product-header-content">
                    <img 
                      src={product.image || '/placeholder-image.jpg'} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                    <div className="product-name">{product.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 价格行 */}
            <tr className="price-row">
              <td 
                className="spec-name sortable"
                onClick={() => requestSort('price')}
              >
                价格
                <span className="sort-icon">
                  {sortConfig.key === 'price' ? (
                    sortConfig.direction === 'ascending' ? 
                    <FontAwesomeIcon icon={faSortUp} /> : 
                    <FontAwesomeIcon icon={faSortDown} />
                  ) : (
                    <FontAwesomeIcon icon={faSort} />
                  )}
                </span>
              </td>
              {sortedProducts.map((product) => (
                <td key={`${product.id}-price`} className="price-cell">
                  ¥{product.price.toLocaleString()}
                </td>
              ))}
            </tr>
            
            {/* 规格行 */}
            {specsToShow.map((spec) => (
              <tr key={spec.name}>
                <td 
                  className="spec-name sortable"
                  onClick={() => requestSort(spec.name)}
                >
                  {spec.name}
                  {spec.isImportant && (
                    <FontAwesomeIcon icon={faInfoCircle} className="important-icon" title="重要参数" />
                  )}
                  <span className="sort-icon">
                    {sortConfig.key === spec.name ? (
                      sortConfig.direction === 'ascending' ? 
                      <FontAwesomeIcon icon={faSortUp} /> : 
                      <FontAwesomeIcon icon={faSortDown} />
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </span>
                </td>
                {sortedProducts.map((product, index) => (
                  <td 
                    key={`${product.id}-${spec.name}`}
                    className={`spec-value ${getCellClass(spec.name, product.specs && product.specs[spec.name], index)}`}
                  >
                    {renderSpecValue(product, spec.name)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="comparison-footer">
        <div className="legend">
          <span className="best-value-indicator"></span> 最佳值
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonTable; 