// 商品数据 - 使用本地图片
// 动态确定图片路径前缀（首页和商品页路径不同，避免与main.js重复声明）
// 兼容 Windows 本地文件路径和服务器路径
const productCurrentPath = window.location.pathname.toLowerCase();
const productIsInHtmlFolder = productCurrentPath.includes('/html/') || productCurrentPath.includes('\\html\\') || productCurrentPath.includes('/html\\') || productCurrentPath.includes('\\html/');
const imgBasePath = productIsInHtmlFolder ? '../images/' : 'images/';

const products = [
    {
        id: 1,
        name: '薯片大礼包',
        description: '精选多种口味薯片，满足不同口味需求',
        price: 29.9,
        category: 'chips',
        image: imgBasePath + 'product-chips.png'
    },
    {
        id: 2,
        name: '巧克力夹心饼干',
        description: '香浓巧克力夹心，外层酥脆可口',
        price: 18.5,
        category: 'biscuit',
        image: imgBasePath + 'product-biscuits.png'
    },
    {
        id: 3,
        name: '果汁软糖',
        description: '100%果汁制作，口感Q弹，果味浓郁',
        price: 15.8,
        category: 'candy',
        image: imgBasePath + 'product-candy.png'
    },
    {
        id: 4,
        name: '气泡饮料组合',
        description: '多种口味气泡饮料，清爽解渴',
        price: 32.0,
        category: 'drinks',
        image: imgBasePath + 'product-drink.png'
    },
    {
        id: 5,
        name: '海苔脆片',
        description: '薄脆海苔，低卡健康零食',
        price: 12.9,
        category: 'chips',
        image: imgBasePath + 'product-seaweed.png'
    },
    {
        id: 6,
        name: '牛奶巧克力',
        description: '进口可可制作，口感丝滑细腻',
        price: 24.9,
        category: 'candy',
        image: imgBasePath + 'product-milkchocolate.png'
    },
    {
        id: 7,
        name: '曲奇饼干礼盒',
        description: '多种口味曲奇，精美礼盒包装',
        price: 45.0,
        category: 'biscuit',
        image: imgBasePath + 'product-cookies.png'
    },
    {
        id: 8,
        name: '坚果能量棒',
        description: '多种坚果混合，补充能量',
        price: 8.5,
        category: 'candy',
        image: imgBasePath + 'product-nuts.png'
    }
];

// 显示首页推荐商品
function displayFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // 显示前6个商品作为推荐
    const featuredProducts = products.slice(0, 6);
    
    let html = '';
    featuredProducts.forEach(product => {
        html += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/250x200/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name)}';">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price">¥${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn view-detail" data-id="${product.id}">查看详情</button>
                        <button class="btn add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">加入购物车</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = html;
    
    // 添加商品卡片事件监听
    initProductCardEvents();
}

// 显示所有商品（商品页面）
function displayAllProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // 获取分类筛选
    const selectedCategory = localStorage.getItem('selectedCategory');
    let filteredProducts = [...products];
    
    // 按分类筛选
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    
    // 获取搜索词
    const searchTerm = localStorage.getItem('searchTerm');
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setTimeout(() => {
            localStorage.removeItem('searchTerm');
        }, 100);
    }
    
    filteredProducts.sort((a, b) => a.id - b.id);
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div class="no-products-icon" style="font-size: 4rem; color: #ddd; margin-bottom: 20px;">
                    <i class="fas fa-search"></i>
                </div>
                <h3 style="margin-bottom: 10px; color: #666;">${searchTerm ? `没有找到"${searchTerm}"相关商品` : '没有找到相关商品'}</h3>
                <p style="color: #888; margin-bottom: 25px;">试试其他关键词或浏览其他分类</p>
                <button class="btn" onclick="localStorage.removeItem('searchTerm'); displayAllProducts();">
                    显示所有商品
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    if (searchTerm) {
        html += `
            <div class="search-results-info" style="grid-column: 1 / -1; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">搜索"${searchTerm}"找到 ${filteredProducts.length} 个结果</h3>
                <button class="btn btn-small" onclick="localStorage.removeItem('searchTerm'); displayAllProducts();" style="background: #ff6b6b; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-times"></i> 清除搜索
                </button>
            </div>
        `;
    }
    
    // 生成商品卡片
    filteredProducts.forEach(product => {
        html += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/250x200/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name)}';">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price">¥${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn view-detail" data-id="${product.id}">查看详情</button>
                        <button class="btn add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">加入购物车</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    productsContainer.innerHTML = html;
    
    // 添加商品卡片事件监听
    initProductCardEvents();
}

// 初始化商品卡片事件
function initProductCardEvents() {
    // 查看详情按钮
    const viewDetailButtons = document.querySelectorAll('.view-detail');
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            // 跳转到详情页
            alert('商品详情功能正在开发中...');
        });
    });
    
    // 加入购物车按钮
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // 添加到购物车
            if (typeof addToCart === 'function') {
                addToCart(id, name, price, image);
            }
        });
    });
}

// 获取分类名称（用于商品详情页）
function getCategoryName(category) {
    const categoryMap = {
        'chips': '膨化食品',
        'candy': '糖果巧克力',
        'drinks': '饮料冲饮',
        'biscuit': '饼干糕点'
    };
    
    return categoryMap[category] || '其他';
}
