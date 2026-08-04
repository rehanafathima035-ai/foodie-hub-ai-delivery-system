// Constants
const API_BASE = '/api';

// Utility for Toast
const showToast = (msg, type = 'success') => {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        className: type === 'success' ? 'bg-success' : 'bg-danger',
        stopOnFocus: true,
    }).showToast();
};

// State Management
const State = {
    user: null,
    cart: [],
    theme: localStorage.getItem('theme') || 'light'
};

// Initialize App
const init = async () => {
    applyTheme();
    await checkAuth();
    updateCartCount();

    // Page specific initialization
    const path = window.location.pathname;
    if (path === '/') loadHomePage();
    if (path === '/restaurants') loadRestaurantsPage();
    if (path.startsWith('/menu/')) loadMenuPage();
    if (path === '/cart') loadCartPage();
    if (path === '/checkout') loadCheckoutPage();
    if (path === '/orders') loadOrdersPage();
    if (path === '/profile') loadProfilePage();
    if (path === '/admin') loadAdminDashboard();

    setupEventListeners();
};

// Auth Functions
const checkAuth = async () => {
    try {
        const res = await fetch(`${API_BASE}/auth/me`);
        if (res.ok) {
            State.user = await res.json();
            renderAuthLinks();
        }
    } catch (e) { console.log("Not logged in"); }
};

const renderAuthLinks = () => {
    const container = document.getElementById('auth-links');
    if (!container) return;

    if (State.user) {
        container.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle rounded-pill px-4" data-bs-toggle="dropdown">
                    Hi, ${State.user.full_name.split(' ')[0]}
                </button>
                <ul class="dropdown-menu dropdown-menu-end glass border-0 shadow">
                    <li><a class="dropdown-item" href="/profile"><i class="fas fa-user-circle me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="/orders"><i class="fas fa-box me-2"></i>Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                </ul>
            </div>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', logout);
    }
};

const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    State.user = null;
    location.reload();
};

// Theme Toggle
const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', State.theme);
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = State.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
};

// Home Page Logic
const loadHomePage = async () => {
    loadCategories();
    loadAIRecommendations();
    loadFeaturedRestaurants();
};

const loadCategories = async () => {
    const res = await fetch(`${API_BASE}/restaurants/categories`);
    const cats = await res.json();
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = cats.map(c => `
        <div class="col-6 col-md-2" data-aos="fade-up">
            <a href="/restaurants?category=${c.id}" class="text-decoration-none text-dark">
                <div class="premium-card p-3 text-center h-100 bg-secondary-color border-0">
                    <div class="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mx-auto mb-2" style="width:60px; height:60px;">
                        <img src="${c.image}" alt="${c.name}"style="width:60px;height:60px;object-fit:cover;border-radius:50%;">
                    </div>
                    <span class="small fw-bold">${c.name}</span>
                </div>
            </a>
        </div>
    `).join('');
};

