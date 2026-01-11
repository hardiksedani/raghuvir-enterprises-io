# Neobrutalism E-commerce Store

A bold and vibrant e-commerce application built with Next.js 14, Supabase, and neobrutalism design style.

## Features

- 🎨 **Neobrutalism Design** - Bold colors, thick borders, and hard shadows
- 👥 **Dual Customer Types** - Retailer and Dealer pricing with role-based access
- 🔐 **User Authentication** - Secure signup/login with Supabase Auth
- 🛒 **Shopping Cart** - Full cart functionality with quantity management
- 💳 **UPI Payment** - UPI-only payment system
- 🔐 **Admin Panel** - Secure admin dashboard for managing products and orders
- 📦 **Product Management** - Add, edit, delete products (admin only)
- 📋 **Order Management** - Track and update order status
- 👤 **User Dashboard** - View order history and status

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom neobrutalism theme
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with role-based access control

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

The Supabase configuration is already set up in `/lib/supabase.ts` with your credentials.

### 3. Set Up Database Tables

Go to your Supabase project dashboard:
1. Navigate to the SQL Editor
2. Copy the contents of `supabase-setup.sql`
3. Run the SQL script to create tables, policies, and triggers

**Important:** Make sure to enable email confirmations in your Supabase project settings:
- Go to Authentication > Settings
- Enable "Enable email confirmations" if you want users to verify their email
- Or disable it for development to allow instant signup

### 4. Create Admin User

After setting up the database, you'll need to create an admin user:
1. Sign up through the `/signup` page
2. In Supabase SQL Editor, run:
```sql
UPDATE user_profiles 
SET user_role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your store!

## Authentication

### User Roles

The application supports three user roles:

1. **Retailer**
   - Standard pricing
   - Lower minimum quantity requirements
   - Can place orders and view order history
   - Sign up at `/signup`

2. **Dealer**
   - Bulk/wholesale pricing
   - Higher minimum quantity requirements
   - Can place orders and view order history
   - Sign up at `/signup`

3. **Admin**
   - Full access to admin panel at `/admin`
   - Can manage products (add, edit, delete)
   - Can view and update all orders
   - Must be manually assigned in database

### Creating an Admin Account

1. Sign up normally through the website
2. In Supabase SQL Editor, run:
```sql
UPDATE user_profiles 
SET user_role = 'admin' 
WHERE email = 'admin@example.com';
```
3. Log out and log back in to access the admin panel

## User Features

### For Customers (Retailers & Dealers)
- Browse products with role-specific pricing
- Add products to cart
- Place orders with UPI payment
- View order history at `/orders`
- Track order status

### For Admins

### For Admins
- **URL**: `/admin`
- **Access**: Requires admin role in database

### Admin Features:
- Add new products
- Edit existing products
- Delete products
- View all orders
- Update order status

## Customer Types

### Retailer
- Higher prices
- Lower minimum quantity requirements
- Flexible ordering

### Dealer
- Lower prices (bulk pricing)
- Higher minimum quantity requirements
- Wholesale pricing

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel (protected)
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout page (requires auth)
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── orders/         # User order history (protected)
│   ├── globals.css     # Global styles with neobrutalism theme
│   ├── layout.tsx      # Root layout with navbar and auth provider
│   └── page.tsx        # Home page with products
├── components/
│   ├── Navbar.tsx      # Navigation with auth state
│   └── ProductCard.tsx # Product display card
├── lib/
│   ├── auth.ts         # Authentication context and hooks
│   ├── supabase.ts     # Supabase client and types
│   └── store.ts        # Zustand store for cart management
└── supabase-setup.sql  # Database schema and sample data
```

## Database Schema

### User Profiles Table
- `id` - UUID (Foreign Key to auth.users)
- `email` - User email
- `full_name` - User's full name
- `phone` - User's phone number
- `user_role` - 'retailer', 'dealer', or 'admin'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Products Table
- `id` - UUID (Primary Key)
- `name` - Product name
- `description` - Product description
- `image_url` - Product image URL
- `retailer_price` - Price for retailers
- `dealer_price` - Price for dealers
- `min_dealer_quantity` - Minimum quantity for dealer pricing
- `stock` - Available stock
- `created_at` - Timestamp

### Orders Table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `customer_name` - Customer name
- `customer_phone` - Customer phone number
- `customer_type` - 'retailer' or 'dealer'
- `items` - JSONB array of order items
- `total_amount` - Total order amount
- `upi_transaction_id` - UPI transaction ID
- `status` - Order status (pending, confirmed, shipped, delivered, cancelled)
- `created_at` - Timestamp

## Payment Flow

1. User must be logged in
2. User selects products and adds to cart
3. Proceeds to checkout
4. Views UPI payment details
5. Makes payment via UPI
6. Enters transaction ID
7. Order is created with 'pending' status linked to user account
8. Admin confirms and updates order status
9. User can track order status in `/orders` page

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only view their own orders
- Only admins can modify products
- Only admins can update order status
- Authentication required for checkout
- Role-based access control for admin panel

## Customization

### Colors
Edit CSS variables in `app/globals.css`:
- `--primary`: Main brand color (default: #ff6b35)
- `--secondary`: Secondary color (default: #ffd93d)
- `--accent`: Accent color (default: #6bcf7f)

### Admin Credentials
The old simple username/password admin authentication has been replaced with Supabase Auth.
Create an admin user by signing up and then updating the user_role in the database:
```sql
UPDATE user_profiles SET user_role = 'admin' WHERE email = 'your-email@example.com';
```

### UPI Details
Update merchant UPI ID in `app/checkout/page.tsx`

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
