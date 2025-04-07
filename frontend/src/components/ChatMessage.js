// 处理产品选择，自动触发价格分析
const handleProductSelect = (product) => {
  setSelectedProduct(product);
  
  // 生成该产品的价格历史数据，传递产品名称以获取更精确的数据
  const priceHistoryData = mockData.generatePriceHistoryData(product.price, product.id, product.name);
  setPriceData(priceHistoryData);
  
  // 自动显示价格分析图表
  setShouldShowPriceAnalysis(true);
  
  // 记录到控制台，用于调试
  console.log(`已选择产品: ${product.name}, 显示价格分析图表`);
}; 