const loadAIRecommendations = async () => {
    const res = await fetch(`${API_BASE}/ai/recommendations`);
    const data = await res.json();
    const container = document.getElementById('ai-recommendations');
    if (!container) return;

    container.innerHTML = data.map(f => `
        <div class="col-md-3" data-aos="zoom-in">
            <div class="premium-card h-100">
                <div class="card-img-container position-relative">
                    <img src="${f.image}" alt="${f.name}">
                    <span class="badge bg-primary position-absolute top-0 end-0 m-2">Top Choice</span>
                </div>
                <div class="p-3">
                    <h6 class="fw-bold mb-1">${f.name}</h6>
                    <p class="small text-muted mb-2">${f.restaurant}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-primary-color">$${f.price}</span>
                        <button class="btn btn-sm btn-primary rounded-pill add-to-cart" data-id="${f.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const loadFeaturedRestaurants = async () => {
    const res = await fetch(`${API_BASE}/restaurants/`);
    const data = await res.json();
    const container = document.getElementById('featured-restaurants');
    if (!container) return;

    container.innerHTML = data.map(r => `
        <div class="col-md-4" data-aos="fade-up">
            <div class="premium-card h-100">
                <div class="card-img-container">
                    <a href="/menu/${r.id}"><img src="${r.image}" alt="${r.name}"></a>
                </div>
                <div class="p-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h5 class="fw-bold m-0">${r.name}</h5>
                        <span class="badge bg-success"><i class="fas fa-star me-1"></i>${r.rating}</span>
                    </div>
                    <p class="text-muted small mb-3">${r.cuisine}</p>
                    <div class="d-flex justify-content-between align-items-center border-top pt-2">
                        <span class="small text-muted"><i class="fas fa-clock me-1"></i>${r.delivery_time}</span>
                        <span class="small text-muted"><i class="fas fa-map-marker-alt me-1"></i>${r.location}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Cart Logic
const updateCartCount = async () => {
    if (!State.user) return;
    const res = await fetch(`${API_BASE}/user/cart`);
    if (res.ok) {
        const cart = await res.json();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }
};

const setupEventListeners = () => {
    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        State.theme = State.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', State.theme);
        applyTheme();
    });

    // Auth Forms
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);

    // Delegate Add to Cart
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.add-to-cart')) {
            const id = e.target.closest('.add-to-cart').dataset.id;
            if (!State.user) {
                showToast("Please login first", "error");
                return;
            }
            const res = await fetch(`${API_BASE}/user/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ food_id: id })
            });
            if (res.ok) {
                showToast("Added to cart!");
                updateCartCount();
            }
        }
    });

    // Search Suggestions
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async (e) => {
            const q = e.target.value;
            if (q.length < 3) {
                suggestions.style.display = 'none';
                return;
            }
            const res = await fetch(`${API_BASE}/restaurants/search?q=${q}`);
            const data = await res.json();

            let html = '';
            data.restaurants.forEach(r => {
                html += `<a href="/menu/${r.id}" class="list-group-item list-group-item-action border-0"><i class="fas fa-utensils me-2 text-primary-color"></i>${r.name}</a>`;
            });
            data.foods.forEach(f => {
                html += `<a href="/menu/${f.restaurant_id}" class="list-group-item list-group-item-action border-0"><i class="fas fa-hamburger me-2 text-muted"></i>${f.name}</a>`;
            });

            suggestions.innerHTML = html || '<div class="p-3 text-muted">No results found</div>';
            suggestions.style.display = 'block';
        }, 300));
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
        email: e.target.email.value,
        password: e.target.password.value
    };
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        showToast("Login Successful!");
        setTimeout(() => location.href = '/', 1000);
    } else {
        showToast("Invalid credentials", "error");
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
        full_name: e.target.full_name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        password: e.target.password.value
    };
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        showToast("Registration Successful! Please login.");
        setTimeout(() => location.href = '/login', 1500);
    } else {
        const error = await res.json();
        showToast(error.message, "error");
    }
};

async function loadCartPage() {
    const res = await fetch(`${API_BASE}/user/cart`);
    const cart = await res.json();
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-5"><img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" style="width:200px"><h4 class="mt-4">Your cart is empty</h4><a href="/restaurants" class="btn btn-primary rounded-pill px-4">Browse Restaurants</a></div>`;
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="premium-card p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-3 col-md-2"><img src="${item.image}" class="img-fluid rounded"></div>
                    <div class="col-5 col-md-6">
                        <h6 class="fw-bold mb-0">${item.name}</h6>
                        <span class="text-primary-color">$${item.price}</span>
                    </div>
                    <div class="col-4 col-md-4 text-end">
                        <div class="input-group input-group-sm justify-content-end">
                            <button class="btn btn-outline-secondary cart-update" data-id="${item.cart_id}" data-action="decrease">-</button>
                            <span class="px-3 border d-flex align-items-center">${item.quantity}</span>
                            <button class="btn btn-outline-secondary cart-update" data-id="${item.cart_id}" data-action="increase">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').innerText = `$${(subtotal * 0.1).toFixed(2)}`;
    document.getElementById('total').innerText = `$${(subtotal * 1.1 + 2.0).toFixed(2)}`;

    document.querySelectorAll('.cart-update').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const btnEl = e.target.closest('.cart-update');
            const { id, action } = btnEl.dataset;
            await fetch(`${API_BASE}/user/cart/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: id, action })
            });
            loadCartPage();
            updateCartCount();
        });
    });
}

async function loadCheckoutPage() {
    const res = await fetch(`${API_BASE}/user/cart`);
    const cart = await res.json();
    if (cart.length === 0) location.href = '/cart';

    document.getElementById('checkout-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            address: e.target.address.value,
            payment: e.target.payment.value
        };
        const res = await fetch(`${API_BASE}/user/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showToast("Order placed successfully!");
            location.href = '/orders';
        }
    });
}

