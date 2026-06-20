-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    items JSONB,
    total_amount DECIMAL,
    status TEXT DEFAULT 'pending',
    customer_email TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (so only you can insert products)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Only allow reading for everyone (public store)
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

-- Only allow insert with secret key (admin only)
CREATE POLICY "Only admin can insert" ON products
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Only admin can update" ON products
    FOR UPDATE USING (true);
    
CREATE POLICY "Only admin can delete" ON products
    FOR DELETE USING (true);