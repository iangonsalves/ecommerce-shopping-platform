# E-commerce Platform Backend

This is the backend service for the e-commerce platform, built with Laravel 10.x. It provides a robust API for the React frontend, handling authentication, product management, orders, and more.

## Features

- **Authentication System**
  - JWT-based authentication
  - User registration and login
  - Password reset functionality
  - Role-based access control

- **Product Management**
  - CRUD operations for products
  - Category management
  - Inventory tracking
  - Product search and filtering

- **Order Processing**
  - Shopping cart functionality
  - Order creation and management
  - Payment processing integration
  - Order status tracking

- **User Management**
  - User profiles
  - Address management
  - Order history
  - Wishlist functionality

## Tech Stack

- **Framework**: Laravel 10.x
- **Database**: MySQL/PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI/Swagger
- **Testing**: PHPUnit, Laravel Sanctum

## Prerequisites

- PHP >= 8.1
- Composer
- MySQL/PostgreSQL
- Node.js & NPM (for frontend assets)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env`:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed the database (optional):
```bash
php artisan db:seed
```

8. Start the development server:
```bash
php artisan serve
```

## API Documentation

The API documentation is available at `/api/documentation` when running the application. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Testing

Run the test suite:
```bash
php artisan test
```

## Directory Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # API Controllers
│   │   ├── Middleware/     # Custom Middleware
│   │   └── Requests/       # Form Requests
│   ├── Models/             # Eloquent Models
│   ├── Services/           # Business Logic
│   └── Providers/          # Service Providers
├── database/
│   ├── migrations/         # Database Migrations
│   └── seeders/           # Database Seeders
├── routes/
│   └── api.php            # API Routes
└── tests/                 # Test Files
```

## Environment Variables

Key environment variables that need to be configured:

- `APP_NAME`: Application name
- `APP_ENV`: Environment (local/production)
- `APP_KEY`: Application key
- `DB_*`: Database configuration
- `JWT_SECRET`: JWT secret key
- `MAIL_*`: Email configuration
- `STRIPE_KEY`: Stripe API key (for payments)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## Security

- All API endpoints are protected with JWT authentication
- CORS is configured for the frontend domain
- Input validation is implemented for all requests
- SQL injection protection through prepared statements
- XSS protection through proper escaping

## License

This project is licensed under the MIT License - see the LICENSE file for details.
