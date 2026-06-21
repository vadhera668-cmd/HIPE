const SUPABASE_URL = 'https://ozumnakvrhxqiliblavd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1uYWt2cmh4cWlsaWJsYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTQ3OTEsImV4cCI6MjA5NzQ5MDc5MX0.GntM_Pawq9PkZrV0iZYJF6tZ3pnAdvTMqYCgob_moD8';
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
