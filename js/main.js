// 主 JavaScript文件 - 控制网站通用功能

// 动态确定页面路径前缀（首页和子页面路径不同）
// 兼容 Windows 本地文件路径和服务器路径
const currentPath = window.location.pathname.toLowerCase();
const isInHtmlFolder = currentPath.includes('/html/') || currentPath.includes('\\html\\') || currentPath.includes('/html\\') || currentPath.includes('\\html/');
const pageBasePath = isInHtmlFolder ? '' : 'html/';
const indexPath = isInHtmlFolder ? '../index.html' : 'index.html';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('零食小铺网站已加载');
    
    // 初始化购物车数量
    updateCartCount();
    
    // 初始化轮播图（如果页面有轮播图）
    initCarousel();
    
    // 初始化移动端菜单切换
    initMobileMenu();
    
    // 初始化搜索功能
    initSearch();
    
    // 检查用户登录状态
    checkLoginStatus();
    
    // 初始化商品卡片交互
    initProductCards();
    
    // 添加回到顶部按钮
    addBackToTopButton();
});

// 更新购物车数量显示
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // 从本地存储获取购物车数据
        const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
        let totalCount = 0;
        
        // 计算购物车中所有商品数量
        cart.forEach(item => {
            totalCount += item.quantity || 0;
        });
        
        cartCountElement.textContent = totalCount;
    }
}

// 轮播图功能
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 切换到指定幻灯片
    function goToSlide(n) {
        // 隐藏当前幻灯片
        slides[currentSlide].classList.remove('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.remove('active');
        }
        
        // 更新当前幻灯片索引
        currentSlide = (n + totalSlides) % totalSlides;
        
        // 显示新幻灯片
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    // 下一张幻灯片
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 设置自动轮播
    let slideInterval = setInterval(nextSlide, 5000);
    
    // 鼠标悬停时暂停轮播
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // 鼠标离开时恢复轮播
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // 添加按钮点击事件
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // 添加指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

// 移动端菜单切换
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // 切换图标
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // 点击菜单项后关闭移动菜单
        const menuItems = navMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // 搜索按钮点击事件
        searchBtn.addEventListener('click', performSearch);
        
        // 输入框回车事件
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // 存储搜索词到本地存储，用于在商品页面显示
            localStorage.setItem('searchTerm', searchTerm);
            // 跳转到商品页面
            window.location.href = pageBasePath + 'products.html';
        } else {
            alert('请输入搜索关键词');
            searchInput.focus();
        }
    }
}

// 检查用户登录状态
function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const user = JSON.parse(localStorage.getItem('snackUser'));
    
    if (loginLink) {
        if (user) {
            // 用户已登录，显示用户名和退出选项
            loginLink.innerHTML = `<i class="fas fa-user"></i> ${user.name} <i class="fas fa-sign-out-alt"></i>`;
            // 根据当前页面位置设置正确的个人中心链接
            if (isInHtmlFolder) {
                loginLink.href = 'profile.html';
            } else {
                loginLink.href = 'html/profile.html';
            }
            
            // 添加退出功能
            loginLink.addEventListener('click', function(e) {
                if (e.target.classList.contains('fa-sign-out-alt') || 
                    e.target.parentElement.classList.contains('fa-sign-out-alt')) {
                    e.preventDefault();
                    localStorage.removeItem('snackUser');
                    window.location.href = indexPath;
                }
            });
        }
        // 用户未登录时，不修改链接，保持HTML中的原始设置
    }
}

// 商品卡片交互
function initProductCards() {
    // 分类卡片点击事件
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            localStorage.setItem('selectedCategory', category);
            window.location.href = pageBasePath + 'products.html';
        });
    });
}

// 显示消息通知
function showMessage(message, type = 'success') {
    // 移除旧的消息
    const oldMessage = document.querySelector('.message');
    if (oldMessage) oldMessage.remove();
    
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
        <span>${message}</span>
        <button class="message-close"><i class="fas fa-times"></i></button>
    `;
    
    // 添加样式
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
    `;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 添加关闭功能
    const closeBtn = messageEl.querySelector('.message-close');
    closeBtn.addEventListener('click', () => {
        messageEl.remove();
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 3000);
}

// 添加到购物车
function addToCart(productId, productName, productPrice, productImage) {
    // 获取当前购物车
    let cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    
    // 转换为数字ID
    const id = parseInt(productId);
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
        // 如果已存在，增加数量
        cart[existingItemIndex].quantity += 1;
    } else {
        // 如果不存在，添加新商品
        cart.push({
            id: id,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
        });
    }
    
    // 保存回本地存储
    localStorage.setItem('snackCart', JSON.stringify(cart));
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 显示成功消息
    showMessage(`已添加 "${productName}" 到购物车`, 'success');
    
    return cart;
}

// 从购物车移除商品
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    const id = parseInt(productId);
    
    // 过滤掉要删除的商品
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('snackCart', JSON.stringify(cart));
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 显示成功消息
    showMessage('已从购物车移除商品', 'success');
    
    // 如果当前在购物车页面，刷新页面
    if (window.location.pathname.includes('cart.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// 更新购物车商品数量
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    let cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    const id = parseInt(productId);
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('snackCart', JSON.stringify(cart));
        
        // 更新购物车数量显示
        updateCartCount();
        
        // 如果当前在购物车页面，刷新页面
        if (window.location.pathname.includes('cart.html')) {
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }
}

// 计算购物车总价
function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    let total = 0;
    
    cart.forEach(item => {
        total += (item.price || 0) * (item.quantity || 0);
    });
    
    return total.toFixed(2);
}

// 获取购物车数据
function getCartData() {
    return JSON.parse(localStorage.getItem('snackCart')) || [];
}

// 清空购物车
function clearCart() {
    localStorage.removeItem('snackCart');
    updateCartCount();
    showMessage('购物车已清空', 'success');
    
    if (window.location.pathname.includes('cart.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// 检查购物车是否为空
function isCartEmpty() {
    const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    return cart.length === 0;
}

// 获取商品总数
function getTotalCartItems() {
    const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    let total = 0;
    cart.forEach(item => {
        total += item.quantity || 0;
    });
    return total;
}

// 页面加载动画
function showLoading() {
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loading';
    loadingEl.innerHTML = `
        <div class="spinner"></div>
        <p>加载中...</p>
    `;
    loadingEl.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    `;
    document.body.appendChild(loadingEl);
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.remove();
    }
}

// 页面滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加回到顶部按钮
function addBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(button);
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });
    
    // 点击回到顶部
    button.addEventListener('click', scrollToTop);
}

// 防抖函数，用于优化性能
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数，用于优化性能
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 验证邮箱格式
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// 验证手机号格式
function isValidPhone(phone) {
    const re = /^1[3-9]\d{9}$/;
    return re.test(String(phone));
}

// 格式化价格
function formatPrice(price) {
    return '¥' + parseFloat(price).toFixed(2);
}

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}