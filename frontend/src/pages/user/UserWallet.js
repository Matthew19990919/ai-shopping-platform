import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWallet, 
  faMoneyBillWave, 
  faExchangeAlt, 
  faCreditCard,
  faCalendarAlt,
  faPlus,
  faMinus,
  faAngleLeft,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import { getUserWallet, getWalletTransactions } from '../../services/userService';
import './user-wallet.css';

const UserWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 加载钱包数据
  const loadWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const walletData = await getUserWallet();
      setWallet(walletData);
      
      const txResult = await getWalletTransactions(currentPage);
      setTransactions(txResult.transactions);
      setTotalPages(txResult.pagination.totalPages);
    } catch (err) {
      setError('获取钱包信息失败，请稍后再试');
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadWallet();
  }, [currentPage]);

  // 处理页面变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 格式化金额
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 获取交易类型的对应图标和样式
  const getTransactionTypeDetails = (type) => {
    switch (type) {
      case 'recharge':
        return { 
          icon: faPlus, 
          text: '充值', 
          class: 'income'
        };
      case 'withdraw':
        return { 
          icon: faMinus, 
          text: '提现', 
          class: 'expense'
        };
      case 'payment':
        return { 
          icon: faMinus, 
          text: '支付', 
          class: 'expense'
        };
      case 'refund':
        return { 
          icon: faPlus, 
          text: '退款', 
          class: 'income'
        };
      case 'reward':
        return { 
          icon: faPlus, 
          text: '奖励', 
          class: 'income'
        };
      default:
        return { 
          icon: faExchangeAlt, 
          text: '其他', 
          class: ''
        };
    }
  };

  return (
    <div className="user-wallet-container">
      <div className="section-header">
        <h2>我的钱包</h2>
      </div>

      {/* 显示错误信息 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {loading && !wallet ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载钱包信息中...</p>
        </div>
      ) : (
        <>
          {/* 钱包卡片 */}
          {wallet && (
            <div className="wallet-card">
              <div className="wallet-header">
                <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
                <h3>我的余额</h3>
              </div>
              
              <div className="wallet-balance">
                <span className="balance-label">¥</span>
                <span className="balance-amount">{formatAmount(wallet.balance)}</span>
              </div>
              
              <div className="wallet-actions">
                <button className="wallet-action-btn recharge">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  充值
                </button>
                <button className="wallet-action-btn withdraw">
                  <FontAwesomeIcon icon={faCreditCard} />
                  提现
                </button>
              </div>
            </div>
          )}

          {/* 交易记录 */}
          <div className="transactions-section">
            <h3 className="section-title">
              <FontAwesomeIcon icon={faExchangeAlt} />
              交易记录
            </h3>
            
            {loading ? (
              <div className="loading-spinner small">
                <div className="spinner"></div>
                <p>加载交易记录中...</p>
              </div>
            ) : (
              <>
                {transactions.length === 0 ? (
                  <div className="empty-transactions">
                    <p>暂无交易记录</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {transactions.map(transaction => {
                      const typeDetails = getTransactionTypeDetails(transaction.type);
                      return (
                        <div className="transaction-item" key={transaction.id}>
                          <div className="transaction-icon-wrapper">
                            <FontAwesomeIcon 
                              icon={typeDetails.icon} 
                              className={`transaction-icon ${typeDetails.class}`} 
                            />
                          </div>
                          
                          <div className="transaction-info">
                            <div className="transaction-title">
                              <span className="transaction-name">{transaction.description || typeDetails.text}</span>
                              <span className={`transaction-amount ${typeDetails.class}`}>
                                {typeDetails.class === 'income' ? '+' : '-'}
                                ¥{formatAmount(Math.abs(transaction.amount))}
                              </span>
                            </div>
                            
                            <div className="transaction-details">
                              <span className="transaction-time">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                {formatDate(transaction.date)}
                              </span>
                              <span className="transaction-status">
                                {transaction.status === 'completed' ? '交易成功' : 
                                 transaction.status === 'pending' ? '处理中' : 
                                 transaction.status === 'failed' ? '交易失败' : 
                                 transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="page-button prev"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                      上一页
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`page-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="page-button next"
                    >
                      下一页
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserWallet; 