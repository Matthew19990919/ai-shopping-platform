import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AiAssistant from './pages/AiAssistant';
import AiShopping from './pages/AiShopping';
import AiShoppingModern from './pages/AiShoppingModern'; // 导入现代化的聊天界面页面
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import Promotions from './pages/Promotions';
import PromotionDetail from './pages/PromotionDetail';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import ProductList from './pages/ProductList';
import DataAnalytics from './pages/DataAnalytics';
import EcosystemDashboard from './pages/EcosystemDashboard';
import PriceComparison from './pages/PriceComparison';
import { useAuth } from './contexts/AuthContext';
import NotFound from './pages/NotFound';
import CouponPopup from './components/CouponPopup';
import { UserProvider } from './contexts/UserContext';
import AfterSales from './pages/AfterSales';

// 管理员路由保护组件
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // 检查用户是否是管理员
  const isAdmin = isAuthenticated && user && user.role === 'admin';
  
  // 如果不是管理员，重定向到首页
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    document.title = 'AI购物商城 - 智能导购体验';
  }, []);

  return (
    <UserProvider>
      <CouponPopup />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/ai-shopping" element={<AiShoppingModern />} /> {/* 使用现代化界面替换原来的 */}
        <Route path="/ai-shopping-classic" element={<AiShopping />} /> {/* 保留原来的界面为备用 */}
        <Route path="/price-comparison" element={<PriceComparison />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/search" element={<Search />} />
        <Route path="/user/*" element={<UserProfile />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotion/:id" element={<PromotionDetail />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/analytics" element={<DataAnalytics />} />
        
        {/* 管理员路由 */}
        <Route 
          path="/admin/ecosystem" 
          element={
            <AdminRoute>
              <EcosystemDashboard />
            </AdminRoute>
          } 
        />
        
        {/* 社区相关路由 */}
        <Route path="/community" element={<Community />} />
        <Route path="/community/post/:postId" element={<PostDetail />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/community/category/:category" element={<Community />} />
        <Route path="/community/tag/:tag" element={<Community />} />
        
        {/* 售后服务路由 */}
        <Route path="/after-sales" element={<AfterSales />} />
        
        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;