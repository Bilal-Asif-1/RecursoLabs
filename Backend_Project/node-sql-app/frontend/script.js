// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let currentPage = 1;
let totalPages = 1;

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    if (authToken) {
        loadUserProfile();
    }
    loadProducts();
    loadUsers();
});

// Setup event listeners
function setupEventListeners() {
    // Authentication forms
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('updateProfileForm').addEventListener('submit', handleUpdateProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    
    // Product forms
    document.getElementById('createProductForm').addEventListener('submit', handleCreateProduct);
}

// Tab switching
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Utility functions
function showStatus(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}

function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
}

// Authentication functions
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('authStatus', 'Registration successful! You can now login.', 'success');
            document.getElementById('registerForm').reset();
        } else {
            showStatus('authStatus', data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showStatus('authStatus', 'Network error. Please try again.', 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            
            showStatus('authStatus', 'Login successful!', 'success');
            document.getElementById('loginForm').reset();
            
            updateUserDisplay();
            loadProducts(); // Refresh products to show user-specific actions
        } else {
            showStatus('authStatus', data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showStatus('authStatus', 'Network error. Please try again.', 'error');
    }
}

async function loadUserProfile() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.data.user;
            updateUserDisplay();
        } else {
            // Token might be expired
            logout();
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    
    if (!authToken) {
        showStatus('authStatus', 'Please login first', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('updateName').value,
        email: document.getElementById('updateEmail').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.data.user;
            updateUserDisplay();
            showStatus('authStatus', 'Profile updated successfully!', 'success');
            document.getElementById('updateProfileForm').reset();
        } else {
            showStatus('authStatus', data.message || 'Update failed', 'error');
        }
    } catch (error) {
        showStatus('authStatus', 'Network error. Please try again.', 'error');
    }
}

async function handleChangePassword(event) {
    event.preventDefault();
    
    if (!authToken) {
        showStatus('authStatus', 'Please login first', 'error');
        return;
    }
    
    const formData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('authStatus', 'Password changed successfully!', 'success');
            document.getElementById('changePasswordForm').reset();
        } else {
            showStatus('authStatus', data.message || 'Password change failed', 'error');
        }
    } catch (error) {
        showStatus('authStatus', 'Network error. Please try again.', 'error');
    }
}

function updateUserDisplay() {
    const userInfo = document.getElementById('userInfo');
    const userDetails = document.getElementById('userDetails');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const tokenText = document.getElementById('tokenText');
    
    if (currentUser) {
        userInfo.style.display = 'block';
        tokenDisplay.style.display = 'block';
        
        userDetails.innerHTML = `
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>ID:</strong> ${currentUser.id}</p>
        `;
        
        tokenText.textContent = authToken;
    } else {
        userInfo.style.display = 'none';
        tokenDisplay.style.display = 'none';
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateUserDisplay();
    showStatus('authStatus', 'Logged out successfully', 'info');
    loadProducts(); // Refresh products
}

// Product functions
async function loadProducts(page = 1) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading products...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/products?page=${page}&limit=6`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayProducts(data.data.products);
            displayPagination(data.data.pagination);
        } else {
            container.innerHTML = '<div class="status error">Failed to load products</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="status error">Network error loading products</div>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="status info">No products found</div>';
        return;
    }
    
    const productsHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>${product.description || 'No description available'}</p>
            <div class="price">$${parseFloat(product.price).toFixed(2)}</div>
            <div class="category">${product.category}</div>
            <p class="stock">Stock: ${product.stock} units</p>
            <p><small>Created by: ${product.user ? product.user.name : 'Unknown'}</small></p>
            <div class="actions">
                ${currentUser && product.userId === currentUser.id ? `
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="products-grid">${productsHTML}</div>`;
}

function displayPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    currentPage = pagination.currentPage;
    totalPages = pagination.totalPages;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="loadProducts(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="loadProducts(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="loadProducts(${currentPage + 1})">Next</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

async function handleCreateProduct(event) {
    event.preventDefault();
    
    if (!authToken) {
        showStatus('productsStatus', 'Please login first to create products', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showStatus('productsStatus', 'Product created successfully!', 'success');
            document.getElementById('createProductForm').reset();
            loadProducts(currentPage);
        } else {
            showStatus('productsStatus', data.message || 'Failed to create product', 'error');
        }
    } catch (error) {
        showStatus('productsStatus', 'Network error. Please try again.', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showStatus('productsStatus', 'Product deleted successfully!', 'success');
            loadProducts(currentPage);
        } else {
            const data = await response.json();
            showStatus('productsStatus', data.message || 'Failed to delete product', 'error');
        }
    } catch (error) {
        showStatus('productsStatus', 'Network error. Please try again.', 'error');
    }
}

function editProduct(productId) {
    // For simplicity, we'll just show an alert
    // In a real application, you'd open a modal or navigate to an edit page
    alert(`Edit product ${productId} - This would open an edit form in a real application`);
}

async function searchProducts() {
    const searchTerm = document.getElementById('searchTerm').value;
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let url = `${API_BASE}/products?page=1&limit=6`;
    
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (sortBy) url += `&sortBy=${sortBy}&sortOrder=ASC`;
    
    try {
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayProducts(data.data.products);
            displayPagination(data.data.pagination);
        } else {
            showStatus('productsStatus', 'Search failed', 'error');
        }
    } catch (error) {
        showStatus('productsStatus', 'Network error during search', 'error');
    }
}

// User functions
async function loadUsers() {
    const container = document.getElementById('usersContainer');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading users...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUsers(data.data.users);
        } else {
            container.innerHTML = '<div class="status error">Failed to load users (login required)</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="status error">Network error loading users</div>';
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    
    if (!users || users.length === 0) {
        container.innerHTML = '<div class="status info">No users found (login required to view users)</div>';
        return;
    }
    
    const usersHTML = users.map(user => `
        <div class="product-card">
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
            ${currentUser && currentUser.id !== user.id ? `
                <div class="actions">
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete User
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    container.innerHTML = `<div class="products-grid">${usersHTML}</div>`;
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            showStatus('usersStatus', 'User deleted successfully!', 'success');
            loadUsers();
        } else {
            const data = await response.json();
            showStatus('usersStatus', data.message || 'Failed to delete user', 'error');
        }
    } catch (error) {
        showStatus('usersStatus', 'Network error. Please try again.', 'error');
    }
}

// Add logout button to the page
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const logoutBtn = document.createElement('button');
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    logoutBtn.className = 'btn btn-danger';
    logoutBtn.style.position = 'absolute';
    logoutBtn.style.top = '20px';
    logoutBtn.style.right = '20px';
    logoutBtn.onclick = logout;
    header.style.position = 'relative';
    header.appendChild(logoutBtn);
});
