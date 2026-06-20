const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Change this to YOUR secret password
const ADMIN_PASSWORD = 'hype2024secret';

let isLoggedIn = false;

function login() {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('login-status').textContent = '';
    } else {
        document.getElementById('login-status').textContent = '❌ Wrong password!';
        document.getElementById('login-status').style.color = '#FF2200';
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

async function uploadProduct() {
    if (!isLoggedIn) {
        document.getElementById('status').textContent = '❌ Please login first';
        return;
    }

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;
    const image_url = document.getElementById('product-image').value;

    if (!name || !price || !image_url) {
        document.getElementById('status').textContent = '❌ Fill all required fields';
        document.getElementById('status').className = 'error';
        return;
    }

    const { error } = await supabase
        .from('products')
        .insert([{ name, price, description, image_url }]);

    if (error) {
        document.getElementById('status').textContent = '❌ Error: ' + error.message;
        document.getElementById('status').className = 'error';
    } else {
        document.getElementById('status').textContent = '✅ Product uploaded successfully!';
        document.getElementById('status').className = 'success';
        // Clear form
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-description').value = '';
        document.getElementById('product-image').value = '';
    }
}