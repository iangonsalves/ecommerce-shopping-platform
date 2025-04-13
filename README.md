# E-commerce Shopping Platform

A full-stack e-commerce platform built with React and Laravel.

## Features

- User authentication (login/register)
- Product listing and details
- Category management
- Product search and filtering
- Price sorting
- Shopping cart (coming soon)
- User profile management (coming soon)
- Order management (coming soon)

## Tech Stack

- Frontend: React, Material-UI, Vite
- Backend: Laravel, MySQL
- Authentication: JWT

## Project Structure

```
ecommerce-shopping-platform/
├── frontend/               # React frontend application
├── backend/               # Laravel backend API
└── README.md             # This file
```

## Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16
- MySQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-shopping-platform.git
cd ecommerce-shopping-platform
```

2. Set up the backend:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/user - Get authenticated user

### Product Endpoints

- GET /api/products - List all products
- GET /api/products/{id} - Get product details
- GET /api/products?search={term} - Search products
- GET /api/products?category={id} - Filter by category
- GET /api/products?sort=price_asc - Sort by price

### Category Endpoints

- GET /api/categories - List all categories
- GET /api/categories/{id} - Get category details
- GET /api/categories/{id}/products - Get products in category

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
