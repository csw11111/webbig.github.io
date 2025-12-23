// 登录页面功能
// 动态确定页面路径前缀（避免与main.js重复声明）
// 兼容 Windows 本地文件路径和服务器路径
const authCurrentPath = window.location.pathname.toLowerCase();
const authIsInHtmlFolder = authCurrentPath.includes('/html/') || authCurrentPath.includes('\\html\\') || authCurrentPath.includes('/html\\') || authCurrentPath.includes('\\html/');
const authIndexPath = authIsInHtmlFolder ? '../index.html' : 'index.html';

document.addEventListener('DOMContentLoaded', function() {
    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorElement = document.getElementById('login-error');
            
            // 简单验证
            if (!email || !password) {
                showError(errorElement, '请填写所有字段');
                return;
            }
            
            // 验证邮箱格式
            if (!isValidEmail(email)) {
                showError(errorElement, '请输入有效的邮箱地址');
                return;
            }
            
            // 模拟登录验证
            const users = JSON.parse(localStorage.getItem('snackUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // 登录成功
                localStorage.setItem('snackUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
                
                // 显示成功消息
                showMessage('登录成功！正在跳转...', 'success');
                
                // 跳转到首页
                setTimeout(() => {
                    window.location.href = authIndexPath;
                }, 1500);
            } else {
                showError(errorElement, '邮箱或密码错误');
            }
        });
    }
    
    // 注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const errorElement = document.getElementById('register-error');
            
            // 验证所有字段
            if (!name || !email || !password || !confirmPassword) {
                showError(errorElement, '请填写所有字段');
                return;
            }
            
            // 验证邮箱格式
            if (!isValidEmail(email)) {
                showError(errorElement, '请输入有效的邮箱地址');
                return;
            }
            
            // 验证密码长度
            if (password.length < 6) {
                showError(errorElement, '密码长度至少为6位');
                return;
            }
            
            // 验证密码匹配
            if (password !== confirmPassword) {
                showError(errorElement, '两次输入的密码不匹配');
                return;
            }
            
            // 检查邮箱是否已注册
            const users = JSON.parse(localStorage.getItem('snackUsers')) || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showError(errorElement, '该邮箱已被注册');
                return;
            }
            
            // 创建新用户
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                registerDate: new Date().toISOString()
            };
            
            // 保存用户
            users.push(newUser);
            localStorage.setItem('snackUsers', JSON.stringify(users));
            
            // 自动登录
            localStorage.setItem('snackUser', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }));
            
            // 显示成功消息
            showMessage('注册成功！正在跳转...', 'success');
            
            // 跳转到首页
            setTimeout(() => {
                window.location.href = authIndexPath;
            }, 1500);
        });
    }
    
    // 密码显示/隐藏切换
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示错误信息
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // 3秒后隐藏错误信息
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}