// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// State management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Elements
const elements = {
    // Auth
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    authForms: document.getElementById('authForms'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginFormElement: document.getElementById('loginFormElement'),
    registerFormElement: document.getElementById('registerFormElement'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    
    // Dashboard
    welcomeSection: document.getElementById('welcomeSection'),
    dashboard: document.getElementById('dashboard'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Products
    productsTab: document.getElementById('productsTab'),
    productsTableBody: document.getElementById('productsTableBody'),
    addProductBtn: document.getElementById('addProductBtn'),
    
    // Users
    usersTab: document.getElementById('usersTab'),
    usersTableBody: document.getElementById('usersTableBody'),
    
    // Modal
    productModal: document.getElementById('productModal'),
    modalTitle: document.getElementById('modalTitle'),
    productForm: document.getElementById('productForm'),
    productId: document.getElementById('productId'),
    productName: document.getElementById('productName'),
    productDescription: document.getElementById('productDescription'),
    productPrice: document.getElementById('productPrice'),
    productCategory: document.getElementById('productCategory'),
    productStock: document.getElementById('productStock'),
    cancelProduct: document.getElementById('cancelProduct'),
    
    // Messages
    message: document.getElementById('message'),
    messageContent: document.getElementById('messageContent')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    if (authToken) {
        // Check if token is still valid
        checkAuthStatus();
    } else {
        showWelcomeScreen();
    }
}

function setupEventListeners() {
    // Auth buttons
    elements.loginBtn.addEventListener('click', () => showAuthForms('login'));
    elements.registerBtn.addEventListener('click', () => showAuthForms('register'));
    elements.showRegister.addEventListener('click', () => showAuthForms('register'));
    elements.showLogin.addEventListener('click', () => showAuthForms('login'));
    
    // Forms
    elements.loginFormElement.addEventListener('submit', handleLogin);
    elements.registerFormElement.addEventListener('submit', handleRegister);
    
    // Dashboard
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Products
    elements.addProductBtn.addEventListener('click', () => showProductModal());
    elements.productForm.addEventListener('submit', handleProductSubmit);
    elements.cancelProduct.addEventListener('click', hideProductModal);
    
    // Modal backdrop click
    elements.productModal.addEventListener('click', (e) => {
        if (e.target === elements.productModal) {
            hideProductModal();
        }
    });
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            showDashboard();
            showMessage('Login successful!', 'success');
            clearAuthForms();
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = elements.registerName.value;
    const email = elements.registerEmail.value;
    const password = elements.registerPassword.value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Registration successful! Please login.', 'success');
            showAuthForms('login');
            clearAuthForms();
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            showDashboard();
        } else {
            handleLogout();
        }
    } catch (error) {
        handleLogout();
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showWelcomeScreen();
    showMessage('Logged out successfully', 'success');
}

// UI Functions
function showWelcomeScreen() {
    elements.welcomeSection.classList.remove('hidden');
    elements.authForms.classList.add('hidden');
    elements.dashboard.classList.add('hidden');
}

function showAuthForms(type) {
    elements.welcomeSection.classList.add('hidden');
    elements.authForms.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
    
    if (type === 'login') {
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
    } else {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
    }
}

function showDashboard() {
    elements.welcomeSection.classList.add('hidden');
    elements.authForms.classList.add('hidden');
    elements.dashboard.classList.remove('hidden');
    
    // Update user info
    elements.userName.textContent = currentUser.name;
    elements.userEmail.textContent = currentUser.email;
    
    // Load data
    loadProducts();
    loadUsers();
}

function clearAuthForms() {
    elements.loginFormElement.reset();
    elements.registerFormElement.reset();
}

function switchTab(tabName) {
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active', 'border-purple-500', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    event.target.classList.add('active', 'border-purple-500', 'text-purple-600');
    event.target.classList.remove('border-transparent', 'text-gray-500');
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    if (tabName === 'products') {
        elements.productsTab.classList.remove('hidden');
    } else if (tabName === 'users') {
        elements.usersTab.classList.remove('hidden');
    }
}

// Product Functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderProducts(data.products);
        } else {
            showMessage('Failed to load products', 'error');
        }
    } catch (error) {
        showMessage('Network error loading products', 'error');
    }
}

function renderProducts(products) {
    if (!products || products.length === 0) {
        elements.productsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No products found. Create your first product!
                </td>
            </tr>
        `;
        return;
    }
    
    elements.productsTableBody.innerHTML = products.map(product => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${product.name}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">${product.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">$${product.price}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${product.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${product.stock}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i data-feather="edit" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Reinitialize feather icons
    feather.replace();
}

function showProductModal(product = null) {
    elements.productModal.classList.remove('hidden');
    
    if (product) {
        // Edit mode
        elements.modalTitle.textContent = 'Edit Product';
        elements.productId.value = product.id;
        elements.productName.value = product.name;
        elements.productDescription.value = product.description;
        elements.productPrice.value = product.price;
        elements.productCategory.value = product.category;
        elements.productStock.value = product.stock;
    } else {
        // Add mode
        elements.modalTitle.textContent = 'Add Product';
        elements.productForm.reset();
        elements.productId.value = '';
    }
}

function hideProductModal() {
    elements.productModal.classList.add('hidden');
    elements.productForm.reset();
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: elements.productName.value,
        description: elements.productDescription.value,
        price: parseFloat(elements.productPrice.value),
        category: elements.productCategory.value,
        stock: parseInt(elements.productStock.value)
    };
    
    const productId = elements.productId.value;
    const isEdit = productId !== '';
    
    try {
        const url = isEdit ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(isEdit ? 'Product updated successfully!' : 'Product created successfully!', 'success');
            hideProductModal();
            loadProducts();
        } else {
            showMessage(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showProductModal(data.product);
        } else {
            showMessage('Failed to load product', 'error');
        }
    } catch (error) {
        showMessage('Network error loading product', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showMessage(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

// User Functions
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            renderUsers(data.users);
        } else {
            showMessage('Failed to load users', 'error');
        }
    } catch (error) {
        showMessage('Network error loading users', 'error');
    }
}

function renderUsers(users) {
    if (!users || users.length === 0) {
        elements.usersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No users found.
                </td>
            </tr>
        `;
        return;
    }
    
    elements.usersTableBody.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${user.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${new Date(user.createdAt).toLocaleDateString()}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Reinitialize feather icons
    feather.replace();
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('User deleted successfully!', 'success');
            loadUsers();
        } else {
            showMessage(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    }
}

// Utility Functions
function showMessage(message, type = 'success') {
    elements.messageContent.textContent = message;
    elements.messageContent.className = `px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    
    elements.message.classList.remove('hidden');
    
    setTimeout(() => {
        elements.message.classList.add('hidden');
    }, 3000);
}

// Initialize feather icons
feather.replace();
