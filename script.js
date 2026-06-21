const SUPABASE_URL = 'https://ozumnakvrhxqiliblavd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1uYWt2cmh4cWlsaWJsYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTQ3OTEsImV4cCI6MjA5NzQ5MDc5MX0.GntM_Pawq9PkZrV0iZYJF6tZ3pnAdvTMqYCgob_moD8';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cart = JSON.parse(localStorage.getItem('hipeCart')) || [];

function saveCart() {
    localStorage.setItem('hipeCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    var count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    var el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

function addToCart(id, name, price, image) {
    var existing = cart.find(function(item) { return item.id === id; });
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: id, name: name, price: price, image: image, quantity: 1 });
    }
    saveCart();
    alert('Added to cart!');
}

function removeFromCart(id) {
    cart = cart.filter(function(item) { return item.id !== id; });
    saveCart();
    renderCart();
}

function viewCart() {
    renderCart();
    document.getElementById('cart-overlay').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-overlay').style.display = 'none';
}

function renderCart() {
    var itemsEl = document.getElementById('cart-items');
    var totalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p style="color:#999;">Cart is empty</p>';
        totalEl.style.display = 'none';
        return;
    }
    
    var total = 0;
    itemsEl.innerHTML = cart.map(function(item) {
        total += item.price * item.quantity;
        return '<div style="display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid #222;">' +
            '<div><strong>' + item.name + '</strong><br><small>Qty: ' + item.quantity + '</small></div>' +
            '<div style="color:#FF2200;">₹' + (item.price * item.quantity) + '</div>' +
            '<button onclick="removeFromCart(\'' + item.id + '\')" style="background:none;border:none;color:red;cursor:pointer;">✕</button>' +
            '</div>';
    }).join('');
    
    document.getElementById('total-amount').textContent = total;
    totalEl.style.display = 'block';
}

function checkout() {
    var total = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    if (total === 0) { alert('Cart empty!'); return; }
    alert('Order placed! Total: ₹' + total);
    cart = [];
    saveCart();
    closeCart();
}

async function loadProducts() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '<p style="color:#999;text-align:center;">Loading products...</p>';
    
    var { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        grid.innerHTML = '<p style="color:red;text-align:center;">Error: ' + error.message + '</p>';
        return;
    }
    
    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="color:#999;text-align:center;">No products yet. New drop coming soon!</p>';
        return;
    }
    
    grid.innerHTML = data.map(function(p) {
        return '<div style="background:#111;border:1px solid #222;overflow:hidden;">' +
            '<img src="' + p.image_url + '" alt="' + p.name + '" style="width:100%;height:300px;object-fit:cover;" onerror="this.src=\'https://via.placeholder.com/400x400/111/fff?text=HIPE\'">' +
            '<div style="padding:20px;">' +
            '<h3 style="font-family:\'Bebas Neue\',cursive;font-size:24px;letter-spacing:2px;">' + p.name + '</h3>' +
            '<p style="color:#FF2200;font-weight:700;font-size:18px;">₹' + p.price + '</p>' +
            '<p style="color:#999;font-size:13px;">' + (p.description || '') + '</p>' +
            '<button onclick="addToCart(\'' + p.id + '\',\'' + p.name + '\',' + p.price + ',\'' + p.image_url + '\')" style="width:100%;padding:12px;background:#FF2200;color:#fff;border:none;font-weight:700;cursor:pointer;margin-top:10px;">ADD TO CART</button>' +
            '</div></div>';
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});
