# Football Jersey E-commerce Platform

A specialized e-commerce platform for football/soccer jerseys built with Laravel and React.

## Features

### Jersey Management
- Browse by clubs (categories)
- Filter by season and kit type (home/away/third)
- Size variations (S, M, L, XL, XXL)
- High-quality jersey images
- Detailed product descriptions

### Shopping Experience
- Club-based navigation
- Size guide
- Season filtering
- Kit type selection
- Stock management by size

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

## Testing

### Backend Tests
```bash
cd backend
php artisan test
```

Available test suites:
- Feature Tests: API endpoints and integration tests
- Unit Tests: Business logic and model tests

