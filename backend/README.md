# E-commerce Platform Backend

Laravel-based REST API for the e-commerce platform.

## Features

- User authentication with JWT
- Product management
- Category management
- Search and filtering
- Database seeding

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/user - Get authenticated user

### Products
- GET /api/products - List all products
- GET /api/products/{id} - Get product details
- GET /api/products?search={term} - Search products
- GET /api/products?category={id} - Filter by category
- GET /api/products?sort=price_asc - Sort by price

### Categories
- GET /api/categories - List all categories
- GET /api/categories/{id} - Get category details
- GET /api/categories/{id}/products - Get products in category

## Database Structure

### Users Table
- id (primary key)
- name
- email (unique)
- password
- role (admin/customer)
- timestamps

### Products Table
- id (primary key)
- name
- description
- price
- image
- category_id (foreign key)
- timestamps

### Categories Table
- id (primary key)
- name
- description
- timestamps

## Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure database in .env:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run migrations and seeders:
```bash
php artisan migrate:fresh --seed
```

6. Start the server:
```bash
php artisan serve
```

## Testing

The API will be available at http://localhost:8000

## Dependencies

- PHP >= 8.1
- Laravel 10.x
- MySQL
- JWT Authentication
