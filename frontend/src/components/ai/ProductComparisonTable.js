import React from 'react';
import './ChatMessage.css';

/**
 * 产品比较表格组件
 * @param {Object} props
 * @param {Array} props.products 要比较的产品数组
 */
const ProductComparisonTable = ({ products }) => {
  if (!products || products.length < 2) {
    return null;
  }

  // 最多比较两个产品，如果超过两个取前两个
  const productsToCompare = products.slice(0, 2);
  
  // 定义要比较的属性
  const comparisonAttributes = [
    { key: 'brand', label: '品牌' },
    { key: 'price', label: '价格', format: value => `¥${value}` },
    { key: 'rating', label: '评分', format: value => `${value}分` },
    { key: 'description', label: '特点' },
  ];
  
  return (
    <div className="product-comparison-container">
      <h3 className="comparison-title">产品对比</h3>
      
      <div className="comparison-products">
        {productsToCompare.map((product, index) => (
          <div key={index} className="comparison-product">
            <div className="comparison-product-image">
              <img 
                src={product.imageUrl || '/images/placeholder-product.png'} 
                alt={product.name}
              />
            </div>
            <h4 className="comparison-product-name">{product.name}</h4>
          </div>
        ))}
      </div>
      
      <table className="comparison-table">
        <tbody>
          {comparisonAttributes.map((attr, index) => (
            <tr key={index}>
              <td className="comparison-attribute">{attr.label}</td>
              {productsToCompare.map((product, productIndex) => {
                const value = product[attr.key];
                const formattedValue = attr.format ? attr.format(value) : value;
                
                return (
                  <td 
                    key={productIndex} 
                    className="comparison-value"
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="comparison-conclusion">
        {getComparisonConclusion(productsToCompare)}
      </div>
    </div>
  );
};

/**
 * 生成产品比较结论
 * @param {Array} products 要比较的产品
 * @returns {string} 比较结论
 */
const getComparisonConclusion = (products) => {
  if (products.length < 2) return '';
  
  const [product1, product2] = products;
  
  // 价格比较
  const priceDiff = product1.price - product2.price;
  const priceDiffPercentage = Math.abs(priceDiff) / Math.min(product1.price, product2.price) * 100;
  const hasPriceAdvantage = priceDiffPercentage > 10; // 价格差异超过10%视为显著
  
  // 评分比较
  const ratingDiff = product1.rating - product2.rating;
  const hasRatingAdvantage = Math.abs(ratingDiff) >= 0.3; // 评分差异0.3分以上视为显著
  
  // 综合分析
  let conclusion = '';
  
  if (hasPriceAdvantage) {
    const cheaperProduct = priceDiff > 0 ? product2.name : product1.name;
    const expensiveProduct = priceDiff > 0 ? product1.name : product2.name;
    conclusion += `${cheaperProduct}的价格比${expensiveProduct}便宜约${Math.round(priceDiffPercentage)}%。`;
  } else {
    conclusion += `这两款产品的价格相近，差异不大。`;
  }
  
  if (hasRatingAdvantage) {
    const betterProduct = ratingDiff > 0 ? product1.name : product2.name;
    const worseProduct = ratingDiff > 0 ? product2.name : product1.name;
    conclusion += ` ${betterProduct}的用户评分高于${worseProduct}。`;
  } else {
    conclusion += ` 两款产品的用户评价相近。`;
  }
  
  // 综合建议
  conclusion += ` 如果您更注重价格，`;
  conclusion += priceDiff > 0 ? `${product2.name}是更好的选择。` : `${product1.name}是更好的选择。`;
  conclusion += ` 如果您更注重用户评价，`;
  conclusion += ratingDiff > 0 ? `${product1.name}会更符合您的要求。` : `${product2.name}会更符合您的要求。`;
  
  return conclusion;
};

export default ProductComparisonTable; 