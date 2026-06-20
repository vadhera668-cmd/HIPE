// ============ SUPABASE CONFIGURATION ============
// Replace these with your Supabase project credentials
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ CART LOGIC ============
let cart = JSON.parse(localStorage.getItem('hypeCart')) || [];

function saveCart() {
    localStorage.setItem('hypeCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function addToCart(productId, name, price, image) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, image, quantity: 1 });
    }
    saveCart();
    alert('Added to cart! 🛒');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
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
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: #999;">Cart is empty</p>';
        cartTotal.style.display = 'none';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <small style="color: #999;">Qty: ${item.quantity}</small>
                </div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">✕</button>
            </div>
        `;
    }).join('');
    
    document.getElementById('total-amount').textContent = total;
    cartTotal.style.display = 'block';
}

// ============ LOAD PRODUCTS FROM SUPABASE ============
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        grid.innerHTML = '<p style="color: #999; text-align: center;">Error loading products. Make sure Supabase is configured.</p>';
        console.error(error);
        return;
    }
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="color: #999; text-align: center; width: 100%;">No products yet. New drop coming soon.</p>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x400/1a1a1a/ffffff?text=HYPE'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <p class="product-description">${product.description || ''}</p>
                <button class="add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image_url}')">
                    ADD TO CART
                </button>
            </div>
        </div>
    `).join('');
}

// ============ CHECKOUT WITH RAZORPAY ============
async function checkout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (total === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Create order in Supabase
    const { data: order, error } = await supabase
        .from('orders')
        .insert({
            items: cart,
            total_amount: total,
            status: 'pending',
            customer_email: 'customer@email.com' // You can add a form for this
        })
        .select()
        .single();
    
    if (error) {
        alert('Error creating order');
        console.error(error);
        return;
    }
    
    // Initialize Razorpay
    const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
        amount: total * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'HYPE Store',
        description: 'Streetwear Purchase',
        order_id: order.id,
        handler: async function(response) {
            // Payment successful
            await supabase
                .from('orders')
                .update({ 
                    status: 'paid',
                    razorpay_payment_id: response.razorpay_payment_id 
                })
                .eq('id', order.id);
            
            alert('Payment successful! Your order is confirmed. 🔥');
            cart = [];
            saveCart();
            closeCart();
        },
        prefill: {
            name: 'Customer',
            email: 'customer@email.com',
            contact: '9999999999'
        },
        theme: {
            color: '#FF2200'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});