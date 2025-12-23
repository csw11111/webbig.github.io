// 购物车页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 显示购物车内容
    displayCartItems();
    
    // 初始化购物车事件
    initCartEvents();
});

// 显示购物车内容
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    // 从本地存储获取购物车数据
    const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
    
    if (cart.length === 0) {
        // 购物车为空
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    // 购物车有商品
    if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    
    // 生成购物车商品HTML
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=${encodeURIComponent(item.name)}';">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">单价: ¥${item.price.toFixed(2)}</div>
                    <div class="cart-item-total">小计: ¥${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    
    // 更新购物车总计
    updateCartSummary(subtotal);
}

// 更新购物车总计
function updateCartSummary(subtotal) {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `¥${subtotal.toFixed(2)}`;
    }
    
    if (totalElement) {
        // 假设运费为0，实际应用中可以根据情况计算
        const shipping = 0;
        const total = subtotal + shipping;
        totalElement.textContent = `¥${total.toFixed(2)}`;
    }
}

// 初始化购物车事件
function initCartEvents() {
    // 数量减少按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('minus') || e.target.parentElement.classList.contains('minus')) {
            const button = e.target.classList.contains('minus') ? e.target : e.target.parentElement;
            const productId = button.getAttribute('data-id');
            
            // 获取当前数量
            const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            if (quantityInput) {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                    updateCartItemQuantity(productId, quantity - 1);
                }
            }
        }
    });
    
    // 数量增加按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('plus') || e.target.parentElement.classList.contains('plus')) {
            const button = e.target.classList.contains('plus') ? e.target : e.target.parentElement;
            const productId = button.getAttribute('data-id');
            
            // 获取当前数量
            const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            if (quantityInput) {
                let quantity = parseInt(quantityInput.value);
                if (quantity < 10) {
                    quantityInput.value = quantity + 1;
                    updateCartItemQuantity(productId, quantity + 1);
                }
            }
        }
    });
    
    // 数量输入框变化
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.getAttribute('data-id');
            const quantity = parseInt(e.target.value);
            
            if (quantity >= 1 && quantity <= 10) {
                updateCartItemQuantity(productId, quantity);
            } else {
                // 恢复原来的值
                const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
                const item = cart.find(item => item.id === parseInt(productId));
                if (item) {
                    e.target.value = item.quantity;
                }
            }
        }
    });
    
    // 删除商品按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || 
            e.target.parentElement.classList.contains('remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.parentElement;
            const productId = button.getAttribute('data-id');
            
            if (confirm('确定要从购物车中删除此商品吗？')) {
                removeFromCart(productId);
            }
        }
    });
    
    // 清空购物车按钮
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('确定要清空购物车吗？')) {
                localStorage.removeItem('snackCart');
                updateCartCount();
                displayCartItems();
                showMessage('购物车已清空', 'success');
            }
        });
    }
    
    // 结算按钮
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('snackCart')) || [];
            if (cart.length === 0) {
                alert('购物车为空，无法结算');
                return;
            }
            
            // 检查用户是否登录
            const user = JSON.parse(localStorage.getItem('snackUser'));
            if (!user) {
                alert('请先登录后再结算');
                window.location.href = 'login.html';
                return;
            }
            
            // 跳转到结算页面
            window.location.href = 'checkout.html';
        });
    }
    
    // 继续购物按钮
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
}