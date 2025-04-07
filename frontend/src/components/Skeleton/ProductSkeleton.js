import React from 'react';
import { Skeleton as AntSkeleton } from 'antd';
import './Skeleton.css';

/**
 * 商品卡片骨架屏组件
 * 在商品数据加载时显示
 * 
 * @param {Object} props
 * @param {boolean} props.loading - 是否正在加载
 * @param {React.ReactNode} props.children - 子元素，加载完成后显示
 * @param {number} props.rows - 描述文本行数
 */
const ProductSkeleton = ({ loading = true, children, rows = 3 }) => {
  if (!loading) return children;

  return (
    <div className="product-skeleton">
      <div className="product-skeleton-image">
        <AntSkeleton.Image active className="skeleton-image" />
      </div>
      <div className="product-skeleton-content">
        <AntSkeleton active paragraph={{ rows }} title={true} />
      </div>
      <div className="product-skeleton-price">
        <AntSkeleton.Button active size="small" shape="round" className="skeleton-price" />
      </div>
    </div>
  );
};

/**
 * 商品列表骨架屏组件
 * 在商品列表数据加载时显示
 * 
 * @param {Object} props
 * @param {boolean} props.loading - 是否正在加载
 * @param {React.ReactNode} props.children - 子元素，加载完成后显示
 * @param {number} props.count - 显示多少个骨架卡片
 * @param {string} props.layout - 布局方式: 'grid' 或 'list'
 */
export const ProductListSkeleton = ({ loading = true, children, count = 8, layout = 'grid' }) => {
  if (!loading) return children;

  return (
    <div className={`product-list-skeleton ${layout}-layout`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ProductSkeleton key={index} loading={true} />
        ))}
    </div>
  );
};

export default ProductSkeleton; 