const SUPABASE_URL = 'https://ozumnakvrhxqiliblavd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1uYWt2cmh4cWlsaWJsYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MTQ3OTEsImV4cCI6MjA5NzQ5MDc5MX0.GntM_Pawq9PkZrV0iZYJF6tZ3pnAdvTMqYCgob_moD8';
const ADMIN_PASSWORD = '6688';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function login() {
    var pass = document.getElementById('pass').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('panel').style.display = 'block';
        document.getElementById('error-msg').textContent = '';
    } else {
        document.getElementById('error-msg').textContent = 'Wrong password!';
    }
}

function logout() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('panel').style.display = 'none';
    document.getElementById('pass').value = '';
    document.getElementById('error-msg').textContent = '';
}

async function uploadProduct() {
    var name = document.getElementById('name').value;
    var price = document.getElementById('price').value;
    var description = document.getElementById('desc').value;
    var image_url = document.getElementById('image').value;
    var status = document.getElementById('status');

    if (!name || !price || !image_url) {
        status.textContent = 'Please fill all fields';
        status.style.color = 'red';
        return;
    }

    var { error } = await supabase
        .from('products')
        .insert([{ 
            name: name, 
            price: parseFloat(price), 
            description: description, 
            image_url: image_url 
        }]);

    if (error) {
        status.textContent = 'Error: ' + error.message;
        status.style.color = 'red';
    } else {
        status.textContent = 'Product added successfully!';
        status.style.color = 'green';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('image').value = '';
    }
}
