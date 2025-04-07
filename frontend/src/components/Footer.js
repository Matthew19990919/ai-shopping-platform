import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      {/* 底部帮助区域 */}
      <div className="footer-help">
        <div className="help-container">
          <div className="help-item">
            <h4>购物指南</h4>
            <ul>
              <li><a href="#">购物流程</a></li>
              <li><a href="#">会员介绍</a></li>
              <li><a href="#">常见问题</a></li>
            </ul>
          </div>
          <div className="help-item">
            <h4>配送方式</h4>
            <ul>
              <li><a href="#">上门自提</a></li>
              <li><a href="#">211限时达</a></li>
              <li><a href="#">配送服务查询</a></li>
            </ul>
          </div>
          <div className="help-item">
            <h4>支付方式</h4>
            <ul>
              <li><a href="#">货到付款</a></li>
              <li><a href="#">在线支付</a></li>
              <li><a href="#">分期付款</a></li>
            </ul>
          </div>
          <div className="help-item">
            <h4>售后服务</h4>
            <ul>
              <li><a href="#">售后政策</a></li>
              <li><a href="#">退款说明</a></li>
              <li><a href="#">返修/退换货</a></li>
            </ul>
          </div>
          <div className="help-item">
            <h4>特色服务</h4>
            <ul>
              <li><a href="#">AI智能导购</a></li>
              <li><a href="#">会员尊享</a></li>
              <li><a href="#">企业采购</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 版权区域 */}
      <div className="copyright-section">
        <p>©2025 AI购物商城 版权所有 | 隐私政策 | 使用条款</p>
      </div>
    </footer>
  );
};

export default Footer; 