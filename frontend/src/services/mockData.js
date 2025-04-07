// 模拟商品数据服务

// 模拟获取产品数据
export const getProductsMock = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    // 手机类
    {
      id: "101",
      name: "华为 Mate 60 Pro",
      price: "6999.00",
      oldPrice: "7299.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/238537/5/5897/112050/65376650F611dae84/bc79cb580fec3aeb.jpg",
      category: "手机",
      description: "华为麒麟芯片，OLED曲面屏，5G，鸿蒙系统，50MP超感知摄像头，66W超级快充",
      sales: 4589,
      rating: 4.9,
      stock: 1800
    },
    {
      id: "102",
      name: "Apple iPhone 15 Pro",
      price: "8999.00",
      oldPrice: "9999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/130720/28/34302/62670/63f8a49fFfb517b53/a6d4d8c339b1c442.jpg",
      category: "手机",
      description: "A17 Pro芯片，Pro级相机系统，120Hz高刷新率，四重抛光钛金属，Dynamic Island灵动岛，iOS系统",
      sales: 5689,
      rating: 4.8,
      stock: 2300
    },
    {
      id: "103",
      name: "小米14",
      price: "4299.00",
      oldPrice: "4999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/164816/29/37972/66337/6544c59dFacfd8139/77ec2b32eb84794f.jpg",
      category: "手机",
      description: "骁龙8 Gen 3，徕卡光学影像系统，MIUI 15系统，2K AMOLED屏幕，120W快充，无线充电",
      sales: 3256,
      rating: 4.7,
      stock: 1600
    },
    {
      id: "104",
      name: "vivo X100 Pro",
      price: "5999.00",
      oldPrice: "6499.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/109112/34/40646/37870/654c8c0dFd06bfa7a/54dd3e1bd9dcd6ce.jpg",
      category: "手机",
      description: "天玑9300处理器，2K AMOLED曲面屏，蔡司影像系统，5000mAh大电池，100W闪充，IP68防水",
      sales: 2789,
      rating: 4.6,
      stock: 1500
    },
    {
      id: "105",
      name: "OPPO Find X7",
      price: "5999.00",
      oldPrice: "6999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/175347/32/38680/52463/65a4ffeaFe570de04/c7ef8e05a3ccf19f.jpg",
      category: "手机",
      description: "哈苏影像，2K 120Hz曲面屏，5000mAh电池容量，80W超级闪充，ColorOS系统，骁龙8 Gen 3",
      sales: 2456,
      rating: 4.7,
      stock: 1200
    },
    
    // 电脑类
    {
      id: "201",
      name: "联想小新Pro16 2023",
      price: "5499.00",
      oldPrice: "5999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/174616/17/38366/54373/65a3b65bF56b4be8a/b2fd2e9120bdf75c.jpg",
      category: "电脑",
      description: "16英寸2.5K 120Hz高刷，AMD R7-7840HS，16GB内存，512GB SSD，RTX 4050显卡，Windows 11",
      sales: 1895,
      rating: 4.5,
      stock: 980
    },
    {
      id: "202",
      name: "Apple MacBook Pro 14",
      price: "12999.00",
      oldPrice: "13999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/199225/34/31846/31177/6370754aE2341be76/af4a1c9ec3168da3.jpg",
      category: "电脑",
      description: "M3 Pro芯片，14英寸Liquid视网膜XDR显示屏，16GB内存，512GB SSD，macOS系统",
      sales: 2156,
      rating: 4.9,
      stock: 780
    },
    {
      id: "203",
      name: "华为MateBook X Pro",
      price: "9999.00",
      oldPrice: "10999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/171363/21/39508/111452/65a67a53F5ad5a4fd/f1d1c3c0c4fd8e45.jpg",
      category: "电脑",
      description: "13.9英寸3:2超感屏，英特尔酷睿i7，16GB内存，1TB SSD，超薄金属机身，鸿蒙系统多设备协同",
      sales: 1562,
      rating: 4.7,
      stock: 650
    },
    {
      id: "204",
      name: "戴尔XPS 15",
      price: "10999.00",
      oldPrice: "11999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/113693/20/41099/115493/65e2f8a0Faba50d32/1602c477c4a12ae6.jpg",
      category: "电脑",
      description: "15.6英寸4K OLED触控屏，英特尔i9处理器，32GB内存，1TB SSD，RTX 4060显卡，Windows 11",
      sales: 985,
      rating: 4.6,
      stock: 420
    },
    
    // 家电类
    {
      id: "301",
      name: "小米电视 大师 77英寸OLED",
      price: "14999.00",
      oldPrice: "15999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/206711/17/5940/184944/615eaf9eE2d411feb/1ad5cea702bc25e8.jpg",
      category: "家电",
      description: "4K HDR，OLED屏，杜比视界，杜比全景声，120Hz刷新率，HDMI 2.1，内置小爱同学",
      sales: 789,
      rating: 4.7,
      stock: 350
    },
    {
      id: "302",
      name: "海尔冰箱 531升对开门",
      price: "3999.00",
      oldPrice: "4599.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/180410/20/32168/120559/63f84cc6F58a2b3dc/d50b7a70b2ebd79a.jpg",
      category: "家电",
      description: "风冷无霜，紫外线杀菌，变频节能，智能温控，双开门冰箱，深空银",
      sales: 1256,
      rating: 4.5,
      stock: 420
    },
    {
      id: "303",
      name: "美的洗碗机 13套",
      price: "2999.00",
      oldPrice: "3599.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/143500/37/23833/105802/61dc27d0E0a8c3357/edc56d9660f0e47b.jpg",
      category: "家电",
      description: "13套大容量，高温除菌，智能烘干，静音设计，一级能效，嵌入式",
      sales: 895,
      rating: 4.6,
      stock: 280
    },
    
    // 服装类
    {
      id: "401",
      name: "李宁运动外套 男款",
      price: "299.00",
      oldPrice: "399.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/221132/12/18884/94957/63097767Eeb8c41ec/cff33500a563cd4c.jpg",
      category: "服装",
      description: "运动卫衣，连帽设计，保暖舒适，时尚百搭，秋冬新款",
      sales: 2365,
      rating: 4.7,
      stock: 1500
    },
    {
      id: "402",
      name: "优衣库 女士羽绒服",
      price: "599.00",
      oldPrice: "699.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/191592/5/32414/70037/63b7f22aFcde044f9/6b9b3e2eb43a97e2.jpg",
      category: "服装",
      description: "轻薄羽绒，90%白鸭绒填充，防风保暖，多色可选，冬季必备",
      sales: 3562,
      rating: 4.8,
      stock: 2100
    },
    {
      id: "403",
      name: "NIKE 男士跑步鞋",
      price: "899.00",
      oldPrice: "999.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/183168/17/32420/83238/63f94acbFc6e69abb/df26e8cfc5dea3f3.jpg",
      category: "服装",
      description: "气垫缓震，轻盈透气，舒适贴合，时尚外观，运动必备",
      sales: 2985,
      rating: 4.6,
      stock: 1300
    },
    
    // 美妆类
    {
      id: "501",
      name: "兰蔻小黑瓶精华 50ml",
      price: "899.00",
      oldPrice: "1099.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/225909/30/15143/83444/6257a5fcE4cdb3ff6/1a3abafb7c3fba0b.jpg",
      category: "美妆",
      description: "肌底修护精华露，改善肤质，提亮肤色，淡化细纹，夜间修护",
      sales: 4562,
      rating: 4.8,
      stock: 2300
    },
    {
      id: "502",
      name: "雅诗兰黛 DW粉底液",
      price: "459.00",
      oldPrice: "550.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/190503/20/16056/88131/6102b7e4E3a5a6dcb/98c42a4ced6cc05e.jpg",
      category: "美妆",
      description: "30ml，持久不脱妆，遮瑕自然，多色号可选，油皮亲妈",
      sales: 5689,
      rating: 4.7,
      stock: 2800
    },
    {
      id: "503",
      name: "资生堂红腰子精华 75ml",
      price: "799.00",
      oldPrice: "980.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/213994/12/1249/63890/61693a40E38e31f21/f6d48f4d4bf4d0e4.jpg",
      category: "美妆",
      description: "红色蜜露精华，改善细纹，紧致肌肤，提升弹力，抗氧化",
      sales: 3256,
      rating: 4.9,
      stock: 1600
    },
    
    // 食品类
    {
      id: "601",
      name: "三只松鼠 坚果礼盒",
      price: "149.00",
      oldPrice: "199.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/148187/8/33137/193193/63dc70a9F17c1dac6/d7f0f0e0c55a8704.jpg",
      category: "食品",
      description: "混合坚果礼盒，多种口味，每日坚果，营养健康，送礼佳选",
      sales: 6523,
      rating: 4.7,
      stock: 3500
    },
    {
      id: "602",
      name: "良品铺子 零食大礼包",
      price: "99.00",
      oldPrice: "129.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/219956/35/18861/142404/62aab95aEfe965d39/41280cb05f10a3bc.jpg",
      category: "食品",
      description: "综合零食礼包，多种口味，休闲食品，糖果饼干，肉类小吃",
      sales: 8956,
      rating: 4.6,
      stock: 4200
    },
    {
      id: "603",
      name: "百草味 坚果炒货礼盒",
      price: "129.00",
      oldPrice: "159.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/62472/22/24999/104942/64092eb3F27dbe279/41e1a3bf0599e04e.jpg",
      category: "食品",
      description: "干果礼盒，多种坚果，健康零食，营养丰富，自然美味",
      sales: 7523,
      rating: 4.5,
      stock: 3800
    },
    
    // 礼品类
    {
      id: "701",
      name: "周大福 足金黄金手链",
      price: "2299.00",
      oldPrice: "2599.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/135789/21/22341/48191/62e23b26E03c75080/16cd9236e9d7fb62.jpg",
      category: "礼品",
      description: "足金手链，精致工艺，送礼佳品，时尚百搭，附带品牌证书",
      sales: 1256,
      rating: 4.9,
      stock: 560
    },
    {
      id: "702",
      name: "飞利浦 电动剃须刀",
      price: "899.00",
      oldPrice: "1099.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/2397/9/19638/74914/6312ca59E97563ebe/0f8e54577e8aec3f.jpg",
      category: "礼品",
      description: "智能电动剃须刀，干湿两用，全身水洗，智能感应，送男友父亲礼物",
      sales: 2856,
      rating: 4.7,
      stock: 1200
    },
    {
      id: "703",
      name: "蒂佳婷 面膜礼盒",
      price: "299.00",
      oldPrice: "399.00",
      image: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/199669/25/2254/169334/6110da76E57cd2fca/be13930ca55f911c.jpg",
      category: "礼品",
      description: "面膜套装，补水保湿，改善肤质，韩国进口，送妈妈女友礼物",
      sales: 3565,
      rating: 4.6,
      stock: 1800
    }
  ];
}; 