async function loadOrdersPage() {
    const res = await fetch(`${API_BASE}/user/orders`);
    const orders = await res.json();
    const container = document.getElementById('orders-list');
    if (!container) return;

    container.innerHTML = orders.map(o => `
        <div class="premium-card p-4 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h6 class="fw-bold mb-0">Order #${o.id}</h6>
                    <small class="text-muted">${o.date}</small>
                </div>
                <span class="badge ${o.status === 'Delivered' ? 'bg-success' : 'bg-warning'} px-3 rounded-pill">${o.status}</span>
            </div>
            <div class="d-flex justify-content-between">
                <span class="fw-bold">Total Amount: $${o.total.toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-primary rounded-pill">View Details</button>
            </div>
        </div>
    `).join('');
}

async function loadMenuPage() {
    const restaurantId = window.location.pathname.split('/').pop();
    const res = await fetch(`${API_BASE}/restaurants/${restaurantId}`);
    const data = await res.json();

    document.getElementById('restaurant-name').innerText = data.name;
    document.getElementById('restaurant-image').src = data.image;
    document.getElementById('restaurant-cuisine').innerText = data.cuisine;

    const container = document.getElementById('menu-items');
    if (container) {
        container.innerHTML = data.menu.map(f => `
            <div class="col-md-6 mb-4" data-aos="fade-up">
                <div class="premium-card p-3 h-100 d-flex gap-3">
                    <img src="${f.image}" class="rounded shadow-sm" style="width:120px; height:120px; object-fit:cover">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <h6 class="fw-bold mb-1">${f.name}</h6>
                            <span class="fw-bold text-primary-color">$${f.price}</span>
                        </div>
                        <p class="small text-muted mb-2">${f.description.substring(0, 60)}...</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                             <span class="badge bg-light text-dark small"><i class="fas fa-star text-warning me-1"></i>${f.rating}</span>
                             <button class="btn btn-primary btn-sm rounded-pill add-to-cart px-3" data-id="${f.id}">Add +</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

async function loadAdminDashboard() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    const stats = await res.json();

    const els = {
        'total-orders': stats.total_orders,
        'total-revenue': `$${stats.revenue}`,
        'total-users': stats.total_users
    };
    for (const [id, val] of Object.entries(els)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    const ordersTable = document.getElementById('recent-orders-table');
    if (ordersTable) {
        ordersTable.innerHTML = stats.recent_orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>$${o.total}</td>
                <td><span class="badge bg-info">${o.status}</span></td>
                <td><button class="btn btn-sm btn-light"><i class="fas fa-eye"></i></button></td>
            </tr>
        `).join('');
    }
}

// Utils
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
async function loadRestaurantsPage() {
    const res = await fetch(`${API_BASE}/restaurants/`);
    const restaurants = await res.json();

    const container = document.getElementById('featured-restaurants');
    if (!container) return;

    container.innerHTML = restaurants.map(r => `
        <div class="col-md-4 mb-4">
            <div class="premium-card h-100">
                <div class="card-img-container">
                    <img src="${r.image}" class="img-fluid" alt="${r.name}">
                </div>

                <div class="p-3">
                    <h5>${r.name}</h5>
                    <p>${r.cuisine}</p>

                    <div class="d-flex justify-content-between">
                        <span>⭐ ${r.rating}</span>
                        <span>${r.delivery_time}</span>
                    </div>

                    <a href="/menu/${r.id}" class="btn btn-primary w-100 mt-3">
                        View Menu
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
// Start the app
document.addEventListener('DOMContentLoaded', init);
