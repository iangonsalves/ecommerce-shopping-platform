# E-commerce Shopping Platform

A modern, full-stack e-commerce platform built with Laravel (Backend) and React (Frontend).

## Features

### Authentication & User Management
- User registration and login
- JWT-based authentication
- Protected routes
- User profile management

### Product Management
- Product listing with details
- Product categories
- Product search and filtering
- Detailed product views

### Shopping Cart
- Real-time cart management
- Add/remove items
- Update quantities
- Persistent cart across sessions

### Order Management
- Order placement and checkout
- Order history tracking
- Order status updates
- Detailed order views

### Categories
- Browse products by category
- Category listing page
- Category detail view

## Technical Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios

### Backend
- Laravel 10
- MySQL database
- JWT authentication
- RESTful API

## Project Structure

```
├── backend/                 # Laravel API backend
└── frontend/               # React frontend
```

See individual README files in each directory for detailed documentation.

## Getting Started

### Prerequisites
- PHP 8.1 or higher
- Node.js 16 or higher
- MySQL
- Composer
- npm

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Run migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

5. Start the Laravel server:
```bash
php artisan serve
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/logout` - User logout
- GET `/api/user` - Get authenticated user

### Products
- GET `/api/products` - List all products
- GET `/api/products/{id}` - Get product details
- GET `/api/products/search` - Search products

### Categories
- GET `/api/categories` - List all categories
- GET `/api/categories/{id}` - Get category details

### Cart
- GET `/api/cart` - Get user's cart
- POST `/api/cart/items` - Add item to cart
- PUT `/api/cart/items/{id}` - Update cart item quantity
- DELETE `/api/cart/items/{id}` - Remove item from cart

